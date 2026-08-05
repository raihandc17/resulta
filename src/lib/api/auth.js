import { getCurrentUser } from "@/lib/authServer";
import { isAdminRole } from "@/lib/roles";

export async function requireApiUser() {
  const user = await getCurrentUser();
  if (!user) {
    return { error: { status: 401, message: "Authentication required." } };
  }
  return { user };
}

export async function requireApiAdmin() {
  const result = await requireApiUser();
  if (result.error) {
    return result;
  }
  if (!isAdminRole(result.user.role)) {
    return { error: { status: 403, message: "Admin access required." } };
  }
  return { user: result.user };
}

export function jsonError(message, status = 400) {
  return Response.json({ error: message }, { status });
}

export function jsonData(data, status = 200) {
  return Response.json({ data }, { status });
}
