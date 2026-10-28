import { createAdminSession } from "@/lib/admin-auth.server";

export async function POST(request) {
  let credentials;
  try {
    credentials = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { email, password } = credentials ?? {};
  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    email.length > 320 ||
    password.length === 0 ||
    password.length > 1024 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  ) {
    return Response.json({ error: "Invalid credentials." }, { status: 400 });
  }

  const sessionCookie = createAdminSession(
    { email: email.trim(), password },
    request,
  );
  const response = Response.json({ valid: Boolean(sessionCookie) });
  if (sessionCookie) response.headers.set("Set-Cookie", sessionCookie);
  return response;
}
