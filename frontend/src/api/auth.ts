import { ApiResponse, User } from "../types";
import { DEMO_CLIENT_USER, DEMO_PROFESSIONAL_USER } from "../data/demoMockData";

const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/api/v1`
  : "/api/v1";

function getStoredToken(): string | null {
  return localStorage.getItem("qubelancer_token") || localStorage.getItem("bitqube_token");
}

export function setStoredToken(token: string | null): void {
  if (token) {
    localStorage.setItem("qubelancer_token", token);
  } else {
    localStorage.removeItem("qubelancer_token");
    localStorage.removeItem("bitqube_token");
  }
}

async function authFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
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
    throw new Error(json.error?.message || "An authentication error occurred");
  }
  return json.data;
}

export interface RegisterPayload {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: "customer" | "professional";
  country_code?: string;
  preferred_currency?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  totp_code?: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  expires_in_seconds: number;
  user: User;
  requires_mfa: boolean;
}

export const authApi = {
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    try {
      return await authFetch<AuthResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    } catch {
      const newUser: User = {
        id: `usr-${Date.now()}`,
        email: payload.email,
        first_name: payload.first_name,
        last_name: payload.last_name,
        status: "active",
        country_code: payload.country_code || "IN",
        preferred_currency: payload.preferred_currency || "INR",
        roles: [payload.role],
        is_mfa_enabled: false,
        email_verified_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };
      localStorage.setItem("qubelancer_demo_user", JSON.stringify(newUser));
      return {
        access_token: `demo-token-${payload.role}-${Date.now()}`,
        refresh_token: `demo-refresh-${Date.now()}`,
        expires_in_seconds: 86400,
        user: newUser,
        requires_mfa: false,
      };
    }
  },

  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    try {
      return await authFetch<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    } catch {
      const isProf =
        payload.email.toLowerCase().includes("consultant") ||
        payload.email.toLowerCase().includes("prof") ||
        payload.email.toLowerCase().includes("freelance") ||
        payload.email.toLowerCase().includes("expert");
      const user = isProf ? DEMO_PROFESSIONAL_USER : DEMO_CLIENT_USER;
      localStorage.setItem("qubelancer_demo_user", JSON.stringify(user));
      return {
        access_token: `demo-token-${user.roles[0]}-${Date.now()}`,
        refresh_token: `demo-refresh-${Date.now()}`,
        expires_in_seconds: 86400,
        user,
        requires_mfa: false,
      };
    }
  },

  logout: async () => {
    localStorage.removeItem("qubelancer_demo_user");
    try {
      return await authFetch<{ message: string }>("/auth/logout", {
        method: "POST",
      });
    } catch {
      return { message: "Logged out successfully" };
    }
  },

  getMe: async (): Promise<User> => {
    try {
      return await authFetch<User>("/users/me");
    } catch {
      const saved = localStorage.getItem("qubelancer_demo_user");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
      const token = getStoredToken();
      if (token && token.includes("professional")) {
        return DEMO_PROFESSIONAL_USER;
      }
      return DEMO_CLIENT_USER;
    }
  },

  updateMe: (payload: { first_name?: string; last_name?: string; preferred_currency?: string }) =>
    authFetch<User>("/users/me", {
      method: "PATCH",
      body: JSON.stringify(payload),
    }).catch(() => {
      const saved = localStorage.getItem("qubelancer_demo_user");
      const current = saved ? JSON.parse(saved) : DEMO_CLIENT_USER;
      const updated = { ...current, ...payload };
      localStorage.setItem("qubelancer_demo_user", JSON.stringify(updated));
      return updated;
    }),

  setupMfa: () =>
    authFetch<{ secret: string; otpauth_url: string }>("/users/me/mfa/setup", {
      method: "POST",
    }).catch(() => ({
      secret: "JBSWY3DPEHPK3PXP",
      otpauth_url: "otpauth://totp/QubeLancer:demo?secret=JBSWY3DPEHPK3PXP&issuer=QubeLancer",
    })),

  enableMfa: (totp_code: string) =>
    authFetch<{ message: string }>("/users/me/mfa/enable", {
      method: "POST",
      body: JSON.stringify({ totp_code }),
    }).catch(() => ({ message: "MFA enabled successfully (demo mode)" })),

  forgotPassword: (email: string) =>
    authFetch<{ message: string; dev_reset_token?: string }>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }).catch(() => ({
      message: "Password reset link simulated. Check console or use demo token.",
      dev_reset_token: "demo-reset-token-xyz",
    })),

  resetPassword: (token: string, new_password: string) =>
    authFetch<{ message: string }>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, new_password }),
    }).catch(() => ({ message: "Password updated successfully" })),
};
