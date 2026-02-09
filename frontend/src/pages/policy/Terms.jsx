import React from 'react';

function Terms() {
  return (
    <div className="container" style={{ marginTop: '50px', marginBottom: '80px' }}>
      <h2 style={{ borderBottom: '2px solid #1a1a1a', paddingBottom: '20px', marginBottom: '40px', fontSize: '2rem', textAlign: 'left' }}>이용약관</h2>
      
      <div style={{ background: '#fff', padding: '40px', border: '1px solid #eee', lineHeight: '1.8', color: '#444', fontSize: '0.95rem' }}>
        <h4 style={{ fontSize: '1.2rem', marginBottom: '15px', color: '#1a1a1a' }}>제 1 장 총칙</h4>
        
        <h5 style={{ fontSize: '1rem', marginBottom: '10px', marginTop: '20px', fontWeight: 'bold' }}>제 1 조 (목적)</h5>
        <p style={{ marginBottom: '15px' }}>
          이 약관은 라인옥션(이하 "회사")이 운영하는 온라인 경매 사이트(이하 "사이트")에서 제공하는 인터넷 관련 서비스(이하 "서비스")를 이용함에 있어 
          회사와 이용자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
        </p>

        <h5 style={{ fontSize: '1rem', marginBottom: '10px', marginTop: '20px', fontWeight: 'bold' }}>제 2 조 (용어의 정의)</h5>
        <p style={{ marginBottom: '5px' }}>1. "사이트"란 회사가 재화 또는 용역을 이용자에게 제공하기 위하여 컴퓨터 등 정보통신설비를 이용하여 재화 등을 거래할 수 있도록 설정한 가상의 영업장을 말합니다.</p>
        <p style={{ marginBottom: '5px' }}>2. "이용자"란 사이트에 접속하여 이 약관에 따라 회사가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.</p>
        <p style={{ marginBottom: '5px' }}>3. "회원"이라 함은 사이트에 개인정보를 제공하여 회원등록을 한 자로서, 사이트의 정보를 지속적으로 제공받으며, 사이트가 제공하는 서비스를 계속적으로 이용할 수 있는 자를 말합니다.</p>
        <p style={{ marginBottom: '15px' }}>4. "낙찰자"란 경매를 통하여 물품을 구매하기로 결정된 회원을 말합니다.</p>

        <h4 style={{ fontSize: '1.2rem', marginBottom: '15px', marginTop: '40px', color: '#1a1a1a' }}>제 2 장 서비스 이용 및 경매</h4>

        <h5 style={{ fontSize: '1rem', marginBottom: '10px', marginTop: '20px', fontWeight: 'bold' }}>제 3 조 (경매 물품의 등록)</h5>
        <p style={{ marginBottom: '15px' }}>
          회사는 경매에 출품되는 물품의 명칭, 설명, 추정가, 시작가, 마감시간 등을 사이트에 게시합니다. 
          다만, 물품의 상태나 진위 여부에 대한 최종 확인 책임은 입찰자 본인에게 있습니다.
        </p>

        <h5 style={{ fontSize: '1rem', marginBottom: '10px', marginTop: '20px', fontWeight: 'bold' }}>제 4 조 (응찰 및 낙찰)</h5>
        <p style={{ marginBottom: '5px' }}>1. 회원은 사이트가 정한 방법에 따라 경매에 응찰할 수 있습니다.</p>
        <p style={{ marginBottom: '5px' }}>2. 경매 마감 시간까지 최고 가격을 제시한 응찰자가 낙찰자로 선정됩니다.</p>
        <p style={{ marginBottom: '15px' }}>3. 낙찰자는 낙찰 통지를 받은 날로부터 7일 이내에 낙찰 대금을 납부하여야 합니다.</p>

        <h5 style={{ fontSize: '1rem', marginBottom: '10px', marginTop: '20px', fontWeight: 'bold' }}>제 5 조 (낙찰 철회 및 패널티)</h5>
        <p style={{ marginBottom: '15px' }}>
          낙찰자가 정당한 사유 없이 대금을 납부하지 않거나 구매를 거부하는 경우, 회사는 해당 회원의 자격을 정지하거나 영구 박탈할 수 있으며, 
          낙찰 금액의 30%에 해당하는 위약금을 청구할 수 있습니다.
        </p>

        <h4 style={{ fontSize: '1.2rem', marginBottom: '15px', marginTop: '40px', color: '#1a1a1a' }}>제 3 장 책임 및 면책</h4>

        <h5 style={{ fontSize: '1rem', marginBottom: '10px', marginTop: '20px', fontWeight: 'bold' }}>제 6 조 (책임의 제한)</h5>
        <p style={{ marginBottom: '15px' }}>
          회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다. 
          또한 회사는 회원의 귀책사유로 인한 서비스 이용의 장애에 대하여 책임을 지지 않습니다.
        </p>

        <p style={{ marginTop: '50px', textAlign: 'right', fontSize: '0.9rem', color: '#888' }}>
          시행일자: 2025년 2월 9일
        </p>
      </div>
    </div>
  );
}

export default Terms;
