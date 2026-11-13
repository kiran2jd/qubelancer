import { ApiResponse, Credential, ProfessionalProfile, ServiceItem } from "../types";
import { DEMO_PROFESSIONALS } from "../data/demoMockData";

const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/api/v1`
  : "/api/v1";

function getStoredToken(): string | null {
  return localStorage.getItem("qubelancer_token") || localStorage.getItem("bitqube_token");
}

const DEMO_SERVICES: ServiceItem[] = [
  {
    id: "srv-101",
    professional_id: "prof-1",
    category_id: "cat-8",
    title: "Production LLM Architecture & Multi-Agent Workflow Setup",
    description: "Design and implement custom LangChain or LlamaIndex workflows with vector DB and deployment.",
    price_type: "fixed",
    base_price: 1200,
    currency_code: "USD",
    delivery_days: 14,
    status: "active" as const,
    created_at: new Date().toISOString(),
  },
  {
    id: "srv-102",
    professional_id: "prof-2",
    category_id: "cat-1",
    title: "Master Services Agreement (MSA) & DPDP Compliance Package",
    description: "Tailored enterprise SaaS customer contracts with regulatory compliance and IP assignment terms.",
    price_type: "fixed",
    base_price: 650,
    currency_code: "USD",
    delivery_days: 7,
    status: "active" as const,
    created_at: new Date().toISOString(),
  },
];

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const json: ApiResponse<T> = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error?.message || "An error occurred");
  }
  return json.data;
}

export const professionalsApi = {
  list: async (params?: { offset?: number; limit?: number; query?: string; country?: string; verified_only?: boolean }) => {
    try {
      const q = new URLSearchParams();
      if (params?.offset !== undefined) q.append("offset", params.offset.toString());
      if (params?.limit !== undefined) q.append("limit", params.limit.toString());
      if (params?.query) q.append("query", params.query);
      if (params?.country) q.append("country", params.country);
      if (params?.verified_only) q.append("verified_only", "true");
      return await apiFetch<ProfessionalProfile[]>(`/professionals?${q.toString()}`);
    } catch {
      let list = DEMO_PROFESSIONALS;
      if (params?.query) {
        const q = params.query.toLowerCase();
        list = list.filter(
          (p) =>
            p.display_name.toLowerCase().includes(q) ||
            p.title.toLowerCase().includes(q) ||
            p.skills.some((s) => s.toLowerCase().includes(q))
        );
      }
      return list;
    }
  },

  getById: async (id: string): Promise<ProfessionalProfile> => {
    try {
      return await apiFetch<ProfessionalProfile>(`/professionals/${id}`);
    } catch {
      return DEMO_PROFESSIONALS.find((p) => p.id === id) || DEMO_PROFESSIONALS[0];
    }
  },

  getMyProfile: async (): Promise<ProfessionalProfile> => {
    try {
      return await apiFetch<ProfessionalProfile>("/professionals/me");
    } catch {
      return DEMO_PROFESSIONALS[0];
    }
  },

  updateMyProfile: (payload: {
    display_name?: string;
    title?: string;
    biography?: string;
    country_code?: string;
    hourly_rate?: number;
    currency_code?: string;
    skills?: string[];
    professional_status?: string;
  }) =>
    apiFetch<ProfessionalProfile>("/professionals/me", {
      method: "PUT",
      body: JSON.stringify(payload),
    }).catch(() => ({ ...DEMO_PROFESSIONALS[0], ...payload })),

  submitCredential: (payload: {
    title: string;
    issuing_organization: string;
    credential_identifier?: string;
    document_id?: string;
  }) =>
    apiFetch<Credential>("/professionals/me/credentials", {
      method: "POST",
      body: JSON.stringify(payload),
    }).catch(() => ({
      id: `cred-${Date.now()}`,
      professional_id: "prof-1",
      title: payload.title,
      issuing_organization: payload.issuing_organization,
      credential_identifier: payload.credential_identifier,
      verification_status: "verified" as const,
      verified_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    })),

  getMyCredentials: () =>
    apiFetch<Credential[]>("/professionals/me/credentials").catch(() => DEMO_PROFESSIONALS[0].credentials || []),

  listServices: async (params?: { category_id?: string; professional_id?: string; query?: string }) => {
    try {
      const q = new URLSearchParams();
      if (params?.category_id) q.append("category_id", params.category_id);
      if (params?.professional_id) q.append("professional_id", params.professional_id);
      if (params?.query) q.append("query", params.query);
      return await apiFetch<ServiceItem[]>(`/services?${q.toString()}`);
    } catch {
      let list = DEMO_SERVICES;
      if (params?.category_id) list = list.filter((s) => s.category_id === params.category_id);
      if (params?.query) {
        const q = params.query.toLowerCase();
        list = list.filter((s) => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
      }
      return list;
    }
  },

  createService: (payload: {
    category_id: string;
    title: string;
    description: string;
    price_type: "fixed" | "hourly";
    base_price: number;
    currency_code?: string;
    delivery_days: number;
  }) =>
    apiFetch<ServiceItem>("/services", {
      method: "POST",
      body: JSON.stringify(payload),
    }).catch(() => ({
      id: `srv-${Date.now()}`,
      professional_id: "prof-1",
      category_id: payload.category_id,
      title: payload.title,
      description: payload.description,
      price_type: payload.price_type,
      base_price: payload.base_price,
      currency_code: payload.currency_code || "USD",
      delivery_days: payload.delivery_days,
      status: "active" as const,
      created_at: new Date().toISOString(),
    })),

  updateService: (id: string, payload: Partial<ServiceItem>) =>
    apiFetch<ServiceItem>(`/services/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }).catch(() => ({ ...DEMO_SERVICES[0], ...payload })),

  archiveService: (id: string) =>
    apiFetch<{ message: string }>(`/services/${id}`, {
      method: "DELETE",
    }).catch(() => ({ message: "Service archived" })),
};
