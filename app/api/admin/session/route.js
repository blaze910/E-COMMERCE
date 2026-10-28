import { hasValidAdminSession } from "@/lib/admin-auth.server";

export function GET(request) {
  return Response.json({ valid: hasValidAdminSession(request) });
}
