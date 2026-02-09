import { useState, useEffect, useRef } from 'react'

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { id: 1, text: '안녕하세요? 옥경매를 방문해 주셔서 감사합니다. 문의사항이 있으시다면 알려주세요. 빠르게 회신 드리겠습니다.', isUser: false, time: new Date() }
  ])
  const [inputText, setInputText] = useState('')
  const messagesEndRef = useRef(null)

  const toggleChat = () => setIsOpen(!isOpen)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) scrollToBottom()
  }, [messages, isOpen])

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!inputText.trim()) return

    const newMessage = {
      id: Date.now(),
      text: inputText,
      isUser: true,
      time: new Date()
    }

    setMessages(prev => [...prev, newMessage])
    setInputText('')

    // Simulate bot response
    setTimeout(() => {
        const botResponse = {
            id: Date.now() + 1,
            text: '현재 상담원이 부재중입니다. 1:1 문의를 남겨주시면 이메일로 답변 드리겠습니다.',
            isUser: false,
            time: new Date()
        }
        setMessages(prev => [...prev, botResponse])
    }, 1000)
  }

  return (
    <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 9999 }}>
      {/* Chat Button */}
      {!isOpen && (
        <button 
          onClick={toggleChat}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: '#2196F3', // Blue color like the image
            color: 'white',
            border: 'none',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px'
          }}
        >
          💬
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          width: '350px',
          height: '500px',
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 5px 25px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          fontFamily: 'Noto Sans KR, sans-serif'
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #448aff, #2196F3)',
            padding: '20px',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '40px', height: '40px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2196F3', fontWeight: 'bold' }}>OA</div>
                <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>옥경매 고객센터</h3>
                    <span style={{ fontSize: '0.8rem', opacity: 0.9 }}>Online</span>
                </div>
            </div>
            <button onClick={toggleChat} style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
          </div>

          {/* Messages Area */}
          <div style={{
            flex: 1,
            padding: '20px',
            overflowY: 'auto',
            backgroundColor: '#f5f7fb'
          }}>
            {/* Time Badge */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <span style={{ background: 'rgba(0,0,0,0.1)', color: '#666', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem' }}>
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>

            {messages.map(msg => (
              <div key={msg.id} style={{
                display: 'flex',
                justifyContent: msg.isUser ? 'flex-end' : 'flex-start',
                marginBottom: '15px'
              }}>
                {!msg.isUser && (
                    <div style={{ width: '30px', height: '30px', background: '#e0e0e0', borderRadius: '50%', marginRight: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>OA</div>
                )}
                <div style={{
                  maxWidth: '70%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  backgroundColor: msg.isUser ? '#2196F3' : 'white',
                  color: msg.isUser ? 'white' : '#333',
                  boxShadow: msg.isUser ? 'none' : '0 2px 5px rgba(0,0,0,0.05)',
                  fontSize: '0.9rem',
                  lineHeight: '1.5',
                  borderTopLeftRadius: !msg.isUser ? '0' : '12px',
                  borderTopRightRadius: msg.isUser ? '0' : '12px'
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            
            {/* Additional Info */}
            <div style={{ margin: '20px 0', padding: '15px', background: 'white', borderRadius: '8px', fontSize: '0.85rem', color: '#555', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                <p style={{ margin: '0 0 5px 0' }}>고객센터 영업시간:</p>
                <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>10:00am ~ 18:00pm</p>
                <p style={{ margin: 0 }}>연락처: 031-798-7787</p>
            </div>

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} style={{
            padding: '15px',
            backgroundColor: 'white',
            borderTop: '1px solid #eee',
            display: 'flex',
            gap: '10px'
          }}>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="메시지를 입력하세요."
              style={{
                flex: 1,
                padding: '10px 15px',
                borderRadius: '20px',
                border: '1px solid #ddd',
                outline: 'none',
                fontSize: '0.9rem'
              }}
            />
            <button 
                type="submit" 
                style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: '#2196F3', 
                    fontSize: '1.2rem', 
                    cursor: 'pointer',
                    padding: '0 5px'
                }}
            >
                📤
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default ChatWidget
