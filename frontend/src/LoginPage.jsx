import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Button,
  Input,
  Label,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  useToast,
} from './components/ui'
import { useAuth } from './AuthContext.jsx'

const API_URL = 'http://localhost:5000'

export default function LoginPage() {
  const { setToken } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const { addToast } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      const data = await res.json()
      if (res.ok) {
        setToken(data.access_token)
        addToast({ title: 'Logged in successfully' })
        navigate('/groups')
      } else {
        const msg = data.error || 'Error logging in'
        setMessage(msg)
        addToast({ title: 'Login failed', description: msg })
      }
    } catch (err) {
      console.error(err)
      setMessage('Network error')
      addToast({ title: 'Network error' })
    }
  }

  return (
    <Card className="auth-container space-y-4">
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="space-y-1">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit">Login</Button>
        </form>
      </CardContent>
      {message && <p className="text-sm text-red-500">{message}</p>}
    </Card>
  )
}
