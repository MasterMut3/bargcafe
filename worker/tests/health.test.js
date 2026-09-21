import { describe, it, expect } from "vitest";
import { router } from "../src/router.js";

describe("GET /api/health", () => {
  it("returns a healthy API response", async () => {
    const request = new Request("http://localhost/api/health");

    const response = await router(request, {});

    expect(response.status).toBe(200);

    const body = await response.json();

    expect(body).toEqual({
      ok: true,
      service: "bargcafe-api"
    });
  });
});
