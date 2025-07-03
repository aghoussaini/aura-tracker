import { useState } from 'react'
import { Button, Input, Label } from './components/ui'

const API_URL = 'http://localhost:5000'

export default function SignupPage() {
  const [username, setUsername] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    if (password !== confirm) {
      setMessage('Passwords do not match')
      return
    }
    try {
      const res = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          first_name: firstName,
          last_name: lastName,
          password,
          confirm_password: confirm
        })
      })
      const data = await res.json()
      if (res.ok) {
        setMessage('User created successfully')
      } else {
        setMessage(data.error || 'Error signing up')
      }
    } catch (err) {
      console.error(err)
      setMessage('Network error')
    }
  }

  return (
    <div className="auth-container space-y-4">
      <h2 className="text-xl font-semibold">Sign Up</h2>
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
          <Label htmlFor="first-name">First Name</Label>
          <Input
            id="first-name"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="last-name">Last Name</Label>
          <Input
            id="last-name"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
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
        <div className="space-y-1">
          <Label htmlFor="confirm">Confirm Password</Label>
          <Input
            id="confirm"
            type="password"
            placeholder="Confirm Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </div>
        <Button type="submit">Sign Up</Button>
      </form>
      {message && <p className="text-sm text-red-500">{message}</p>}
    </div>
  )
}
