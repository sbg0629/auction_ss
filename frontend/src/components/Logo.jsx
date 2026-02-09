import React from 'react';

const Logo = () => {
  return (
    <svg width="150" height="40" viewBox="0 0 150 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Icon: Stylized Ceramic Jar */}
      <path d="M10 10 C10 5, 30 5, 30 10 L32 12 C38 15, 38 25, 32 28 L30 30 C30 35, 10 35, 10 30 L8 28 C2 25, 2 15, 8 12 Z" stroke="#333" strokeWidth="2" fill="none"/>
      <path d="M10 12 L30 12" stroke="#333" strokeWidth="1"/>
      
      {/* Text: OK Auction (Korean style font simulation with path) */}
      <text x="45" y="28" fontFamily="'Noto Serif KR', serif" fontSize="22" fontWeight="bold" fill="#333">
        옥경매
      </text>
      <text x="115" y="28" fontFamily="'Noto Sans KR', sans-serif" fontSize="10" fill="#666" letterSpacing="1">
        AUCTION
      </text>
    </svg>
  );
};

export default Logo;
