import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { captureRef } from './lib/track'
import Home from './pages/Home'
import CasePage from './pages/CasePage'
import AdminPage from './pages/admin/AdminPage'

export default function App() {
  useEffect(() => { captureRef() }, [])
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/case/:slug" element={<CasePage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  )
}
