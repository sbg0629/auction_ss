import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

function Inquiry() {
  const { user } = useAuth();
  const [form, setForm] = useState({ title: '', content: '' });
  const [inquiries, setInquiries] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    if (user) {
        fetchMyInquiries();
    }
  }, [user]);

  const fetchMyInquiries = async () => {
    try {
        const response = await axios.get('/api/inquiries/my', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setInquiries(response.data);
    } catch (error) {
        console.error('Failed to fetch inquiries', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
        alert('로그인이 필요합니다.');
        return;
    }
    try {
        await axios.post('/api/inquiries', form, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        alert('문의가 접수되었습니다. 빠른 시일 내에 답변 드리겠습니다.');
        setForm({ title: '', content: '' });
        fetchMyInquiries();
    } catch (error) {
        console.error('Submit error', error);
        alert('문의 접수에 실패했습니다.');
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="container" style={{ marginTop: '30px' }}>
      <h2 style={{ borderBottom: '2px solid var(--primary-color)', paddingBottom: '10px', marginBottom: '30px' }}>1:1 문의하기</h2>
      
      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
          {/* Write Form */}
          <div style={{ flex: 1, minWidth: '300px' }}>
            <h3 style={{ marginBottom: '20px' }}>문의 작성</h3>
            <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '30px', borderRadius: '8px', boxShadow: 'var(--shadow)' }}>
                <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>제목</label>
                <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                    placeholder="문의 제목을 입력해주세요"
                />
                </div>
                <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>내용</label>
                <textarea
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    required
                    rows="10"
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', resize: 'vertical' }}
                    placeholder="문의 내용을 상세히 적어주세요"
                ></textarea>
                </div>
                <button type="submit" className="btn" style={{ width: '100%', padding: '15px', fontSize: '1.1rem' }}>문의 접수하기</button>
            </form>
          </div>

          {/* My Inquiries List */}
          <div style={{ flex: 1, minWidth: '300px' }}>
            <h3 style={{ marginBottom: '20px' }}>나의 문의 내역</h3>
            {inquiries.length === 0 ? (
                <p style={{ color: '#666' }}>작성한 문의가 없습니다.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {inquiries.map(inquiry => (
                        <div key={inquiry.id} style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                            <div 
                                onClick={() => toggleExpand(inquiry.id)}
                                style={{ padding: '15px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8f9fa' }}
                            >
                                <div>
                                    <span style={{ 
                                        display: 'inline-block', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', marginRight: '10px',
                                        color: 'white', background: inquiry.status === 'ANSWERED' ? '#4CAF50' : '#ff9800' 
                                    }}>
                                        {inquiry.status === 'ANSWERED' ? '답변완료' : '대기중'}
                                    </span>
                                    <span style={{ fontWeight: 'bold' }}>{inquiry.title}</span>
                                </div>
                                <span style={{ fontSize: '12px', color: '#888' }}>{new Date(inquiry.createdAt).toLocaleDateString()}</span>
                            </div>
                            
                            {expandedId === inquiry.id && (
                                <div style={{ padding: '20px', borderTop: '1px solid #eee' }}>
                                    <div style={{ marginBottom: '15px', whiteSpace: 'pre-wrap' }}>{inquiry.content}</div>
                                    
                                    {inquiry.answer ? (
                                        <div style={{ background: '#e8f5e9', padding: '15px', borderRadius: '4px', marginTop: '15px' }}>
                                            <p style={{ fontWeight: 'bold', color: '#2e7d32', marginBottom: '5px' }}>[관리자 답변]</p>
                                            <div style={{ whiteSpace: 'pre-wrap' }}>{inquiry.answer}</div>
                                            <p style={{ fontSize: '12px', color: '#666', marginTop: '10px', textAlign: 'right' }}>
                                                답변자: {inquiry.answererName}
                                            </p>
                                        </div>
                                    ) : (
                                        <p style={{ color: '#888', fontSize: '14px', fontStyle: 'italic' }}>관리자 답변 대기 중입니다.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
          </div>
      </div>
    </div>
  );
}

export default Inquiry;
