import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import AddressSearchModal from '../components/AddressSearchModal'

function Signup() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phoneNumber: '',
    address: '',
    detailAddress: '',
    privacyAgreed: false,
    identityVerified: false
  })
  const [error, setError] = useState(null)
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [verificationCode, setVerificationCode] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)

  const handleVerifyIdentity = () => {
    if (!formData.phoneNumber.startsWith('010') || !formData.name) {
      toast.error('올바른 이름과 휴대폰 번호를 입력해주세요.')
      return
    }
    // Simulation
    setIsVerifying(true)
    setTimeout(() => {
      toast.success(`인증번호가 발송되었습니다. (테스트용: 123456)`)
      setIsVerifying(false)
    }, 1000)
  }

  const handleConfirmVerification = () => {
    if (verificationCode === '123456') {
      setFormData({ ...formData, identityVerified: true })
      toast.success('본인인증이 완료되었습니다.')
    } else {
      toast.error('인증번호가 일치하지 않습니다.')
    }
  }

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setFormData({
      ...formData,
      [e.target.name]: value
    })
  }

  const handleAddressComplete = (address) => {
      setFormData({
          ...formData,
          address: address
      })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }

    if (!formData.identityVerified) {
      setError('본인인증을 완료해주세요.')
      return
    }

    if (!formData.privacyAgreed) {
      setError('개인정보 수집 및 이용에 동의해야 합니다.')
      return
    }

    try {
      await axios.post('/api/auth/signup', {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        detailAddress: formData.detailAddress,
        privacyAgreed: formData.privacyAgreed
      })
      toast.success('회원가입이 완료되었습니다! 로그인해주세요.')
      navigate('/login')
    } catch (err) {
      toast.error('회원가입 실패: ' + (err.response?.data || '알 수 없는 오류'))
      setError(err.response?.data || '회원가입에 실패했습니다.')
    }
  }

  return (
    <div className="container" style={{ maxWidth: '400px', marginTop: '50px', padding: '40px', background: 'white', borderRadius: '8px', boxShadow: 'var(--shadow)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px', color: 'var(--primary-color)' }}>회원가입</h2>
      {error && <div style={{ color: 'red', marginBottom: '15px', fontSize: '0.9rem' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>이름</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
            required
            placeholder="홍길동"
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>휴대폰 번호 (본인인증)</label>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
              placeholder="01012345678"
              disabled={formData.identityVerified}
            />
            <button
              type="button"
              onClick={handleVerifyIdentity}
              disabled={formData.identityVerified}
              style={{ padding: '10px', background: '#333', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              인증요청
            </button>
          </div>
          {!formData.identityVerified && (
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                placeholder="인증번호 6자리"
              />
              <button
                type="button"
                onClick={handleConfirmVerification}
                style={{ padding: '10px', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                확인
              </button>
            </div>
          )}
          {formData.identityVerified && <div style={{ color: 'green', fontSize: '0.9rem' }}>✓ 본인인증 완료</div>}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>이메일</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
            required
            placeholder="example@test.com"
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>주소</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
              placeholder="주소 검색을 클릭하세요"
              readOnly
            />
            <button
              type="button"
              onClick={() => setShowAddressModal(true)}
              style={{ padding: '10px', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              검색
            </button>
          </div>
          <input
            type="text"
            name="detailAddress"
            value={formData.detailAddress}
            onChange={handleChange}
            placeholder="상세 주소를 입력하세요 (예: 101동 101호)"
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box', marginTop: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>비밀번호</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
            required
            placeholder="••••••••"
          />
        </div>
        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>비밀번호 확인</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
            required
            placeholder="••••••••"
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '10px' }}>
              <input
                type="checkbox"
                name="privacyAgreed"
                checked={formData.privacyAgreed}
                onChange={handleChange}
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '0.9rem' }}>
                [필수] 개인정보 수집 및 이용에 동의합니다. 
                <span 
                    style={{ color: '#999', textDecoration: 'underline', marginLeft: '5px', fontSize: '0.8rem' }}
                    onClick={(e) => {
                        e.preventDefault();
                        alert('수집하는 개인정보 항목: 이메일, 이름, 주소\n보유 기간: 회원 탈퇴 시까지');
                    }}
                >
                    (내용보기)
                </span>
              </span>
            </label>
          </div>

          <button type="submit" className="btn" style={{ width: '100%', padding: '12px' }}>가입하기</button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
        이미 계정이 있으신가요? <a href="/login" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>로그인</a>
      </p>
      {showAddressModal && (
        <AddressSearchModal 
            onClose={() => setShowAddressModal(false)}
            onComplete={handleAddressComplete}
        />
      )}
    </div>
  )
}

export default Signup
