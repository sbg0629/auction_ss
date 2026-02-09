import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import '../App.css'

function AdminPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [users, setUsers] = useState([])
  const [inquiries, setInquiries] = useState([])
  const [dashboard, setDashboard] = useState(null)
  const [payments, setPayments] = useState([])
  const [auctions, setAuctions] = useState([]) // For auction management if needed
  const [noticeForm, setNoticeForm] = useState({ title: '', content: '' })
  const [faqForm, setFaqForm] = useState({ question: '', answer: '' })
  const [loading, setLoading] = useState(false)
  
  // Inquiry Modal
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false)
  const [selectedInquiry, setSelectedInquiry] = useState(null)
  const [answerContent, setAnswerContent] = useState('')

  // Ban Modal State
  const [banModalOpen, setBanModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [banDays, setBanDays] = useState(3)
  const [banReason, setBanReason] = useState('')

  const [deliveryModalOpen, setDeliveryModalOpen] = useState(false)
  const [selectedPaymentId, setSelectedPaymentId] = useState(null)
  const [deliveryForm, setDeliveryForm] = useState({ courierName: 'CJ대한통운', trackingNumber: '' })

  useEffect(() => {
    if (activeTab === 'dashboard') {
        fetchDashboard()
    } else if (activeTab === 'users') {
        fetchUsers()
    } else if (activeTab === 'inquiries') {
        fetchInquiries()
    } else if (activeTab === 'payments') {
        fetchPayments()
    } else if (activeTab === 'auctions') {
        fetchAuctions()
    }
  }, [activeTab])

  const openDeliveryModal = (paymentId) => {
    setSelectedPaymentId(paymentId)
    setDeliveryForm({ courierName: 'CJ대한통운', trackingNumber: '' })
    setDeliveryModalOpen(true)
  }

  const handleDeliverySubmit = async () => {
    try {
      await axios.post(`/api/admin/payments/${selectedPaymentId}/delivery`, deliveryForm, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      alert('운송장 번호가 등록되었습니다.')
      setDeliveryModalOpen(false)
      fetchPayments()
    } catch (error) {
      alert('등록 실패')
    }
  }
  const fetchDashboard = async () => {
    try {
        const response = await axios.get('/api/admin/dashboard', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        setDashboard(response.data)
    } catch (error) {
        console.error(error)
    }
  }

  const fetchPayments = async () => {
    try {
        const response = await axios.get('/api/admin/payments', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        setPayments(response.data)
    } catch (error) {
        console.error(error)
    }
  }

  const fetchAuctions = async () => {
      try {
          const response = await axios.get('/api/auctions?size=100', {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          })
          setAuctions(response.data.content)
      } catch (error) {
          console.error(error)
      }
  }

  const handleCancelAuction = async (id) => {
      if (!window.confirm('정말 이 경매를 취소하시겠습니까?')) return
      try {
          await axios.post(`/api/admin/auctions/${id}/cancel`, {}, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          })
          alert('경매가 취소되었습니다.')
          fetchAuctions()
      } catch (error) {
          alert('작업 실패')
      }
  }

  const handleDeleteAuction = async (id) => {
      if (!window.confirm('정말 이 경매를 삭제하시겠습니까?')) return
      try {
          await axios.post(`/api/admin/auctions/${id}/delete`, {}, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          })
          alert('경매가 삭제되었습니다.')
          fetchAuctions()
      } catch (error) {
          alert('작업 실패')
      }
  }

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await axios.get('/api/admin/users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      setUsers(response.data)
    } catch (error) {
      console.error('Failed to fetch users', error)
      alert('데이터를 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const fetchInquiries = async () => {
    setLoading(true)
    try {
        const response = await axios.get('/api/admin/inquiries', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        setInquiries(response.data)
    } catch (error) {
        console.error('Failed to fetch inquiries', error)
        alert('문의 목록을 불러오는데 실패했습니다.')
    } finally {
        setLoading(false)
    }
  }

  const openInquiryModal = (inquiry) => {
    setSelectedInquiry(inquiry)
    setAnswerContent(inquiry.answer || '')
    setInquiryModalOpen(true)
  }

  const closeInquiryModal = () => {
    setInquiryModalOpen(false)
    setSelectedInquiry(null)
    setAnswerContent('')
  }

  const handleAnswerSubmit = async () => {
    try {
        await axios.post(`/api/admin/inquiries/${selectedInquiry.id}/answer`, {
            answer: answerContent
        }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        alert('답변이 등록되었습니다.')
        closeInquiryModal()
        fetchInquiries()
    } catch (error) {
        console.error(error)
        alert('답변 등록 실패')
    }
  }

  const openBanModal = (user) => {
    setSelectedUser(user)
    setBanDays(3)
    setBanReason('')
    setBanModalOpen(true)
  }

  const closeBanModal = () => {
    setBanModalOpen(false)
    setSelectedUser(null)
  }

  const confirmBanUser = async () => {
    try {
        await axios.post(`/api/admin/users/${selectedUser.email}/ban`, {
            days: parseInt(banDays),
            reason: banReason
        }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        alert('사용자가 정지되었습니다.')
        closeBanModal()
        fetchUsers()
    } catch (error) {
        console.error(error)
        alert('작업 실패')
    }
  }

  const handleUnbanUser = async (email) => {
    if (!window.confirm(`${email} 사용자의 정지를 해제하시겠습니까?`)) return
    try {
        await axios.post(`/api/admin/users/${email}/unban`, {}, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        alert('정지가 해제되었습니다.')
        fetchUsers()
    } catch (error) {
        console.error(error)
        alert('작업 실패')
    }
  }

  const handleDeleteUser = async (email) => {
    if (!window.confirm(`${email} 사용자를 영구 삭제하시겠습니까? (되돌릴 수 없습니다)`)) return
    try {
        await axios.post(`/api/admin/users/${email}/delete`, {}, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        alert('사용자가 삭제되었습니다.')
        fetchUsers()
    } catch (error) {
        alert('작업 실패')
    }
  }

  const handleNoticeSubmit = async (e) => {
    e.preventDefault()
    try {
        await axios.post('/api/admin/notices', noticeForm, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        alert('공지사항이 등록되었습니다.')
        setNoticeForm({ title: '', content: '' })
    } catch (error) {
        alert('등록 실패')
    }
  }

  const handleFaqSubmit = async (e) => {
    e.preventDefault()
    try {
        await axios.post('/api/admin/faqs', faqForm, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        alert('FAQ가 등록되었습니다.')
        setFaqForm({ question: '', answer: '' })
    } catch (error) {
        alert('등록 실패')
    }
  }

  return (
    <div className="container" style={{ marginTop: '30px' }}>
      <h2 style={{ borderBottom: '2px solid var(--primary-color)', paddingBottom: '10px', marginBottom: '30px' }}>관리자 페이지</h2>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <button 
            className="btn" 
            style={{ background: activeTab === 'dashboard' ? 'var(--primary-color)' : '#ddd', color: activeTab === 'dashboard' ? 'white' : '#333' }}
            onClick={() => setActiveTab('dashboard')}
        >
            대시보드
        </button>
        <button 
            className="btn" 
            style={{ background: '#673ab7', color: 'white' }}
            onClick={() => navigate('/admin/revenue')}
        >
            💰 수익/정산 관리
        </button>
        <button 
            className="btn" 
            style={{ background: activeTab === 'users' ? 'var(--primary-color)' : '#ddd', color: activeTab === 'users' ? 'white' : '#333' }}
            onClick={() => setActiveTab('users')}
        >
            회원 관리
        </button>
        <button 
            className="btn" 
            style={{ background: activeTab === 'auctions' ? 'var(--primary-color)' : '#ddd', color: activeTab === 'auctions' ? 'white' : '#333' }}
            onClick={() => setActiveTab('auctions')}
        >
            경매 관리
        </button>
        <button 
            className="btn" 
            style={{ background: activeTab === 'payments' ? 'var(--primary-color)' : '#ddd', color: activeTab === 'payments' ? 'white' : '#333' }}
            onClick={() => setActiveTab('payments')}
        >
            결제 내역
        </button>
        <button 
            className="btn" 
            style={{ background: activeTab === 'inquiries' ? 'var(--primary-color)' : '#ddd', color: activeTab === 'inquiries' ? 'white' : '#333' }}
            onClick={() => setActiveTab('inquiries')}
        >
            1:1 문의
        </button>
        <button 
            className="btn" 
            style={{ background: activeTab === 'notice' ? 'var(--primary-color)' : '#ddd', color: activeTab === 'notice' ? 'white' : '#333' }}
            onClick={() => setActiveTab('notice')}
        >
            공지 등록
        </button>
        <button 
            className="btn" 
            style={{ background: activeTab === 'faq' ? 'var(--primary-color)' : '#ddd', color: activeTab === 'faq' ? 'white' : '#333' }}
            onClick={() => setActiveTab('faq')}
        >
            FAQ 등록
        </button>
      </div>

      {activeTab === 'dashboard' && dashboard && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
              <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: 'var(--shadow)', textAlign: 'center' }}>
                  <h3 style={{ margin: 0, color: '#666' }}>총 회원수</h3>
                  <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '10px 0' }}>{dashboard.totalUsers}명</p>
              </div>
              <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: 'var(--shadow)', textAlign: 'center' }}>
                  <h3 style={{ margin: 0, color: '#666' }}>진행중 경매</h3>
                  <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '10px 0', color: 'var(--primary-color)' }}>{dashboard.activeAuctions}건</p>
              </div>
              <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: 'var(--shadow)', textAlign: 'center' }}>
                  <h3 style={{ margin: 0, color: '#666' }}>누적 경매수</h3>
                  <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '10px 0' }}>{dashboard.totalAuctions}건</p>
              </div>
              <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: 'var(--shadow)', textAlign: 'center' }}>
                  <h3 style={{ margin: 0, color: '#666' }}>총 매출액</h3>
                  <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '10px 0', color: '#4CAF50' }}>{dashboard.totalSales.toLocaleString()}원</p>
              </div>
          </div>
      )}

      {activeTab === 'payments' && (
          <>
            <h3 style={{ marginBottom: '15px' }}>결제 내역</h3>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                    <thead>
                        <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                            <th style={{ padding: '12px' }}>ID</th>
                            <th style={{ padding: '12px' }}>경매 ID</th>
                            <th style={{ padding: '12px' }}>구매자</th>
                            <th style={{ padding: '12px' }}>금액</th>
                            <th style={{ padding: '12px' }}>결제수단</th>
                            <th style={{ padding: '12px' }}>상태</th>
                            <th style={{ padding: '12px' }}>일시</th>
                            <th style={{ padding: '12px' }}>배송 관리</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map((payment) => (
                            <tr key={payment.id} style={{ borderBottom: '1px solid #eee', textAlign: 'center' }}>
                                <td style={{ padding: '12px' }}>{payment.id}</td>
                                <td style={{ padding: '12px' }}>{payment.auction?.id}</td>
                                <td style={{ padding: '12px' }}>{payment.buyer?.name}</td>
                                <td style={{ padding: '12px' }}>{payment.amount.toLocaleString()}원</td>
                                <td style={{ padding: '12px' }}>{payment.paymentMethod}</td>
                                <td style={{ padding: '12px', color: 'green', fontWeight: 'bold' }}>{payment.status}</td>
                                <td style={{ padding: '12px' }}>{new Date(payment.createdAt).toLocaleString()}</td>
                                <td style={{ padding: '12px' }}>
                                    <button 
                                        onClick={() => openDeliveryModal(payment.id)}
                                        style={{ padding: '5px 10px', background: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                    >
                                        운송장 등록
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          </>
      )}

      {activeTab === 'auctions' && (
          <>
            <h3 style={{ marginBottom: '15px' }}>경매 관리</h3>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                    <thead>
                        <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                            <th style={{ padding: '12px' }}>ID</th>
                            <th style={{ padding: '12px' }}>제목</th>
                            <th style={{ padding: '12px' }}>판매자</th>
                            <th style={{ padding: '12px' }}>현재가</th>
                            <th style={{ padding: '12px' }}>상태</th>
                            <th style={{ padding: '12px' }}>관리</th>
                        </tr>
                    </thead>
                    <tbody>
                        {auctions.map((auction) => (
                            <tr key={auction.id} style={{ borderBottom: '1px solid #eee', textAlign: 'center' }}>
                                <td style={{ padding: '12px' }}>{auction.id}</td>
                                <td style={{ padding: '12px' }}>{auction.itemTitle}</td>
                                <td style={{ padding: '12px' }}>{auction.sellerName}</td>
                                <td style={{ padding: '12px' }}>{auction.currentPrice.toLocaleString()}원</td>
                                <td style={{ padding: '12px' }}>{auction.status}</td>
                                <td style={{ padding: '12px' }}>
                                    {auction.status === 'RUNNING' && (
                                        <button 
                                            onClick={() => handleCancelAuction(auction.id)}
                                            style={{ marginRight: '5px', padding: '5px 10px', background: '#ff9800', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                        >
                                            취소
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => handleDeleteAuction(auction.id)}
                                        style={{ padding: '5px 10px', background: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                    >
                                        삭제
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          </>
      )}

      {activeTab === 'users' && (
          <>
            <h3 style={{ marginBottom: '15px' }}>회원 목록</h3>
            {loading ? <p>로딩 중...</p> : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                        <thead>
                            <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                                <th style={{ padding: '12px', textAlign: 'left' }}>이름</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>이메일</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>상태</th>
                                <th style={{ padding: '12px', textAlign: 'center' }}>관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '12px' }}>{user.name}</td>
                                    <td style={{ padding: '12px' }}>{user.email}</td>
                                    <td style={{ padding: '12px' }}>
                                        <span style={{ 
                                            color: user.status === 'BANNED' ? 'red' : 'green',
                                            fontWeight: 'bold'
                                        }}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px', textAlign: 'center' }}>
                                        {user.status === 'BANNED' ? (
                                            <button 
                                                onClick={() => handleUnbanUser(user.email)}
                                                style={{ marginRight: '5px', padding: '5px 10px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                            >
                                                정지 해제
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => openBanModal(user)}
                                                style={{ marginRight: '5px', padding: '5px 10px', background: '#ff9800', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                            >
                                                정지
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => handleDeleteUser(user.email)}
                                            style={{ padding: '5px 10px', background: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                        >
                                            삭제
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
          </>
      )}

      {activeTab === 'inquiries' && (
          <>
            <h3 style={{ marginBottom: '15px' }}>1:1 문의 목록</h3>
            {loading ? <p>로딩 중...</p> : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                        <thead>
                            <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                                <th style={{ padding: '12px', textAlign: 'left' }}>상태</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>제목</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>작성자</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>작성일</th>
                                <th style={{ padding: '12px', textAlign: 'center' }}>관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inquiries.map((inquiry) => (
                                <tr key={inquiry.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '12px' }}>
                                        <span style={{ 
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontSize: '12px',
                                            color: 'white',
                                            background: inquiry.status === 'ANSWERED' ? '#4CAF50' : '#ff9800'
                                        }}>
                                            {inquiry.status === 'ANSWERED' ? '답변완료' : '대기중'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px' }}>{inquiry.title}</td>
                                    <td style={{ padding: '12px' }}>{inquiry.authorName} ({inquiry.authorEmail})</td>
                                    <td style={{ padding: '12px' }}>{new Date(inquiry.createdAt).toLocaleDateString()}</td>
                                    <td style={{ padding: '12px', textAlign: 'center' }}>
                                        <button 
                                            onClick={() => openInquiryModal(inquiry)}
                                            style={{ padding: '5px 10px', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                        >
                                            상세/답변
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
          </>
      )}

      {activeTab === 'notice' && (
          <div style={{ maxWidth: '600px' }}>
            <h3 style={{ marginBottom: '20px' }}>공지사항 등록</h3>
            <form onSubmit={handleNoticeSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>제목</label>
                    <input 
                        type="text" 
                        value={noticeForm.title} 
                        onChange={e => setNoticeForm({...noticeForm, title: e.target.value})}
                        required
                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>내용</label>
                    <textarea 
                        value={noticeForm.content} 
                        onChange={e => setNoticeForm({...noticeForm, content: e.target.value})}
                        required
                        rows="10"
                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                </div>
                <button type="submit" className="btn">등록하기</button>
            </form>
          </div>
      )}

      {activeTab === 'faq' && (
          <div style={{ maxWidth: '600px' }}>
            <h3 style={{ marginBottom: '20px' }}>FAQ 등록</h3>
            <form onSubmit={handleFaqSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>질문 (Question)</label>
                    <input 
                        type="text" 
                        value={faqForm.question} 
                        onChange={e => setFaqForm({...faqForm, question: e.target.value})}
                        required
                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>답변 (Answer)</label>
                    <textarea 
                        value={faqForm.answer} 
                        onChange={e => setFaqForm({...faqForm, answer: e.target.value})}
                        required
                        rows="10"
                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                </div>
                <button type="submit" className="btn">등록하기</button>
            </form>
          </div>
      )}

      {/* Inquiry Modal */}
      {inquiryModalOpen && selectedInquiry && (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
            <div style={{
                backgroundColor: 'white', padding: '30px', borderRadius: '8px', width: '600px', maxHeight: '90vh', overflowY: 'auto',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
                <h3 style={{ marginBottom: '20px' }}>문의 내용</h3>
                <div style={{ marginBottom: '20px', padding: '15px', background: '#f9f9f9', borderRadius: '4px' }}>
                    <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>[{selectedInquiry.title}]</p>
                    <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
                        작성자: {selectedInquiry.authorName} | 작성일: {new Date(selectedInquiry.createdAt).toLocaleString()}
                    </p>
                    <div style={{ whiteSpace: 'pre-wrap' }}>{selectedInquiry.content}</div>
                </div>
                
                <h4 style={{ marginBottom: '10px' }}>답변 작성</h4>
                <textarea 
                    value={answerContent} 
                    onChange={(e) => setAnswerContent(e.target.value)}
                    placeholder="답변을 입력하세요"
                    rows="6"
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '20px' }}
                />

                {selectedInquiry.answer && (
                    <div style={{ marginBottom: '20px', fontSize: '12px', color: '#888' }}>
                        <p>최근 답변자: {selectedInquiry.answererName}</p>
                    </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button 
                        onClick={closeInquiryModal}
                        style={{ padding: '8px 15px', background: '#ddd', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        닫기
                    </button>
                    <button 
                        onClick={handleAnswerSubmit}
                        style={{ padding: '8px 15px', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        답변 등록
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Ban Modal */}
      {banModalOpen && (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '30px',
                borderRadius: '8px',
                width: '400px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
                <h3 style={{ marginBottom: '20px' }}>사용자 정지</h3>
                <p style={{ marginBottom: '15px' }}>대상: {selectedUser?.email}</p>
                
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>정지 기간 (일)</label>
                    <input 
                        type="number" 
                        value={banDays} 
                        onChange={(e) => setBanDays(e.target.value)}
                        min="1"
                        style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>정지 사유</label>
                    <textarea 
                        value={banReason} 
                        onChange={(e) => setBanReason(e.target.value)}
                        placeholder="정지 사유를 입력하세요"
                        rows="3"
                        style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button 
                        onClick={closeBanModal}
                        style={{ padding: '8px 15px', background: '#ddd', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        취소
                    </button>
                    <button 
                        onClick={confirmBanUser}
                        style={{ padding: '8px 15px', background: '#ff9800', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        정지 적용
                    </button>
                </div>
            </div>
        </div>
      )}
      {/* Delivery Modal */}
      {deliveryModalOpen && (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
            <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', width: '400px' }}>
                <h3 style={{ marginBottom: '20px' }}>운송장 등록</h3>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>택배사</label>
                    <select 
                        value={deliveryForm.courierName} 
                        onChange={e => setDeliveryForm({...deliveryForm, courierName: e.target.value})}
                        style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                    >
                        <option value="CJ대한통운">CJ대한통운</option>
                        <option value="우체국택배">우체국택배</option>
                        <option value="한진택배">한진택배</option>
                        <option value="로젠택배">로젠택배</option>
                    </select>
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>운송장 번호</label>
                    <input 
                        type="text" 
                        value={deliveryForm.trackingNumber} 
                        onChange={e => setDeliveryForm({...deliveryForm, trackingNumber: e.target.value})}
                        placeholder="숫자만 입력"
                        style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button onClick={() => setDeliveryModalOpen(false)} style={{ padding: '8px 15px', background: '#ddd', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>취소</button>
                    <button onClick={handleDeliverySubmit} style={{ padding: '8px 15px', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>등록</button>
                </div>
            </div>
        </div>
      )}
    </div>
  )
}

export default AdminPage
