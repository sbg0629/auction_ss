import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom'
import { useAuth, AuthProvider } from './context/AuthContext'
import Home from './pages/Home'
import AuctionList from './pages/AuctionList'
import Login from './pages/Login'
import Signup from './pages/Signup'
import FindIdPassword from './pages/FindIdPassword'
import AuctionRegister from './pages/AuctionRegister'
import Profile from './pages/Profile'
import AdminPage from './pages/AdminPage'
import AdminRevenuePage from './pages/AdminRevenuePage'
import AuctionDetail from './pages/AuctionDetail'
import Notice from './pages/support/Notice'
import Faq from './pages/support/Faq'
import Inquiry from './pages/support/Inquiry'
import TermsOfService from './pages/policy/TermsOfService'
import PrivacyPolicy from './pages/policy/PrivacyPolicy'
import YouthPolicy from './pages/policy/YouthPolicy'
import Location from './pages/company/Location'
import SessionTimer from './components/SessionTimer'
import NotificationBell from './components/NotificationBell'
import { Toaster } from 'react-hot-toast'
import ChatWidget from './components/ChatWidget'
import Footer from './components/Footer'
import Logo from './components/Logo'
import './App.css'

// Navigation Component to handle navigation logic (useNavigate can only be used inside Router)
function Navigation() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
    setIsMenuOpen(false)
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
    if (!isMenuOpen) setIsSearchOpen(true) // Open search when menu opens on mobile
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (keyword.trim()) {
      navigate(`/auctions?keyword=${encodeURIComponent(keyword)}`)
      setKeyword('')
      setIsMenuOpen(false)
    }
  }

  return (
    <header>
      <div className="container nav-wrapper">
        <Link to="/" className="logo-link">
          <Logo />
        </Link>
        
        <button className="mobile-menu-btn" onClick={toggleMenu}>
            ☰
        </button>

        <div className={`nav-search ${isMenuOpen ? 'active' : ''}`} style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginRight: '20px' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'flex-end' }}>
            <input 
              type="text" 
              placeholder="작품명 검색" 
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              style={{ 
                padding: '8px 12px', 
                borderRadius: '4px', 
                border: '1px solid #ddd',
                marginRight: '5px',
                fontSize: '0.9rem',
                width: '200px'
              }}
            />
            <button type="submit" style={{ padding: '8px 12px', background: '#333', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              검색
            </button>
          </form>
        </div>

        <nav className={isMenuOpen ? 'active' : ''}>
            <ul>
              <li><Link to="/auctions" onClick={() => setIsMenuOpen(false)}>경매 목록</Link></li>
              {user ? (
                <>
                <li><Link to="/register" onClick={() => setIsMenuOpen(false)}>경매 등록</Link></li>
                {user.role !== 'ADMIN' && (
                  <li><Link to="/inquiry" onClick={() => setIsMenuOpen(false)}>1:1 문의</Link></li>
                )}
                {user.role === 'ADMIN' && (
                  <li><Link to="/admin" onClick={() => setIsMenuOpen(false)} style={{ color: '#ffd700', textDecoration: 'none', fontWeight: 'bold' }}>관리자 페이지</Link></li>
                )}
                <li style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    <NotificationBell />
                    <SessionTimer targetDate={user.expiration} onExpire={handleLogout} />
                    <Link to="/profile" onClick={() => setIsMenuOpen(false)} style={{color: 'var(--primary-color)', fontWeight: 'bold', marginRight: '10px'}}>{user.name}님</Link>
                </li>
                <li><button onClick={handleLogout} style={{background: 'none', border: 'none', cursor: 'pointer', font: 'inherit', color: 'var(--text-color)', fontWeight: 500, padding: 0}}>로그아웃</button></li>
              </>
            ) : (
              <>
                <li><Link to="/login" onClick={() => setIsMenuOpen(false)}>로그인</Link></li>
                <li><Link to="/signup" onClick={() => setIsMenuOpen(false)}>회원가입</Link></li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navigation />

          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auctions" element={<AuctionList />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/find-id-password" element={<FindIdPassword />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/register" element={<AuctionRegister />} />
              <Route path="/auctions/:id" element={<AuctionDetail />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/admin/revenue" element={<AdminRevenuePage />} />
              
              {/* Footer Routes */}
              <Route path="/notice" element={<Notice />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/inquiry" element={<Inquiry />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/youth-policy" element={<YouthPolicy />} />
              <Route path="/location" element={<Location />} />
            </Routes>
          </main>

          <Footer />
          <ChatWidget />
          <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
