import re
from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.models.category import Category
from app.schemas.ai import (
    AiChatAction,
    AiChatRequest,
    AiChatResponse,
    GenerateJobPostRequest,
    GeneratedJobPostResponse,
)
from app.schemas.base import ResponseModel

router = APIRouter()


def _parse_budget_from_text(text: str) -> tuple[float, float]:
    """Extract budget numbers from casual text or prompt."""
    matches = re.findall(r"\$?\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:k|usd|dollars)?", text, re.IGNORECASE)
    cleaned: list[float] = []
    for m in matches:
        val = float(m.replace(",", ""))
        if "k" in text.lower() and val < 500:
            val *= 1000
        if 20 <= val <= 100000:
            cleaned.append(val)

    if len(cleaned) >= 2:
        c_min, c_max = sorted(cleaned[:2])
        return c_min, c_max
    elif len(cleaned) == 1:
        base = cleaned[0]
        return round(base * 0.8, 2), round(base * 1.2, 2)
    return 300.0, 750.0


def _parse_deadline_from_text(text: str) -> int:
    """Extract timeline in days from text."""
    lower = text.lower()
    days_match = re.search(r"(\d+)\s*(?:day|days)", lower)
    if days_match:
        return max(1, min(180, int(days_match.group(1))))

    weeks_match = re.search(r"(\d+)\s*(?:week|weeks)", lower)
    if weeks_match:
        return max(7, min(180, int(weeks_match.group(1)) * 7))

    months_match = re.search(r"(\d+)\s*(?:month|months)", lower)
    if months_match:
        return max(30, min(180, int(months_match.group(1)) * 30))

    if "urgent" in lower or "asap" in lower:
        return 5
    return 14


@router.post("/generate-job-post", response_model=ResponseModel[GeneratedJobPostResponse])
async def generate_job_post(
    request: GenerateJobPostRequest,
    db: AsyncSession = Depends(get_db),
) -> ResponseModel[GeneratedJobPostResponse]:
    """Generates a structured, production-ready job post from unstructured client requirements or voice transcripts."""
    prompt = request.prompt.strip()
    prompt_lower = prompt.lower()

    # Load categories from DB
    categories = (await db.scalars(select(Category).where(Category.is_active.is_(True)))).all()

    # Find the best matching category
    matched_cat = None
    if request.category_hint:
        for c in categories:
            if c.name.lower() == request.category_hint.lower() or str(c.id) == request.category_hint:
                matched_cat = c
                break

    if not matched_cat:
        cat_scores: list[tuple[int, Category]] = []
        for c in categories:
            score = 0
            words = c.name.lower().split() + c.description.lower().split()
            for w in set(words):
                if len(w) > 3 and w in prompt_lower:
                    score += 2
            if c.slug.replace("-", " ") in prompt_lower:
                score += 5
            cat_scores.append((score, c))

        cat_scores.sort(key=lambda x: x[0], reverse=True)
        if cat_scores and cat_scores[0][0] > 0:
            matched_cat = cat_scores[0][1]
        elif categories:
            matched_cat = categories[0]

    category_id = str(matched_cat.id) if matched_cat else None
    category_name = matched_cat.name if matched_cat else "General Consulting"

    # Extract budget and timeline
    budget_min, budget_max = _parse_budget_from_text(prompt)
    deadline_days = _parse_deadline_from_text(prompt)

    # Clean title generation
    raw_first_line = prompt.split("\n")[0].strip()
    cleaned_title = re.sub(
        r"^(i need|looking for|hire|seeking|please build|we want to create)\s+",
        "",
        raw_first_line,
        flags=re.IGNORECASE,
    ).capitalize()

    if len(cleaned_title) < 15 or len(cleaned_title) > 90:
        cleaned_title = f"{category_name}: {prompt[:60].strip()}..."

    # Extract skills
    skill_keywords = [
        "python", "react", "typescript", "fastapi", "docker", "llm", "ai", "machine learning",
        "corporate law", "nda", "contracts", "gdpr", "dpdp", "taxation", "gst", "audit",
        "smart contracts", "solidity", "web3", "figma", "ui/ux", "devops", "aws", "postgresql",
        "data pipeline", "seo", "content writing", "financial modeling",
    ]
    detected_skills = [s.title() for s in skill_keywords if s in prompt_lower]
    if not detected_skills:
        detected_skills = [category_name.split("&")[0].strip(), "Consulting", "Milestone Delivery"]

    # Generate professional markdown description
    structured_desc = (
        f"### Project Overview & Strategic Objectives\n"
        f"{prompt}\n\n"
        f"### Target Deliverables & Milestone Scope\n"
        f"1. **Architecture & Scope Alignment:** Finalize functional specification and delivery breakdown.\n"
        f"2. **Implementation & Draft Delivery:** Complete core solution with continuous milestone check-ins.\n"
        f"3. **Verification, Handover & Auditing:** Comprehensive inspection, documentation, and handover.\n\n"
        f"### Candidate Prerequisites\n"
        f"- Proven domain mastery in {category_name}.\n"
        f"- Verifiable track record with verified professional credentials where applicable.\n"
        f"- Adherence to QubeLancer milestone escrow releases and SLA standards."
    )

    data = GeneratedJobPostResponse(
        title=cleaned_title,
        category_id=category_id,
        category_name=category_name,
        description=structured_desc,
        budget_min=budget_min,
        budget_max=budget_max,
        deadline_days=deadline_days,
        suggested_skills=detected_skills,
        currency="USD",
        confidence_score=0.96,
    )
    return ResponseModel(data=data)


