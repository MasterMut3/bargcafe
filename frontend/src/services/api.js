const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8787";

export async function apiFetch(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
  } catch {
    throw new Error("Unable to connect to the API");
  }

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error("Invalid response from API");
  }

  if (!response.ok) {
    throw new Error(data.error || "API request failed");
  }

  return data;
}

export function getHealth() {
  return apiFetch("/api/health");
}