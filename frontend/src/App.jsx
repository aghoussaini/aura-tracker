import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import LoginPage from './LoginPage.jsx'
import SignupPage from './SignupPage.jsx'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <nav className="nav">
        <Link to="/">Login</Link>
        <Link to="/signup">Sign Up</Link>
      </nav>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </BrowserRouter>
  )
}
