import { json, notFound } from "./response.js";
import { getBotInfo } from "./services/telegram.js";
import { categories, items } from "./data/menu.js";
import { createOrderFromRequest } from "./services/orders.js";
import { sendMessage } from "./services/telegram.js";
import { getRepositoryFile } from "./services/github.js";

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

  if (request.method === "POST" && url.pathname === "/api/orders") {
  try {
    const body = await request.json();

    const order = createOrderFromRequest({
      id: crypto.randomUUID(),
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      notes: body.notes,
      requestedItems: body.items,
    });

    const message = [
      "🧾 سفارش جدید کافه برگ",
      "",
      `شماره سفارش: ${order.id}`,
      `نام: ${order.customerName}`,
      order.customerPhone
        ? `تلفن: ${order.customerPhone}`
        : null,
      "",
      ...order.items.map(
        (item) =>
          `${item.name} × ${item.quantity} — ${
            item.quantity * item.unitPrice
          } تومان`
      ),
      "",
      `مبلغ کل: ${order.total} تومان`,
      order.notes ? `یادداشت: ${order.notes}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    await sendMessage(
      env,
      env.TELEGRAM_ADMIN_CHAT_ID,
      message
    );

    return json(
      {
        ok: true,
        order,
      },
      201
    );
  } catch (error) {
    return json(
      {
        ok: false,
        error: error.message,
      },
      400
    );
  }
}
  if (
  request.method === "GET" &&
  url.pathname === "/api/github/test"
) {
  try {
    const file = await getRepositoryFile(
      env,
      "content/items.json"
    );

    const decoded = Uint8Array.from(
      atob(file.content.replace(/\n/g, "")),
      (char) => char.charCodeAt(0)
    );

    const content = new TextDecoder().decode(decoded);

    return json({
      ok: true,
      github: {
        repository: "MasterMut3/bargcafe",
        path: "content/items.json",
        sha: file.sha,
      },
      content: JSON.parse(content),
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
  return notFound();
}
