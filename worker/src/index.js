export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/api/health") {
      return Response.json({
        ok: true,
        service: "bargcafe-api"
      });
    }

    return Response.json(
      {
        ok: false,
        error: "Not Found"
      },
      { status: 404 }
    );
  }
};
