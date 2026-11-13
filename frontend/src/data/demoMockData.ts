import {
  Category,
  Project,
  ProfessionalProfile,
  PublicConfig,
  User,
  Contract,
} from "../types";
import { GeneratedJobPost, AiChatResponse } from "../api/ai";

export const DEMO_CATEGORIES: Category[] = [
  {
    id: "cat-1",
    name: "Legal Services",
    slug: "legal-services",
    description:
      "Contract drafting, corporate documentation, IP protection, regulatory compliance support, and legal consulting by authorized professionals.",
    icon_name: "Scale",
    is_regulated: true,
    parent_id: null,
    is_active: true,
    sort_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: "cat-2",
    name: "Business Advisory",
    slug: "business-advisory",
    description:
      "Startup consulting, strategic planning, business development, market expansion research, and executive advisory.",
    icon_name: "Briefcase",
    is_regulated: false,
    parent_id: null,
    is_active: true,
    sort_order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: "cat-3",
    name: "Financial Advisory",
    slug: "financial-advisory",
    description:
      "Financial planning, modeling, budgeting, valuation, and investment advisory through authorized professionals.",
    icon_name: "TrendingUp",
    is_regulated: true,
    parent_id: null,
    is_active: true,
    sort_order: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: "cat-4",
    name: "Web3 & Blockchain Developers",
    slug: "web3-blockchain-developers",
    description:
      "Smart contracts, decentralized apps (dApps), protocol engineering, audits, token architectures, and blockchain integration.",
    icon_name: "Blocks",
    is_regulated: false,
    parent_id: null,
    is_active: true,
    sort_order: 4,
    created_at: new Date().toISOString(),
  },
  {
    id: "cat-5",
    name: "IT Consultancy",
    slug: "it-consultancy",
    description:
      "Enterprise software architecture, cloud infrastructure, cybersecurity audits, DevOps, and technical support.",
    icon_name: "Server",
    is_regulated: false,
    parent_id: null,
    is_active: true,
    sort_order: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: "cat-6",
    name: "Web & Mobile Development",
    slug: "web-mobile-development",
    description:
      "Full-stack web applications, iOS and Android apps, e-commerce platforms, custom SaaS products, and API development.",
    icon_name: "Code",
    is_regulated: false,
    parent_id: null,
    is_active: true,
    sort_order: 6,
    created_at: new Date().toISOString(),
  },
  {
    id: "cat-7",
    name: "Digital Marketing",
    slug: "digital-marketing",
    description:
      "Search engine optimization (SEO), performance advertising, social media strategy, branding, and lead generation.",
    icon_name: "Megaphone",
    is_regulated: false,
    parent_id: null,
    is_active: true,
    sort_order: 7,
    created_at: new Date().toISOString(),
  },
  {
    id: "cat-8",
    name: "AI & Automation",
    slug: "ai-automation",
    description:
      "Machine learning, LLM fine-tuning, workflow automations, intelligent chatbots, and predictive data analytics.",
    icon_name: "Bot",
    is_regulated: false,
    parent_id: null,
    is_active: true,
    sort_order: 8,
    created_at: new Date().toISOString(),
  },
  {
    id: "cat-9",
    name: "Design & Creative Services",
    slug: "design-creative-services",
    description:
      "UI/UX product design, brand identity, motion graphics, 3D visualization, and design systems.",
    icon_name: "Palette",
    is_regulated: false,
    parent_id: null,
    is_active: true,
    sort_order: 9,
    created_at: new Date().toISOString(),
  },
  {
    id: "cat-10",
    name: "Accounting & Taxation",
    slug: "accounting-taxation",
    description:
      "Tax filing, GST compliance, bookkeeping, statutory audits, and payroll structuring by certified accountants.",
    icon_name: "Calculator",
    is_regulated: true,
    parent_id: null,
    is_active: true,
    sort_order: 10,
    created_at: new Date().toISOString(),
  },
  {
    id: "cat-11",
    name: "HR & Recruitment",
    slug: "hr-recruitment",
    description:
      "Executive search, technical headhunting, compensation benchmarking, and HR policy consulting.",
    icon_name: "Users",
    is_regulated: false,
    parent_id: null,
    is_active: true,
    sort_order: 11,
    created_at: new Date().toISOString(),
  },
  {
    id: "cat-12",
    name: "Real Estate & Business Projects",
    slug: "real-estate-business-projects",
    description:
      "Property advisory, architectural documentation, lease agreements, and construction project management.",
    icon_name: "Building",
    is_regulated: true,
    parent_id: null,
    is_active: true,
    sort_order: 12,
    created_at: new Date().toISOString(),
  },
  {
    id: "cat-13",
    name: "Healthcare & Life Sciences",
    slug: "healthcare-life-sciences",
    description:
      "Biomedical consulting, clinical trial regulatory advisory, and healthcare software compliance.",
    icon_name: "Activity",
    is_regulated: true,
    parent_id: null,
    is_active: true,
    sort_order: 13,
    created_at: new Date().toISOString(),
  },
  {
    id: "cat-14",
    name: "Engineering & Architecture",
    slug: "engineering-architecture",
    description:
      "Structural engineering design, CAD drafting, MEP specifications, and urban planning compliance.",
    icon_name: "Compass",
    is_regulated: true,
    parent_id: null,
    is_active: true,
    sort_order: 14,
    created_at: new Date().toISOString(),
  },
  {
    id: "cat-15",
    name: "Content & Translation",
    slug: "content-translation",
    description:
      "Technical copywriting, multi-language localization, whitepapers, and regulatory documentation.",
    icon_name: "FileText",
    is_regulated: false,
    parent_id: null,
    is_active: true,
    sort_order: 15,
    created_at: new Date().toISOString(),
  },
];

