import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from './AuthContext.jsx'
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from './components/ui'

const API_URL = 'http://localhost:5000'

export default function GroupsPage() {
  const { token } = useAuth()
  const [groups, setGroups] = useState([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function fetchGroups() {
      try {
        const res = await fetch(`${API_URL}/groups`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          setGroups(data)
        } else {
          setMessage('Error loading groups')
        }
      } catch {
        setMessage('Network error')
      }
    }
    if (token) fetchGroups()
  }, [token])

  return (
    <Card className="space-y-4">
      <CardHeader className="flex justify-between">
        <CardTitle>Your Groups</CardTitle>
        <Link to="/groups/new" className="text-blue-600">Create Group</Link>
      </CardHeader>
      <CardContent>
      {groups.length === 0 && <p>No groups yet.</p>}
      <ul className="space-y-2">
        {groups.map((g) => (
          <li key={g.id} className="rounded border p-2">{g.name}</li>
        ))}
      </ul>
      </CardContent>
      {message && <p className="text-sm text-red-500">{message}</p>}
    </Card>
  )
}
