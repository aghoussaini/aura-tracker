import confetti from 'canvas-confetti'

export function useConfetti() {
  const fireConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#0ea5e9', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6']
    })
  }

  const fireAuraConfetti = (isPositive = true) => {
    const colors = isPositive
      ? ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0']
      : ['#f43f5e', '#fb7185', '#fda4af', '#fecdd3']

    // Fire from both sides
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors
    })
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors
    })
  }

  const fireSuccessConfetti = () => {
    const duration = 2000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#10b981', '#0ea5e9', '#f59e0b', '#8b5cf6']
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#10b981', '#0ea5e9', '#f59e0b', '#8b5cf6']
      })
    }, 250)
  }

  return { fireConfetti, fireAuraConfetti, fireSuccessConfetti }
}
