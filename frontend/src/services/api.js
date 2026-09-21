const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8787";

export async function apiFetch(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "API request failed");
  }

  return data;
}

export function getHealth() {
  return apiFetch("/api/health");
}