import React from 'react';
import defaultLogo from '../assets/logo.png';

const Logo = () => {
  const handleError = (e) => {
    // 업로드된 이미지가 없거나 불러오기 실패하면 기본 로고로 대체
    if (e.target && e.target.src) {
      e.target.onerror = null;
      e.target.src = defaultLogo;
    }
  };

  return (
    <img
      src="/uploads/image(6).jpg"
      alt="옛옥션"
      style={{ height: '70px' }}
      onError={handleError}
    />
  );
};

export default Logo;
