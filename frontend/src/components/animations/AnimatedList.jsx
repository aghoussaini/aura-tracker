// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: {
      duration: 0.2,
    },
  },
}

export function AnimatedList({
  children,
  className,
  staggerDelay = 0.1,
}) {
  return (
    <motion.div
      variants={{
        ...containerVariants,
        visible: {
          ...containerVariants.visible,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function AnimatedListItem({ children, className, layoutId }) {
  return (
    <motion.div
      variants={itemVariants}
      layout
      layoutId={layoutId}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function AnimatedPresenceList({ children, className }) {
  return (
    <div className={className}>
      <AnimatePresence mode="popLayout">
        {children}
      </AnimatePresence>
    </div>
  )
}

export function AnimatedPresenceItem({ children, className, id }) {
  return (
    <motion.div
      key={id}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: -100, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      layout
      className={className}
    >
      {children}
    </motion.div>
  )
}
