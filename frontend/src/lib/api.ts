const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("access_token");
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (token && !headers["Authorization"]) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: `HTTP ${res.status}` }));
    throw new Error(err.detail || "Request failed");
  }

  return res.json();
}

export const api = {
  login: async (username: string, password: string) => {
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    return request<{
      access_token: string;
      token_type: string;
      role?: string;
      fullName?: string;
      phone?: string;
      institution?: string;
      department?: string;
      identityNumber?: string;
    }>("/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    });
  },

  getCourses: () => request<any[]>("/courses"),

  createCourse: (data: any) =>
    request<any>("/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),

  getAssessments: () => request<any[]>("/assessments"),

  submitAssessment: (
    assessmentId: string | number,
    payload: { answers: Record<number, number> }
  ) =>
    request<{
      score: number;
      total: number;
      percentage: number;
      passed: boolean;
      credential_hash?: string;
    }>(`/assessments/${assessmentId}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
};