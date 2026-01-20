import React, { useEffect } from 'react';
import { Result, Button, Card, Steps, Typography, Space, Divider } from 'antd';
import { useNavigate } from 'react-router-dom';
import { 
    ShoppingOutlined, 
    FileSearchOutlined, 
    HomeOutlined, 
    CheckCircleFilled,
    ClockCircleOutlined,
    CarOutlined
} from '@ant-design/icons';
import confetti from 'canvas-confetti';

const { Title, Text } = Typography;

const PaymentSuccess = () => {
    const navigate = useNavigate();

    // Hiệu ứng pháo hoa khi vừa load trang
    useEffect(() => {
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
    }, []);

    return (
        <div style={{ 
            background: 'linear-gradient(180deg, #f6ffed 0%, #ffffff 100%)', 
            minHeight: '100vh', 
            padding: '60px 20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <Card 
                style={{ 
                    maxWidth: 800, 
                    width: '100%', 
                    borderRadius: 24, 
                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                    border: 'none' 
                }}
            >
                <Result
                    status="success"
                    icon={<CheckCircleFilled style={{ color: '#52c41a', fontSize: 72 }} />}
                    title={
                        <Title level={2} style={{ margin: 0 }}>Thanh toán thành công!</Title>
                    }
                    subTitle={
                        <Space direction="vertical" style={{ marginTop: 8 }}>
                            <Text style={{ fontSize: 16, color: '#595959' }}>
                                Cảm ơn bạn đã tin tưởng Coffee Shop. 
                            </Text>
                            <Text type="secondary">Mã đơn hàng: <Text strong>#CS-{Math.floor(Math.random() * 100000)}</Text></Text>
                        </Space>
                    }
                    extra={[
                        <Button 
                            type="primary" 
                            key="home" 
                            size="large" 
                            icon={<HomeOutlined />}
                            onClick={() => navigate('/')}
                            style={{ borderRadius: 10, height: 45, padding: '0 24px' }}
                        >
                            Tiếp tục mua sắm
                        </Button>,
                        <Button 
                            key="history" 
                            size="large" 
                            icon={<FileSearchOutlined />}
                            onClick={() => navigate('/order-history')}
                            style={{ borderRadius: 10, height: 45 }}
                        >
                            Theo dõi đơn hàng
                        </Button>,
                    ]}
                >
                    <Divider orientation="left" style={{ marginTop: 40 }}>Quy trình xử lý</Divider>
                    
                    <div style={{ padding: '20px 0' }}>
                        <Steps
                            current={1}
                            size="small"
                            items={[
                                {
                                    title: 'Đã đặt hàng',
                                    icon: <ShoppingOutlined />,
                                },
                                {
                                    title: 'Xác nhận',
                                    icon: <ClockCircleOutlined />,
                                    description: 'Đang kiểm tra'
                                },
                                {
                                    title: 'Giao hàng',
                                    icon: <CarOutlined />,
                                },
                                {
                                    title: 'Hoàn tất',
                                    icon: <CheckCircleFilled />,
                                },
                            ]}
                        />
                    </div>

                    <Card 
                        bg="#f9f9f9" 
                        style={{ background: '#fafafa', borderRadius: 12, marginTop: 24, border: '1px dashed #d9d9d9' }}
                    >
                        <Text type="secondary" italic>
                            * Thông tin chi tiết đơn hàng đã được gửi vào email của bạn. 
                            Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ hotline 0909 123 456.
                        </Text>
                    </Card>
                </Result>
            </Card>
        </div>
    );
};

export default PaymentSuccess;