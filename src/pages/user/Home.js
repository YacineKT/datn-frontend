import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Row, Typography, Spin, Image, Space, Badge, ConfigProvider } from 'antd';
import { CoffeeOutlined, ArrowRightOutlined, HeartOutlined, StarFilled } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { formatCurrency } from '../../utils/helpers';

const { Title, Paragraph, Text } = Typography;

const Home = () => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [catRes, prodRes] = await Promise.all([
                axios.get(`${process.env.REACT_APP_API_URL}/categories`),
                axios.get(`${process.env.REACT_APP_API_URL}/products`)
            ]);
            setCategories(catRes.data.data);
            
            // Lấy ngẫu nhiên 8 sản phẩm
            const shuffled = prodRes.data.data.sort(() => 0.5 - Math.random());
            setProducts(shuffled.slice(0, 8));
        } catch (error) {
            console.error('Lỗi tải dữ liệu:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <Space direction="vertical" align="center">
                    <Spin size="large" />
                    <Text type="secondary">Đang pha cà phê, đợi chút nhé...</Text>
                </Space>
            </div>
        );
    }

    return (
        <ConfigProvider theme={{ token: { colorPrimary: '#a0522d' } }}>
            <div style={{ overflowX: 'hidden' }}>
                
                {/* --- HERO SECTION --- */}
                <div style={{ 
                    position: 'relative', 
                    padding: '80px 0', 
                    background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=2070") center/cover no-repeat',
                    color: '#fff',
                    marginBottom: 60
                }}>
                    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
                        <Row gutter={[40, 40]} align="middle">
                            <Col xs={24} md={14}>
                                <Badge status="warning" text={<Text style={{ color: '#fff' }}>Hạt cà phê nguyên chất 100%</Text>} />
                                <Title style={{ color: '#fff', fontSize: 'clamp(32px, 5vw, 56px)', marginBottom: 24, marginTop: 12 }}>
                                    Đánh thức cảm hứng <br /> trong từng <span style={{ color: '#d4a373' }}>Giọt Cà Phê</span>
                                </Title>
                                <Paragraph style={{ color: '#f0f0f0', fontSize: 18, maxWidth: 600, lineHeight: 1.8 }}>
                                    Trải nghiệm hương vị tinh tế từ những hạt Arabica tuyển chọn, được rang xay tỉ mỉ để mang đến cho bạn không chỉ là một thức uống, mà là cả một câu chuyện.
                                </Paragraph>
                                <Space size="large" style={{ marginTop: 24 }}>
                                    <Link to="/product">
                                        <Button type="primary" size="large" icon={<CoffeeOutlined />} style={{ height: 50, padding: '0 32px', borderRadius: 25 }}>
                                            Đặt hàng ngay
                                        </Button>
                                    </Link>
                                    <Button ghost size="large" style={{ height: 50, borderRadius: 25 }}>Khám phá không gian</Button>
                                </Space>
                            </Col>
                        </Row>
                    </div>
                </div>

                <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
                    
                    {/* --- CATEGORIES SECTION --- */}
                    <div style={{ marginBottom: 80 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
                            <div>
                                <Title level={2} style={{ marginBottom: 8 }}>Danh mục thực đơn</Title>
                                <Text type="secondary">Tìm kiếm hương vị yêu thích của bạn</Text>
                            </div>
                        </div>
                        <Row gutter={[20, 20]}>
                            {categories.map((cat) => (
                                <Col key={cat._id || cat.id} xs={12} sm={8} md={6}>
                                    <Link to={`/product?category=${cat._id || cat.id}`}>
                                        <Card 
                                            hoverable 
                                            bodyStyle={{ textAlign: 'center', padding: '24px 12px' }}
                                            style={{ borderRadius: 16, border: '1px solid #f0f0f0' }}
                                        >
                                            <div style={{ fontSize: 32, marginBottom: 12 }}>☕</div>
                                            <Title level={5} style={{ margin: 0 }}>{cat.name}</Title>
                                        </Card>
                                    </Link>
                                </Col>
                            ))}
                        </Row>
                    </div>

                    {/* --- FEATURED PRODUCTS --- */}
                    <div style={{ marginBottom: 80 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
                            <div>
                                <Title level={2} style={{ marginBottom: 8 }}>Sản phẩm bán chạy</Title>
                                <Text type="secondary">Gợi ý từ Barista của chúng tôi</Text>
                            </div>
                            <Link to="/product" style={{ color: '#a0522d', fontWeight: 600 }}>
                                Xem tất cả <ArrowRightOutlined />
                            </Link>
                        </div>
                        <Row gutter={[24, 32]}>
                            {products.map((product) => (
                                <Col key={product._id || product.id} xs={24} sm={12} md={6}>
                                    <Card
                                        hoverable
                                        style={{ borderRadius: 20, overflow: 'hidden', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}
                                        cover={
                                            <div style={{ overflow: 'hidden', position: 'relative' }}>
                                                <img
                                                    alt={product.name}
                                                    src={product.image || 'https://via.placeholder.com/300'}
                                                    style={{ height: 220, width: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                                                    className="product-img-hover"
                                                />
                                                <Button 
                                                    icon={<HeartOutlined />} 
                                                    style={{ position: 'absolute', top: 12, right: 12, border: 'none', borderRadius: '50%' }} 
                                                />
                                            </div>
                                        }
                                    >
                                        <Card.Meta
                                            title={<Link to={`/product/${product._id || product.id}`} style={{ color: '#333' }}>{product.name}</Link>}
                                            description={
                                                <Space direction="vertical" size={4} style={{ width: '100%' }}>
                                                    <Space style={{ fontSize: 12, color: '#faad14' }}>
                                                        <StarFilled /> <StarFilled /> <StarFilled /> <StarFilled /> <StarFilled />
                                                    </Space>
                                                    <Text strong style={{ fontSize: 18, color: '#a0522d' }}>
                                                        {formatCurrency(Number(product.price))}
                                                    </Text>
                                                </Space>
                                            }
                                        />
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </div>

                    {/* --- ABOUT SECTION --- */}
                    <Card bordered={false} style={{ borderRadius: 30, background: '#fff9f5', marginBottom: 80, overflow: 'hidden' }}>
                        <Row gutter={[40, 40]} align="middle">
                            <Col xs={24} md={12} style={{ padding: '60px' }}>
                                <Title level={2}>Về chúng tôi</Title>
                                <Paragraph style={{ fontSize: 16, lineHeight: 1.8, color: '#595959' }}>
                                    Tại <strong>Coffee Shop</strong>, chúng tôi tin rằng mỗi tách cà phê là một cầu nối. Chúng tôi kết nối niềm đam mê hạt cà phê Việt với quy trình chế biến quốc tế. 
                                    <br /><br />
                                    Không gian của chúng tôi được thiết kế để bạn tìm thấy sự tĩnh lặng giữa phố thị ồn ào. Dù là một sáng sớm bận rộn hay một buổi chiều tà suy tư, chúng tôi luôn ở đây để đồng hành cùng bạn.
                                </Paragraph>
                                <Button type="default" size="large" style={{ borderRadius: 10 }}>Tìm hiểu thêm</Button>
                            </Col>
                            <Col xs={24} md={12} style={{ padding: 0 }}>
                                <Image 
                                    preview={false}
                                    src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=2047" 
                                    alt="About Our Shop" 
                                    style={{ width: '100%', height: '500px', objectFit: 'cover' }} 
                                />
                            </Col>
                        </Row>
                    </Card>
                </div>

                {/* CSS để tạo hiệu ứng Hover Image */}
                <style>{`
                    .product-img-hover:hover {
                        transform: scale(1.1);
                    }
                `}</style>
            </div>
        </ConfigProvider>
    );
};

export default Home;