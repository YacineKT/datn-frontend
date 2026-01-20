import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Row, Col, Typography, Button, Image, message,
    Skeleton, Space, Tag, Card, Divider, InputNumber
} from 'antd';
import { ArrowLeftOutlined, ShoppingCartOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { CartContext } from './CartContext';
import { formatCurrency } from '../../utils/helpers'; // Đảm bảo bạn dùng hàm format chung

const { Title, Text, Paragraph } = Typography;
const DEFAULT_IMAGE = "https://www.unfe.org/wp-content/uploads/2019/04/SM-placeholder.png";

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [sizes, setSizes] = useState([]);
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);

    const API_URL = process.env.REACT_APP_API_URL;
    const { fetchCartCount } = useContext(CartContext);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        axios.get(`${API_URL}/products/with-sizes`)
            .then(res => {
                const productSizes = res.data.data.filter(p => p.product_id === parseInt(id));
                if (productSizes.length > 0) {
                    setSizes(productSizes);
                    setSelectedSize(productSizes[0]);
                } else {
                    message.error('Không tìm thấy sản phẩm.');
                }
            })
            .catch(() => message.error('Lỗi khi tải dữ liệu sản phẩm.'))
            .finally(() => setLoading(false));
    }, [id, API_URL]);

    const handleSizeChange = (sizeId) => {
        const selected = sizes.find(s => s.size_id === sizeId);
        if (selected) setSelectedSize(selected);
    };

    const handleAddToCart = async () => {
        if (!user) {
            message.warning('Vui lòng đăng nhập để thêm vào giỏ hàng');
            return navigate('/auth/login');
        }

        try {
            await axios.post(`${API_URL}/carts/add`, {
                userId: user.id,
                productId: selectedSize.product_id,
                sizeId: selectedSize.size_id,
                quantity: quantity
            });

            message.success(`Đã thêm ${quantity} ${selectedSize.product_name} vào giỏ hàng`);
            fetchCartCount();
        } catch (err) {
            message.error('Lỗi khi thêm vào giỏ hàng');
        }
    };

    if (loading) return <div style={{ padding: '50px' }}><Skeleton active avatar paragraph={{ rows: 10 }} /></div>;
    if (!selectedSize) return <div style={{ textAlign: 'center', padding: '100px' }}><Title level={4}>Sản phẩm không tồn tại</Title><Button onClick={() => navigate('/products')}>Quay lại cửa hàng</Button></div>;

    const isDiscounted = parseFloat(selectedSize.final_price) < parseFloat(selectedSize.price_with_additional);

    return (
        <div style={{ backgroundColor: '#fcfcfc', minHeight: '100vh', padding: '30px 0' }}>
            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px' }}>
                <Button
                    type="text"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate(-1)}
                    style={{ marginBottom: 20, fontSize: 16, display: 'flex', alignItems: 'center' }}
                >
                    Quay lại danh sách
                </Button>

                <Card bordered={false} style={{ borderRadius: 20, boxShadow: '0 10px 30px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                    <Row gutter={[40, 40]}>
                        {/* CỘT ẢNH */}
                        <Col xs={24} md={11}>
                            <div style={{ borderRadius: 16, overflow: 'hidden', backgroundColor: '#f5f5f5' }}>
                                <Image
                                    src={selectedSize.image || DEFAULT_IMAGE}
                                    fallback={DEFAULT_IMAGE}
                                    alt={selectedSize.product_name}
                                    style={{
                                        width: '100%',
                                        aspectRatio: '1/1',
                                        objectFit: 'cover',
                                    }}
                                />
                            </div>
                        </Col>

                        {/* CỘT THÔNG TIN */}
                        <Col xs={24} md={13}>
                            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                <div>
                                    <Tag color="orange" style={{ marginBottom: 8, borderRadius: 4 }}>{selectedSize.category_name}</Tag>
                                    <Title level={1} style={{ margin: '0 0 10px 0', fontSize: 32 }}>{selectedSize.product_name}</Title>
                                    
                                    <Space align="baseline" size="middle">
                                        <Text style={{ fontSize: 28, color: '#a0522d', fontWeight: 800 }}>
                                            {formatCurrency(selectedSize.final_price)}
                                        </Text>
                                        {isDiscounted && (
                                            <Text delete type="secondary" style={{ fontSize: 18 }}>
                                                {formatCurrency(selectedSize.price_with_additional)}
                                            </Text>
                                        )}
                                    </Space>
                                </div>

                                <Divider style={{ margin: '10px 0' }} />

                                <div>
                                    <Text strong style={{ fontSize: 16 }}>Mô tả sản phẩm:</Text>
                                    <Paragraph style={{ color: '#666', marginTop: 8, fontSize: 15, lineHeight: '1.8' }}>
                                        {selectedSize.description || "Chưa có mô tả chi tiết cho sản phẩm này."}
                                    </Paragraph>
                                </div>

                                <div>
                                    <Text strong style={{ fontSize: 16, display: 'block', marginBottom: 12 }}>Chọn kích cỡ (Size):</Text>
                                    <Space size="middle">
                                        {sizes.map(size => (
                                            <Button
                                                key={size.size_id}
                                                size="large"
                                                type={selectedSize.size_id === size.size_id ? 'primary' : 'default'}
                                                style={{ 
                                                    minWidth: 80, 
                                                    borderRadius: 8,
                                                    fontWeight: selectedSize.size_id === size.size_id ? 600 : 400
                                                }}
                                                onClick={() => handleSizeChange(size.size_id)}
                                            >
                                                {size.size_name}
                                            </Button>
                                        ))}
                                    </Space>
                                </div>

                                <div>
                                    <Text strong style={{ fontSize: 16, display: 'block', marginBottom: 12 }}>Số lượng:</Text>
                                    <InputNumber 
                                        min={1} 
                                        max={99} 
                                        value={quantity} 
                                        onChange={setQuantity} 
                                        size="large"
                                        style={{ borderRadius: 8, width: 120 }}
                                    />
                                </div>

                                <div style={{ marginTop: 20 }}>
                                    <Button 
                                        type="primary" 
                                        icon={<ShoppingCartOutlined />} 
                                        size="large" 
                                        block
                                        onClick={handleAddToCart}
                                        style={{ 
                                            height: 55, 
                                            borderRadius: 12, 
                                            fontSize: 18, 
                                            fontWeight: 600,
                                            backgroundColor: '#a0522d',
                                            border: 'none'
                                        }}
                                    >
                                        Thêm vào giỏ hàng • {formatCurrency(selectedSize.final_price * quantity)}
                                    </Button>
                                    <div style={{ textAlign: 'center', marginTop: 15 }}>
                                        <Text type="secondary" style={{ fontSize: 13 }}>
                                            <SafetyCertificateOutlined /> Đảm bảo chất lượng & Giao hàng nhanh chóng
                                        </Text>
                                    </div>
                                </div>
                            </Space>
                        </Col>
                    </Row>
                </Card>
            </div>
        </div>
    );
};

export default ProductDetail;