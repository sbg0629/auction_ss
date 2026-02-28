import React from 'react'

function TermsOfService() {
  return (
    <div className="container" style={{ marginTop: '50px', marginBottom: '50px', maxWidth: '800px' }}>
      <h2 style={{ borderBottom: '2px solid var(--primary-color)', paddingBottom: '15px', marginBottom: '30px' }}>이용약관</h2>
      
      <div style={{ lineHeight: '1.8', color: '#444' }}>
        <p><strong>제1장 총칙</strong></p>
        
        <p><strong>제1조 (목적)</strong><br/>
        이 약관은 옛옥션의 인터넷 사이트를 통하여 제공하는 경매 서비스 및 정보제공 서비스와 관련하여 옛옥션과 회원 간의 의무와 책임 사항 및 회원의 서비스 이용 절차에 관한 사항을 규정함을 목적으로 합니다.</p>

        <p style={{ marginTop: '20px' }}><strong>제2조 (약관의 명시, 효력 및 변경)</strong><br/>
        가. 옛옥션은 이 약관을 이용자와 회원이 알 수 있도록 인터넷 사이트 화면에 게시합니다.<br/>
        나. 약관을 개정하는 경우에는 적용일자 7일 이전부터 적용일 전일까지 공지합니다.<br/>
        다. 특정 서비스에 관하여 개별 약관을 정하여 미리 공지할 수 있으며, 이 경우 개별 약관이 우선 적용됩니다.</p>

        <p style={{ marginTop: '20px' }}><strong>제3조 (관련 법령과의 관계)</strong><br/>
        이 약관에서 정하지 않은 사항은 전자거래기본법, 정보통신망법, 전자상거래법 등 관련 법령 및 일반적인 상관례에 의합니다.</p>

        <p style={{ marginTop: '20px' }}><strong>제4조 (서비스의 종류)</strong><br/>
        가. 경매 서비스: 회원 상호 간에 물품 매매 거래가 이루어질 수 있는 온라인 거래 장소 제공 및 부가 서비스.<br/>
        나. 기타 정보 서비스: 경매 이외에 온라인으로 제공하는 모든 정보 서비스.</p>

        <p style={{ marginTop: '20px' }}><strong>제5조 (용어의 정의)</strong><br/>
        본 약관에서 사용하는 회원, 아이디, 낙찰, 응찰, 매매보호서비스 등 용어의 정의는 일반적인 상거래 관행 및 본 사이트의 운영 지침에 따릅니다.</p>

        <p style={{ marginTop: '20px' }}><strong>제6조 (경매서비스의 성질과 목적)</strong><br/>
        경매 서비스는 회원 각자의 자기 결정에 의하여 매매가 이루어질 수 있도록 사이버 거래 장소를 제공하는 것이며, 회원 간 성립된 거래와 관련된 책임은 거래 당사자인 회원들에게 있습니다.</p>

        <p style={{ marginTop: '30px' }}><strong>제2장 서비스 이용계약</strong></p>

        <p><strong>제7조 (서비스이용계약)</strong><br/>
        가. 이용 신청에 대하여 옛옥션이 승낙함으로써 성립하며, 승낙의 의사는 서비스 화면 게시 또는 이메일 등으로 통지합니다.<br/>
        나. 만 20세 이상의 개인 또는 사업자가 실명으로 가입할 수 있습니다.<br/>
        다. 회원의 아이디는 1인 1개를 원칙으로 합니다.</p>

        <p style={{ marginTop: '20px' }}><strong>제8조 (이용신청)</strong><br/>
        회원은 옛옥션이 온라인으로 제공하는 가입 신청 양식에 따라 성명, 생년월일, 연락처, 아이디, 비밀번호 등을 정확히 기재해야 합니다.</p>

        <p style={{ marginTop: '20px' }}><strong>제9조 (이용신청의 승낙)</strong><br/>
        회사는 실명 확인 절차를 거쳐 이용을 승낙합니다. 단, 만 20세 미만, 허위 사실 기재, 타인 명의 도용 등의 사유가 있을 경우 승낙을 거부하거나 유보할 수 있습니다.</p>

        <p style={{ marginTop: '20px' }}><strong>제10조 (이용계약의 종료)</strong><br/>
        회원은 언제든지 해지 의사를 통지할 수 있으나, 모든 경매 절차를 완료해야 합니다. 회사는 약관 위반, 직거래 유도 등 서비스 운영을 방해하는 행위가 있을 경우 이용계약을 해지할 수 있습니다.</p>

        <p style={{ marginTop: '30px' }}><strong>제3장 회원정보의 보호</strong></p>

        <p><strong>제11조 (회원정보의 수집과 보호)</strong><br/>
        회사는 배송 업무 등 거래 이행을 위해 필요한 최소한의 정보만을 수집하며, 회원의 동의 없이 제3자에게 제공하지 않습니다.</p>

        <p style={{ marginTop: '20px' }}><strong>제12조 (회원정보의 변경)</strong><br/>
        회원은 정보가 변경되었을 경우 즉시 수정해야 하며, 이를 게을리하여 발생한 손해는 회원 본인이 부담합니다.</p>

        <p style={{ marginTop: '20px' }}><strong>제13조 (아이디의 관리)</strong><br/>
        아이디와 비밀번호의 관리 책임은 회원에게 있으며, 이를 타인에게 양도하거나 대여할 수 없습니다.</p>

        <p style={{ marginTop: '30px' }}><strong>제4장 경매 서비스 이용 규정</strong></p>

        <p><strong>제14조 (이용제한 및 정지)</strong><br/>
        판매거부, 구매거부, 직거래 유도 행위 적발 시 횟수에 따라 경고, 이용정지 조치를 취할 수 있습니다.</p>

        <p style={{ marginTop: '20px' }}><strong>제15조 (회원 신용등급 관리)</strong><br/>
        회사는 거래 실적 및 매너에 따라 회원의 신용등급을 관리하며, 등급에 따라 서비스 이용에 차등을 둘 수 있습니다.</p>

        <p style={{ marginTop: '20px' }}><strong>제16조 (매매보호 서비스의 제공)</strong><br/>
        옛옥션은 거래의 안전을 위해 물품 대금의 입출금을 중개하는 매매보호 서비스를 제공합니다.</p>

        <p style={{ marginTop: '20px' }}><strong>제17조 (매매보호 서비스의 이용)</strong><br/>
        회사가 매매보호 서비스를 제공하는 과정에서 발생하는 이자 등은 서비스 제공 대가로 간주됩니다.</p>

        <p style={{ marginTop: '20px' }}><strong>제18조 (판매물품의 등록)</strong><br/>
        판매자는 고서, 도자기, 민속품, 미술품 등 품목의 상세 정보를 사실대로 명확히 등록해야 합니다.</p>

        <p style={{ marginTop: '20px' }}><strong>제19조 (판매물품 등록 기준)</strong><br/>
        경매 시작가는 10,000원 이상으로 설정해야 하며, 배송비 부담 주체와 배송 방법을 정확히 명시해야 합니다.</p>

        <p style={{ marginTop: '20px' }}><strong>제20조 (매매부적합물품)</strong><br/>
        진품성 허위 기재, 법령 위반 물품 등은 관리자가 직권으로 삭제할 수 있으며, 이와 관련한 책임은 등록한 판매자에게 있습니다.</p>

        <p style={{ marginTop: '20px' }}><strong>제21조 (낙찰의 성립)</strong><br/>
        경매 종료 시 최고가로 입찰한 회원이 낙찰자로 선정됩니다.</p>

        <p style={{ marginTop: '20px' }}><strong>제22조 (대금 결제)</strong><br/>
        낙찰자는 낙찰 후 3일 이내에 지정된 계좌로 낙찰 대금과 수수료를 입금해야 합니다.<br/>
        지정 계좌: 농협 352-2247-1555-63 (예금주: 옛옥션 황화영)</p>

        <p style={{ marginTop: '20px' }}><strong>제23조 (물품 배송)</strong><br/>
        판매자는 입금 확인 후 2영업일 이내에 물품을 발송하고 운송장 번호를 등록해야 합니다.</p>

        <p style={{ marginTop: '20px' }}><strong>제24조 (구매 확정 및 정산)</strong><br/>
        구매자가 물품 수령 후 구매 확정을 하면, 회사는 판매자에게 수수료를 공제한 금액을 정산합니다.</p>

        <p style={{ marginTop: '20px' }}><strong>제25조 (반품 및 환불)</strong><br/>
        구매자는 물품 수령 후 7일 이내에 반품을 요청할 수 있습니다. 단, 단순 변심의 경우 반품 비용은 구매자가 부담합니다.</p>

        <p style={{ marginTop: '20px' }}><strong>제26조 (거래 취소)</strong><br/>
        상호 합의가 없거나 약관을 위반한 거래는 회사의 판단에 따라 취소될 수 있습니다.</p>

        <p style={{ marginTop: '30px' }}><strong>제5장 서비스 이용 수수료</strong></p>

        <p><strong>제27조 (수수료 체계)</strong><br/>
        가. 옛옥션은 시스템 이용료로서 낙찰 수수료를 부과합니다.<br/>
        나. 판매자 수수료: 낙찰가의 10% (대금 정산 시 공제)<br/>
        다. 구매자 수수료: 낙찰가의 15% (낙찰가에 합산하여 입금)</p>

        <p style={{ marginTop: '30px' }}><strong>제6장 면책 및 기타 조항</strong></p>

        <p><strong>제28조 (회사의 면책)</strong><br/>
        가. 옛옥션은 거래 중개자로서 물품의 하자, 진품 여부 등에 대해서는 책임을 지지 않습니다.<br/>
        나. 천재지변 및 통신 장애로 인한 서비스 중단 시 책임이 면제됩니다.</p>

        <p style={{ marginTop: '20px' }}><strong>제29조 (준거법 및 관할법원)</strong><br/>
        이 약관 및 거래와 관련한 분쟁 발생 시 대한민국 법령을 따르며 관할 법원을 정합니다.</p>

        <p style={{ marginTop: '20px' }}><strong>제30조 (게시판 이용)</strong><br/>
        부적절한 게시물이나 직거래 유도글은 사전 통보 없이 삭제될 수 있습니다.</p>

        <p style={{ marginTop: '20px' }}><strong>제31조 (회사 정보)</strong><br/>
        상호: 옛옥션<br/>
        대표자: 황화영<br/>
        주소: 경남 김해시 가야로439 롯데캐슬가야1단지 상가 1층<br/>
        사업자 등록번호: 608-14-93751<br/>
        고객문의: 1588-4033 / mailltd@naver.com</p>

        <p style={{ marginTop: '20px', fontSize: '0.9rem', color: '#666' }}><strong>부칙</strong><br/>
        본 약관은 2026년 2월 7일부터 시행됩니다.</p>
      </div>
    </div>
  )
}

export default TermsOfService