export const DEMO_PUBLIC_CONFIG: PublicConfig = {
  default_country: "IN",
  default_currency: "INR",
  payment_provider: "razorpay",
  platform_fee_percentage: 10,
  countries: [
    { country_code: "IN", name: "India", default_currency: "INR", is_enabled: true },
    { country_code: "US", name: "United States", default_currency: "USD", is_enabled: true },
    { country_code: "GB", name: "United Kingdom", default_currency: "GBP", is_enabled: true },
    { country_code: "DE", name: "Germany", default_currency: "EUR", is_enabled: true },
  ],
  currencies: [
    { code: "INR", name: "Indian Rupee", symbol: "₹", is_enabled: true },
    { code: "USD", name: "US Dollar", symbol: "$", is_enabled: true },
    { code: "GBP", name: "British Pound", symbol: "£", is_enabled: true },
    { code: "EUR", name: "Euro", symbol: "€", is_enabled: true },
  ],
  feature_flags: {
    btq_payments_enabled: false,
    qubex_benefits_enabled: false,
  },
};

export const DEMO_PROJECTS: Project[] = [
  {
    id: "proj-101",
    customer_id: "usr-client-1",
    category_id: "cat-8",
    title: "Autonomous AI Agent Workflow for Customer Intelligence",
    description:
      "Looking for a seasoned AI Engineer to design and deploy an autonomous LangChain/FastAPI workflow with vector search embeddings and real-time dashboard visualization. Must deliver audited code and comprehensive staging documentation.",
    budget_min: 800,
    budget_max: 1500,
    currency_code: "USD",
    deadline: new Date(Date.now() + 21 * 86400000).toISOString(),
    status: "open",
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
    category_name: "AI & Automation",
    customer_name: "Priya Sharma (Acme Corp)",
    proposals_count: 5,
  },
  {
    id: "proj-102",
    customer_id: "usr-client-1",
    category_id: "cat-1",
    title: "Enterprise SaaS Master Services Agreement & DPDP Compliance Audit",
    description:
      "Seeking a verified corporate lawyer with experience in software licensing and India DPDP / EU GDPR data privacy governance to draft an institutional MSA, SLA, and customer DPA.",
    budget_min: 500,
    budget_max: 1000,
    currency_code: "USD",
    deadline: new Date(Date.now() + 14 * 86400000).toISOString(),
    status: "open",
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
    category_name: "Legal Services",
    customer_name: "Apex Ventures Global",
    proposals_count: 3,
  },
  {
    id: "proj-103",
    customer_id: "usr-client-2",
    category_id: "cat-6",
    title: "React 19 & Tailwind Full-Stack FinTech Portal Refactor",
    description:
      "Full-stack revamp of our customer analytics portal. Integrate microservices, optimize Lighthouse scores, and configure Razorpay escrow webhooks with end-to-end Vitest coverage.",
    budget_min: 1200,
    budget_max: 2400,
    currency_code: "USD",
    deadline: new Date(Date.now() + 30 * 86400000).toISOString(),
    status: "open",
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
    category_name: "Web & Mobile Development",
    customer_name: "Kiran Tech Labs",
    proposals_count: 7,
  },
  {
    id: "proj-104",
    customer_id: "usr-client-2",
    category_id: "cat-10",
    title: "Annual Corporate Tax Filing, GST Reconciliation & Statutory Audit",
    description:
      "Chartered Accountant required to perform comprehensive GST input tax credit reconciliation, prepare audited financial statements, and file corporate returns with MCA compliance.",
    budget_min: 400,
    budget_max: 750,
    currency_code: "USD",
    deadline: new Date(Date.now() + 10 * 86400000).toISOString(),
    status: "open",
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
    category_name: "Accounting & Taxation",
    customer_name: "Hyperion Media Pvt Ltd",
    proposals_count: 4,
  },
];

