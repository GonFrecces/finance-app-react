import { createContext, useCallback, useEffect, useMemo, useState } from "react"
import { login as loginRequest } from "@/lib/api"
import { decodeJwt, isExpired, type JwtPayload } from "@/lib/jwt"

// sessionStorage: el token se borra al cerrar la pestaña. Un JWT en storage es
// accesible desde JS (riesgo XSS); la alternativa más segura es una cookie
// httpOnly emitida por el backend, fuera del alcance del challenge.
const TOKEN_KEY = "finance-app.token"

export interface Session {
  token: string
  user: JwtPayload
}

export interface AuthContextValue {
  session: Session | null
  login: (username: string, password: string) => Promise<Session>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

function toSession(token: string | null): Session | null {
  if (!token) return null
  const user = decodeJwt(token)
  if (!user || isExpired(user)) return null
  return { token, user }
}

function readStoredSession(): Session | null {
  const session = toSession(sessionStorage.getItem(TOKEN_KEY))
  if (!session) sessionStorage.removeItem(TOKEN_KEY)
  return session
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(readStoredSession)

  const logout = useCallback(() => {
    sessionStorage.removeItem(TOKEN_KEY)
    setSession(null)
  }, [])

  const login = useCallback(async (username: string, password: string) => {
    const { access_token } = await loginRequest(username, password)
    const next = toSession(access_token)
    if (!next) throw new Error("Token inválido recibido del servidor")

    sessionStorage.setItem(TOKEN_KEY, access_token)
    setSession(next)
    return next
  }, [])

  // Cierra la sesión automáticamente cuando el token expira.
  useEffect(() => {
    if (!session) return
    const ms = session.user.exp * 1000 - Date.now()
    const timer = setTimeout(logout, Math.max(ms, 0))
    return () => clearTimeout(timer)
  }, [session, logout])

  const value = useMemo(
    () => ({ session, login, logout }),
    [session, login, logout]
  )

  return <AuthContext value={value}>{children}</AuthContext>
}
