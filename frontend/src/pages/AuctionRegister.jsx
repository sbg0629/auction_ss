import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import '../App.css'

function AuctionRegister() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startPrice: '',
    durationMinutes: '60', // Default 1 hour
    minBidUnit: '1000'
  })
  const [imageFile, setImageFile] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const form = new FormData()
      form.append('request', new Blob([JSON.stringify({
        title: formData.title,
        description: formData.description,
        startPrice: parseInt(formData.startPrice),
        minBidUnit: parseInt(formData.minBidUnit),
        durationMinutes: parseInt(formData.durationMinutes)
      })], { type: 'application/json' }))
      
      if (imageFile) {
        form.append('image', imageFile)
      }

      await axios.post('/api/auctions', form, {
        headers: {
          // 'Content-Type': 'multipart/form-data', // Let browser set this automatically with boundary
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      toast.success('경매가 등록되었습니다!')
      navigate('/')
    } catch (error) {
      console.error('Failed to register auction', error)
      toast.error('경매 등록에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container" style={{ marginTop: '30px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', background: 'white', padding: '30px', borderRadius: '8px', boxShadow: 'var(--shadow)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: 'var(--primary-color)' }}>경매 물품 등록</h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>상품명</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="예: 조선 백자 달항아리"
              required
              style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>상품 설명</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="상품에 대한 상세한 설명을 적어주세요."
              required
              rows="5"
              style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box', resize: 'vertical' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>상품 이미지</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }}
            />
            <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '5px' }}>* 이미지를 선택해주세요.</p>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>시작 가격 (원)</label>
            <input
              type="number"
              name="startPrice"
              value={formData.startPrice}
              onChange={handleChange}
              placeholder="10000"
              required
              min="1000"
              step="1000"
              style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>최소 입찰 단위 (원)</label>
            <select
              name="minBidUnit"
              value={formData.minBidUnit}
              onChange={handleChange}
              style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }}
            >
              <option value="1000">1,000원</option>
              <option value="5000">5,000원</option>
              <option value="10000">10,000원</option>
              <option value="50000">50,000원</option>
              <option value="100000">100,000원</option>
            </select>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>경매 진행 시간</label>
            <select
              name="durationMinutes"
              value={formData.durationMinutes}
              onChange={handleChange}
              style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }}
            >
              <option value="10">10분 (테스트용)</option>
              <option value="30">30분</option>
              <option value="60">1시간</option>
              <option value="180">3시간</option>
              <option value="360">6시간</option>
              <option value="1440">24시간 (1일)</option>
              <option value="4320">3일</option>
              <option value="10080">7일</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="btn" 
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? '등록 중...' : '경매 등록하기'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AuctionRegister