export const DEMO_PROFESSIONALS: ProfessionalProfile[] = [
  {
    id: "prof-1",
    user_id: "usr-prof-1",
    display_name: "Arjun Mehta",
    title: "Senior AI Architect & Autonomous Systems Engineer",
    biography:
      "10+ years designing enterprise machine learning pipelines, LLM fine-tuning, and scalable microservices in Python, FastAPI, and Kubernetes.",
    country_code: "IN",
    hourly_rate: 65,
    currency_code: "USD",
    skills: ["Python", "FastAPI", "LangChain", "Vector DBs", "Docker", "DevOps"],
    professional_status: "available",
    verification_status: "verified",
    rating_average: 4.95,
    total_reviews_count: 28,
    created_at: new Date(Date.now() - 60 * 86400000).toISOString(),
    credentials: [
      {
        id: "cred-1",
        professional_id: "prof-1",
        title: "AWS Certified Machine Learning - Specialty",
        issuing_organization: "Amazon Web Services",
        credential_identifier: "AWS-ML-849201",
        verification_status: "verified",
        verified_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      },
    ],
  },
  {
    id: "prof-2",
    user_id: "usr-prof-2",
    display_name: "Adv. Kavita Deshmukh",
    title: "Corporate Legal Counsel & Regulatory Compliance Specialist",
    biography:
      "Registered Advocate with 8 years representing startups and multinationals in technology contracts, IP licensing, and DPDP / GDPR regulatory audits.",
    country_code: "IN",
    hourly_rate: 85,
    currency_code: "USD",
    skills: ["Corporate Law", "Contract Drafting", "DPDP Act", "IP Protection", "M&A"],
    professional_status: "available",
    verification_status: "verified",
    rating_average: 5.0,
    total_reviews_count: 19,
    created_at: new Date(Date.now() - 90 * 86400000).toISOString(),
    credentials: [
      {
        id: "cred-2",
        professional_id: "prof-2",
        title: "Bar Council of India License",
        issuing_organization: "Bar Council of India",
        credential_identifier: "BCI-MH-2016-8940",
        verification_status: "verified",
        verified_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      },
    ],
  },
  {
    id: "prof-3",
    user_id: "usr-prof-3",
    display_name: "Vikram Singhania, FCA",
    title: "Chartered Accountant & Strategic Financial Controller",
    biography:
      "Fellow Chartered Accountant (ICAI) offering statutory auditing, valuation, and enterprise cross-border taxation services.",
    country_code: "IN",
    hourly_rate: 70,
    currency_code: "USD",
    skills: ["GST Auditing", "Corporate Taxation", "Valuation", "IFRS", "MCA Compliance"],
    professional_status: "available",
    verification_status: "verified",
    rating_average: 4.9,
    total_reviews_count: 34,
    created_at: new Date(Date.now() - 120 * 86400000).toISOString(),
    credentials: [
      {
        id: "cred-3",
        professional_id: "prof-3",
        title: "Associate Member of ICAI",
        issuing_organization: "Institute of Chartered Accountants of India",
        credential_identifier: "ICAI-MEM-592810",
        verification_status: "verified",
        verified_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      },
    ],
  },
];

