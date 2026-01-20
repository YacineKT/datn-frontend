import React, { useEffect, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import {
    Table, Button, InputNumber, Typography, message,
    Popconfirm, Empty, Image, Card, Space, Tag, Row, Col, Divider
} from 'antd';
import { DeleteOutlined, ShoppingCartOutlined, ArrowLeftOutlined, CreditCardOutlined } from '@ant-design/icons';
import { formatCurrency } from '../../utils/helpers';
import { CartContext } from './CartContext';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const API_URL = process.env.REACT_APP_API_URL;

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const { fetchCartCount } = useContext(CartContext);
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user?.id;

    const fetchCart = useCallback(async () => {
        if (!userId) return;
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/carts/${userId}`);
            const items = Array.isArray(res.data?.data?.items) ? res.data.data.items : [];
            setCartItems(items);
            if (fetchCartCount) fetchCartCount();
        } catch (err) {
            message.error('Không thể tải giỏ hàng');
            setCartItems([]);
        } finally {
            setLoading(false);
        }
    }, [userId, fetchCartCount]);

    useEffect(() => {
        if (!userId) {
            message.warning('Bạn cần đăng nhập để xem giỏ hàng');
        } else {
            fetchCart();
        }
    }, [userId, fetchCart]);

    const handleQuantityChange = async (value, cartItemId) => {
        if (value === null || value < 1) return;

        // Optimistic UI update: Cập nhật giao diện ngay lập tức
        setCartItems(prev => prev.map(item =>
            item.id === cartItemId ? { ...item, quantity: value } : item
        ));

        try {
            await axios.put(`${API_URL}/carts/update`, { cartItemId, quantity: value });
            if (fetchCartCount) fetchCartCount();
        } catch (error) {
            message.error('Lỗi khi cập nhật số lượng');
            fetchCart(); // Hoàn tác nếu lỗi
        }
    };

    const handleRemove = async (cartItemId) => {
        try {
            await axios.delete(`${API_URL}/carts/remove`, { data: { cartItemId } });
            message.success('Đã xóa sản phẩm');
            setCartItems(prev => prev.filter(item => item.id !== cartItemId));
            if (fetchCartCount) fetchCartCount();
        } catch (error) {
            message.error('Lỗi khi xóa sản phẩm');
        }
    };

    const totalAmount = cartItems.reduce(
        (sum, item) => sum + Number(item.price || 0) * (item.quantity || 0),
        0
    );

    // Cấu hình cột cho Desktop
    const columns = [
        {
            title: 'Sản phẩm',
            key: 'product',
            render: (_, record) => (
                <Space size="middle">
                    <Image
                        src={record.product?.image}
                        width={80}
                        height={80}
                        style={{ objectFit: 'cover', borderRadius: 12 }}
                        fallback="https://via.placeholder.com/80"
                    />
                    <div>
                        <Text strong style={{ fontSize: 16 }}>{record.product?.name}</Text>
                        <br />
                        <Tag color="purple">Size: {record.size?.name || 'Mặc định'}</Tag>
                    </div>
                </Space>
            )
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            render: (p) => <Text strong>{formatCurrency(Number(p))}</Text>
        },
        {
            title: 'Số lượng',
            render: (_, record) => (
                <InputNumber
                    min={1} max={99}
                    value={record.quantity}
                    onChange={(v) => handleQuantityChange(v, record.id)}
                    style={{ borderRadius: 6 }}
                />
            )
        },
        {
            title: 'Thành tiền',
            render: (_, record) => (
                <Text type="danger" strong>{formatCurrency(Number(record.price) * record.quantity)}</Text>
            )
        },
        {
            title: '',
            align: 'center',
            render: (_, record) => (
                <Popconfirm title="Xóa món này?" onConfirm={() => handleRemove(record.id)}>
                    <Button type="text" danger icon={<DeleteOutlined />} />
                </Popconfirm>
            )
        }
    ];

    return (
        <div style={{ backgroundColor: '#f5f7fa', minHeight: '100vh', padding: '20px 0' }}>
            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 15px' }}>
                <Space style={{ marginBottom: 20 }}>
                    <Button icon={<ArrowLeftOutlined />} type="text" onClick={() => navigate('/')}>Tiếp tục mua sắm</Button>
                </Space>

                <Title level={2} style={{ marginBottom: 30 }}>
                    <ShoppingCartOutlined style={{ marginRight: 12 }} />
                    Giỏ hàng của bạn
                </Title>

                {cartItems.length === 0 && !loading ? (
                    <Card bordered={false} style={{ textAlign: 'center', borderRadius: 20, padding: '40px 0' }}>
                        <Empty description="Giỏ hàng đang trống" />
                        <Button type="primary" size="large" onClick={() => navigate('/')} style={{ marginTop: 20, borderRadius: 10 }}>
                            Khám phá Menu ngay
                        </Button>
                    </Card>
                ) : (
                    <Row gutter={[24, 24]}>
                        {/* Cột trái: Danh sách sản phẩm */}
                        <Col xs={24} lg={16}>
                            {/* Hiển thị Bảng trên Desktop */}
                            <div className="desktop-cart">
                                <Card bordered={false} bodyStyle={{ padding: 0 }} style={{ borderRadius: 16, overflow: 'hidden' }}>
                                    <Table
                                        dataSource={cartItems}
                                        columns={columns}
                                        rowKey="id"
                                        pagination={false}
                                        loading={loading}
                                    />
                                </Card>
                            </div>

                            {/* Hiển thị Card List trên Mobile */}
                            <div className="mobile-cart">
                                {cartItems.map(item => (
                                    <Card key={item.id} style={{ marginBottom: 12, borderRadius: 12 }} bodyStyle={{ padding: 12 }}>
                                        <Row gutter={12} align="middle">
                                            <Col span={8}>
                                                <Image src={item.product?.image} style={{ borderRadius: 8, aspectRatio: '1/1', objectFit: 'cover' }} />
                                            </Col>
                                            <Col span={16}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Text strong>{item.product?.name}</Text>
                                                    <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleRemove(item.id)} />
                                                </div>
                                                <Text type="secondary" size="small">Size: {item.size?.name || 'Mặc định'}</Text>
                                                <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Text type="danger" strong>{formatCurrency(item.price)}</Text>
                                                    <InputNumber min={1} value={item.quantity} onChange={(v) => handleQuantityChange(v, item.id)} size="small" />
                                                </div>
                                            </Col>
                                        </Row>
                                    </Card>
                                ))}
                            </div>
                        </Col>

                        {/* Cột phải: Tóm tắt đơn hàng */}
                        <Col xs={24} lg={8}>
                            <Card
                                title="Tóm tắt đơn hàng"
                                bordered={false}
                                style={{ borderRadius: 16, position: 'sticky', top: 20 }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                                    <Text type="secondary">Tạm tính</Text>
                                    <Text>{formatCurrency(totalAmount)}</Text>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                                    <Text type="secondary">Phí vận chuyển</Text>
                                    <Text strong color="green">Miễn phí</Text>
                                </div>
                                <Divider />
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                                    <Title level={4}>Tổng cộng</Title>
                                    <Title level={4} style={{ color: '#ff4d4f', margin: 0 }}>{formatCurrency(totalAmount)}</Title>
                                </div>
                                <Button
                                    type="primary"
                                    block
                                    size="large"
                                    icon={<CreditCardOutlined />}
                                    style={{ height: 50, borderRadius: 12, fontSize: 18, fontWeight: 'bold' }}
                                    onClick={() => navigate('/order')}
                                >
                                    Thanh toán ngay
                                </Button>
                            </Card>
                        </Col>
                    </Row>
                )}
            </div>

            <style>{`
                @media (max-width: 768px) {
                    .desktop-cart { display: none; }
                    .mobile-cart { display: block; }
                }
                @media (min-width: 769px) {
                    .desktop-cart { display: block; }
                    .mobile-cart { display: none; }
                }
            `}</style>
        </div>
    );
};

export default CartPage;