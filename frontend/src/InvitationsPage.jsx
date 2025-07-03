import { useEffect, useState } from 'react'
import { useAuth } from './AuthContext.jsx'
import { Button } from './components/ui'

const API_URL = 'http://localhost:5000'

export default function InvitationsPage() {
  const { token } = useAuth()
  const [invitations, setInvitations] = useState([])
  const [message, setMessage] = useState('')

  async function load() {
    try {
      const res = await fetch(`${API_URL}/invitations`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        setInvitations(await res.json())
      } else {
        setMessage('Error loading invitations')
      }
    } catch {
      setMessage('Network error')
    }
  }

  useEffect(() => {
    if (token) load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  async function respond(id, action) {
    try {
      const res = await fetch(`${API_URL}/invitations/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ action })
      })
      if (res.ok) {
        setInvitations((prev) => prev.filter((i) => i.id !== id))
      }
    } catch {
      setMessage('Network error')
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Invitations</h2>
      {invitations.length === 0 && <p>No pending invitations.</p>}
      <ul className="space-y-2">
        {invitations.map((inv) => (
          <li key={inv.id} className="rounded border p-2">
            <p>
              {inv.inviter} invited you to {inv.group_name}
            </p>
            <div className="mt-2 space-x-2">
              <Button onClick={() => respond(inv.id, 'accept')}>Accept</Button>
              <Button onClick={() => respond(inv.id, 'reject')} className="bg-red-500 hover:bg-red-600">
                Reject
              </Button>
            </div>
          </li>
        ))}
      </ul>
      {message && <p className="text-sm text-red-500">{message}</p>}
    </div>
  )
}
