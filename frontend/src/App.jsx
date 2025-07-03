import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import LoginPage from './LoginPage.jsx'
import SignupPage from './SignupPage.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <div className="mx-auto max-w-md p-4">
        <nav className="mb-4 flex gap-4 text-blue-600">
          <Link to="/">Login</Link>
          <Link to="/signup">Sign Up</Link>
        </nav>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
