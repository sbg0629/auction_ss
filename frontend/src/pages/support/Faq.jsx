import React, { useState } from 'react';

function Faq() {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    { question: '경매 참여는 어떻게 하나요?', answer: '회원가입 후 원하는 상품의 상세 페이지에서 입찰하기 버튼을 통해 참여하실 수 있습니다.' },
    { question: '낙찰 후 결제는 언제까지 해야 하나요?', answer: '낙찰 시점으로부터 24시간 이내에 결제를 완료해주셔야 합니다.' },
    { question: '배송 기간은 얼마나 걸리나요?', answer: '결제 완료 후 판매자가 발송 처리하며, 통상 2-3일 내에 받아보실 수 있습니다.' },
    { question: '반품/환불이 가능한가요?', answer: '도자기 특성상 파손 위험이 있어 단순 변심 반품은 제한될 수 있습니다. 단, 배송 중 파손된 경우 환불 가능합니다.' },
  ];

  const toggleFaq = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="container" style={{ marginTop: '30px' }}>
      <h2 style={{ borderBottom: '2px solid var(--primary-color)', paddingBottom: '10px', marginBottom: '30px' }}>자주 묻는 질문 (FAQ)</h2>
      <div style={{ borderTop: '1px solid #333' }}>
        {faqs.map((faq, index) => (
          <div key={index} style={{ borderBottom: '1px solid #eee' }}>
            <div 
              onClick={() => toggleFaq(index)}
              style={{ padding: '20px', cursor: 'pointer', background: '#fff', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}
            >
              <span>Q. {faq.question}</span>
              <span>{activeIndex === index ? '▲' : '▼'}</span>
            </div>
            {activeIndex === index && (
              <div style={{ padding: '20px', background: '#f9f9f9', color: '#555', lineHeight: '1.6' }}>
                A. {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Faq;
