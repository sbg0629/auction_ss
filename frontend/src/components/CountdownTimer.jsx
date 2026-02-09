import { useState, useEffect } from 'react'

const CountdownTimer = ({ targetDate }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date()
    let timeLeft = {}

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      }
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

  const timerComponents = []

  const timeMap = {
    days: '일',
    hours: '시간',
    minutes: '분',
    seconds: '초'
  }

  Object.keys(timeLeft).forEach((interval) => {
    if (timeLeft[interval] === undefined || (timeLeft[interval] === 0 && interval === 'days')) {
      return
    }

    timerComponents.push(
      <span key={interval}>
        {timeLeft[interval]}{timeMap[interval]}{" "}
      </span>
    )
  })

  return (
    <div style={{ color: '#d32f2f', fontWeight: 'bold', fontSize: '0.9rem' }}>
      {timerComponents.length ? timerComponents : <span>종료됨</span>}
    </div>
  )
}

export default CountdownTimer
