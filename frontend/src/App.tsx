import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"

import { AppVersion } from "@/components/app-version"
import { SiteHeader } from "@/components/site-header"
import { DevPage } from "@/pages/dev-page"
import { HomePage } from "@/pages/home-page"
import { NamingPage } from "@/pages/naming-page"
import { TermsPage } from "@/pages/terms-page"

export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-svh bg-background">
        <SiteHeader />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/naming" element={<NamingPage />} />
          <Route path="/dev" element={<DevPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <AppVersion />
      </div>
    </BrowserRouter>
  )
}

export default App
