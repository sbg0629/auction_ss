import React from 'react';

function Privacy() {
  return (
    <div className="container" style={{ marginTop: '30px' }}>
      <h2 style={{ borderBottom: '2px solid var(--primary-color)', paddingBottom: '10px', marginBottom: '30px' }}>개인정보처리방침</h2>
      <div style={{ background: '#fff', padding: '30px', borderRadius: '8px', boxShadow: 'var(--shadow)', lineHeight: '1.8', color: '#555' }}>
        <h4>1. 개인정보의 수집 및 이용 목적</h4>
        <p>회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보 보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.</p>
        <ul>
            <li>회원 가입 및 관리</li>
            <li>재화 또는 서비스 제공 (경매 참여, 낙찰, 배송 등)</li>
            <li>고충 처리 및 분쟁 해결</li>
        </ul>

        <h4 style={{ marginTop: '20px' }}>2. 수집하는 개인정보 항목</h4>
        <p>회사는 회원가입, 상담, 서비스 신청 등을 위해 아래와 같은 개인정보를 수집하고 있습니다.</p>
        <ul>
            <li>수집항목 : 이름, 이메일, 비밀번호, 주소, 상세주소</li>
            <li>수집방법 : 홈페이지(회원가입)</li>
        </ul>

        <h4 style={{ marginTop: '20px' }}>3. 개인정보의 보유 및 이용기간</h4>
        <p>회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.</p>
        
        <p style={{ marginTop: '30px', color: '#999' }}>(이하 생략 - 실제 서비스 운영 시 상세 내용 기재 필요)</p>
      </div>
    </div>
  );
}

export default Privacy;
