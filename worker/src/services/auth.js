
export function getTelegramRole(env, userId) {
  if (!env.TELEGRAM_ADMIN_USERS || !userId) {
    return null;
  }

  try {
    const users = JSON.parse(env.TELEGRAM_ADMIN_USERS);
    return users[String(userId)] || null;
  } catch (error) {
    console.error("Invalid TELEGRAM_ADMIN_USERS configuration");
    return null;
  }
}

export function isMenuManager(role) {
  return role === "developer" || role === "owner";
}

export function canManageSystem(role) {
  return role === "developer";
}