export const DEMO_CLIENT_USER: User = {
  id: "usr-demo-customer",
  email: "demo.client@qubelancer.com",
  first_name: "Priya",
  last_name: "Sharma",
  status: "active",
  country_code: "IN",
  preferred_currency: "INR",
  roles: ["customer"],
  is_mfa_enabled: false,
  email_verified_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
};

export const DEMO_PROFESSIONAL_USER: User = {
  id: "usr-demo-professional",
  email: "demo.consultant@qubelancer.com",
  first_name: "Arjun",
  last_name: "Mehta",
  status: "active",
  country_code: "IN",
  preferred_currency: "USD",
  roles: ["professional"],
  is_mfa_enabled: false,
  email_verified_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
};

export const DEMO_CONTRACTS: Contract[] = [
  {
    id: "cnt-101",
    project_id: "proj-101",
    proposal_id: "prop-101",
    customer_id: "usr-demo-customer",
    professional_id: "prof-1",
    agreed_amount: 1200,
    currency_code: "USD",
    terms_version: "1.0",
    status: "active",
    accepted_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    project_title: "Autonomous AI Agent Workflow for Customer Intelligence",
    customer_name: "Priya Sharma (Demo Client)",
    professional_name: "Arjun Mehta (Demo Consultant)",
    milestones: [
      {
        id: "ms-1",
        contract_id: "cnt-101",
        title: "Milestone 1: Architecture Specification & LangChain Pipeline Design",
        description: "Submit architecture design doc and prototype vector retrieval setup.",
        amount: 500,
        currency_code: "USD",
        due_at: new Date(Date.now() + 7 * 86400000).toISOString(),
        status: "submitted",
        submitted_at: new Date(Date.now() - 1 * 86400000).toISOString(),
        deliverable_notes: "Initial FastAPI endpoints and vector store indexing completed. GitHub branch pushed for review.",
        created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
      },
      {
        id: "ms-2",
        contract_id: "cnt-101",
        title: "Milestone 2: Production Staging Deployment & Vitest Suite",
        description: "Deploy to staging, configure environment variables, and deliver 100% passing tests.",
        amount: 700,
        currency_code: "USD",
        due_at: new Date(Date.now() + 14 * 86400000).toISOString(),
        status: "funded",
        created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
      },
    ],
  },
];

