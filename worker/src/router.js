import { json, notFound } from "./response.js";
import { getBotInfo } from "./services/telegram.js";
import { categories, items } from "./data/menu.js";

export async function router(request, env) {
  const url = new URL(request.url);

  if (request.method === "GET" && url.pathname === "/api/health") {
    return json({
      ok: true,
      service: "bargcafe-api",
    });
  }

  if (request.method === "GET" && url.pathname === "/api/telegram/test") {
    try {
      const bot = await getBotInfo(env);

      return json({
        ok: true,
        telegram: {
          id: bot.id,
          username: bot.username,
          is_bot: bot.is_bot,
        },
      });
    } catch (error) {
      return json(
        {
          ok: false,
          error: error.message,
        },
        500
      );
    }
  }
  if (request.method === "GET" && url.pathname === "/api/categories") {
    return json({
      ok: true,
      categories,
    });
  }

  if (request.method === "GET" && url.pathname === "/api/items") {
    return json({
      ok: true,
      items,
    });
  }
  return notFound();
}
