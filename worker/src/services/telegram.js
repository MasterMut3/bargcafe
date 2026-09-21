const TELEGRAM_API = "https://api.telegram.org";

export async function telegramRequest(env, method, body = {}) {
  if (!env.TELEGRAM_BOT_TOKEN) {
    throw new Error("TELEGRAM_BOT_TOKEN is not configured");
  }

  const response = await fetch(
    `${TELEGRAM_API}/bot${env.TELEGRAM_BOT_TOKEN}/${method}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  const data = await response.json();

  if (!response.ok || !data.ok) {
    throw new Error(
      data.description || `Telegram API request failed: ${response.status}`
    );
  }

  return data.result;
}

export function getBotInfo(env) {
  return telegramRequest(env, "getMe");
}
