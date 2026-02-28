import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import toast from 'react-hot-toast'
import CountdownTimer from '../components/CountdownTimer'
import BidModal from '../components/BidModal'
import { useAuth } from '../context/AuthContext'
import '../App.css'

function AuctionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [auction, setAuction] = useState(null)
  const [bids, setBids] = useState([])
  const [loading, setLoading] = useState(true)
  const [showBidModal, setShowBidModal] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [viewerCount, setViewerCount] = useState(Math.floor(Math.random() * 20) + 5) // Initial random viewers

  useEffect(() => {
    // Simulate real-time viewer count fluctuation
    const interval = setInterval(() => {
        setViewerCount(prev => {
            const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
            return Math.max(5, prev + change); // Minimum 5 viewers
        });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchAuction()
    fetchBids()
    if (user) {
      checkFavorite()
    }

    // Save to Recent Viewed
    const saveToRecent = () => {
      try {
        const recent = JSON.parse(localStorage.getItem('recentViewed') || '[]');
        // Remove duplicates of current item
        const filtered = recent.filter(item => item.id !== id);
        // Add current item to front
        if (auction) {
            const newItem = {
                id: auction.id,
                title: auction.itemTitle,
                price: auction.currentPrice,
                imageUrl: auction.imageUrl
            };
            const updated = [newItem, ...filtered].slice(0, 5); // Keep max 5
            localStorage.setItem('recentViewed', JSON.stringify(updated));
        }
      } catch (e) {
        console.error(e);
      }
    };

    if (auction) {
        saveToRecent();
    }

    // WebSocket Connection
    const socket = new SockJS('http://localhost:8484/ws')
    const stompClient = Stomp.over(socket)
    stompClient.debug = null // Disable debug logs

    stompClient.connect({}, () => {
      stompClient.subscribe(`/topic/auctions/${id}`, (message) => {
        const notification = JSON.parse(message.body)
        
        // Update Auction State (Price, BidCount)
        setAuction(prev => {
            if (!prev) return prev
            return {
                ...prev,
                currentPrice: notification.currentPrice,
                bidCount: notification.bidCount
            }
        })

        // Update Bids State (Prepend new bid)
        setBids(prev => [notification.newBid, ...prev])
      })
    }, (error) => {
        console.error('WebSocket Error:', error)
    })

    return () => {
      if (stompClient && stompClient.connected) {
          try {
              stompClient.disconnect()
          } catch (e) {
              console.warn('Failed to disconnect cleanly', e)
          }
      }
    }
  }, [id, user])

  const fetchAuction = async () => {
    try {
      const response = await axios.get(`/api/auctions/${id}`)
      setAuction(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch auction', error)
      setLoading(false)
    }
  }

  const fetchBids = async () => {
    try {
      const response = await axios.get(`/api/auctions/${id}/bids`)
      setBids(response.data)
    } catch (error) {
      console.error('Failed to fetch bids', error)
    }
  }

  const checkFavorite = async () => {
    try {
      const response = await axios.get(`/api/auctions/${id}/favorite`)
      setIsFavorite(response.data)
    } catch (error) {
      console.error('Failed to check favorite', error)
    }
  }

  const toggleFavorite = async () => {
    if (!user) {
      toast('로그인이 필요한 서비스입니다.')
      navigate('/login')
      return
    }
    try {
      const response = await axios.post(`/api/auctions/${id}/favorite`)
      setIsFavorite(response.data)
      if (response.data) {
        toast.success('즐겨찾기에 추가되었습니다.')
      } else {
        toast('즐겨찾기에서 해제되었습니다.')
      }
    } catch (error) {
      console.error('Failed to toggle favorite', error)
    }
  }

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return url;
  }

  const handleBidClick = () => {
    if (!user) {
      toast('로그인이 필요한 서비스입니다.')
      navigate('/login')
      return
    }
    setShowBidModal(true)
  }

  const handleShare = async () => {
    try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('링크가 복사되었습니다!')
    } catch (err) {
        toast.error('링크 복사에 실패했습니다.')
    }
  }

  if (loading) return <div className="container" style={{padding: '50px', textAlign: 'center'}}>Loading...</div>
  if (!auction) return <div className="container" style={{padding: '50px', textAlign: 'center'}}>경매 정보를 찾을 수 없습니다.</div>

  return (
    <div className="container" style={{ marginTop: '30px' }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: '20px', background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>&larr; 목록으로 돌아가기</button>
      
      <div className="auction-detail-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
        <div>
          {/* 메인 이미지 */}
          <div className="detail-image" style={{
            height: '400px', backgroundColor: '#efebe9', borderRadius: '8px',
            overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            {auction.imageUrls && auction.imageUrls.length > 0 ? (
              <img src={auction.imageUrls[activeImageIndex]} alt={auction.itemTitle}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : auction.imageUrl ? (
              <img src={getImageUrl(auction.imageUrl)} alt={auction.itemTitle}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : (
              <span style={{ fontSize: '5rem' }}>🏺</span>
            )}
          </div>

          {/* 썸네일 */}
          {auction.imageUrls && auction.imageUrls.length > 1 && (
            <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
              {auction.imageUrls.map((url, index) => (
                <img key={index} src={url} alt={`이미지 ${index + 1}`}
                  onClick={() => setActiveImageIndex(index)}
                  style={{
                    width: '70px', height: '70px', objectFit: 'cover', borderRadius: '4px',
                    cursor: 'pointer',
                    border: activeImageIndex === index ? '2px solid var(--primary-color)' : '2px solid #ddd',
                    opacity: activeImageIndex === index ? 1 : 0.7
                  }} />
              ))}
            </div>
          )}
        </div>

        <div className="auction-info-section" style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <span className={`status-badge ${auction.status === 'RUNNING' ? 'status-running' : (auction.status === 'NO_BIDS' ? 'status-ended' : 'status-ended')}`} style={{ backgroundColor: auction.status === 'NO_BIDS' ? '#999' : undefined }}>
              {auction.status === 'RUNNING' ? 'RUNNING' : (auction.status === 'NO_BIDS' ? '유찰' : 'ENDED')}
            </span>
            <small style={{ color: '#999' }}>ID: {auction.id}</small>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem', color: '#e53935', fontWeight: 'bold' }}>
                <span className="pulse-dot"></span>
                {viewerCount}명이 보고 있습니다
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h1 style={{ margin: 0, fontSize: '2rem', color: 'var(--text-color)' }}>{auction.itemTitle}</h1>
            <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={handleShare}
                  style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#666' }}
                  title="공유하기"
                >
                  🔗
                </button>
                <button 
                  onClick={toggleFavorite}
              style={{ 
                background: 'none', 
                border: 'none', 
                fontSize: '2rem', 
                cursor: 'pointer', 
                color: isFavorite ? '#ff4081' : '#ccc',
                transition: 'color 0.2s'
              }}
              title={isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
            >
              {isFavorite ? '♥' : '♡'}
            </button>
                <button
                  onClick={async () => {
                    if (!user) {
                      toast('로그인이 필요한 서비스입니다.')
                      navigate('/login')
                      return
                    }
                    const reason = window.prompt('신고 사유를 입력해 주세요.')
                    if (!reason) return
                    try {
                      await axios.post('/api/reports', { auctionId: id, reason })
                      toast.success('신고가 접수되었습니다.')
                    } catch (e) {
                      toast.error('신고 접수에 실패했습니다.')
                    }
                  }}
                  style={{ background: 'none', border: '1px solid #ccc', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', fontSize: '0.85rem', color: '#666' }}
                >
                  신고
                </button>
            </div>
          </div>
          
          <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: 'var(--shadow)', marginBottom: '30px' }}>
            <div style={{ marginBottom: '15px' }}>
              <span style={{ color: '#666', display: 'block', marginBottom: '5px' }}>현재 입찰가</span>
              <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                {auction.currentPrice.toLocaleString()} KRW
              </span>
              <span style={{ fontSize: '0.9rem', color: '#666', fontWeight: 'normal', marginLeft: '10px' }}>
                (최소 입찰 단위: {auction.minBidUnit.toLocaleString()} KRW)
              </span>
              
              <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '4px', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ color: '#666' }}>예상 낙찰 수수료 (10%)</span>
                    <span>{(auction.currentPrice * 0.1).toLocaleString()} KRW</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #ddd', paddingTop: '5px', fontWeight: 'bold' }}>
                    <span>총 결제 예상 금액</span>
                    <span style={{ color: '#d32f2f' }}>{(auction.currentPrice * 1.1).toLocaleString()} KRW</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
              <div>
                <span style={{ color: '#666', fontSize: '0.9rem' }}>판매자</span>
                <div style={{ fontWeight: '500' }}>{auction.sellerName}</div>
              </div>
              <div>
                <span style={{ color: '#666', fontSize: '0.9rem' }}>총 입찰 수</span>
                <div style={{ fontWeight: '500' }}>{auction.bidCount}회</div>
              </div>
              <div>
                <span style={{ color: '#666', fontSize: '0.9rem' }}>시작 가격</span>
                <div style={{ fontWeight: '500' }}>{auction.startPrice.toLocaleString()} KRW</div>
              </div>
              <div>
                <span style={{ color: '#666', fontSize: '0.9rem' }}>남은 시간</span>
                <div style={{ fontWeight: '500' }}>
                  <CountdownTimer targetDate={auction.endAt} />
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ borderBottom: '2px solid #ddd', paddingBottom: '10px', marginBottom: '15px' }}>상품 설명</h3>
            <p style={{ lineHeight: '1.6', whiteSpace: 'pre-line' }}>{auction.description || '상세 설명이 없습니다.'}</p>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ borderBottom: '2px solid #ddd', paddingBottom: '10px', marginBottom: '15px' }}>입찰 기록</h3>
            {bids.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #ddd', color: '#666' }}>
                    <th style={{ padding: '10px' }}>입찰자</th>
                    <th style={{ padding: '10px' }}>입찰가</th>
                    <th style={{ padding: '10px' }}>입찰 시간</th>
                  </tr>
                </thead>
                <tbody>
                  {bids.map((bid) => (
                    <tr key={bid.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '10px' }}>{bid.bidderName}</td>
                      <td style={{ padding: '10px', fontWeight: 'bold' }}>{bid.bidAmount.toLocaleString()} KRW</td>
                      <td style={{ padding: '10px', color: '#888' }}>
                        {new Date(bid.bidTime).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ color: '#888', textAlign: 'center', padding: '20px' }}>아직 입찰 기록이 없습니다.</p>
            )}
          </div>

          {auction.status === 'RUNNING' && (
            <button 
              className="btn" 
              onClick={handleBidClick}
              style={{ padding: '15px', fontSize: '1.2rem' }}
            >
              입찰하기
            </button>
          )}
        </div>
      </div>

      {showBidModal && (
        <BidModal 
          auction={auction} 
          onClose={() => setShowBidModal(false)} 
          onBidSuccess={() => {
            fetchAuction()
            fetchBids()
            setShowBidModal(false)
          }}
        />
      )}
    </div>
  )
}

export default AuctionDetail
