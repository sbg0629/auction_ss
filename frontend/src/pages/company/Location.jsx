import React, { useEffect, useRef } from 'react';

function Location() {
  const mapRef = useRef(null);

  useEffect(() => {
    // 카카오지도 API가 있다고 가정하고 구현하거나, 지금은 간단한 이미지/텍스트로 대체
    // 실제로는 index.html에 카카오 지도 스크립트 추가 필요
  }, []);

  return (
    <div className="container" style={{ marginTop: '30px' }}>
      <h2 style={{ borderBottom: '2px solid var(--primary-color)', paddingBottom: '10px', marginBottom: '30px' }}>오시는 길</h2>
      
      <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: 'var(--shadow)' }}>
        <div style={{ height: '400px', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', marginBottom: '20px' }}>
            {/* 지도 API 연동 전 임시 플레이스홀더 */}
            <div style={{ textAlign: 'center', color: '#666' }}>
                <h3 style={{ margin: 0 }}>지도 영역</h3>
                <p>서울시 강남구 도산대로 123, 도자기빌딩 1층</p>
            </div>
        </div>

        <div style={{ lineHeight: '1.8' }}>
            <h3>주소</h3>
            <p>서울특별시 강남구 도산대로 123, 도자기빌딩 1층 (우편번호: 06000)</p>
            
            <h3 style={{ marginTop: '20px' }}>교통편 안내</h3>
            <p><strong>지하철:</strong> 3호선 신사역 1번 출구 도보 5분</p>
            <p><strong>버스:</strong> 신사동고개 정류장 하차 (145, 440, 4212번)</p>
        </div>
      </div>
    </div>
  );
}

export default Location;
