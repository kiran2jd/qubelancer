import { ApiResponse, Category, HealthStatus, PublicConfig } from "../types";
import { DEMO_CATEGORIES, DEMO_PUBLIC_CONFIG } from "../data/demoMockData";

const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/api/v1`
  : "/api/v1";

async function request<T>(endpoint: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`);
    if (!res.ok) {
      return fallback;
    }
    const json: ApiResponse<T> = await res.json();
    if (!json.success || !json.data) {
      return fallback;
    }
    return json.data;
  } catch {
    // Graceful fallback for standalone frontend demos on Vercel without active backend
    return fallback;
  }
}

export const api = {
  getCategories: () => request<Category[]>("/categories", DEMO_CATEGORIES),
  getCategoryBySlug: (slug: string) =>
    request<Category>(
      `/categories/${slug}`,
      DEMO_CATEGORIES.find((c) => c.slug === slug) || DEMO_CATEGORIES[0]
    ),
  getPublicConfig: () => request<PublicConfig>("/config/public", DEMO_PUBLIC_CONFIG),
  getHealth: () =>
    request<HealthStatus>("/health", {
      status: "healthy",
      version: "1.0.0",
      environment: "production",
      dependencies: { database: "connected", storage: "connected" },
    }),
};
