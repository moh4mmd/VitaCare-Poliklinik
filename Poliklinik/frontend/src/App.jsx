import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from '../test/LandingPage.jsx'
import AuthPage from './pages/AuthPage.jsx'
import AppointmentPage from './pages/AppointmentPage.jsx'
import Dashboard from './pages/Dashboard.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/appointment" element={<AppointmentPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Redirect unknown routes back to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
