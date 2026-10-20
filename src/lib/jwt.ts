export type Role = "admin" | "user"

export interface JwtPayload {
  sub: string
  role: Role
  rut?: string
  iat: number
  exp: number
}

/**
 * Decodifica el payload del JWT SIN verificar la firma.
 * Solo sirve para la UI (mostrar rol/RUT, saber si expiró): la seguridad real
 * está en el backend, que valida firma y expiración en cada request.
 */
export function decodeJwt(token: string): JwtPayload | null {
  try {
    const [, payload] = token.split(".")
    // base64url -> base64 antes de atob.
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/")
    const data = JSON.parse(atob(base64)) as Partial<JwtPayload>

    if (
      typeof data.sub !== "string" ||
      (data.role !== "admin" && data.role !== "user") ||
      typeof data.exp !== "number"
    ) {
      return null
    }
    return data as JwtPayload
  } catch {
    return null
  }
}

export function isExpired(payload: JwtPayload): boolean {
  return payload.exp * 1000 <= Date.now()
}
