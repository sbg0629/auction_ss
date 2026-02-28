import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer>
      <div className="container footer-content">
        
        {/* 회사 정보 */}
        <div className="footer-section">
          <h3>옛옥션</h3>
          <p>
            한국의 아름다운 도자기를<br/>
            전 세계에 알리고 거래하는<br/>
            프리미엄 경매 플랫폼입니다.
          </p>
        </div>

        {/* 고객 센터 */}
        <div className="footer-section">
          <h4>고객센터</h4>
          <ul>
            <li><Link to="/notice">공지사항</Link></li>
            <li><Link to="/faq">자주 묻는 질문 (FAQ)</Link></li>
            <li><Link to="/inquiry">1:1 문의하기</Link></li>
            <li><Link to="/location">오시는 길</Link></li>
          </ul>
        </div>

        {/* 약관 및 정책 */}
        <div className="footer-section">
          <h4>약관 및 정책</h4>
          <ul>
            <li><Link to="/terms">이용약관</Link></li>
            <li><Link to="/privacy" style={{ fontWeight: 'bold' }}>개인정보처리방침</Link></li>
            <li><Link to="/youth-policy">청소년보호정책</Link></li>
          </ul>
        </div>

        {/* 연락처 */}
        <div className="footer-section">
          <h4>Contact Us</h4>
          <p>
            <strong>전화:</strong> 1588-4033<br/>
            <strong>이메일:</strong> mailltd@naver.com<br/>
            <strong>운영시간:</strong> 평일 10:00 - 18:00<br/>
            (점심시간 12:00 - 13:00)
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
            <p>상호명: 옛옥션 | 대표자: 황화영 | 사업자등록번호: 608-14-93751</p>
            <p>주소: 경남 김해시 가야로439 롯데캐슬가야1단지 상가 1층</p>
            <p style={{ marginTop: '10px' }}>Copyright &copy; 2026 옛옥션. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
