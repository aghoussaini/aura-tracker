// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import { Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Avatar } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { CountUpNumber } from '../animations/CountUpNumber'
import { AnimatedList, AnimatedListItem } from '../animations/AnimatedList'
import { cn } from '../../lib/cn'

function getRankBadge(rank) {
  switch (rank) {
    case 1:
      return { variant: 'gold', icon: Trophy, label: '1st' }
    case 2:
      return { variant: 'silver', icon: null, label: '2nd' }
    case 3:
      return { variant: 'bronze', icon: null, label: '3rd' }
    default:
      return { variant: 'default', icon: null, label: `#${rank}` }
  }
}

export function MemberStatsCard({
  member,
  rank,
  isCurrentUser = false,
  className,
}) {
  const rankInfo = getRankBadge(rank)
  const isPositive = member.aura_points >= 0
  const TrendIcon = member.aura_points > 0 ? TrendingUp : member.aura_points < 0 ? TrendingDown : Minus

  return (
    <motion.div
      whileHover={{ scale: 1.02, x: 4 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={cn(
        'flex items-center gap-4 p-4 rounded-xl border transition-colors',
        isCurrentUser
          ? 'bg-primary-50 border-primary-200'
          : 'bg-white border-slate-100 hover:border-slate-200',
        rank <= 3 && 'shadow-sm',
        className
      )}
    >
      {/* Rank Badge */}
      <div className="flex-shrink-0 w-12 flex justify-center">
        <Badge variant={rankInfo.variant} size="sm" className="font-bold">
          {rankInfo.icon && <rankInfo.icon className="w-3 h-3 mr-1" />}
          {rankInfo.label}
        </Badge>
      </div>

      {/* Avatar */}
      <Avatar
        size="md"
        username={member.username}
        firstName={member.first_name}
        lastName={member.last_name}
        withRing={rank === 1}
      />

      {/* Name and username */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-slate-900 truncate">
          {member.first_name} {member.last_name}
          {isCurrentUser && (
            <span className="ml-2 text-xs text-primary-600 font-normal">(you)</span>
          )}
        </p>
        <p className="text-sm text-slate-500 truncate">@{member.username}</p>
      </div>

      {/* Aura Points */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <TrendIcon
          className={cn(
            'w-4 h-4',
            isPositive ? 'text-aura-positive-500' : 'text-aura-negative-500'
          )}
        />
        <span className={cn(
          'font-bold text-lg tabular-nums',
          isPositive ? 'text-aura-positive-600' : 'text-aura-negative-500'
        )}>
          <CountUpNumber
            value={member.aura_points}
            showSign={true}
            duration={0.5}
          />
        </span>
        <span className="text-sm text-slate-400">aura</span>
      </div>
    </motion.div>
  )
}

export function AuraLeaderboard({
  members = [],
  currentUser,
  className,
}) {
  // Sort members by aura points (highest first)
  const sortedMembers = [...members].sort((a, b) => b.aura_points - a.aura_points)

  return (
    <div className={cn('space-y-2', className)}>
      <AnimatedList staggerDelay={0.08}>
        {sortedMembers.map((member, index) => (
          <AnimatedListItem key={member.username}>
            <MemberStatsCard
              member={member}
              rank={index + 1}
              isCurrentUser={member.username === currentUser}
            />
          </AnimatedListItem>
        ))}
      </AnimatedList>
    </div>
  )
}

export function AuraSummary({ totalMembers, totalAura, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'grid grid-cols-2 gap-4 p-4 rounded-xl bg-gradient-to-r from-primary-50 to-lavender-50 border border-primary-100',
        className
      )}
    >
      <div className="text-center">
        <p className="text-2xl font-bold text-slate-900">
          <CountUpNumber value={totalMembers} />
        </p>
        <p className="text-sm text-slate-500">Members</p>
      </div>
      <div className="text-center">
        <p className={cn(
          'text-2xl font-bold',
          totalAura >= 0 ? 'text-aura-positive-600' : 'text-aura-negative-500'
        )}>
          <CountUpNumber value={totalAura} showSign={true} />
        </p>
        <p className="text-sm text-slate-500">Total Aura</p>
      </div>
    </motion.div>
  )
}
