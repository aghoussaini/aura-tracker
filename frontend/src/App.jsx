import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import LoginPage from './LoginPage.jsx'
import SignupPage from './SignupPage.jsx'
import GroupsPage from './GroupsPage.jsx'
import CreateGroupPage from './CreateGroupPage.jsx'
import InvitationsPage from './InvitationsPage.jsx'
import { AuthProvider, useAuth } from './AuthContext.jsx'

function Navigation() {
  const { token, setToken } = useAuth()
  return (
    <nav className="mb-4 flex gap-4 text-blue-600">
      {token ? (
        <>
          <Link to="/groups">Groups</Link>
          <Link to="/invitations">Invitations</Link>
          <button onClick={() => setToken('')} className="text-red-600">Sign Out</button>
        </>
      ) : (
        <>
          <Link to="/">Login</Link>
          <Link to="/signup">Sign Up</Link>
        </>
      )}
    </nav>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="mx-auto max-w-md p-4">
          <Navigation />
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/groups" element={<GroupsPage />} />
            <Route path="/groups/new" element={<CreateGroupPage />} />
            <Route path="/invitations" element={<InvitationsPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}
