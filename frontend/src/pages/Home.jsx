import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Slider from "react-slick"
import CountdownTimer from '../components/CountdownTimer'
import BidModal from '../components/BidModal'
import RecentViewed from '../components/RecentViewed'
import { useAuth } from '../context/AuthContext'
import '../App.css'

function Home() {
  const [auctions, setAuctions] = useState([])
  const [selectedAuction, setSelectedAuction] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    fetchAuctions()
  }, [])

  const getImageUrl = (url) => {
      if (!url) return null;
      if (url.startsWith('http')) return url;
      return url;
  }

  const fetchAuctions = async () => {
    try {
      const response = await axios.get('/api/auctions?status=RUNNING')
      setAuctions(response.data.content)
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
    setSelectedAuction(auction)
  }

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500, // Faster speed for normal slide
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000, // Wait 2s between slides
    pauseOnHover: true,
    responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 2,
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 1,
          }
        }
      ]
  };

  return (
    <div style={{ paddingBottom: '50px' }}>
      <div className="hero">
        <div className="container">
            <h1>옛옥션 온라인 경매</h1>
            <p>엄선된 미술품과 도자기를 만나는 특별한 공간</p>
            <div style={{ marginTop: '30px' }}>
                <Link to="/auctions" className="btn" style={{ background: 'transparent', border: '1px solid #fff', marginRight: '10px' }}>경매 목록 보기</Link>
                <Link to="/register" className="btn" style={{ background: '#fff', color: '#333', border: '1px solid #fff' }}>출품 신청하기</Link>
            </div>
        </div>
      </div>

      <div className="container">
        {/* Recent Viewed Items */}
        <RecentViewed />

        <h2>진행중인 경매</h2>
        
        {auctions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: '#999' }}>
                <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>현재 진행중인 경매가 없습니다.</p>
                <p>다음 경매 일정을 기다려주세요.</p>
            </div>
        ) : (
            <div style={{ margin: '0 -15px', marginBottom: '50px' }}>
                <Slider {...sliderSettings}>
                    {auctions.map((auction) => (
                        <div key={auction.id} style={{ padding: '0 15px', height: '100%' }}>
                            <div className="card">
                                <Link to={`/auctions/${auction.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block', position: 'relative' }}>
                                    <div className="card-image">
                                        <div className="card-image-content" style={{ 
                                            backgroundImage: auction.imageUrl ? `url(${getImageUrl(auction.imageUrl)})` : 'none',
                                            backgroundColor: auction.imageUrl ? 'transparent' : '#f0f0f0'
                                        }}></div>
                                        {!auction.imageUrl && <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '3rem' }}>🏺</div>}
                                        <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
                                            <span className={`status-badge ${auction.status === 'RUNNING' ? 'status-running' : (auction.status === 'NO_BIDS' ? 'status-ended' : 'status-ended')}`} style={{ backgroundColor: auction.status === 'NO_BIDS' ? '#999' : undefined }}>
                                                {auction.status === 'RUNNING' ? 'RUNNING' : (auction.status === 'NO_BIDS' ? '유찰' : 'ENDED')}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                                <div className="card-content">
                                    <div style={{ marginBottom: '5px', color: '#999', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        Lot {auction.id}
                                    </div>
                                    <Link to={`/auctions/${auction.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <h3 className="card-title">{auction.itemTitle}</h3>
                                    </Link>
                                    
                                    <div className="card-meta">
                                        <span>판매자: {auction.sellerName}</span>
                                        <span>입찰: {auction.bidCount}회</span>
                                    </div>
                                    
                                    <div style={{ marginTop: 'auto' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '15px' }}>
                                            <div>
                                                <small style={{ display: 'block', color: '#999', fontSize: '0.8rem' }}>현재가</small>
                                                <span className="card-price" style={{ border: 'none', padding: 0 }}>
                                                    {auction.currentPrice.toLocaleString()} KRW
                                                </span>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <small style={{ display: 'block', color: '#999', fontSize: '0.8rem' }}>남은 시간</small>
                                                <div style={{ fontWeight: '500', color: '#d32f2f' }}>
                                                    <CountdownTimer targetDate={auction.endAt} />
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <button className="btn" style={{ width: '100%' }} onClick={() => handleBidClick(auction)}>응찰하기</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        )}

        {selectedAuction && (
            <BidModal 
            auction={selectedAuction} 
            onClose={() => setSelectedAuction(null)} 
            onBidSuccess={() => {
                fetchAuctions()
                setSelectedAuction(null)
            }}
            />
        )}
      </div>

      {/* Guide Section */}
      <div style={{ background: '#f8f8f8', padding: '80px 0' }}>
        <div className="container">
            <h2 style={{ marginBottom: '50px' }}>옛옥션 이용안내</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
                {/* Auction Guide */}
                <div style={{ background: '#fff', padding: '40px', textAlign: 'center', border: '1px solid #eee' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🏛️</div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>경매안내</h3>
                    <p style={{ color: '#666', marginBottom: '20px', fontSize: '0.9rem' }}>
                        옛옥션에서 준비하는 엄선된 미술품 경매를 소개드립니다.
                    </p>
                    <Link to="/auctions" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem' }}>자세히 보기 &rarr;</Link>
                </div>

                {/* Consignment Guide */}
                <div style={{ background: '#fff', padding: '40px', textAlign: 'center', border: '1px solid #eee' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '20px' }}>💎</div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>위탁안내</h3>
                    <p style={{ color: '#666', marginBottom: '20px', fontSize: '0.9rem' }}>
                        소장하고 계신 물품의 가치가 궁금하시나요? 전문가가 감정해 드립니다.
                    </p>
                    <Link to="/register" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem' }}>위탁 신청하기 &rarr;</Link>
                </div>

                {/* Inquiry */}
                <div style={{ background: '#fff', padding: '40px', textAlign: 'center', border: '1px solid #eee' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📞</div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>문의하기</h3>
                    <p style={{ color: '#666', marginBottom: '20px', fontSize: '0.9rem' }}>
                        경매 참여 방법이나 작품에 대해 궁금한 점을 해결해 드립니다.
                    </p>
                    <Link to="/inquiry" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem' }}>1:1 문의하기 &rarr;</Link>
                </div>
            </div>
        </div>
      </div>

      {/* How to Buy / Sell Section */}
      <div className="container" style={{ padding: '80px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px' }}>
            {/* How to Buy */}
            <div>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '30px', borderBottom: '2px solid #000', paddingBottom: '15px', display: 'inline-block' }}>How to Buy</h3>
                <p style={{ color: '#666', marginBottom: '30px' }}>회원가입부터 낙찰까지 누구나 쉽게 경매에 참여할 수 있습니다.</p>
                
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    <li style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                        <span style={{ width: '30px', height: '30px', background: '#333', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '15px', fontSize: '0.9rem' }}>1</span>
                        <div>
                            <strong>회원가입</strong>
                            <div style={{ fontSize: '0.9rem', color: '#888' }}>본인 인증 후 정회원으로 가입</div>
                        </div>
                    </li>
                    <li style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                        <span style={{ width: '30px', height: '30px', background: '#333', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '15px', fontSize: '0.9rem' }}>2</span>
                        <div>
                            <strong>경매 응찰</strong>
                            <div style={{ fontSize: '0.9rem', color: '#888' }}>원하는 작품에 온라인/서면/전화 응찰</div>
                        </div>
                    </li>
                    <li style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                        <span style={{ width: '30px', height: '30px', background: '#333', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '15px', fontSize: '0.9rem' }}>3</span>
                        <div>
                            <strong>낙찰 및 결제</strong>
                            <div style={{ fontSize: '0.9rem', color: '#888' }}>낙찰 후 7일 이내 대금 결제</div>
                        </div>
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ width: '30px', height: '30px', background: '#333', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '15px', fontSize: '0.9rem' }}>4</span>
                        <div>
                            <strong>작품 인수</strong>
                            <div style={{ fontSize: '0.9rem', color: '#888' }}>방문 수령 또는 배송 신청</div>
                        </div>
                    </li>
                </ul>
            </div>

            {/* How to Sell */}
            <div>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '30px', borderBottom: '2px solid #000', paddingBottom: '15px', display: 'inline-block' }}>How to Sell</h3>
                <p style={{ color: '#666', marginBottom: '30px' }}>고객님의 소중한 소장품을 기다립니다. 옛옥션에 문의하세요.</p>
                
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    <li style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                        <span style={{ width: '30px', height: '30px', background: '#333', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '15px', fontSize: '0.9rem' }}>1</span>
                        <div>
                            <strong>위탁 문의</strong>
                            <div style={{ fontSize: '0.9rem', color: '#888' }}>홈페이지 또는 이메일로 작품 접수</div>
                        </div>
                    </li>
                    <li style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                        <span style={{ width: '30px', height: '30px', background: '#333', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '15px', fontSize: '0.9rem' }}>2</span>
                        <div>
                            <strong>감정 및 상담</strong>
                            <div style={{ fontSize: '0.9rem', color: '#888' }}>전문가의 실물 감정 및 가격 협의</div>
                        </div>
                    </li>
                    <li style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                        <span style={{ width: '30px', height: '30px', background: '#333', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '15px', fontSize: '0.9rem' }}>3</span>
                        <div>
                            <strong>위탁 계약</strong>
                            <div style={{ fontSize: '0.9rem', color: '#888' }}>경매 출품 계약 체결</div>
                        </div>
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ width: '30px', height: '30px', background: '#333', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '15px', fontSize: '0.9rem' }}>4</span>
                        <div>
                            <strong>경매 및 정산</strong>
                            <div style={{ fontSize: '0.9rem', color: '#888' }}>낙찰 후 대금 정산 및 지급</div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Home
