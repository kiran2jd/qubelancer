import { ApiResponse } from "../types";
import {
  generateClientMockChat,
  generateClientMockJobPost,
} from "../data/demoMockData";

const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/api/v1`
  : "/api/v1";

export interface GeneratedJobPost {
  title: string;
  category_id: string | null;
  category_name: string;
  description: string;
  budget_min: number;
  budget_max: number;
  deadline_days: number;
  suggested_skills: string[];
  currency: string;
  confidence_score: number;
}

export interface AiChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AiChatAction {
  type: string;
  label: string;
  payload?: any;
}

export interface AiChatResponse {
  reply: string;
  is_job_query: boolean;
  extracted_job?: GeneratedJobPost | null;
  suggested_actions?: AiChatAction[];
}

export const aiApi = {
  generateJobPost: async (prompt: string, categoryHint?: string): Promise<GeneratedJobPost> => {
    try {
      const res = await fetch(`${API_BASE}/ai/generate-job-post`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, category_hint: categoryHint }),
      });
      if (res.ok) {
        const json: ApiResponse<GeneratedJobPost> = await res.json();
        if (json.success && json.data) {
          return json.data;
        }
      }
    } catch {
      // Backend not running (e.g. standalone Vercel preview demo)
    }
    // Graceful fallback: intelligent client-side generation
    return generateClientMockJobPost(prompt);
  },

  chat: async (message: string, history?: AiChatMessage[]): Promise<AiChatResponse> => {
    try {
      const res = await fetch(`${API_BASE}/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history }),
      });
      if (res.ok) {
        const json: ApiResponse<AiChatResponse> = await res.json();
        if (json.success && json.data) {
          return json.data;
        }
      }
    } catch {
      // Backend not running (e.g. standalone Vercel preview demo)
    }
    // Graceful fallback: intelligent client-side conversational assistant
    return generateClientMockChat(message);
  },
};
