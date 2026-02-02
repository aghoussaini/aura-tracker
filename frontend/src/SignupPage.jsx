import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion'
import { User, Lock, UserCircle, CheckCircle } from 'lucide-react'
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
import { AuthHeroIllustration } from './components/illustrations/AuthIllustration.jsx'
import { PageTransition } from './components/animations/PageTransition.jsx'
import { useConfetti } from './hooks/useConfetti.js'
import { API_URL } from './config.js'

export default function SignupPage() {
  const [username, setUsername] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { addToast } = useToast()
  const { fireSuccessConfetti } = useConfetti()

  useEffect(() => {
    let id = localStorage.getItem('device_id')
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem('device_id', id)
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    if (password !== confirm) {
      setMessage('Passwords do not match')
      addToast({ title: 'Error', description: 'Passwords do not match', variant: 'error' })
      return
    }
    setIsLoading(true)
    try {
      let deviceId = localStorage.getItem('device_id')
      if (!deviceId) {
        deviceId = crypto.randomUUID()
        localStorage.setItem('device_id', deviceId)
      }
      const res = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          first_name: firstName,
          last_name: lastName,
          device_id: deviceId,
          password,
          confirm_password: confirm
        })
      })
      const data = await res.json()
      if (res.ok) {
        setIsSuccess(true)
        addToast({ title: 'Account created!', description: 'You can now sign in', variant: 'success' })
        fireSuccessConfetti()
      } else {
        const msg = data.error || 'Error signing up'
        setMessage(msg)
        addToast({ title: 'Sign up failed', description: msg, variant: 'error' })
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

        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Card className="text-center">
                <CardContent className="py-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.1 }}
                    className="w-20 h-20 mx-auto mb-4 rounded-full bg-aura-positive-100 flex items-center justify-center"
                  >
                    <CheckCircle className="w-10 h-10 text-aura-positive-500" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Account Created!</h2>
                  <p className="text-slate-500 mb-6">Your account has been created successfully.</p>
                  <Link to="/">
                    <Button size="lg">
                      Continue to Login
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Create an account</CardTitle>
                  <CardDescription>Join Aura Tracker and start tracking your social aura</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                          id="username"
                          placeholder="Choose a username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first-name">First Name</Label>
                        <div className="relative">
                          <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <Input
                            id="first-name"
                            placeholder="First"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name">Last Name</Label>
                        <Input
                          id="last-name"
                          placeholder="Last"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
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
                          placeholder="Create a password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                          id="confirm"
                          type="password"
                          placeholder="Confirm your password"
                          value={confirm}
                          onChange={(e) => setConfirm(e.target.value)}
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
                      Create Account
                    </Button>
                  </form>

                  <div className="mt-6 text-center">
                    <p className="text-sm text-slate-500">
                      Already have an account?{' '}
                      <Link
                        to="/"
                        className="text-primary-600 font-medium hover:text-primary-700 transition-colors"
                      >
                        Sign in
                      </Link>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  )
}
