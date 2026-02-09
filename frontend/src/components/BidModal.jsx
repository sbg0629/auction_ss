import { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

const BidModal = ({ auction, onClose, onBidSuccess }) => {
  const [bidAmount, setBidAmount] = useState(auction.currentPrice + auction.minBidUnit)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const minBid = auction.currentPrice + auction.minBidUnit

  const btnStyle = {
    padding: '5px 8px',
    fontSize: '0.8rem',
    cursor: 'pointer',
    background: '#eee',
    border: '1px solid #ccc',
    borderRadius: '4px'
  }

  const adjustBid = (amount) => {
    const newAmount = parseInt(bidAmount) + amount
    if (newAmount >= minBid) {
      setBidAmount(newAmount)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await axios.post(`/api/auctions/${auction.id}/bids`, {
        amount: parseInt(bidAmount)
      })
      toast.success('입찰에 성공했습니다!')
      onBidSuccess()
      onClose()
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || '입찰에 실패했습니다.')
      setError(err.response?.data?.message || '입찰에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose} style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{
        backgroundColor: 'white', padding: '30px', borderRadius: '8px', width: '90%', maxWidth: '400px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '15px' }}>입찰하기</h3>
        <p style={{ marginBottom: '10px' }}>현재가: <strong>{auction.currentPrice.toLocaleString()} KRW</strong></p>
        <p style={{ marginBottom: '20px', color: '#666', fontSize: '0.9rem' }}>
            최소 입찰 단위는 <strong>{auction.minBidUnit.toLocaleString()} KRW</strong>입니다.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>입찰 금액</label>
            
            {/* 금액 조절 버튼 그룹 */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '5px', marginBottom: '10px' }}>
                <button type="button" onClick={() => adjustBid(-1000000)} style={btnStyle}>-100만</button>
                <button type="button" onClick={() => adjustBid(-100000)} style={btnStyle}>-10만</button>
                <button type="button" onClick={() => adjustBid(-50000)} style={btnStyle}>-5만</button>
                <div style={{ width: '10px' }}></div>
                <button type="button" onClick={() => adjustBid(50000)} style={btnStyle}>+5만</button>
                <button type="button" onClick={() => adjustBid(100000)} style={btnStyle}>+10만</button>
                <button type="button" onClick={() => adjustBid(1000000)} style={btnStyle}>+100만</button>
            </div>

            <input
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              min={minBid}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '1.1rem', fontWeight: 'bold', boxSizing: 'border-box', textAlign: 'center' }}
            />
            {error && <p style={{ color: 'red', fontSize: '0.9rem', marginTop: '5px' }}>{error}</p>}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: '12px', background: '#ccc', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>취소</button>
            <button type="submit" disabled={loading} style={{ flex: 1, padding: '12px', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', opacity: loading ? 0.7 : 1 }}>
              {loading ? '처리중...' : '입찰하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BidModal
