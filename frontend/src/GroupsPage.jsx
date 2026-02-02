import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import { Users, Plus, ChevronRight, Sparkles } from 'lucide-react'
import { useAuth } from './AuthContext.jsx'
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  SkeletonList,
} from './components/ui'
import { EmptyState } from './components/illustrations/EmptyState.jsx'
import { PageTransition } from './components/animations/PageTransition.jsx'
import { AnimatedList, AnimatedListItem } from './components/animations/AnimatedList.jsx'
import { API_URL } from './config.js'
import { cn } from './lib/cn'

export default function GroupsPage() {
  const { token } = useAuth()
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
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
      } finally {
        setLoading(false)
      }
    }
    if (token) fetchGroups()
  }, [token])

  return (
    <PageTransition>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary-500" />
              Your Groups
            </CardTitle>
            <CardDescription>Manage and track aura in your groups</CardDescription>
          </div>
          <Link to="/groups/new">
            <Button size="sm">
              <Plus className="w-4 h-4" />
              Create
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {loading ? (
            <SkeletonList count={3} />
          ) : groups.length === 0 ? (
            <EmptyState
              illustration="groups"
              title="No groups yet"
              description="Create your first group to start tracking aura with friends"
              action={
                <Link to="/groups/new">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Group
                  </Button>
                </Link>
              }
            />
          ) : (
            <AnimatedList className="space-y-2">
              {groups.map((g) => (
                <AnimatedListItem key={g.id}>
                  <Link to={`/groups/${g.id}`}>
                    <motion.div
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        'flex items-center gap-4 p-4 rounded-xl border border-slate-100',
                        'bg-white hover:border-primary-200 hover:shadow-soft',
                        'transition-all duration-200 cursor-pointer group'
                      )}
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-400 to-lavender-500 flex items-center justify-center shadow-sm">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 group-hover:text-primary-600 transition-colors">
                          {g.name}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {g.member_count || 0} members
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                    </motion.div>
                  </Link>
                </AnimatedListItem>
              ))}
            </AnimatedList>
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