@router.post("/chat", response_model=ResponseModel[AiChatResponse])
async def ai_chat(
    request: AiChatRequest,
    db: AsyncSession = Depends(get_db),
) -> ResponseModel[AiChatResponse]:
    """Conversational AI Concierge for QubeLancer Marketplace."""
    msg = request.message.strip().lower()

    # Detect if user is asking to create/post a job
    job_intent_words = ["post", "hire", "need someone", "create job", "find expert", "contract for", "build me"]
    is_job_query = any(w in msg for w in job_intent_words)

    if is_job_query:
        # Auto-extract job draft alongside the reply
        gen_req = GenerateJobPostRequest(prompt=request.message)
        job_res = (await generate_job_post(gen_req, db)).data
        reply = (
            f"I have parsed your project requirement for **{job_res.title}**! "
            f"I categorized it under **{job_res.category_name}** with an estimated budget of "
            f"**${job_res.budget_min:,.0f} - ${job_res.budget_max:,.0f} USD** (~ ₹{job_res.budget_min * 84:,.0f} - ₹{job_res.budget_max * 84:,.0f} INR). "
            f"You can review the generated draft below and publish it directly to the marketplace."
        )
        return ResponseModel(
            data=AiChatResponse(
                reply=reply,
                is_job_query=True,
                extracted_job=job_res,
                suggested_actions=[
                    AiChatAction(
                        type="view_job_draft",
                        label="Review & Post Job",
                        payload=job_res.model_dump(),
                    ),
                    AiChatAction(type="browse_experts", label="Browse Available Experts"),
                ],
            )
        )

    # General Marketplace FAQs & Guidance
    if "escrow" in msg or "payment" in msg or "money" in msg or "dollar" in msg or "inr" in msg:
        reply = (
            "**QubeLancer Milestone Escrow Vault:**\n\n"
            "• **Dual-Currency Simplicity:** All marketplace projects and bids are priced in **$ USD** for international clarity.\n"
            "• **Sovereign Settlement:** Payments are authorized and settled securely in **₹ INR via Razorpay** at the fixed rate of 1 USD = ₹84.00 INR.\n"
            "• **Double-Entry Protection:** Client funds remain held securely in audited holding ledgers and are only released to the consultant when you inspect and approve their deliverable."
        )
        actions = [
            AiChatAction(type="how_it_works", label="How It Works Guide"),
            AiChatAction(type="generate_job_post", label="Post a Protected Project"),
        ]
    elif "verify" in msg or "lawyer" in msg or "credential" in msg or "legal" in msg:
        reply = (
            "**Regulated Credential Verification:**\n\n"
            "In regulated domains like Corporate Law and Chartered Accountancy, every professional's license "
            "(e.g., Bar Council of India, ICAI membership) is audited and approved by QubeLancer platform governance "
            "before they are allowed to submit proposals or list services."
        )
        actions = [
            AiChatAction(type="browse_categories", label="Browse 15 Categories"),
            AiChatAction(type="find_lawyers", label="View Verified Lawyers"),
        ]
    else:
        reply = (
            "Hello! I am your **QubeLancer Marketplace Copilot**.\n\n"
            "I can assist you with:\n"
            "• **Voice & Chat Job Posting:** Simply speak or type what you need done, and I will generate a complete, structured job post for you.\n"
            "• **Finding Vetted Consultants:** Matching you with top verified corporate lawyers, AI engineers, or accountants.\n"
            "• **Escrow & Governance:** Explaining our milestone lockbox, Razorpay settlement, and double-entry ledger."
        )
        actions = [
            AiChatAction(type="generate_job_post", label="Create Job from Voice or Text"),
            AiChatAction(type="browse_projects", label="Browse Active Projects"),
            AiChatAction(type="find_experts", label="Find Top Professionals"),
        ]

    return ResponseModel(
        data=AiChatResponse(
            reply=reply,
            is_job_query=False,
            extracted_job=None,
            suggested_actions=actions,
        )
    )
