import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import '../App.css'

const CATEGORIES = ['도자기', '회화', '조각', '공예', '고가구', '서예', '사진', '기타']

function AuctionRegister() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '도자기',
    startPrice: '',
    durationMinutes: '60',
    minBidUnit: '1000'
  })
  const [imageFiles, setImageFiles] = useState([])
  const [previews, setPreviews] = useState([])
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 5) {
      toast.error('이미지는 최대 5장까지 등록 가능합니다.')
      return
    }
    setImageFiles(files)
    const newPreviews = files.map(file => URL.createObjectURL(file))
    setPreviews(prev => { prev.forEach(url => URL.revokeObjectURL(url)); return newPreviews })
  }

  const removeImage = (index) => {
    URL.revokeObjectURL(previews[index])
    setImageFiles(imageFiles.filter((_, i) => i !== index))
    setPreviews(previews.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const form = new FormData()
      form.append('request', new Blob([JSON.stringify({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        startPrice: parseInt(formData.startPrice),
        minBidUnit: parseInt(formData.minBidUnit),
        durationMinutes: parseInt(formData.durationMinutes)
      })], { type: 'application/json' }))

      imageFiles.forEach(file => form.append('images', file))

      await axios.post('/api/auctions', form, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      toast.success('경매가 등록되었습니다!')
      previews.forEach(url => URL.revokeObjectURL(url))
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
          {/* 상품명 */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>상품명</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange}
              placeholder="예: 조선 백자 달항아리" required
              style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
          </div>

          {/* 카테고리 */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>카테고리</label>
            <select name="category" value={formData.category} onChange={handleChange}
              style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }}>
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          {/* 상품 설명 */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>상품 설명</label>
            <textarea name="description" value={formData.description} onChange={handleChange}
              placeholder="상품에 대한 상세한 설명을 적어주세요." required rows="5"
              style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box', resize: 'vertical' }} />
          </div>

          {/* 이미지 업로드 */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              상품 이미지
              <span style={{ fontWeight: 'normal', color: '#888', fontSize: '0.85rem', marginLeft: '6px' }}>
                (최대 5장, 첫 번째 사진이 대표 이미지)
              </span>
            </label>
            <input type="file" accept="image/*" multiple onChange={handleImageChange}
              style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }} />

            {/* 미리보기 */}
            {previews.length > 0 && (
              <div style={{ display: 'flex', gap: '10px', marginTop: '12px', flexWrap: 'wrap' }}>
                {previews.map((src, index) => (
                  <div key={index} style={{ position: 'relative' }}>
                    <img src={src} alt={`미리보기 ${index + 1}`}
                      style={{
                        width: '100px', height: '100px', objectFit: 'cover', borderRadius: '6px',
                        border: index === 0 ? '2px solid var(--primary-color)' : '2px solid #ddd'
                      }} />
                    {index === 0 && (
                      <span style={{
                        position: 'absolute', bottom: '4px', left: '4px',
                        background: 'var(--primary-color)', color: 'white',
                        fontSize: '0.65rem', padding: '2px 5px', borderRadius: '3px'
                      }}>대표</span>
                    )}
                    <button type="button" onClick={() => removeImage(index)}
                      style={{
                        position: 'absolute', top: '-6px', right: '-6px',
                        width: '20px', height: '20px', background: '#e53935',
                        color: 'white', border: 'none', borderRadius: '50%',
                        cursor: 'pointer', fontSize: '13px', lineHeight: '1',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 시작 가격 */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>시작 가격 (원)</label>
            <input type="number" name="startPrice" value={formData.startPrice} onChange={handleChange}
              placeholder="10000" required min="1000" step="1000"
              style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
          </div>

          {/* 최소 입찰 단위 */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>최소 입찰 단위 (원)</label>
            <select name="minBidUnit" value={formData.minBidUnit} onChange={handleChange}
              style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }}>
              <option value="1000">1,000원</option>
              <option value="5000">5,000원</option>
              <option value="10000">10,000원</option>
              <option value="50000">50,000원</option>
              <option value="100000">100,000원</option>
            </select>
          </div>

          {/* 경매 진행 시간 */}
          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>경매 진행 시간</label>
            <select name="durationMinutes" value={formData.durationMinutes} onChange={handleChange}
              style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }}>
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

          <button type="submit" className="btn" disabled={loading}
            style={{ width: '100%', padding: '14px', opacity: loading ? 0.7 : 1, fontSize: '1rem' }}>
            {loading ? '등록 중...' : '경매 등록하기'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AuctionRegister
