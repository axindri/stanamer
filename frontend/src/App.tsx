import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"

import { SiteHeader } from "@/components/site-header"
import { HomePage } from "@/pages/home-page"
import { NamingPage } from "@/pages/naming-page"

export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-svh bg-background">
        <SiteHeader />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/naming" element={<NamingPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
