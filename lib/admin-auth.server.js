import { createHmac, timingSafeEqual } from "node:crypto";

const COOKIE_NAME = "novaedge_admin_session";
const SESSION_SECONDS = 60 * 60 * 8;

function constantTimeEqual(actual, expected) {
  const actualBytes = Buffer.from(actual);
  const expectedBytes = Buffer.from(expected);
  return (
    actualBytes.length === expectedBytes.length &&
    timingSafeEqual(actualBytes, expectedBytes)
  );
}

function sessionSignature(expiresAt, signingKey) {
  return createHmac("sha256", signingKey).update(expiresAt).digest("base64url");
}

function getSessionCookie(request) {
  const cookie = request.headers.get?.("cookie") ?? request.headers.cookie;
  if (!cookie) return null;
  const value = cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${COOKIE_NAME}=`))
    ?.slice(COOKIE_NAME.length + 1);
  return value ?? null;
}

export function hasValidAdminSession(request) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;

  const value = getSessionCookie(request);
  if (!value) return false;

  const [expiresAt, signature] = value.split(".");
  const expiry = Number(expiresAt);
  if (
    !expiresAt ||
    !signature ||
    !Number.isFinite(expiry) ||
    expiry <= Date.now()
  )
    return false;
  if (expiry > Date.now() + SESSION_SECONDS * 1000 + 60_000) return false;

  return constantTimeEqual(
    signature,
    sessionSignature(expiresAt, adminPassword),
  );
}

export function createAdminSession(credentials, request) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) return false;

  const emailMatches = constantTimeEqual(
    credentials.email.toLowerCase(),
    adminEmail.trim().toLowerCase(),
  );
  const passwordMatches = constantTimeEqual(
    credentials.password,
    adminPassword,
  );
  if (!emailMatches || !passwordMatches) return false;

  const expiresAt = String(Date.now() + SESSION_SECONDS * 1000);
  const signature = sessionSignature(expiresAt, adminPassword);
  const forwardedProtocol =
    request.headers.get?.("x-forwarded-proto") ??
    request.headers["x-forwarded-proto"];
  const isSecure =
    (typeof forwardedProtocol === "string" &&
      forwardedProtocol.split(",")[0]?.trim() === "https") ||
    new URL(request.url).protocol === "https:";
  const secure = isSecure ? "; Secure" : "";
  return `${COOKIE_NAME}=${expiresAt}.${signature}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_SECONDS}${secure}`;
}
