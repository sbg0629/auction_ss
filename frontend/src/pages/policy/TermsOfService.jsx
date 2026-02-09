import React from 'react'

function TermsOfService() {
  return (
    <div className="container" style={{ marginTop: '50px', marginBottom: '50px', maxWidth: '800px' }}>
      <h2 style={{ borderBottom: '2px solid var(--primary-color)', paddingBottom: '15px', marginBottom: '30px' }}>이용약관</h2>
      
      <div style={{ lineHeight: '1.8', color: '#444' }}>
        <p><strong>제1조 (목적)</strong><br/>
        이 약관은 도자기 경매(이하 "회사"라 함)가 제공하는 경매 서비스(이하 "서비스"라 함)의 이용조건 및 절차, 회사와 회원 간의 권리, 의무 및 책임사항 등을 규정함을 목적으로 합니다.</p>

        <p style={{ marginTop: '20px' }}><strong>제2조 (정의)</strong><br/>
        1. "회원"이라 함은 회사에 개인정보를 제공하여 회원등록을 한 자로서, 회사의 정보를 지속적으로 제공받으며, 회사가 제공하는 서비스를 계속적으로 이용할 수 있는 자를 말합니다.<br/>
        2. "경매"라 함은 물품을 구매하고자 하는 다수의 희망자가 가격을 제시하고, 그 중 가장 높은 가격을 제시한 자에게 물품을 매도하는 방식을 말합니다.</p>

        <p style={{ marginTop: '20px' }}><strong>제3조 (약관의 명시와 개정)</strong><br/>
        회사는 이 약관의 내용과 상호, 영업소 소재지, 대표자의 성명, 사업자등록번호, 연락처 등을 이용자가 알 수 있도록 초기 서비스화면에 게시합니다.</p>

        <p style={{ marginTop: '20px' }}><strong>제4조 (경매 서비스의 이용)</strong><br/>
        1. 회원은 회사가 정한 절차에 따라 입찰에 참여할 수 있습니다.<br/>
        2. 낙찰자는 회사가 정한 기한 내에 대금을 지급해야 하며, 이를 위반할 경우 회원 자격이 정지될 수 있습니다.</p>

        <p style={{ marginTop: '20px' }}><strong>제5조 (면책조항)</strong><br/>
        회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.</p>
      </div>
    </div>
  )
}

export default TermsOfService
