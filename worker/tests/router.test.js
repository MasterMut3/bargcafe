import { describe, it, expect } from "vitest";
import { router } from "../src/router.js";

describe("Router", () => {
  it("returns 404 for an unknown route", async () => {
    const request = new Request("http://localhost/api/unknown");

    const response = await router(request, {});

    expect(response.status).toBe(404);

    const body = await response.json();

    expect(body).toEqual({
      ok: false,
      error: "Not Found"
    });
  });
});
