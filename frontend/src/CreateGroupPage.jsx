import { useState, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import { Users, ArrowLeft, Sparkles } from 'lucide-react'
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
  UserSearch,
} from './components/ui'
import { PageTransition } from './components/animations/PageTransition.jsx'
import { useConfetti } from './hooks/useConfetti.js'
import { API_URL } from './config.js'

export default function CreateGroupPage() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [selectedUsers, setSelectedUsers] = useState([])
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { addToast } = useToast()
  const { fireSuccessConfetti } = useConfetti()

  const handleSelectUser = useCallback((user) => {
    setSelectedUsers(prev => [...prev, user])
  }, [])

  const handleRemoveUser = useCallback((username) => {
    setSelectedUsers(prev => prev.filter(u => u.username !== username))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setIsLoading(true)
    try {
      const res = await fetch(`${API_URL}/groups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          invitees: selectedUsers.map(u => u.username)
        })
      })
      const data = await res.json()
      if (res.ok) {
        addToast({ title: 'Group created!', description: 'Start tracking aura now', variant: 'success' })
        fireSuccessConfetti()
        navigate('/groups')
      } else {
        const msg = data.error || 'Error creating group'
        setMessage(msg)
        addToast({ title: 'Failed to create group', description: msg, variant: 'error' })
      }
    } catch {
      setMessage('Network error')
      addToast({ title: 'Network error', variant: 'error' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Back Link */}
        <Link to="/groups">
          <motion.div
            whileHover={{ x: -4 }}
            className="flex items-center gap-2 text-slate-600 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Groups</span>
          </motion.div>
        </Link>

        {/* Animated Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.1 }}
          className="flex justify-center"
        >
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-400 to-lavender-500 flex items-center justify-center shadow-vibrant">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Sparkles className="w-10 h-10 text-white" />
            </motion.div>
          </div>
        </motion.div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>Create a New Group</CardTitle>
            <CardDescription>
              Start a group to track aura with friends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Group Name</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="name"
                    placeholder="Enter group name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>
                  Invite Members
                  <span className="ml-2 text-slate-400 font-normal">(optional)</span>
                </Label>
                <UserSearch
                  token={token}
                  selectedUsers={selectedUsers}
                  onSelect={handleSelectUser}
                  onRemove={handleRemoveUser}
                  placeholder="Search by username..."
                />
                <p className="text-xs text-slate-500">
                  Search for users and double-click to add them
                </p>
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
                Create Group
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  )
}
