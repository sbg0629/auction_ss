import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import '../App.css';

function AdminRevenuePage() {
    const [revenues, setRevenues] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRevenue();
    }, []);

    const fetchRevenue = async () => {
        try {
            const response = await axios.get('/api/admin/revenue');
            const data = response.data;
            setRevenues(Array.isArray(data) ? data : []);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch revenue', error);
            toast.error('수익 정보를 불러오는데 실패했습니다.');
            setRevenues([]);
            setLoading(false);
        }
    };

    const safeRevenues = Array.isArray(revenues) ? revenues : [];
    const totalRevenue = safeRevenues.reduce((sum, item) => sum + (item?.feeAmount ?? 0), 0);
    const totalSales = safeRevenues.reduce((sum, item) => sum + (item?.totalAmount ?? 0), 0);

    if (loading) return <div className="container" style={{ padding: '50px', textAlign: 'center' }}>Loading...</div>;

    return (
        <div className="container" style={{ marginTop: '30px' }}>
            <h1 style={{ marginBottom: '20px' }}>수익 관리 (정산)</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                <div className="card" style={{ padding: '20px', textAlign: 'center', backgroundColor: '#e3f2fd' }}>
                    <h3>총 플랫폼 수익 (수수료)</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1976d2', margin: '10px 0' }}>
                        {totalRevenue.toLocaleString()} KRW
                    </p>
                </div>
                <div className="card" style={{ padding: '20px', textAlign: 'center', backgroundColor: '#f3e5f5' }}>
                    <h3>총 거래액 (매출)</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#7b1fa2', margin: '10px 0' }}>
                        {totalSales.toLocaleString()} KRW
                    </p>
                </div>
            </div>

            <div className="card" style={{ padding: '20px' }}>
                <h3>수익 상세 내역</h3>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                                <th style={{ padding: '12px', textAlign: 'left' }}>결제일</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>상품명</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>구매자</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>판매자</th>
                                <th style={{ padding: '12px', textAlign: 'right' }}>낙찰가 (정산금)</th>
                                <th style={{ padding: '12px', textAlign: 'right', color: '#d32f2f' }}>수수료 (수익)</th>
                                <th style={{ padding: '12px', textAlign: 'right' }}>총 결제금액</th>
                                <th style={{ padding: '12px', textAlign: 'center' }}>상태</th>
                            </tr>
                        </thead>
                        <tbody>
                            {safeRevenues.map((item) => (
                                <tr key={item.paymentId} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '12px' }}>{new Date(item.paymentDate).toLocaleDateString()}</td>
                                    <td style={{ padding: '12px' }}>{item.itemTitle}</td>
                                    <td style={{ padding: '12px' }}>{item.buyerName}</td>
                                    <td style={{ padding: '12px' }}>{item.sellerName}</td>
                                    <td style={{ padding: '12px', textAlign: 'right' }}>{item.netAmount.toLocaleString()}</td>
                                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', color: '#d32f2f' }}>
                                        {item.feeAmount.toLocaleString()}
                                    </td>
                                    <td style={{ padding: '12px', textAlign: 'right' }}>{item.totalAmount.toLocaleString()}</td>
                                    <td style={{ padding: '12px', textAlign: 'center' }}>
                                        <span className={`status-badge ${item.status === 'SUCCESS' ? 'status-ended' : ''}`} 
                                              style={{ backgroundColor: item.status === 'SUCCESS' ? '#4caf50' : '#999' }}>
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {safeRevenues.length === 0 && (
                                <tr>
                                    <td colSpan="8" style={{ padding: '30px', textAlign: 'center', color: '#888' }}>
                                        수익 내역이 없습니다.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AdminRevenuePage;
