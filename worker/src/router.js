import { json, notFound } from "./response.js";

export async function router(request, env) {
  const url = new URL(request.url);

  if (request.method === "GET" && url.pathname === "/api/health") {
    return json({
      ok: true,
      service: "bargcafe-api"
    });
  }

  return notFound();
}