import React from 'react';

function YouthPolicy() {
  return (
    <div className="container" style={{ marginTop: '30px' }}>
      <h2 style={{ borderBottom: '2px solid var(--primary-color)', paddingBottom: '10px', marginBottom: '30px' }}>청소년보호정책</h2>
      <div style={{ background: '#fff', padding: '30px', borderRadius: '8px', boxShadow: 'var(--shadow)', lineHeight: '1.8', color: '#555' }}>
        <p>도자기 경매는 정보통신망 이용촉진 및 정보보호 등에 관한 법률 및 청소년보호법 등 관련 법령에 근거하여 청소년이 유해한 환경으로부터 보호받고 건전하게 성장할 수 있도록 청소년보호정책을 수립, 시행하고 있습니다.</p>
        
        <h4 style={{ marginTop: '20px' }}>1. 유해정보로부터 청소년보호 계획 수립 및 업무담당자 교육 시행</h4>
        <p>회사는 청소년이 아무런 제한장치 없이 청소년 유해정보에 노출되지 않도록 청소년유해매체물에 대해서는 별도의 인증장치를 마련, 적용하며 청소년 유해정보가 노출되지 않도록 예방차원의 조치를 강구하고 있습니다.</p>

        <h4 style={{ marginTop: '20px' }}>2. 청소년보호 책임자 및 담당자 지정</h4>
        <p>회사는 청소년보호 업무를 수행하기 위하여 다음과 같이 청소년보호 책임자 및 담당자를 지정하여 운영하고 있습니다.</p>
        <ul style={{ background: '#f5f5f5', padding: '15px', borderRadius: '4px', listStyle: 'none' }}>
            <li><strong>청소년 보호 책임자</strong> : 김보호 (02-1234-5678)</li>
            <li><strong>청소년 보호 담당자</strong> : 이안전 (security@potteryauction.com)</li>
        </ul>
      </div>
    </div>
  );
}

export default YouthPolicy;
