import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import CountdownTimer from '../components/CountdownTimer'
import BidModal from '../components/BidModal'
import { useAuth } from '../context/AuthContext'
import '../App.css'

function AuctionList() {
  const [auctions, setAuctions] = useState([])
  const [selectedAuction, setSelectedAuction] = useState(null)
  const { user } = useAuth()
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const pageSize = 15 // 3x5 grid

  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const keyword = searchParams.get('keyword')

  const [statusFilter, setStatusFilter] = useState('RUNNING')
  const [categoryFilter, setCategoryFilter] = useState('')

  const CATEGORIES = ['도자기', '회화', '조각', '공예', '고가구', '서예', '사진', '기타']

  useEffect(() => {
    setPage(0)
  }, [keyword, statusFilter, categoryFilter])

  useEffect(() => {
    fetchAuctions(page, statusFilter, keyword, categoryFilter)
  }, [page, statusFilter, keyword, categoryFilter])

  const getImageUrl = (url) => {
      if (!url) return null;
      if (url.startsWith('http')) return url;
      return url;
  }

  const fetchAuctions = async (pageNumber, status, searchKeyword, category) => {
    try {
      let url = `/api/auctions?page=${pageNumber}&size=${pageSize}&sort=id,desc`
      if (status) url += `&status=${status}`
      if (searchKeyword) url += `&keyword=${encodeURIComponent(searchKeyword)}`
      if (category) url += `&category=${encodeURIComponent(category)}`
      const response = await axios.get(url)
      setAuctions(response.data.content)
      setTotalPages(response.data.totalPages)
    } catch (error) {
      console.error('Failed to fetch auctions', error)
    }
  }

  const handleBidClick = (auction) => {
    if (!user) {
      alert('로그인이 필요한 서비스입니다.')
      window.location.href = '/login'
      return
    }
    if (auction.status !== 'RUNNING') {
        alert('진행 중인 경매가 아닙니다.')
        return
    }
    setSelectedAuction(auction)
  }

  return (
    <div className="container" style={{ marginTop: '30px' }}>
      <h2 style={{ marginBottom: '20px', color: 'var(--primary-color)' }}>경매 목록</h2>
      
      {/* 상태 탭 */}
      <div style={{ marginBottom: '20px', borderBottom: '1px solid #ddd' }}>
        <button onClick={() => { setStatusFilter('RUNNING'); setPage(0); }}
          style={{ padding: '15px 30px', background: 'none', border: 'none',
            borderBottom: statusFilter === 'RUNNING' ? '3px solid var(--primary-color)' : '3px solid transparent',
            fontWeight: statusFilter === 'RUNNING' ? 'bold' : 'normal',
            color: statusFilter === 'RUNNING' ? 'var(--primary-color)' : '#666',
            cursor: 'pointer', fontSize: '1.1rem', transition: 'all 0.3s' }}>
          진행중인 경매
        </button>
        <button onClick={() => { setStatusFilter('ENDED'); setPage(0); }}
          style={{ padding: '15px 30px', background: 'none', border: 'none',
            borderBottom: statusFilter === 'ENDED' ? '3px solid var(--primary-color)' : '3px solid transparent',
            fontWeight: statusFilter === 'ENDED' ? 'bold' : 'normal',
            color: statusFilter === 'ENDED' ? 'var(--primary-color)' : '#666',
            cursor: 'pointer', fontSize: '1.1rem', transition: 'all 0.3s' }}>
          종료된 경매
        </button>
      </div>

      {/* 카테고리 필터 */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '25px' }}>
        <button onClick={() => { setCategoryFilter(''); setPage(0); }}
          style={{ padding: '6px 14px', borderRadius: '20px', border: '1px solid #ddd', cursor: 'pointer',
            background: categoryFilter === '' ? 'var(--primary-color)' : 'white',
            color: categoryFilter === '' ? 'white' : '#333', fontSize: '0.85rem' }}>
          전체
        </button>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => { setCategoryFilter(cat); setPage(0); }}
            style={{ padding: '6px 14px', borderRadius: '20px', border: '1px solid #ddd', cursor: 'pointer',
              background: categoryFilter === cat ? 'var(--primary-color)' : 'white',
              color: categoryFilter === cat ? 'white' : '#333', fontSize: '0.85rem' }}>
            {cat}
          </button>
        ))}
      </div>

      <div className="grid">
        {auctions.length === 0 ? (
          <p style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px' }}>등록된 경매가 없습니다.</p>
        ) : (
          <>
            {auctions.map((auction) => (
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

                  <div style={{ marginBottom: '10px', fontSize: '14px', color: '#555' }}>
                    <p>판매자: {auction.sellerName}</p>
                    <p>입찰 수: {auction.bidCount}회</p>
                  </div>
                  
                  <div className="card-meta">
                    <span>시작가: {auction.startPrice.toLocaleString()}</span>
                    <div style={{textAlign: 'right'}}>
                      <small style={{display: 'block', color: '#666'}}>남은 시간</small>
                      <CountdownTimer targetDate={auction.endAt} />
                    </div>
                  </div>
                  
                  {auction.status === 'RUNNING' && (
                    <button className="btn" onClick={() => handleBidClick(auction)}>입찰하기</button>
                  )}
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Pagination */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '30px', marginBottom: '50px' }}>
        <button 
            disabled={page === 0}
            onClick={() => setPage(p => Math.max(0, p - 1))}
            className="btn"
            style={{ background: page === 0 ? '#ddd' : 'var(--primary-color)', padding: '10px 20px' }}
        >
            이전
        </button>
        <span style={{ display: 'flex', alignItems: 'center', fontSize: '1.2rem' }}>
            {page + 1} / {totalPages || 1}
        </span>
        <button 
            disabled={page >= totalPages - 1}
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            className="btn"
            style={{ background: page >= totalPages - 1 ? '#ddd' : 'var(--primary-color)', padding: '10px 20px' }}
        >
            다음
        </button>
      </div>

      {selectedAuction && (
        <BidModal 
          auction={selectedAuction} 
          onClose={() => setSelectedAuction(null)} 
          onBidSuccess={() => {
            fetchAuctions(page, statusFilter, keyword, categoryFilter)
            setSelectedAuction(null)
          }}
        />
      )}
    </div>
  )
}

export default AuctionList
