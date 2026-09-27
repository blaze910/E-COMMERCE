import { createServerFn } from "@tanstack/react-start";
import { getRequest, getRequestHeader, setResponseHeader } from "@tanstack/react-start/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";

const COOKIE_NAME = "novaedge_admin_session";
const SESSION_SECONDS = 60 * 60 * 8;
const credentialsSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1).max(1024),
});
type AdminCredentials = z.infer<typeof credentialsSchema>;

function constantTimeEqual(actual: string, expected: string) {
  const actualBytes = Buffer.from(actual);
  const expectedBytes = Buffer.from(expected);
  return actualBytes.length === expectedBytes.length && timingSafeEqual(actualBytes, expectedBytes);
}

function sessionSignature(expiresAt: string, signingKey: string) {
  return createHmac("sha256", signingKey).update(expiresAt).digest("base64url");
}

function hasValidSession() {
  const adminPassword = process.env["ADMIN_PASSWORD"];
  if (!adminPassword) return false;

  const cookie = getRequestHeader("cookie");
  const value = cookie
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${COOKIE_NAME}=`))
    ?.slice(COOKIE_NAME.length + 1);
  if (!value) return false;

  const [expiresAt, signature] = value.split(".");
  const expiry = Number(expiresAt);
  if (!expiresAt || !signature || !Number.isFinite(expiry) || expiry <= Date.now()) return false;
  if (expiry > Date.now() + SESSION_SECONDS * 1000 + 60_000) return false;

  return constantTimeEqual(signature, sessionSignature(expiresAt, adminPassword));
}

export const verifyAdminSession = createServerFn().handler(async () => hasValidSession());

export const authenticateAdmin = createServerFn({ method: "POST" })
  .validator((data: AdminCredentials) => credentialsSchema.parse(data))
  .handler(async ({ data }: { data: AdminCredentials }) => {
    const adminEmail = process.env["ADMIN_EMAIL"];
    const adminPassword = process.env["ADMIN_PASSWORD"];
    if (!adminEmail || !adminPassword) return false;

    const emailMatches = constantTimeEqual(
      data.email.toLowerCase(),
      adminEmail.trim().toLowerCase(),
    );
    const passwordMatches = constantTimeEqual(data.password, adminPassword);
    if (!emailMatches || !passwordMatches) return false;

    const expiresAt = String(Date.now() + SESSION_SECONDS * 1000);
    const signature = sessionSignature(expiresAt, adminPassword);
    const secure = new URL(getRequest().url).protocol === "https:" ? "; Secure" : "";
    setResponseHeader(
      "Set-Cookie",
      `${COOKIE_NAME}=${expiresAt}.${signature}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_SECONDS}${secure}`,
    );
    return true;
  });
