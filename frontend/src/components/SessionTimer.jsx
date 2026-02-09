import { useState, useEffect } from 'react'

const SessionTimer = ({ targetDate, onExpire }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date()
    let timeLeft = {}

    if (difference > 0) {
      timeLeft = {
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      }
    } else {
        // Trigger expire callback if provided and time is up
        if (onExpire) onExpire()
    }

    return timeLeft
  }

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearTimeout(timer)
  })

  // Format with leading zeros
  const minutes = String(timeLeft.minutes || 0).padStart(2, '0')
  const seconds = String(timeLeft.seconds || 0).padStart(2, '0')

  if (+new Date(targetDate) - +new Date() <= 0) {
      return <span style={{ color: '#d32f2f', fontWeight: 'bold' }}>Session Expired</span>
  }

  return (
    <span style={{ color: '#666', fontSize: '0.9rem', marginRight: '10px' }}>
      남은 시간: {minutes}:{seconds}
    </span>
  )
}

export default SessionTimer
