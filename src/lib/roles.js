export const ROLES = {
  GENERAL: "general",
  ADMIN: "admin",
};

export function isAdminRole(role) {
  return role === ROLES.ADMIN;
}

export function resolveRoleForNewUser(email) {
  const raw = process.env.ADMIN_EMAILS ?? "";
  const adminEmails = raw
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);

  if (adminEmails.includes(email.trim().toLowerCase())) {
    return ROLES.ADMIN;
  }

  return ROLES.GENERAL;
}
