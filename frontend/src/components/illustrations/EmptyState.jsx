// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'

export function EmptyGroupsIllustration({ className }) {
  return (
    <div className={className}>
      <svg
        viewBox="0 0 200 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto max-w-[200px] mx-auto"
      >
        {/* Background circles */}
        <motion.circle
          cx="100"
          cy="80"
          r="60"
          fill="#e0f2fe"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        />
        <motion.circle
          cx="100"
          cy="80"
          r="45"
          fill="#bae6fd"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        />

        {/* Person 1 */}
        <motion.g
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <circle cx="70" cy="70" r="12" fill="#0ea5e9" />
          <circle cx="70" cy="62" r="6" fill="white" />
          <path d="M60 85 Q70 78 80 85" stroke="#0ea5e9" strokeWidth="8" strokeLinecap="round" fill="none" />
        </motion.g>

        {/* Person 2 */}
        <motion.g
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <circle cx="130" cy="70" r="12" fill="#a855f7" />
          <circle cx="130" cy="62" r="6" fill="white" />
          <path d="M120 85 Q130 78 140 85" stroke="#a855f7" strokeWidth="8" strokeLinecap="round" fill="none" />
        </motion.g>

        {/* Person 3 (center, floating) */}
        <motion.g
          animate={{ y: [-2, 2, -2] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <circle cx="100" cy="55" r="14" fill="#10b981" />
          <circle cx="100" cy="46" r="7" fill="white" />
          <path d="M88 72 Q100 64 112 72" stroke="#10b981" strokeWidth="9" strokeLinecap="round" fill="none" />
        </motion.g>

        {/* Plus icon */}
        <motion.g
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, delay: 0.5, type: 'spring' }}
        >
          <circle cx="150" cy="40" r="15" fill="#f97316" />
          <path d="M145 40 H155 M150 35 V45" stroke="white" strokeWidth="3" strokeLinecap="round" />
        </motion.g>

        {/* Sparkles */}
        <motion.g
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <circle cx="45" cy="50" r="2" fill="#facc15" />
          <circle cx="155" cy="100" r="2" fill="#facc15" />
          <circle cx="60" cy="110" r="1.5" fill="#f97316" />
          <circle cx="140" cy="45" r="1.5" fill="#0ea5e9" />
        </motion.g>
      </svg>
    </div>
  )
}

export function EmptyInvitationsIllustration({ className }) {
  return (
    <div className={className}>
      <svg
        viewBox="0 0 200 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto max-w-[200px] mx-auto"
      >
        {/* Background */}
        <motion.circle
          cx="100"
          cy="80"
          r="55"
          fill="#faf5ff"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        />

        {/* Envelope */}
        <motion.g
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Envelope body */}
          <rect x="55" y="60" width="90" height="60" rx="4" fill="#e9d5ff" stroke="#a855f7" strokeWidth="2" />
          {/* Envelope flap */}
          <path d="M55 60 L100 90 L145 60" fill="#d8b4fe" stroke="#a855f7" strokeWidth="2" strokeLinejoin="round" />
          {/* Envelope inner lines */}
          <path d="M70 85 H110" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
          <path d="M70 95 H95" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
        </motion.g>

        {/* Floating envelope animation */}
        <motion.g
          animate={{ y: [-3, 3, -3] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Mini envelope 1 */}
          <rect x="35" y="45" width="25" height="18" rx="2" fill="#bae6fd" stroke="#0ea5e9" strokeWidth="1.5" />
          <path d="M35 45 L47.5 55 L60 45" fill="#7dd3fc" stroke="#0ea5e9" strokeWidth="1.5" />
        </motion.g>

        <motion.g
          animate={{ y: [3, -3, 3] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Mini envelope 2 */}
          <rect x="140" y="50" width="22" height="16" rx="2" fill="#fecdd3" stroke="#f43f5e" strokeWidth="1.5" />
          <path d="M140 50 L151 58 L162 50" fill="#fda4af" stroke="#f43f5e" strokeWidth="1.5" />
        </motion.g>

        {/* Sparkles */}
        <motion.g
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <path d="M165 75 L168 78 L165 81 L162 78 Z" fill="#facc15" />
          <path d="M40 90 L42 92 L40 94 L38 92 Z" fill="#facc15" />
          <circle cx="155" cy="110" r="2" fill="#f97316" />
          <circle cx="50" cy="70" r="2" fill="#0ea5e9" />
        </motion.g>

        {/* Check mark on main envelope */}
        <motion.circle
          cx="145"
          cy="60"
          r="12"
          fill="#10b981"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.6, type: 'spring' }}
        />
        <motion.path
          d="M140 60 L143 63 L150 56"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3, delay: 0.8 }}
        />
      </svg>
    </div>
  )
}

export function EmptyTransactionsIllustration({ className }) {
  return (
    <div className={className}>
      <svg
        viewBox="0 0 200 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto max-w-[200px] mx-auto"
      >
        {/* Background */}
        <motion.circle
          cx="100"
          cy="80"
          r="55"
          fill="#ecfdf5"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        />

        {/* Large checkmark circle */}
        <motion.g
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2, type: 'spring' }}
        >
          <circle cx="100" cy="80" r="40" fill="#10b981" />
          <motion.path
            d="M80 80 L93 93 L120 66"
            stroke="white"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          />
        </motion.g>

        {/* Glow rings */}
        <motion.circle
          cx="100"
          cy="80"
          r="50"
          stroke="#10b981"
          strokeWidth="2"
          fill="none"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0.5, 0, 0.5], scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.circle
          cx="100"
          cy="80"
          r="55"
          stroke="#10b981"
          strokeWidth="1"
          fill="none"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0.3, 0, 0.3], scale: [1, 1.3, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        />

        {/* Sparkles */}
        <motion.g
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <path d="M50 60 L53 63 L50 66 L47 63 Z" fill="#facc15" />
          <path d="M150 100 L153 103 L150 106 L147 103 Z" fill="#facc15" />
          <circle cx="60" cy="110" r="3" fill="#f97316" />
          <circle cx="145" cy="55" r="3" fill="#0ea5e9" />
          <circle cx="40" cy="85" r="2" fill="#a855f7" />
          <circle cx="160" cy="75" r="2" fill="#a855f7" />
        </motion.g>
      </svg>
    </div>
  )
}

export function EmptyState({ illustration, title, description, action }) {
  const IllustrationComponent = {
    groups: EmptyGroupsIllustration,
    invitations: EmptyInvitationsIllustration,
    transactions: EmptyTransactionsIllustration,
  }[illustration] || EmptyGroupsIllustration

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
    >
      <IllustrationComponent className="mb-6" />
      {title && (
        <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      )}
      {description && (
        <p className="text-slate-500 mb-6 max-w-sm">{description}</p>
      )}
      {action}
    </motion.div>
  )
}
