import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import '../App.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('/api/auth/login', { email, password })
      
      const { token, name, role, id } = response.data
      login(token, name, role, id)
      toast.success('로그인 되었습니다!')
      navigate('/')
    } catch (error) {
      toast.error('로그인 실패: 이메일과 비밀번호를 확인해주세요.')
      setError('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.')
    }
  }

  return (
    <div className="container" style={{ maxWidth: '400px', marginTop: '50px', padding: '40px', background: 'white', borderRadius: '8px', boxShadow: 'var(--shadow)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px', color: 'var(--primary-color)' }}>로그인</h2>
      {error && <div style={{ color: 'red', marginBottom: '15px', fontSize: '0.9rem' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>이메일</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
            required
            placeholder="example@test.com"
          />
        </div>
        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
            required
            placeholder="••••••••"
          />
        </div>
        <button type="submit" className="btn">로그인</button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
        <a href="/find-id-password" style={{ color: '#666', marginRight: '15px', textDecoration: 'none' }}>아이디/비밀번호 찾기</a>
        <span style={{ margin: '0 10px', color: '#ddd' }}>|</span>
        계정이 없으신가요? <a href="/signup" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>회원가입</a>
      </p>
    </div>
  )
}

export default Login
