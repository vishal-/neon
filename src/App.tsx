import { Routes, Route } from 'react-router-dom'
import { HomePage } from './components/pages/home'
import { LoginPage } from './components/pages/login'
import { ProfilePage } from './components/pages/profile'

export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  )
}

