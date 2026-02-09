import { useEffect, useRef } from 'react'

const AddressSearchModal = ({ onClose, onComplete }) => {
  const containerRef = useRef(null)

  useEffect(() => {
    // index.html에 이미 스크립트가 로드되어 있다고 가정
    // 혹은 로드되지 않았을 경우를 대비한 방어 코드를 추가할 수도 있음
    if (!window.daum || !window.daum.Postcode) {
      console.error('Daum Postcode script not loaded')
      return
    }

    const postcode = new window.daum.Postcode({
      oncomplete: function(data) {
        var addr = ''; 
        var extraAddr = ''; 

        if (data.userSelectedType === 'R') { 
            addr = data.roadAddress;
        } else { 
            addr = data.jibunAddress;
        }

        if(data.userSelectedType === 'R'){
            if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
                extraAddr += data.bname;
            }
            if(data.buildingName !== '' && data.apartment === 'Y'){
                extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
            }
            if(extraAddr !== ''){
                extraAddr = ' (' + extraAddr + ')';
            }
        }

        onComplete(addr + extraAddr)
        onClose()
      },
      width: '100%',
      height: '100%'
    })

    if (containerRef.current) {
        containerRef.current.innerHTML = '' // 중복 생성 방지: 기존 내용 초기화
        postcode.embed(containerRef.current)
    }
  }, [])

  return (
    <div className="modal-overlay" onClick={onClose} style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{
        backgroundColor: 'white', padding: '20px', borderRadius: '8px', width: '90%', maxWidth: '500px', height: '500px', position: 'relative'
      }}>
        <button onClick={onClose} style={{
            position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer'
        }}>&times;</button>
        <h3 style={{ marginTop: 0, marginBottom: '15px' }}>주소 검색</h3>
        <div ref={containerRef} style={{ width: '100%', height: '400px' }}></div>
      </div>
    </div>
  )
}

export default AddressSearchModal
