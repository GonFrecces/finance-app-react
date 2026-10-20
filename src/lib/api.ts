// Cliente HTTP mínimo sobre fetch. La URL base viene de VITE_API_URL (.env).
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000"

export interface LoginResponse {
  access_token: string
}

export interface ScoreResponse {
  rut: string
  score: number
  fecha: string
}

// Error con el status HTTP, para distinguir 401 (sesión inválida) de 403 / 400.
export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...init.headers },
    })
  } catch {
    throw new ApiError(0, "No se pudo conectar con el servidor")
  }

  const body = await response.json().catch(() => null)

  if (!response.ok) {
    // NestJS responde { statusCode, message, error }; message puede ser string[].
    const message = Array.isArray(body?.message)
      ? body.message.join(", ")
      : (body?.message ?? response.statusText)
    throw new ApiError(response.status, message)
  }

  return body as T
}

export function login(username: string, password: string) {
  return request<LoginResponse>("/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  })
}

export function getScore(rut: string, token: string) {
  return request<ScoreResponse>(`/score/${encodeURIComponent(rut)}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}
