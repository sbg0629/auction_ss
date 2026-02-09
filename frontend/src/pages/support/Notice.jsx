import React from 'react';

function Notice() {
  const notices = [
    { id: 1, title: '도자기 경매 서비스 오픈 안내', date: '2026-02-01' },
    { id: 2, title: '설 연휴 배송 지연 안내', date: '2026-02-05' },
    { id: 3, title: '개인정보처리방침 개정 안내', date: '2026-02-10' },
  ];

  return (
    <div className="container" style={{ marginTop: '30px' }}>
      <h2 style={{ borderBottom: '2px solid var(--primary-color)', paddingBottom: '10px', marginBottom: '30px' }}>공지사항</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {notices.map(notice => (
          <li key={notice.id} style={{ borderBottom: '1px solid #eee', padding: '15px 0', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ cursor: 'pointer', fontWeight: '500' }}>[공지] {notice.title}</span>
            <span style={{ color: '#999', fontSize: '0.9rem' }}>{notice.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Notice;
