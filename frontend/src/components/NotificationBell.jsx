import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const NotificationBell = () => {
  const { user } = useAuth()
  const [unreadCount, setUnreadCount] = useState(0)
  const [notifications, setNotifications] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const dropdownRef = useRef(null)

  useEffect(() => {
    if (user) {
      fetchUnreadCount()
      fetchNotifications()
      
      // WebSocket
      const socket = new SockJS('http://localhost:8484/ws')
      const stompClient = Stomp.over(socket)
      stompClient.debug = null

      stompClient.connect({}, () => {
        stompClient.subscribe(`/topic/notifications/${user.id}`, (message) => {
          const notification = JSON.parse(message.body)
          setNotifications(prev => [notification, ...prev])
          setUnreadCount(prev => prev + 1)
        })
      })

      return () => {
        if (stompClient && stompClient.connected) {
            try {
                stompClient.disconnect();
            } catch (e) {
                console.warn('Failed to disconnect cleanly', e);
            }
        }
      }
    }
  }, [user])

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false)
        }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchUnreadCount = async () => {
    try {
      const response = await axios.get('/api/notifications/unread-count')
      setUnreadCount(response.data)
    } catch (error) {
      console.error('Failed to fetch unread count', error)
    }
  }

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('/api/notifications')
      const data = response.data
      setNotifications(Array.isArray(data) ? data : [])
    } catch (error) {
        console.error('Failed to fetch notifications', error)
        setNotifications([])
    }
  }

  const handleRead = async (id, auctionId) => {
    try {
      await axios.post(`/api/notifications/${id}/read`)
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
      setUnreadCount(prev => Math.max(0, prev - 1))
      setIsOpen(false)
      navigate(`/auctions/${auctionId}`)
    } catch (error) {
      console.error('Failed to mark as read', error)
    }
  }

  const toggleDropdown = () => {
      if (!isOpen) {
          fetchNotifications() // Refresh on open
      }
      setIsOpen(!isOpen)
  }

  return (
    <div style={{ position: 'relative', marginRight: '15px' }} ref={dropdownRef}>
      <button 
        onClick={toggleDropdown}
        style={{ 
          background: 'none', 
          border: 'none', 
          fontSize: '1.5rem', 
          cursor: 'pointer',
          position: 'relative',
          color: '#333'
        }}
      >
        🔔
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            background: 'red',
            color: 'white',
            borderRadius: '50%',
            width: '18px',
            height: '18px',
            fontSize: '0.7rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold'
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          width: '300px',
          background: 'white',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          borderRadius: '8px',
          zIndex: 1000,
          maxHeight: '400px',
          overflowY: 'auto'
        }}>
          {notifications.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>알림이 없습니다.</div>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {notifications.map(notification => (
                <li key={notification.id} style={{
                  padding: '15px',
                  borderBottom: '1px solid #eee',
                  background: notification.isRead ? 'white' : '#f9f9f9',
                  cursor: 'pointer'
                }} onClick={() => handleRead(notification.id, notification.relatedAuctionId)}>
                  <div style={{ fontSize: '0.9rem', marginBottom: '5px' }}>{notification.message}</div>
                  <div style={{ fontSize: '0.75rem', color: '#999' }}>{new Date(notification.createdAt).toLocaleString()}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

export default NotificationBell