// Client-side AI Generator fallback
export function generateClientMockJobPost(prompt: string): GeneratedJobPost {
  const p = prompt.trim();
  const pLower = p.toLowerCase();

  // Detect budget
  let budgetMin = 200;
  let budgetMax = 600;
  const numbers = p.match(/\b\d{2,6}\b/g);
  if (numbers && numbers.length >= 2) {
    const n1 = parseInt(numbers[0], 10);
    const n2 = parseInt(numbers[1], 10);
    budgetMin = Math.min(n1, n2);
    budgetMax = Math.max(n1, n2);
  } else if (numbers && numbers.length === 1) {
    const val = parseInt(numbers[0], 10);
    budgetMax = Math.max(val, 25);
    budgetMin = Math.round(budgetMax * 0.6);
  }

  // Detect timeline
  let timelineDays = 14;
  const daysMatch = pLower.match(/(\d+)\s*(day|week|month)/);
  if (daysMatch) {
    const count = parseInt(daysMatch[1], 10);
    if (daysMatch[2].startsWith("week")) timelineDays = count * 7;
    else if (daysMatch[2].startsWith("month")) timelineDays = count * 30;
    else timelineDays = count;
  }

  // Detect category
  let category = DEMO_CATEGORIES[5]; // Web & Mobile
  if (pLower.includes("law") || pLower.includes("contract") || pLower.includes("nda") || pLower.includes("legal")) {
    category = DEMO_CATEGORIES[0];
  } else if (pLower.includes("tax") || pLower.includes("audit") || pLower.includes("gst") || pLower.includes("ca")) {
    category = DEMO_CATEGORIES[9];
  } else if (pLower.includes("ai") || pLower.includes("agent") || pLower.includes("llm") || pLower.includes("bot")) {
    category = DEMO_CATEGORIES[7];
  } else if (pLower.includes("design") || pLower.includes("ui") || pLower.includes("ux") || pLower.includes("figma")) {
    category = DEMO_CATEGORIES[8];
  } else if (pLower.includes("blockchain") || pLower.includes("web3") || pLower.includes("smart contract")) {
    category = DEMO_CATEGORIES[3];
  }

  const generatedTitle =
    p.length > 50
      ? p.split(/[.\n]/)[0].slice(0, 80)
      : `${category.name} Milestone Specification`;

  return {
    title: generatedTitle,
    category_id: category.id,
    category_name: category.name,
    description: `### Project Objectives & Deliverables\n${p}\n\n### Required Milestones\n1. Technical & Functional Specification Alignment\n2. Primary Deliverable Handover\n3. Acceptance Testing & Escrow Sign-Off\n\n### Skills & Standards\n- Strong experience in ${category.name}\n- Clear milestone reporting and compliance with QubeLancer Escrow standards.`,
    budget_min: budgetMin,
    budget_max: budgetMax,
    deadline_days: timelineDays,
    suggested_skills: [category.name, "Milestone Escrow", "Consulting", "Documentation"],
    currency: "USD",
    confidence_score: 0.95,
  };
}

// Client-side AI Chatbot fallback
export function generateClientMockChat(message: string): AiChatResponse {
  const msg = message.toLowerCase();
  const isJobQuery =
    msg.includes("hire") ||
    msg.includes("need") ||
    msg.includes("build") ||
    msg.includes("post") ||
    msg.includes("create") ||
    msg.includes("contract");

  if (isJobQuery) {
    const job = generateClientMockJobPost(message);
    return {
      reply: `I have analyzed your requirement: **${job.title}** categorized under **${job.category_name}** with an estimated budget of **$${job.budget_min} - $${job.budget_max} USD** (~ ₹${(job.budget_min * 84).toLocaleString()} - ₹${(job.budget_max * 84).toLocaleString()} INR). You can review the draft below and publish directly to QubeLancer!`,
      is_job_query: true,
      extracted_job: job,
      suggested_actions: [
        { type: "view_job_draft", label: "Review & Publish Brief", payload: job },
        { type: "browse_experts", label: "Browse Available Experts" },
      ],
    };
  }

  return {
    reply:
      "Hello! I am your **QubeLancer AI Copilot**.\n\nYou can speak or type what you need to build or hire for, and I will extract the requirements, timeline, budget, and auto-fill your project brief instantly!",
    is_job_query: false,
    extracted_job: null,
    suggested_actions: [
      { type: "generate_job_post", label: "Create Project Brief" },
      { type: "browse_projects", label: "Browse Active Projects" },
    ],
  };
}
