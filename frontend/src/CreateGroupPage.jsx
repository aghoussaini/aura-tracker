import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext.jsx'
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

const API_URL = 'http://localhost:5000'

export default function CreateGroupPage() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [invitees, setInvitees] = useState('')
  const [message, setMessage] = useState('')
  const { addToast } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    try {
      const res = await fetch(`${API_URL}/groups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          invitees: invitees.split(',').map((s) => s.trim()).filter(Boolean)
        })
      })
      const data = await res.json()
      if (res.ok) {
        navigate('/groups')
        addToast({ title: 'Group created' })
      } else {
        const msg = data.error || 'Error creating group'
        setMessage(msg)
        addToast({ title: 'Failed to create group', description: msg })
      }
    } catch {
      setMessage('Network error')
      addToast({ title: 'Network error' })
    }
  }

  return (
    <Card className="space-y-4">
      <CardHeader>
        <CardTitle>Create Group</CardTitle>
      </CardHeader>
      <CardContent>
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="space-y-1">
          <Label htmlFor="name">Group Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="space-y-1">
          <Label htmlFor="invitees">Invite Users (comma separated)</Label>
          <Input id="invitees" value={invitees} onChange={(e) => setInvitees(e.target.value)} />
        </div>
        <Button type="submit">Create</Button>
      </form>
      </CardContent>
      {message && <p className="text-sm text-red-500">{message}</p>}
    </Card>
  )
}
