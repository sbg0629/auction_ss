import { Link } from 'react-router-dom';

const RecentViewed = () => {
  const getRecentItems = () => {
    try {
      const items = localStorage.getItem('recentViewed');
      const parsed = items ? JSON.parse(items) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  };

  const recentItems = getRecentItems();

  if (!recentItems?.length) return null;

  return (
    <div style={{ marginTop: '50px', marginBottom: '30px' }}>
      <h3 style={{ fontSize: '1.2rem', marginBottom: '15px', color: '#333' }}>최근 본 상품</h3>
      <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '10px' }}>
        {recentItems.map((item) => (
          <Link 
            key={item.id} 
            to={`/auctions/${item.id}`}
            style={{ 
              display: 'block', 
              textDecoration: 'none', 
              color: 'inherit',
              minWidth: '120px',
              maxWidth: '120px'
            }}
          >
            <div style={{ 
              width: '120px', 
              height: '120px', 
              borderRadius: '8px', 
              overflow: 'hidden',
              marginBottom: '8px',
              border: '1px solid #eee'
            }}>
              {item.imageUrl ? (
                <img 
                  src={item.imageUrl}
                  alt={item.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
                  🏺
                </div>
              )}
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {item.title}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#e53935', fontWeight: 'bold' }}>
              {item.price?.toLocaleString()} KRW
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentViewed;
