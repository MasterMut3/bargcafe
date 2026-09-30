import { json, notFound } from "./response.js";
import { categories, items } from "./data/menu.js";
import { createOrderFromRequest } from "./services/orders.js";
import {
  getBotInfo,
  sendMessage,
} from "./services/telegram.js";
import {
  getRepositoryFile,
  updateRepositoryFile,
} from "./services/github.js";

export async function router(request, env) {
  const url = new URL(request.url);

  // Health
  if (
    request.method === "GET" &&
    url.pathname === "/api/health"
  ) {
    return json({
      ok: true,
      service: "bargcafe-api",
    });
  }

  // Telegram API test
  if (
    request.method === "GET" &&
    url.pathname === "/api/telegram/test"
  ) {
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

  // Categories
  if (
    request.method === "GET" &&
    url.pathname === "/api/categories"
  ) {
    return json({
      ok: true,
      categories,
    });
  }

  // Items
  if (
    request.method === "GET" &&
    url.pathname === "/api/items"
  ) {
    return json({
      ok: true,
      items,
    });
  }

  // Create order
  if (
    request.method === "POST" &&
    url.pathname === "/api/orders"
  ) {
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
        order.notes
          ? `یادداشت: ${order.notes}`
          : null,
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

  // GitHub test
  if (
    request.method === "GET" &&
    url.pathname === "/api/github/test"
  ) {
    try {
      const file = await getRepositoryFile(
        env,
        "content/items.json"
      );

      const binary = atob(
        file.content.replace(/\n/g, "")
      );

      const bytes = Uint8Array.from(
        binary,
        (char) => char.charCodeAt(0)
      );

      const content = new TextDecoder().decode(bytes);

      return json({
        ok: true,
        github: {
          repository: "MasterMut3/bargcafe",
          path: "content/items.json",
          sha: file.sha,
        },
        items: JSON.parse(content),
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

  // Add menu item
  if (
    request.method === "POST" &&
    url.pathname === "/api/admin/items"
  ) {
    try {
      const body = await request.json();

      if (
        !body.name ||
        !body.categoryId ||
        !body.price
      ) {
        return json(
          {
            ok: false,
            error:
              "name, categoryId and price are required",
          },
          400
        );
      }

      const file = await getRepositoryFile(
        env,
        "content/items.json"
      );

      const binary = atob(
        file.content.replace(/\n/g, "")
      );

      const bytes = Uint8Array.from(
        binary,
        (char) => char.charCodeAt(0)
      );

      const content = new TextDecoder().decode(bytes);

      const items = JSON.parse(content);

      const item = {
        id: body.id || crypto.randomUUID(),
        categoryId: body.categoryId,
        name: body.name,
        description: body.description || "",
        price: Number(body.price),
        image: body.image || null,
        available: body.available ?? true,
        sortOrder:
          body.sortOrder ?? items.length + 1,
      };

      items.push(item);

      await updateRepositoryFile(
        env,
        "content/items.json",
        JSON.stringify(items, null, 2) + "\n",
        `feat: add menu item ${item.id}`
      );

      return json(
        {
          ok: true,
          item,
        },
        201
      );
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

  // Telegram webhook
  if (
    request.method === "POST" &&
    url.pathname === "/api/telegram/webhook"
  ) {
    const secret = request.headers.get(
      "X-Telegram-Bot-Api-Secret-Token"
    );

    if (
      !env.TELEGRAM_WEBHOOK_SECRET ||
      secret !== env.TELEGRAM_WEBHOOK_SECRET
    ) {
      return json(
        {
          ok: false,
          error: "Unauthorized",
        },
        401
      );
    }

    try {
      const update = await request.json();

      console.log(
        "Telegram update:",
        JSON.stringify(update)
      );

      if (update.message?.text) {
        const chatId = update.message.chat.id;
        const text = update.message.text.trim();

        if (text === "/start") {
          await sendMessage(
            env,
            chatId,
            "☕ کافه برگ\n\nپنل مدیریت به‌زودی آماده است."
          );
        }
      }

      return json({
        ok: true,
      });
    } catch (error) {
      console.error(
        "Telegram webhook error:",
        error
      );

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