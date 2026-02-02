import { useEffect, useState } from 'react'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import { Mail, Check, X, Sparkles, Users } from 'lucide-react'
import { useAuth } from './AuthContext.jsx'
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  useToast,
  SkeletonList,
} from './components/ui'
import { EmptyState } from './components/illustrations/EmptyState.jsx'
import { PageTransition } from './components/animations/PageTransition.jsx'
import { AnimatedPresenceList, AnimatedPresenceItem } from './components/animations/AnimatedList.jsx'
import { useConfetti } from './hooks/useConfetti.js'
import { API_URL } from './config.js'

export default function InvitationsPage() {
  const { token } = useAuth()
  const [invitations, setInvitations] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const { addToast } = useToast()
  const { fireConfetti } = useConfetti()

  async function load() {
    try {
      const res = await fetch(`${API_URL}/invitations`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        setInvitations(await res.json())
      } else {
        const msg = 'Error loading invitations'
        setMessage(msg)
        addToast({ title: msg, variant: 'error' })
      }
    } catch {
      setMessage('Network error')
      addToast({ title: 'Network error', variant: 'error' })
    } finally {
      setLoading(false)
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
        if (action === 'accept') {
          addToast({
            title: 'Invitation accepted!',
            description: 'You can now access this group',
            variant: 'success'
          })
          fireConfetti()
        } else {
          addToast({
            title: 'Invitation declined',
            variant: 'info'
          })
        }
      }
    } catch {
      setMessage('Network error')
      addToast({ title: 'Network error', variant: 'error' })
    }
  }

  return (
    <PageTransition>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-lavender-500" />
            Invitations
          </CardTitle>
          <CardDescription>Pending group invitations</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <SkeletonList count={3} />
          ) : invitations.length === 0 ? (
            <EmptyState
              illustration="invitations"
              title="No pending invitations"
              description="When someone invites you to a group, it will appear here"
            />
          ) : (
            <AnimatedPresenceList className="space-y-3">
              {invitations.map((inv) => (
                <AnimatedPresenceItem key={inv.id} id={inv.id}>
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="p-4 rounded-xl border border-slate-100 bg-gradient-to-r from-white to-lavender-50 space-y-4"
                  >
                    <div className="flex items-start gap-4">
                      {/* Group Icon */}
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-lavender-400 to-primary-500 flex items-center justify-center shadow-sm flex-shrink-0">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>

                      {/* Invitation Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900">
                          {inv.group_name}
                        </h3>
                        <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                          <Users className="w-4 h-4" />
                          Invited by <span className="font-medium text-slate-700">@{inv.inviter}</span>
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => respond(inv.id, 'accept')}
                        variant="success"
                        className="flex-1"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Accept
                      </Button>
                      <Button
                        onClick={() => respond(inv.id, 'reject')}
                        variant="outline"
                        className="flex-1"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Decline
                      </Button>
                    </div>
                  </motion.div>
                </AnimatedPresenceItem>
              ))}
            </AnimatedPresenceList>
          )}

          {message && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-aura-negative-500 mt-4"
            >
              {message}
            </motion.p>
          )}
        </CardContent>
      </Card>
    </PageTransition>
  )
}
