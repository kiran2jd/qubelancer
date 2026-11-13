import { ApiResponse, Contract, Project, Proposal, Review } from "../types";
import { DEMO_PROJECTS, DEMO_CATEGORIES, DEMO_CONTRACTS } from "../data/demoMockData";

const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/api/v1`
  : "/api/v1";

function getStoredToken(): string | null {
  return localStorage.getItem("qubelancer_token") || localStorage.getItem("bitqube_token");
}

function getLocalContracts(): Contract[] {
  try {
    const raw = localStorage.getItem("qubelancer_demo_contracts");
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEMO_CONTRACTS;
}

function saveLocalContract(c: Contract) {
  try {
    const list = getLocalContracts().filter((existing) => existing.id !== c.id);
    const updated = [c, ...list];
    localStorage.setItem("qubelancer_demo_contracts", JSON.stringify(updated));
  } catch {}
}

function getLocalProjects(): Project[] {
  try {
    const raw = localStorage.getItem("qubelancer_demo_projects");
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEMO_PROJECTS;
}

function saveLocalProject(p: Project) {
  try {
    const list = getLocalProjects();
    const updated = [p, ...list];
    localStorage.setItem("qubelancer_demo_projects", JSON.stringify(updated));
  } catch {}
}

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
    throw new Error(json.error?.message || "An error occurred with the request");
  }
  return json.data;
}

export const projectsApi = {
  list: async (params?: {
    offset?: number;
    limit?: number;
    category_id?: string;
    customer_id?: string;
    status?: string;
    search?: string;
  }) => {
    try {
      const q = new URLSearchParams();
      if (params?.offset !== undefined) q.append("offset", params.offset.toString());
      if (params?.limit !== undefined) q.append("limit", params.limit.toString());
      if (params?.category_id) q.append("category_id", params.category_id);
      if (params?.customer_id) q.append("customer_id", params.customer_id);
      if (params?.status) q.append("status", params.status);
      if (params?.search) q.append("search", params.search);
      return await apiFetch<Project[]>(`/projects?${q.toString()}`);
    } catch {
      // Demo fallback when backend is offline
      let projects = getLocalProjects();
      if (params?.category_id) {
        projects = projects.filter((p) => p.category_id === params.category_id);
      }
      if (params?.search) {
        const s = params.search.toLowerCase();
        projects = projects.filter(
          (p) => p.title.toLowerCase().includes(s) || p.description.toLowerCase().includes(s)
        );
      }
      return projects;
    }
  },

  getById: async (id: string) => {
    try {
      return await apiFetch<Project>(`/projects/${id}`);
    } catch {
      const projects = getLocalProjects();
      return (
        projects.find((p) => p.id === id) ||
        projects[0] ||
        DEMO_PROJECTS[0]
      );
    }
  },

  create: async (payload: {
    category_id: string;
    title: string;
    description: string;
    budget_min?: number;
    budget_max: number;
    currency_code?: string;
    deadline: string;
  }) => {
    try {
      return await apiFetch<Project>("/projects", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    } catch {
      const cat = DEMO_CATEGORIES.find((c) => c.id === payload.category_id);
      const newProj: Project = {
        id: `proj-${Date.now()}`,
        customer_id: "usr-demo-customer",
        category_id: payload.category_id,
        category_name: cat?.name || "Professional Services",
        customer_name: "You (Demo Client)",
        title: payload.title,
        description: payload.description,
        budget_min: payload.budget_min || Math.round(payload.budget_max * 0.6),
        budget_max: payload.budget_max,
        currency_code: payload.currency_code || "USD",
        deadline: payload.deadline,
        status: "open",
        proposals_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      saveLocalProject(newProj);
      return newProj;
    }
  },

  update: (id: string, payload: Partial<Project>) =>
    apiFetch<Project>(`/projects/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }).catch(() => ({ ...DEMO_PROJECTS[0], ...payload })),

  getProposals: (projectId: string) =>
    apiFetch<Proposal[]>(`/projects/${projectId}/proposals`).catch(() => []),
};

