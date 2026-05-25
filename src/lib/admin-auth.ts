/**
 * Admin Auth — simple credential check
 * Superadmin: danipalacio@gmail.com / Comics2026*
 */

export const SUPERADMIN = {
  email: "danipalacio@gmail.com",
  password: "Comics2026*",
  name: "Daniel Palacio",
  role: "superadmin" as const,
}

export function verifySuperAdmin(email: string, password: string) {
  return email === SUPERADMIN.email && password === SUPERADMIN.password
}

export const ADMIN_SESSION_KEY = "mz_admin_session"

export function createAdminToken() {
  return Buffer.from(`${SUPERADMIN.email}:${Date.now()}`).toString("base64")
}

export function verifyAdminToken(token: string | null): boolean {
  if (!token) return false
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8")
    const [email, ts] = decoded.split(":")
    const age = Date.now() - parseInt(ts)
    const MAX_AGE = 24 * 60 * 60 * 1000 // 24h
    return email === SUPERADMIN.email && age < MAX_AGE
  } catch {
    return false
  }
}
