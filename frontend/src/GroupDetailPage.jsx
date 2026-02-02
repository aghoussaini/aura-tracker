import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Sparkles,
  Send,
  ThumbsUp,
  ThumbsDown,
  Plus,
  Minus,
  MessageSquare,
  Clock,
  Pencil,
  Check,
  X,
} from 'lucide-react'
import { useAuth } from './AuthContext.jsx'
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
  Avatar,
  Badge,
  SkeletonCard,
} from './components/ui'
import { AuraLeaderboard, AuraSummary } from './components/charts/MemberStats.jsx'
import { EmptyState } from './components/illustrations/EmptyState.jsx'
import { PageTransition } from './components/animations/PageTransition.jsx'
import { AnimatedPresenceList, AnimatedPresenceItem } from './components/animations/AnimatedList.jsx'
import { useConfetti } from './hooks/useConfetti.js'
import { API_URL } from './config.js'
import { cn } from './lib/cn'

const AURA_AMOUNTS = [5, 10, 25, 50, 100]

export default function GroupDetailPage() {
  const { groupId } = useParams()
  const { token } = useAuth()
  const { addToast } = useToast()
  const { fireAuraConfetti } = useConfetti()
  const [group, setGroup] = useState(null)
  const [loading, setLoading] = useState(true)
  const [giveForm, setGiveForm] = useState({ target: '', amount: '5', reason: '', isNegative: false })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEditingName, setIsEditingName] = useState(false)
  const [editedName, setEditedName] = useState('')
  const [isSavingName, setIsSavingName] = useState(false)

  async function loadGroup() {
    try {
      const res = await fetch(`${API_URL}/groups/${groupId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        setGroup(await res.json())
      } else {
        addToast({ title: 'Error loading group', variant: 'error' })
      }
    } catch {
      addToast({ title: 'Network error', variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadGroup()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId, token])

  async function handleSaveGroupName() {
    if (!editedName.trim() || editedName === group.name) {
      setIsEditingName(false)
      return
    }
    setIsSavingName(true)
    try {
      const res = await fetch(`${API_URL}/groups/${groupId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name: editedName.trim() })
      })
      const data = await res.json()
      if (res.ok) {
        addToast({ title: 'Group name updated!', variant: 'success' })
        setGroup({ ...group, name: data.name })
        setIsEditingName(false)
      } else {
        addToast({ title: data.error || 'Error updating group name', variant: 'error' })
      }
    } catch {
      addToast({ title: 'Network error', variant: 'error' })
    } finally {
      setIsSavingName(false)
    }
  }

  async function handleGiveAura(e) {
    e.preventDefault()
    const amount = giveForm.isNegative ? -parseInt(giveForm.amount) : parseInt(giveForm.amount)
    setIsSubmitting(true)
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
        addToast({
          title: 'Aura transaction created!',
          description: 'Waiting for group approval',
          variant: 'success'
        })
        fireAuraConfetti(!giveForm.isNegative)
        setGiveForm({ target: '', amount: '5', reason: '', isNegative: false })
        loadGroup()
      } else {
        addToast({ title: data.error || 'Error creating transaction', variant: 'error' })
      }
    } catch {
      addToast({ title: 'Network error', variant: 'error' })
    } finally {
      setIsSubmitting(false)
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
        addToast({
          title: approval ? 'Approved!' : 'Rejected',
          description: `Transaction ${data.status}`,
          variant: approval ? 'success' : 'info'
        })
        if (data.status === 'approved') {
          fireAuraConfetti(true)
        }
        loadGroup()
      } else {
        addToast({ title: data.error || 'Error voting', variant: 'error' })
      }
    } catch {
      addToast({ title: 'Network error', variant: 'error' })
    }
  }

  if (loading) {
    return (
      <PageTransition>
        <div className="space-y-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </PageTransition>
    )
  }

  if (!group) {
    return (
      <PageTransition>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-slate-500">Group not found or access denied.</p>
            <Link to="/groups">
              <Button variant="outline" className="mt-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Groups
              </Button>
            </Link>
          </CardContent>
        </Card>
      </PageTransition>
    )
  }

  const otherMembers = group.members.filter(m => m.username !== group.current_user)
  const totalAura = group.members.reduce((sum, m) => sum + m.aura_points, 0)

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/groups">
            <motion.div
              whileHover={{ x: -4 }}
              className="flex items-center gap-2 text-slate-600 hover:text-primary-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </motion.div>
          </Link>
        </div>

        {/* Group Header Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-400 to-lavender-500 flex items-center justify-center shadow-vibrant">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="text-xl font-semibold"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveGroupName()
                        if (e.key === 'Escape') setIsEditingName(false)
                      }}
                    />
                    <Button
                      size="sm"
                      variant="success"
                      onClick={handleSaveGroupName}
                      disabled={isSavingName}
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsEditingName(false)}
                      disabled={isSavingName}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-2xl">{group.name}</CardTitle>
                    {group.is_creator && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditedName(group.name)
                          setIsEditingName(true)
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                )}
                <CardDescription>{group.members.length} members</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <AuraSummary
              totalMembers={group.members.length}
              totalAura={totalAura}
            />
          </CardContent>
        </Card>

        {/* Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-sunshine-500" />
              Aura Leaderboard
            </CardTitle>
            <CardDescription>Rankings based on aura points</CardDescription>
          </CardHeader>
          <CardContent>
            <AuraLeaderboard
              members={group.members}
              currentUser={group.current_user}
            />
          </CardContent>
        </Card>

        {/* Give Aura Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="w-5 h-5 text-primary-500" />
              {giveForm.isNegative ? 'Take Aura' : 'Give Aura'}
            </CardTitle>
            <CardDescription>
              {giveForm.isNegative
                ? 'Remove aura from a group member'
                : 'Award aura to a group member'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGiveAura} className="space-y-4">
              {/* Give/Take Toggle */}
              <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setGiveForm({ ...giveForm, isNegative: false })}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-all',
                    !giveForm.isNegative
                      ? 'bg-aura-positive-500 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-200'
                  )}
                >
                  <Plus className="w-4 h-4" />
                  Give
                </button>
                <button
                  type="button"
                  onClick={() => setGiveForm({ ...giveForm, isNegative: true })}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-all',
                    giveForm.isNegative
                      ? 'bg-aura-negative-500 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-200'
                  )}
                >
                  <Minus className="w-4 h-4" />
                  Take
                </button>
              </div>

              {/* Member Select */}
              <div className="space-y-2">
                <Label>To Member</Label>
                <select
                  value={giveForm.target}
                  onChange={(e) => setGiveForm({ ...giveForm, target: e.target.value })}
                  className={cn(
                    'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm',
                    'shadow-sm transition-all duration-200',
                    'hover:border-slate-300',
                    'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20',
                    !giveForm.target && 'text-slate-400'
                  )}
                  required
                >
                  <option value="">Select a member...</option>
                  {otherMembers.map((m) => (
                    <option key={m.username} value={m.username}>
                      {m.first_name} {m.last_name} (@{m.username})
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount Select */}
              <div className="space-y-2">
                <Label>Amount</Label>
                <select
                  value={giveForm.amount}
                  onChange={(e) => setGiveForm({ ...giveForm, amount: e.target.value })}
                  className={cn(
                    'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm',
                    'shadow-sm transition-all duration-200',
                    'hover:border-slate-300',
                    'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20'
                  )}
                >
                  {AURA_AMOUNTS.map((a) => (
                    <option key={a} value={String(a)}>
                      {giveForm.isNegative ? '-' : '+'}{a} aura
                    </option>
                  ))}
                </select>
              </div>

              {/* Reason Input */}
              <div className="space-y-2">
                <Label htmlFor="reason">Reason</Label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input
                    id="reason"
                    placeholder="Why are you giving/taking aura?"
                    value={giveForm.reason}
                    onChange={(e) => setGiveForm({ ...giveForm, reason: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                variant={giveForm.isNegative ? 'destructive' : 'success'}
                isLoading={isSubmitting}
                disabled={!giveForm.target}
              >
                {giveForm.isNegative ? 'Take' : 'Give'} {giveForm.amount} Aura
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Pending Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-lavender-500" />
              Pending Transactions
            </CardTitle>
            <CardDescription>Vote on aura transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {group.pending_transactions.length === 0 ? (
              <EmptyState
                illustration="transactions"
                title="All caught up!"
                description="No pending transactions to review"
              />
            ) : (
              <AnimatedPresenceList className="space-y-3">
                {group.pending_transactions.map((t) => (
                  <AnimatedPresenceItem key={t.id} id={t.id}>
                    <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-3">
                      {/* Transaction Header */}
                      <div className="flex items-start gap-3">
                        <Avatar
                          size="md"
                          username={t.giver}
                          firstName={t.giver_first_name}
                          lastName={t.giver_last_name}
                        />
                        <div className="flex-1">
                          <p className="text-slate-900">
                            <span className="font-semibold">@{t.giver}</span>
                            {' wants to '}
                            {t.amount >= 0 ? 'give' : 'take'}
                            {' '}
                            <span className={cn(
                              'font-bold',
                              t.amount >= 0 ? 'text-aura-positive-500' : 'text-aura-negative-500'
                            )}>
                              {Math.abs(t.amount)} aura
                            </span>
                            {' '}
                            {t.amount >= 0 ? 'to' : 'from'}
                            {' '}
                            <span className="font-semibold">@{t.target}</span>
                          </p>
                          <p className="text-sm text-slate-500 mt-1">
                            "{t.reason}"
                          </p>
                        </div>
                      </div>

                      {/* Vote Status */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Badge variant="success" size="sm">
                            <ThumbsUp className="w-3 h-3 mr-1" />
                            {t.approvals}
                          </Badge>
                          <Badge variant="error" size="sm">
                            <ThumbsDown className="w-3 h-3 mr-1" />
                            {t.rejections}
                          </Badge>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant={t.user_voted && t.user_vote ? 'outline' : 'success'}
                            onClick={() => handleVote(t.id, true)}
                            disabled={t.user_voted && t.user_vote}
                          >
                            <ThumbsUp className="w-4 h-4 mr-1" />
                            {t.user_voted && t.user_vote ? 'Approved' : 'Approve'}
                          </Button>
                          <Button
                            size="sm"
                            variant={t.user_voted && !t.user_vote ? 'outline' : 'destructive'}
                            onClick={() => handleVote(t.id, false)}
                            disabled={t.user_voted && !t.user_vote}
                          >
                            <ThumbsDown className="w-4 h-4 mr-1" />
                            {t.user_voted && !t.user_vote ? 'Rejected' : 'Reject'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </AnimatedPresenceItem>
                ))}
              </AnimatedPresenceList>
            )}
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  )
}
