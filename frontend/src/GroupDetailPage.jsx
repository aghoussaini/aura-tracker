import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
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
import { API_URL } from './config.js'

const AURA_AMOUNTS = [5, 10, 25, 50, 100]

export default function GroupDetailPage() {
  const { groupId } = useParams()
  const { token } = useAuth()
  const { addToast } = useToast()
  const [group, setGroup] = useState(null)
  const [loading, setLoading] = useState(true)
  const [giveForm, setGiveForm] = useState({ target: '', amount: 5, reason: '', isNegative: false })

  async function loadGroup() {
    try {
      const res = await fetch(`${API_URL}/groups/${groupId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        setGroup(await res.json())
      } else {
        addToast({ title: 'Error loading group' })
      }
    } catch {
      addToast({ title: 'Network error' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadGroup()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId, token])

  async function handleGiveAura(e) {
    e.preventDefault()
    const amount = giveForm.isNegative ? -giveForm.amount : giveForm.amount
    try {
      const res = await fetch(`${API_URL}/aura/give`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          group_id: parseInt(groupId),
          target_username: giveForm.target,
          amount,
          reason: giveForm.reason,
        })
      })
      const data = await res.json()
      if (res.ok) {
        addToast({ title: 'Aura transaction created!' })
        setGiveForm({ target: '', amount: 5, reason: '', isNegative: false })
        loadGroup()
      } else {
        addToast({ title: data.error || 'Error creating transaction' })
      }
    } catch {
      addToast({ title: 'Network error' })
    }
  }

  async function handleVote(transactionId, approval) {
    try {
      const res = await fetch(`${API_URL}/aura/transactions/${transactionId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ approval })
      })
      const data = await res.json()
      if (res.ok) {
        addToast({ title: `Vote recorded! Status: ${data.status}` })
        loadGroup()
      } else {
        addToast({ title: data.error || 'Error voting' })
      }
    } catch {
      addToast({ title: 'Network error' })
    }
  }

  if (loading) {
    return <p>Loading...</p>
  }

  if (!group) {
    return <p>Group not found or access denied.</p>
  }

  const otherMembers = group.members.filter(m => m.username !== group.current_user)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link to="/groups" className="text-blue-600">&larr; Back</Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{group.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <h3 className="font-semibold mb-2">Members</h3>
          <ul className="space-y-1">
            {group.members.map((m) => (
              <li key={m.username} className="flex justify-between border-b py-1">
                <span>
                  {m.first_name} {m.last_name} (@{m.username})
                  {m.username === group.current_user && ' (you)'}
                </span>
                <span className={m.aura_points >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {m.aura_points >= 0 ? '+' : ''}{m.aura_points} aura
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Give Aura</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGiveAura} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="target">To Member</Label>
              <select
                id="target"
                className="w-full rounded border p-2"
                value={giveForm.target}
                onChange={(e) => setGiveForm({ ...giveForm, target: e.target.value })}
                required
              >
                <option value="">Select member...</option>
                {otherMembers.map((m) => (
                  <option key={m.username} value={m.username}>
                    {m.first_name} {m.last_name} (@{m.username})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="amount">Amount</Label>
              <div className="flex gap-2 items-center">
                <select
                  id="amount"
                  className="rounded border p-2"
                  value={giveForm.amount}
                  onChange={(e) => setGiveForm({ ...giveForm, amount: parseInt(e.target.value) })}
                >
                  {AURA_AMOUNTS.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={giveForm.isNegative}
                    onChange={(e) => setGiveForm({ ...giveForm, isNegative: e.target.checked })}
                  />
                  Negative (take aura)
                </label>
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="reason">Reason</Label>
              <Input
                id="reason"
                placeholder="Why are you giving/taking aura?"
                value={giveForm.reason}
                onChange={(e) => setGiveForm({ ...giveForm, reason: e.target.value })}
                required
              />
            </div>
            <Button type="submit">
              {giveForm.isNegative ? 'Take' : 'Give'} {giveForm.amount} Aura
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pending Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {group.pending_transactions.length === 0 ? (
            <p className="text-gray-500">No pending transactions.</p>
          ) : (
            <ul className="space-y-3">
              {group.pending_transactions.map((t) => (
                <li key={t.id} className="border rounded p-3">
                  <p>
                    <strong>@{t.giver}</strong> wants to {t.amount >= 0 ? 'give' : 'take'}{' '}
                    <span className={t.amount >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {Math.abs(t.amount)} aura
                    </span>{' '}
                    {t.amount >= 0 ? 'to' : 'from'} <strong>@{t.target}</strong>
                  </p>
                  <p className="text-gray-600 text-sm mt-1">Reason: {t.reason}</p>
                  <p className="text-sm mt-1">
                    Votes: <span className="text-green-600">{t.approvals} approve</span> /{' '}
                    <span className="text-red-600">{t.rejections} reject</span>
                  </p>
                  {t.user_voted ? (
                    <p className="text-sm text-gray-500 mt-2">
                      You voted: {t.user_vote ? 'Approve' : 'Reject'}
                    </p>
                  ) : (
                    <div className="mt-2 flex gap-2">
                      <Button onClick={() => handleVote(t.id, true)}>Approve</Button>
                      <Button
                        onClick={() => handleVote(t.id, false)}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
