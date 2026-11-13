from typing import Any
from pydantic import BaseModel, Field


class GenerateJobPostRequest(BaseModel):
    prompt: str = Field(..., min_length=3, max_length=2000, description="Client requirement prompt or voice transcript")
    category_hint: str | None = Field(default=None, description="Optional user selected category preference")


class GeneratedJobPostResponse(BaseModel):
    title: str
    category_id: str | None = None
    category_name: str
    description: str
    budget_min: float
    budget_max: float
    deadline_days: int
    suggested_skills: list[str] = Field(default_factory=list)
    currency: str = "USD"
    confidence_score: float = 0.95


class AiChatMessage(BaseModel):
    role: str = Field(..., description="'user' or 'assistant'")
    content: str


class AiChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=1500)
    history: list[AiChatMessage] | None = None


class AiChatAction(BaseModel):
    type: str  # e.g., 'generate_job_post', 'view_categories', 'escrow_faq', 'find_professionals'
    label: str
    payload: dict[str, Any] | None = None


class AiChatResponse(BaseModel):
    reply: str
    is_job_query: bool = False
    extracted_job: GeneratedJobPostResponse | None = None
    suggested_actions: list[AiChatAction] = Field(default_factory=list)
