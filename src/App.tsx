import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './component/Navbar'
import HomePage from './screens/HomePage'
import UploadPage from './screens/UploadPage'
import AccessPage from './screens/AccessPage'
import VaultPage from './screens/VaultPage'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="app-shell">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/access" element={<AccessPage />} />
          <Route path="/vault" element={<VaultPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}
