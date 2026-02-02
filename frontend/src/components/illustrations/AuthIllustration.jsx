// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'

export function AuraLogoIllustration({ className, size = 'default' }) {
  const sizes = {
    small: 'w-16 h-16',
    default: 'w-24 h-24',
    large: 'w-32 h-32',
  }

  return (
    <div className={className}>
      <motion.svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${sizes[size]} mx-auto`}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
      >
        {/* Outer glow ring */}
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          stroke="url(#gradient1)"
          strokeWidth="2"
          fill="none"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Middle glow ring */}
        <motion.circle
          cx="50"
          cy="50"
          r="38"
          stroke="url(#gradient2)"
          strokeWidth="2"
          fill="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.03, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        />

        {/* Main circle */}
        <motion.circle
          cx="50"
          cy="50"
          r="30"
          fill="url(#mainGradient)"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2, type: 'spring' }}
        />

        {/* Inner circle */}
        <motion.circle
          cx="50"
          cy="50"
          r="20"
          fill="white"
          fillOpacity="0.2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3, type: 'spring' }}
        />

        {/* A letter */}
        <motion.text
          x="50"
          y="58"
          textAnchor="middle"
          fill="white"
          fontSize="28"
          fontWeight="bold"
          fontFamily="Poppins, sans-serif"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          A
        </motion.text>

        {/* Sparkles */}
        <motion.g
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <circle cx="20" cy="25" r="2" fill="#facc15" />
          <circle cx="80" cy="30" r="2" fill="#f97316" />
          <circle cx="75" cy="75" r="1.5" fill="#a855f7" />
          <circle cx="25" cy="70" r="1.5" fill="#10b981" />
        </motion.g>

        {/* Floating particles */}
        <motion.circle
          cx="15"
          cy="50"
          r="3"
          fill="#0ea5e9"
          animate={{ y: [-5, 5, -5], x: [-2, 2, -2] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.circle
          cx="85"
          cy="50"
          r="3"
          fill="#10b981"
          animate={{ y: [5, -5, 5], x: [2, -2, 2] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Gradients */}
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
          <linearGradient id="gradient2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="50%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
          <linearGradient id="mainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
      </motion.svg>
    </div>
  )
}

export function AuthHeroIllustration({ className }) {
  return (
    <div className={className}>
      <motion.div
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <AuraLogoIllustration size="large" />
        <motion.div
          className="mt-4 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h1 className="text-3xl font-display font-bold gradient-text">
            Aura Tracker
          </h1>
          <p className="text-slate-500 mt-1">Track your social aura</p>
        </motion.div>
      </motion.div>
    </div>
  )
}
