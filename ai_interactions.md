# Uso de herramientas de IA

| Herramienta | Uso |
|---|---|
| Claude (Anthropic) | Revisión de la estructura inicial (Vite + React + shadcn/ui y el `LoginForm` base) y generación de: cliente HTTP (`src/lib/api.ts`), decodificación del JWT para la UI (`src/lib/jwt.ts`), utilidades de RUT (`src/lib/rut.ts`), `AuthProvider` + hook `useAuthentication` (sesión en `sessionStorage`, logout y expiración automática), `ProtectedRoute` con react-router, conexión del `LoginForm` a `POST /login` y las vistas de score (`ScorePage`, `ScoreLookup`, `ScoreResult`) contra `GET /score/:rut`. |

El código generado fue revisado y verificado con `tsc`, `eslint`, `vite build` y una prueba manual del flujo (login user/admin, consulta de score, error 401/400, logout) contra el backend local.
