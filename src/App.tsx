import { BrowserRouter, Navigate, Route, Routes } from "react-router"
import { ProtectedRoute } from "@/components/protected-route"
import { AuthProvider } from "@/context/auth-context"
import { LoginPage } from "@/pages/auth/LoginPage"
import { ScorePage } from "@/pages/score/ScorePage"

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute roles={["admin", "user"]} />}>
            <Route path="/score" element={<ScorePage />} />
          </Route>
          <Route path="*" element={<Navigate to="/score" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
