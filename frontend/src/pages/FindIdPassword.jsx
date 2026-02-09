import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function FindIdPassword() {
  const [activeTab, setActiveTab] = useState('findId');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Find ID State
  const [findIdName, setFindIdName] = useState('');
  const [findIdPhone, setFindIdPhone] = useState('');
  const [foundEmail, setFoundEmail] = useState('');

  // Reset Password State
  const [resetPwEmail, setResetPwEmail] = useState('');
  const [resetPwName, setResetPwName] = useState('');
  const [resetPwPhone, setResetPwPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleFindId = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post('/api/auth/find-id', {
        name: findIdName,
        phoneNumber: findIdPhone
      });
      setFoundEmail(response.data.email);
      toast.success('이메일을 찾았습니다.');
    } catch (error) {
      toast.error(error.response?.data || '이메일 찾기에 실패했습니다.');
      setFoundEmail('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('비밀번호가 일치하지 않습니다.');
      return;
    }
    setIsLoading(true);
    try {
      await axios.post('/api/auth/reset-password', {
        email: resetPwEmail,
        name: resetPwName,
        phoneNumber: resetPwPhone,
        newPassword: newPassword
      });
      toast.success('비밀번호가 재설정되었습니다. 로그인해주세요.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data || '비밀번호 재설정에 실패했습니다. 정보를 확인해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '500px', marginTop: '50px', padding: '40px', background: 'white', borderRadius: '8px', boxShadow: 'var(--shadow)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px', color: 'var(--primary-color)' }}>
        아이디/비밀번호 찾기
      </h2>

      <div style={{ display: 'flex', borderBottom: '1px solid #ddd', marginBottom: '30px' }}>
        <button
          onClick={() => setActiveTab('findId')}
          style={{
            flex: 1,
            padding: '15px',
            background: activeTab === 'findId' ? '#f8f9fa' : 'white',
            border: 'none',
            borderBottom: activeTab === 'findId' ? '2px solid var(--primary-color)' : 'none',
            cursor: 'pointer',
            fontWeight: activeTab === 'findId' ? 'bold' : 'normal',
            color: activeTab === 'findId' ? 'var(--primary-color)' : '#666'
          }}
        >
          아이디 찾기
        </button>
        <button
          onClick={() => setActiveTab('resetPw')}
          style={{
            flex: 1,
            padding: '15px',
            background: activeTab === 'resetPw' ? '#f8f9fa' : 'white',
            border: 'none',
            borderBottom: activeTab === 'resetPw' ? '2px solid var(--primary-color)' : 'none',
            cursor: 'pointer',
            fontWeight: activeTab === 'resetPw' ? 'bold' : 'normal',
            color: activeTab === 'resetPw' ? 'var(--primary-color)' : '#666'
          }}
        >
          비밀번호 재설정
        </button>
      </div>

      {activeTab === 'findId' ? (
        <form onSubmit={handleFindId}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>이름</label>
            <input
              type="text"
              value={findIdName}
              onChange={(e) => setFindIdName(e.target.value)}
              placeholder="가입시 등록한 이름"
              required
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>휴대폰 번호</label>
            <input
              type="tel"
              value={findIdPhone}
              onChange={(e) => setFindIdPhone(e.target.value)}
              placeholder="010-0000-0000"
              required
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
          </div>
          
          <button type="submit" className="btn" disabled={isLoading} style={{ width: '100%' }}>
            {isLoading ? '처리중...' : '아이디 찾기'}
          </button>

          {foundEmail && (
            <div style={{ marginTop: '20px', padding: '15px', background: '#e9ecef', borderRadius: '4px', textAlign: 'center' }}>
              회원님의 아이디는 <strong>{foundEmail}</strong> 입니다.
              <div style={{ marginTop: '10px' }}>
                <button type="button" onClick={() => navigate('/login')} className="btn" style={{ fontSize: '0.9rem', padding: '5px 15px' }}>
                  로그인하러 가기
                </button>
              </div>
            </div>
          )}
        </form>
      ) : (
        <form onSubmit={handleResetPassword}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>이메일</label>
            <input
              type="email"
              value={resetPwEmail}
              onChange={(e) => setResetPwEmail(e.target.value)}
              placeholder="example@test.com"
              required
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>이름</label>
            <input
              type="text"
              value={resetPwName}
              onChange={(e) => setResetPwName(e.target.value)}
              placeholder="가입시 등록한 이름"
              required
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>휴대폰 번호</label>
            <input
              type="tel"
              value={resetPwPhone}
              onChange={(e) => setResetPwPhone(e.target.value)}
              placeholder="010-0000-0000"
              required
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>새 비밀번호</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="새로운 비밀번호"
              required
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>새 비밀번호 확인</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="새로운 비밀번호 확인"
              required
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
          </div>
          
          <button type="submit" className="btn" disabled={isLoading} style={{ width: '100%' }}>
            {isLoading ? '처리중...' : '비밀번호 재설정'}
          </button>
        </form>
      )}
    </div>
  );
}

export default FindIdPassword;