export const proposalsApi = {
  submit: async (payload: {
    project_id: string;
    amount: number;
    currency_code?: string;
    estimated_duration_days: number;
    cover_letter: string;
  }) => {
    try {
      return await apiFetch<Proposal>("/proposals", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    } catch {
      return {
        id: `prop-${Date.now()}`,
        project_id: payload.project_id,
        professional_id: "prof-1",
        professional_name: "Arjun Mehta (Demo Consultant)",
        amount: payload.amount,
        currency_code: payload.currency_code || "USD",
        estimated_duration_days: payload.estimated_duration_days,
        cover_letter: payload.cover_letter,
        status: "submitted" as const,
        created_at: new Date().toISOString(),
      };
    }
  },

  getMyProposals: () => apiFetch<Proposal[]>("/proposals/me").catch(() => []),

  accept: (id: string) =>
    apiFetch<Contract>(`/proposals/${id}/accept`, { method: "POST" }),
};

export const contractsApi = {
  list: async (): Promise<Contract[]> => {
    try {
      return await apiFetch<Contract[]>("/contracts");
    } catch {
      return getLocalContracts();
    }
  },

  getById: async (id: string): Promise<Contract> => {
    try {
      return await apiFetch<Contract>(`/contracts/${id}`);
    } catch {
      const all = getLocalContracts();
      return all.find((c) => c.id === id) || all[0] || DEMO_CONTRACTS[0];
    }
  },

  fundEscrow: async (id: string): Promise<Contract> => {
    try {
      return await apiFetch<Contract>(`/contracts/${id}/fund`, { method: "POST" });
    } catch {
      const all = getLocalContracts();
      const target = all.find((c) => c.id === id) || DEMO_CONTRACTS[0];
      const updated: Contract = {
        ...target,
        milestones: target.milestones.map((m, idx) =>
          idx === 0 ? { ...m, status: "funded" } : m
        ),
      };
      saveLocalContract(updated);
      return updated;
    }
  },

  submitMilestoneDeliverable: async (
    contractId: string,
    milestoneId: string,
    notes: string
  ): Promise<Contract> => {
    try {
      return await apiFetch<Contract>(`/contracts/${contractId}/milestones/${milestoneId}/submit`, {
        method: "POST",
        body: JSON.stringify({ notes }),
      });
    } catch {
      const all = getLocalContracts();
      const target = all.find((c) => c.id === contractId) || DEMO_CONTRACTS[0];
      const updated: Contract = {
        ...target,
        milestones: target.milestones.map((m) =>
          m.id === milestoneId
            ? { ...m, status: "submitted", deliverable_notes: notes, submitted_at: new Date().toISOString() }
            : m
        ),
      };
      saveLocalContract(updated);
      return updated;
    }
  },

  approveMilestone: async (contractId: string, milestoneId: string): Promise<Contract> => {
    try {
      return await apiFetch<Contract>(`/contracts/${contractId}/milestones/${milestoneId}/approve`, {
        method: "POST",
      });
    } catch {
      const all = getLocalContracts();
      const target = all.find((c) => c.id === contractId) || DEMO_CONTRACTS[0];
      const updated: Contract = {
        ...target,
        milestones: target.milestones.map((m) =>
          m.id === milestoneId
            ? { ...m, status: "approved", approved_at: new Date().toISOString() }
            : m
        ),
      };
      saveLocalContract(updated);
      return updated;
    }
  },

  approveMilestoneDeliverable: async (contractId: string, milestoneId: string): Promise<Contract> => {
    return contractsApi.approveMilestone(contractId, milestoneId);
  },
};

export const reviewsApi = {
  submit: (payload: { contract_id: string; rating: number; comment: string }) =>
    apiFetch<Review>("/reviews", {
      method: "POST",
      body: JSON.stringify(payload),
    }).catch(() => ({
      id: `rev-${Date.now()}`,
      contract_id: payload.contract_id,
      reviewer_id: "usr-demo-customer",
      reviewee_id: "usr-demo-professional",
      reviewer_name: "Verified Client",
      counterpart_name: "Professional Specialist",
      rating: payload.rating,
      comment: payload.comment,
      created_at: new Date().toISOString(),
    })),
};
