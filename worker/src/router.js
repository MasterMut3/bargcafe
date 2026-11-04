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
      const command = message.text
                                  .trim()
                                  .split(/\s+/)[0]
                                  .split("@")[0];

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
        "/addproduct",
        "/addcategory",
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

        // MAIN MENU
        if (command === "/menu") {
          await sendMessage(
            env,
            chatId,
            `☕ مدیریت منوی کافه برگ

      /categories - مشاهده دسته‌بندی‌ها
      /products - مشاهده محصولات

      برای افزودن محصول:
      /addproduct categoryId | name | description | price

      برای افزودن دسته‌بندی:
      /addcategory id | name | description

      مثال:
      /addproduct coffee | کافه موکا | اسپرسو و شیر | 120000`
          );

          return json({ ok: true });
        }

        // LIST CATEGORIES
        if (command === "/categories") {
          const data = await getRepositoryJson(
            env,
            "content/categories.json"
          );

          const activeCategories = data
            .filter((category) => category.active !== false)
            .sort((a, b) => a.sortOrder - b.sortOrder);

          const message = activeCategories.length
            ? activeCategories
                .map(
                  (category, index) =>
                    `${index + 1}. ${category.name}\nID: ${category.id}`
                )
                .join("\n\n")
            : "هنوز دسته‌بندی فعالی وجود ندارد.";

          await sendMessage(
            env,
            chatId,
            `📂 دسته‌بندی‌های کافه برگ\n\n${message}`
          );

          return json({ ok: true });
        }

        // LIST PRODUCTS
        if (command === "/products") {
          const data = await getRepositoryJson(
            env,
            "content/items.json"
          );

          const availableItems = data
            .filter((item) => item.available !== false)
            .sort((a, b) => a.sortOrder - b.sortOrder);

          const message = availableItems.length
            ? availableItems
                .slice(0, 30)
                .map(
                  (item, index) =>
                    `${index + 1}. ${item.name}\n💰 ${item.price.toLocaleString("en-US")} تومان\nID: ${item.id}`
                )
                .join("\n\n")
            : "هنوز محصول فعالی وجود ندارد.";

          await sendMessage(
            env,
            chatId,
            `🍽 محصولات کافه برگ\n\n${message}`
          );

          return json({ ok: true });
        }

        // ADD PRODUCT
        if (command === "/addproduct") {
          const input = message.text
            .trim()
            .replace(/^\/addproduct(?:@\w+)?\s*/i, "");

          const parts = input.split("|").map((part) => part.trim());

          if (
            parts.length !== 4 ||
            parts.some((part) => !part)
          ) {
            await sendMessage(
              env,
              chatId,
              `فرمت وارد کردن محصول صحیح نیست.

      فرمت:
      /addproduct categoryId | name | description | price

      مثال:
      /addproduct coffee | کافه موکا | اسپرسو و شیر | 120000`
            );

            return json({ ok: true });
          }

          const [categoryId, name, description, rawPrice] = parts;
          const price = Number(rawPrice);

          if (!Number.isFinite(price) || price < 0) {
            await sendMessage(
              env,
              chatId,
              "❌ قیمت باید یک عدد معتبر و غیرمنفی باشد."
            );

            return json({ ok: true });
          }

          const [categoriesData, itemsData] = await Promise.all([
            getRepositoryJson(env, "content/categories.json"),
            getRepositoryJson(env, "content/items.json"),
          ]);

          const category = categoriesData.find(
            (entry) =>
              entry.id === categoryId &&
              entry.active !== false
          );

          if (!category) {
            await sendMessage(
              env,
              chatId,
              "❌ دسته‌بندی پیدا نشد یا غیرفعال است.\nاز /categories برای مشاهده شناسه‌ها استفاده کن."
            );

            return json({ ok: true });
          }

          const item = {
            id: crypto.randomUUID(),
            categoryId,
            name,
            description,
            price,
            image: null,
            available: true,
            sortOrder:
              Math.max(0, ...itemsData.map((entry) => Number(entry.sortOrder) || 0)) + 1,
          };

          itemsData.push(item);

          await updateRepositoryFile(
            env,
            "content/items.json",
            JSON.stringify(itemsData, null, 2) + "\n",
            `feat: add menu item ${item.id}`
          );

          await sendMessage(
            env,
            chatId,
            `✅ محصول با موفقیت ثبت شد.

      🍽 ${item.name}
      📂 ${category.name}
      💰 ${item.price.toLocaleString("en-US")} تومان

      شناسه: ${item.id}`
          );

          return json({ ok: true });
        }

        // ADD CATEGORY
        if (command === "/addcategory") {
          const input = message.text
            .trim()
            .replace(/^\/addcategory(?:@\w+)?\s*/i, "");

          const parts = input.split("|").map((part) => part.trim());

          if (
            parts.length !== 3 ||
            parts.some((part) => !part)
          ) {
            await sendMessage(
              env,
              chatId,
              `فرمت وارد کردن دسته‌بندی صحیح نیست.

      فرمت:
      /addcategory id | name | description

      مثال:
      /addcategory breakfast | صبحانه | انواع صبحانه`
            );

            return json({ ok: true });
          }

          const [id, name, description] = parts;

          if (!/^[a-z0-9-]+$/.test(id)) {
            await sendMessage(
              env,
              chatId,
              "❌ شناسه باید فقط شامل حروف انگلیسی کوچک، عدد و خط تیره باشد."
            );

            return json({ ok: true });
          }

          const categoriesData = await getRepositoryJson(
            env,
            "content/categories.json"
          );

          if (categoriesData.some((category) => category.id === id)) {
            await sendMessage(
              env,
              chatId,
              "❌ این شناسه قبلاً استفاده شده است."
            );

            return json({ ok: true });
          }

          const category = {
            id,
            name,
            description,
            image: null,
            sortOrder:
              Math.max(
                0,
                ...categoriesData.map(
                  (entry) => Number(entry.sortOrder) || 0
                )
              ) + 1,
            active: true,
          };

          categoriesData.push(category);

          await updateRepositoryFile(
            env,
            "content/categories.json",
            JSON.stringify(categoriesData, null, 2) + "\n",
            `feat: add category ${id}`
          );

          await sendMessage(
            env,
            chatId,
            `✅ دسته‌بندی با موفقیت ثبت شد.

      📂 ${category.name}
      شناسه: ${category.id}`
          );

          return json({ ok: true });
        }
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