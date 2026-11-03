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
  getRepositoryJson,
} from "./services/github.js";

import {
  getTelegramRole,
  isMenuManager,
  canManageSystem,
} from "./services/auth.js";


export async function router(request, env) {
  const url = new URL(request.url);

  // --------------------------------------------------
  // HEALTH CHECK
  // --------------------------------------------------

  if (
    request.method === "GET" &&
    url.pathname === "/api/health"
  ) {
    return json({
      ok: true,
      service: "bargcafe-api",
    });
  }


  // --------------------------------------------------
  // TELEGRAM BOT TEST
  // --------------------------------------------------

  if (
    request.method === "GET" &&
    url.pathname === "/api/telegram/test"
  ) {
    try {
      const bot = await getBotInfo(env);

      return json({
        ok: true,
        bot,
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

// --------------------------------------------------
// PUBLIC MENU API - GITHUB BACKED
// --------------------------------------------------

if (
  request.method === "GET" &&
  url.pathname === "/api/categories"
) {
  try {
    const repositoryCategories = await getRepositoryJson(
      env,
      "content/categories.json"
    );

    const activeCategories = repositoryCategories
      .filter((category) => category.active !== false)
      .sort((a, b) => a.sortOrder - b.sortOrder);

    return json({
      ok: true,
      categories: activeCategories,
    });
  } catch (error) {
    console.error("Categories API error:", error);

    return json(
      {
        ok: false,
        error: "Could not load categories",
      },
      500
    );
  }
}

if (
  request.method === "GET" &&
  url.pathname === "/api/items"
) {
  try {
    const [repositoryItems, repositoryCategories] =
      await Promise.all([
        getRepositoryJson(env, "content/items.json"),
        getRepositoryJson(env, "content/categories.json"),
      ]);

    const activeCategoryIds = new Set(
      repositoryCategories
        .filter((category) => category.active !== false)
        .map((category) => category.id)
    );

    const availableItems = repositoryItems
      .filter(
        (item) =>
          item.available !== false &&
          activeCategoryIds.has(item.categoryId)
      )
      .sort((a, b) => a.sortOrder - b.sortOrder);

    return json({
      ok: true,
      items: availableItems,
    });
  } catch (error) {
    console.error("Items API error:", error);

    return json(
      {
        ok: false,
        error: "Could not load menu items",
      },
      500
    );
  }
}


  // --------------------------------------------------
  // CREATE ORDER
  // --------------------------------------------------

  if (
    request.method === "POST" &&
    url.pathname === "/api/orders"
  ) {
    try {
      const body = await request.json();

      const order = createOrderFromRequest(body);

      if (env.TELEGRAM_ADMIN_CHAT_ID) {
        await sendMessage(
          env,
          env.TELEGRAM_ADMIN_CHAT_ID,
          `🛎 سفارش جدید کافه برگ\n\n${JSON.stringify(
            order,
            null,
            2
          )}`
        );
      }

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


  // --------------------------------------------------
  // GITHUB CONNECTION TEST
  // --------------------------------------------------

  if (
    request.method === "GET" &&
    url.pathname === "/api/github/test"
  ) {
    try {
      const file = await getRepositoryFile(
        env,
        "content/items.json"
      );

      return json({
        ok: true,
        file: {
          name: file.name,
          path: file.path,
          sha: file.sha,
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


  // --------------------------------------------------
  // ADD MENU ITEM (PROTECTED API)
  // --------------------------------------------------

  if (
    request.method === "POST" &&
    url.pathname === "/api/admin/items"
  ) {
    const adminKey = env.ADMIN_API_SECRET;
    const providedKey = request.headers.get("X-Admin-Key");

    if (!adminKey || providedKey !== adminKey) {
      return json(
        {
          ok: false,
          error: "Unauthorized",
        },
        401
      );
    }

    try {
      const body = await request.json();

      if (
        !body.name ||
        !body.categoryId ||
        body.price === undefined ||
        body.price === null
      ) {
        return json(
          {
            ok: false,
            error: "name, categoryId and price are required",
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

      const repositoryItems = JSON.parse(content);

      const item = {
        id: body.id || crypto.randomUUID(),
        categoryId: body.categoryId,
        name: body.name,
        description: body.description || "",
        price: Number(body.price),
        image: body.image || null,
        available: body.available ?? true,
        sortOrder:
          body.sortOrder ?? repositoryItems.length + 1,
      };

      if (
        !Number.isFinite(item.price) ||
        item.price < 0
      ) {
        return json(
          {
            ok: false,
            error: "Invalid price",
          },
          400
        );
      }

      repositoryItems.push(item);

      await updateRepositoryFile(
        env,
        "content/items.json",
        JSON.stringify(repositoryItems, null, 2) + "\n",
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


  // --------------------------------------------------
  // TELEGRAM WEBHOOK
  // --------------------------------------------------

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

      const message = update.message;

      if (!message?.text) {
        return json({ ok: true });
      }

      const chatId = message.chat.id;
      const userId = message.from?.id;
      const command = message.text.trim().split(/\s+/)[0];

      const role = getTelegramRole(env, userId);

      // ----------------------------------------------
      // START
      // ----------------------------------------------

      if (command === "/start") {
        if (isMenuManager(role)) {
          await sendMessage(
            env,
            chatId,
            `☕ کافه برگ

سلام، به پنل مدیریت خوش آمدی.

نقش شما: ${role}

دستورات:

/menu - مدیریت منو
/categories - مشاهده دسته‌بندی‌ها
/products - مشاهده محصولات`
          );
        } else {
          await sendMessage(
            env,
            chatId,
            "☕ به کافه برگ خوش آمدید!\n\nبرای مشاهده منو و سفارش، از وب‌سایت کافه استفاده کنید."
          );
        }

        return json({ ok: true });
      }


      // ----------------------------------------------
      // RESTRICTED ADMIN COMMANDS
      // ----------------------------------------------

      const adminCommands = [
        "/menu",
        "/categories",
        "/products",
      ];

      if (adminCommands.includes(command)) {
        if (!isMenuManager(role)) {
          await sendMessage(
            env,
            chatId,
            "⛔ شما اجازه دسترسی به پنل مدیریت را ندارید."
          );

          return json({ ok: true });
        }

        if (command === "/menu") {
          await sendMessage(
            env,
            chatId,
            `🛠 مدیریت منوی کافه برگ

برای مدیریت منو از دستورات زیر استفاده کن:

/categories - دسته‌بندی‌ها
/products - محصولات

امکانات مدیریت منو را در مرحله بعد اضافه می‌کنیم.`
          );
        }

        if (command === "/categories") {
          await sendMessage(
            env,
            chatId,
            "📂 بخش دسته‌بندی‌ها هنوز در حال آماده‌سازی است."
          );
        }

        if (command === "/products") {
          await sendMessage(
            env,
            chatId,
            "🍽 بخش محصولات هنوز در حال آماده‌سازی است."
          );
        }

        return json({ ok: true });
      }


      // ----------------------------------------------
      // DEVELOPER-ONLY COMMANDS
      // ----------------------------------------------

      if (command === "/system") {
        if (!canManageSystem(role)) {
          await sendMessage(
            env,
            chatId,
            "⛔ این دستور فقط برای توسعه‌دهنده در دسترس است."
          );

          return json({ ok: true });
        }

        await sendMessage(
          env,
          chatId,
          "⚙️ دسترسی توسعه‌دهنده تأیید شد."
        );

        return json({ ok: true });
      }


      // ----------------------------------------------
      // UNKNOWN COMMAND
      // ----------------------------------------------

      if (command.startsWith("/")) {
        await sendMessage(
          env,
          chatId,
          "دستور شناخته نشد. برای شروع از /start استفاده کن."
        );
      }

      return json({ ok: true });

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


  // --------------------------------------------------
  // NOT FOUND
  // --------------------------------------------------

  return notFound();
}