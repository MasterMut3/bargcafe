export function json(data, status = 200, headers = {}) {
  return Response.json(data, {
    status,
    headers: {
      ...headers
    }
  });
}

export function notFound() {
  return json(
    {
      ok: false,
      error: "Not Found"
    },
    404
  );
}