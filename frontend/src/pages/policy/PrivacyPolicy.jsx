import React from 'react'

function PrivacyPolicy() {
  return (
    <div className="container" style={{ marginTop: '50px', marginBottom: '50px', maxWidth: '800px' }}>
      <h2 style={{ borderBottom: '2px solid var(--primary-color)', paddingBottom: '15px', marginBottom: '30px' }}>개인정보처리방침</h2>
      
      <div style={{ lineHeight: '1.8', color: '#444' }}>
        <p><strong>제1조 (목적)</strong><br/>
        도자기 경매(이하 '회사')는 회원의 개인정보를 중요시하며, "정보통신망 이용촉진 및 정보보호"에 관한 법률을 준수하고 있습니다.</p>

        <p style={{ marginTop: '20px' }}><strong>제2조 (수집하는 개인정보 항목)</strong><br/>
        회사는 회원가입, 상담, 서비스 신청 등을 위해 아래와 같은 개인정보를 수집하고 있습니다.<br/>
        - 필수항목: 이름, 로그인ID(이메일), 비밀번호, 휴대전화번호, 주소<br/>
        - 자동수집항목: 서비스 이용기록, 접속 로그, 쿠키, 접속 IP 정보</p>

        <p style={{ marginTop: '20px' }}><strong>제3조 (개인정보의 수집 및 이용목적)</strong><br/>
        회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다.<br/>
        - 서비스 제공에 따른 요금정산: 구매 및 요금 결제, 물품배송<br/>
        - 회원 관리: 본인인증, 개인 식별, 불량회원의 부정 이용 방지</p>

        <p style={{ marginTop: '20px' }}><strong>제4조 (개인정보의 보유 및 이용기간)</strong><br/>
        원칙적으로, 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 관계법령의 규정에 의하여 보존할 필요가 있는 경우 회사는 아래와 같이 관계법령에서 정한 일정한 기간 동안 회원정보를 보관합니다.<br/>
        - 계약 또는 청약철회 등에 관한 기록: 5년<br/>
        - 대금결제 및 재화 등의 공급에 관한 기록: 5년</p>

        <p style={{ marginTop: '20px' }}><strong>제5조 (개인정보 보호책임자)</strong><br/>
        이름: 홍길동<br/>
        직위: 개인정보관리책임자<br/>
        이메일: privacy@potteryauction.com</p>
      </div>
    </div>
  )
}

export default PrivacyPolicy
