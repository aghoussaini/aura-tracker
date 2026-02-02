import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import { User, Lock, ArrowRight } from 'lucide-react'
import {
  Button,
  Input,
  Label,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  useToast,
} from './components/ui'
import { useAuth } from './AuthContext.jsx'
import { AuthHeroIllustration } from './components/illustrations/AuthIllustration.jsx'
import { PageTransition } from './components/animations/PageTransition.jsx'
import { useConfetti } from './hooks/useConfetti.js'
import { API_URL } from './config.js'

export default function LoginPage() {
  const { setToken } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { addToast } = useToast()
  const { fireConfetti } = useConfetti()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setIsLoading(true)
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      const data = await res.json()
      if (res.ok) {
        setToken(data.access_token)
        addToast({ title: 'Welcome back!', description: 'Logged in successfully', variant: 'success' })
        fireConfetti()
        navigate('/groups')
      } else {
        const msg = data.error || 'Error logging in'
        setMessage(msg)
        addToast({ title: 'Login failed', description: msg, variant: 'error' })
      }
    } catch (err) {
      console.error(err)
      setMessage('Network error')
      addToast({ title: 'Network error', variant: 'error' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        <AuthHeroIllustration className="mb-8" />

        <Card>
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>Sign in to continue to Aura Tracker</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="username"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {message && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-aura-negative-500 bg-aura-negative-50 p-3 rounded-lg"
                >
                  {message}
                </motion.p>
              )}

              <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                Sign In
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-500">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="text-primary-600 font-medium hover:text-primary-700 transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  )
}
