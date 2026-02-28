import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import CountdownTimer from '../components/CountdownTimer'
import AddressSearchModal from '../components/AddressSearchModal'

function Profile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState({ name: '', email: '', address: '' })
  const [favorites, setFavorites] = useState([])
  const [wonAuctions, setWonAuctions] = useState([])
  const [activeTab, setActiveTab] = useState('favorites')
  const [loading, setLoading] = useState(true)
  const [deliveryInfo, setDeliveryInfo] = useState({}) // Store delivery info by auctionId
  const [editForm, setEditForm] = useState({ name: '', address: '', detailAddress: '' })
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (user) {
      fetchProfile()
      fetchFavorites()
      fetchWonAuctions()
    }
  }, [user])

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/api/auth/me')
      setProfile(response.data)
      setEditForm({ 
        name: response.data.name, 
        address: response.data.address || '',
        detailAddress: response.data.detailAddress || ''
      })
    } catch (error) {
      console.error('Failed to fetch profile', error)
    }
  }

  const fetchFavorites = async () => {
    try {
      const response = await axios.get('/api/auctions/favorites')
      const data = response.data
      setFavorites(Array.isArray(data) ? data : [])
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch favorites', error)
      setFavorites([])
      setLoading(false)
    }
  }

  const fetchWonAuctions = async () => {
    try {
      const response = await axios.get('/api/auctions/won')
      const won = Array.isArray(response.data) ? response.data : []
      setWonAuctions(won)
      
      // Fetch delivery info for paid auctions
      won.forEach(async (auction) => {
          if (auction.paid) {
              try {
                  const deliveryRes = await axios.get(`/api/auctions/${auction.id}/delivery`)
                  setDeliveryInfo(prev => ({ ...prev, [auction.id]: deliveryRes.data }))
              } catch (e) {
                  // Ignore if no delivery info yet
              }
          }
      })
    } catch (error) {
      console.error('Failed to fetch won auctions', error)
      setWonAuctions([])
    }
  }

  const handlePayment = async (auctionId) => {
    if (!window.confirm('등록된 카드로 결제하시겠습니까? (시뮬레이션)')) return

    try {
      await axios.post('/api/payments', {
        auctionId: auctionId,
        method: 'CARD'
      })
      alert('결제가 완료되었습니다!')
      fetchWonAuctions() // Refresh list
    } catch (error) {
      console.error('Payment failed', error)
      alert('결제 처리에 실패했습니다.')
    }
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.put('/api/auth/me', editForm)
      setProfile(response.data)
      setIsEditing(false)
      alert('프로필이 수정되었습니다.')
    } catch (error) {
      console.error('Failed to update profile', error)
      alert('프로필 수정에 실패했습니다.')
    }
  }

  const handleAddressComplete = (address) => {
    setEditForm({
        ...editForm,
        address: address
    })
  }

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return url;
  }

  if (!user) return <div className="container">로그인이 필요합니다.</div>
  if (loading) return <div className="container">Loading...</div>

  return (
    <div className="container" style={{ marginTop: '30px' }}>
      <h1 style={{ borderBottom: '2px solid var(--primary-color)', paddingBottom: '10px', marginBottom: '30px' }}>
        {profile.name}님의 프로필
      </h1>

      <div style={{ marginBottom: '40px', background: 'white', padding: '20px', borderRadius: '8px', boxShadow: 'var(--shadow)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0 }}>내 정보</h3>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', fontWeight: 'bold' }}
          >
            {isEditing ? '취소' : '수정'}
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleUpdateProfile}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#666' }}>이름</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#666' }}>주소</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                    type="text"
                    value={editForm.address}
                    readOnly
                    onClick={() => setShowAddressModal(true)}
                    placeholder="주소 검색을 클릭하세요"
                    style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ddd', cursor: 'pointer', backgroundColor: '#f9f9f9' }}
                />
                <button 
                    type="button" 
                    onClick={() => setShowAddressModal(true)}
                    style={{ padding: '0 15px', background: '#eee', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}
                >
                     검색
                 </button>
               </div>
               <input
                 type="text"
                 value={editForm.detailAddress}
                 onChange={(e) => setEditForm({...editForm, detailAddress: e.target.value})}
                 placeholder="상세 주소를 입력하세요"
                 style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', marginTop: '5px' }}
               />
             </div>
             <button type="submit" className="btn" style={{ padding: '8px 20px' }}>저장</button>
          </form>
        ) : (
          <>
            <p><strong>이메일:</strong> {profile.email}</p>
            <p><strong>이름:</strong> {profile.name}</p>
            <p>
              <strong>주소:</strong> {profile.address || '주소가 등록되지 않았습니다.'}
              {profile.detailAddress && ` ${profile.detailAddress}`}
            </p>
          </>
        )}
      </div>

      <div style={{ marginBottom: '20px', borderBottom: '1px solid #ddd' }}>
        <button 
            onClick={() => setActiveTab('favorites')}
            style={{ 
                padding: '10px 20px', 
                background: 'none', 
                border: 'none', 
                borderBottom: activeTab === 'favorites' ? '2px solid var(--primary-color)' : 'none',
                fontWeight: activeTab === 'favorites' ? 'bold' : 'normal',
                cursor: 'pointer',
                fontSize: '1rem'
            }}
        >
            즐겨찾기한 경매
        </button>
        <button 
            onClick={() => setActiveTab('won')}
            style={{ 
                padding: '10px 20px', 
                background: 'none', 
                border: 'none', 
                borderBottom: activeTab === 'won' ? '2px solid var(--primary-color)' : 'none',
                fontWeight: activeTab === 'won' ? 'bold' : 'normal',
                cursor: 'pointer',
                fontSize: '1rem'
            }}
        >
            낙찰 내역 (Winning Bids)
        </button>
      </div>
      
      {activeTab === 'favorites' && (
          <>
            {favorites.length === 0 ? (
                <p style={{ color: '#666', padding: '20px', background: '#f9f9f9', borderRadius: '8px' }}>즐겨찾기한 경매가 없습니다.</p>
            ) : (
                <div className="grid">
                {favorites.map((auction) => (
                    <div key={auction.id} className="card">
                    <Link to={`/auctions/${auction.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                        <div className="card-image" style={{ 
                        backgroundImage: auction.imageUrl ? `url(${getImageUrl(auction.imageUrl)})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                        }}>
                        {!auction.imageUrl && '🏺'}
                        </div>
                    </Link>
                    <div className="card-content">
                        <Link to={`/auctions/${auction.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <h3 className="card-title">{auction.itemTitle}</h3>
                        </Link>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <span className={`status-badge ${auction.status === 'RUNNING' ? 'status-running' : (auction.status === 'NO_BIDS' ? 'status-ended' : 'status-ended')}`} style={{ backgroundColor: auction.status === 'NO_BIDS' ? '#999' : undefined }}>
                            {auction.status === 'RUNNING' ? 'RUNNING' : (auction.status === 'NO_BIDS' ? '유찰' : 'ENDED')}
                        </span>
                        <small style={{ color: '#999' }}>ID: {auction.id}</small>
                        </div>
                        
                        <div className="card-price">
                        현재가: {auction.currentPrice.toLocaleString()} KRW
                        </div>
                        
                        <div className="card-meta">
                        <div style={{textAlign: 'right', width: '100%'}}>
                            <small style={{display: 'block', color: '#666'}}>남은 시간</small>
                            <CountdownTimer targetDate={auction.endAt} />
                        </div>
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            )}
          </>
      )}

      {activeTab === 'won' && (
          <>
            {wonAuctions.length === 0 ? (
                <p style={{ color: '#666', padding: '20px', background: '#f9f9f9', borderRadius: '8px' }}>낙찰받은 경매 내역이 없습니다.</p>
            ) : (
                <div className="grid">
                {wonAuctions.map((auction) => (
                    <div key={auction.id} className="card" style={{ border: '1px solid var(--accent-color)' }}>
                    <div style={{ background: 'var(--accent-color)', color: 'white', padding: '5px 10px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                        🎉 낙찰 성공!
                    </div>
                    <Link to={`/auctions/${auction.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                        <div className="card-image" style={{ 
                        backgroundImage: auction.imageUrl ? `url(${getImageUrl(auction.imageUrl)})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                        }}>
                        {!auction.imageUrl && '🏺'}
                        </div>
                    </Link>
                    <div className="card-content">
                        <Link to={`/auctions/${auction.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <h3 className="card-title">{auction.itemTitle}</h3>
                        </Link>
                        
                        <div className="card-price" style={{ color: '#d32f2f' }}>
                        낙찰가: {auction.currentPrice.toLocaleString()} KRW
                        </div>
                        
                        {auction.paid ? (
                            <div style={{ marginTop: '15px' }}>
                                {auction.tradeCompleted ? (
                                  <button className="btn" style={{ width: '100%', background: '#4CAF50', cursor: 'default', marginBottom: '10px' }} disabled>
                                      거래 완료
                                  </button>
                                ) : (
                                  <button
                                    className="btn"
                                    style={{ width: '100%', background: '#4CAF50', marginBottom: '10px' }}
                                    onClick={async () => {
                                      if (!window.confirm('이 거래를 완료 처리하시겠습니까?')) return
                                      try {
                                        await axios.post(`/api/payments/confirm/${auction.id}`)
                                        alert('거래가 완료 처리되었습니다.')
                                        fetchWonAuctions()
                                      } catch (e) {
                                        alert('거래 완료 처리에 실패했습니다.')
                                      }
                                    }}
                                  >
                                      거래 완료
                                  </button>
                                )}
                                {deliveryInfo[auction.id] ? (
                                    <div style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px', fontSize: '0.9rem' }}>
                                        <p style={{ margin: '0 0 5px 0', fontWeight: 'bold', color: '#333' }}>🚚 배송 중</p>
                                        <p style={{ margin: 0 }}>{deliveryInfo[auction.id].courierName}</p>
                                        <p style={{ margin: 0, color: 'var(--primary-color)' }}>{deliveryInfo[auction.id].trackingNumber}</p>
                                    </div>
                                ) : (
                                    <div style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px', fontSize: '0.9rem', color: '#666' }}>
                                        배송 준비 중
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button className="btn" style={{ marginTop: '15px', width: '100%' }} onClick={() => handlePayment(auction.id)}>
                                결제하기
                            </button>
                        )}
                    </div>
                    </div>
                ))}
                </div>
            )}
          </>
      )}

      {showAddressModal && (
        <AddressSearchModal 
            onClose={() => setShowAddressModal(false)}
            onComplete={handleAddressComplete}
        />
      )}
    </div>
  )
}

export default Profile
