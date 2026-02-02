import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion'
import { Users, Mail, LogOut, LogIn, UserPlus, Sparkles } from 'lucide-react'
import LoginPage from './LoginPage.jsx'
import SignupPage from './SignupPage.jsx'
import GroupsPage from './GroupsPage.jsx'
import GroupDetailPage from './GroupDetailPage.jsx'
import CreateGroupPage from './CreateGroupPage.jsx'
import InvitationsPage from './InvitationsPage.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'
import { AuthProvider, useAuth } from './AuthContext.jsx'
import { ToastProvider, Button } from './components/ui'
import { AuraLogoIllustration } from './components/illustrations/AuthIllustration.jsx'
import { API_URL } from './config.js'
import { cn } from './lib/cn'

function NavLink({ to, children, icon: Icon }) {
  const location = useLocation()
  const isActive = location.pathname === to || location.pathname.startsWith(to + '/')

  return (
    <Link to={to}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200',
          isActive
            ? 'bg-primary-500 text-white shadow-vibrant'
            : 'text-slate-600 hover:bg-slate-100'
        )}
      >
        {Icon && <Icon className="w-4 h-4" />}
        {children}
      </motion.div>
    </Link>
  )
}

function Navigation() {
  const { token, setToken } = useAuth()

  async function handleSignOut() {
    try {
      await fetch(`${API_URL}/signout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      })
    } catch {
      // Ignore network errors on sign out
    }
    setToken('')
  }

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="glass sticky top-0 z-50 mb-6 rounded-2xl p-3"
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link to={token ? '/groups' : '/'} className="flex items-center gap-2">
          <motion.div
            whileHover={{ rotate: 10 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-lavender-500 flex items-center justify-center shadow-vibrant">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          </motion.div>
          <span className="font-display font-bold text-lg gradient-text hidden sm:block">
            Aura
          </span>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-2">
          {token ? (
            <>
              <NavLink to="/groups" icon={Users}>Groups</NavLink>
              <NavLink to="/invitations" icon={Mail}>Invites</NavLink>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-aura-negative-500 hover:bg-aura-negative-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </motion.button>
            </>
          ) : (
            <>
              <NavLink to="/" icon={LogIn}>Login</NavLink>
              <NavLink to="/signup" icon={UserPlus}>Sign Up</NavLink>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  )
}

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/groups" element={<ProtectedRoute><GroupsPage /></ProtectedRoute>} />
        <Route path="/groups/new" element={<ProtectedRoute><CreateGroupPage /></ProtectedRoute>} />
        <Route path="/groups/:groupId" element={<ProtectedRoute><GroupDetailPage /></ProtectedRoute>} />
        <Route path="/invitations" element={<ProtectedRoute><InvitationsPage /></ProtectedRoute>} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <div className="min-h-screen">
            <div className="mx-auto max-w-2xl px-4 py-4">
              <Navigation />
              <AnimatedRoutes />
            </div>
          </div>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  )
}
