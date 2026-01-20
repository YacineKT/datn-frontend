import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import {
    Table, Button, Typography, message, Empty, Input, Radio, Form, 
    Card, Row, Col, Divider, Space, Tag, Avatar
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { 
    CreditCardOutlined, 
    CarOutlined, 
    ShoppingOutlined, 
    UserOutlined, 
    PhoneOutlined, 
    EnvironmentOutlined 
} from '@ant-design/icons';
import { formatCurrency } from '../../utils/helpers';
import { CartContext } from './CartContext';

const { TextArea } = Input;
const { Title, Text } = Typography;
const API_URL = process.env.REACT_APP_API_URL;

const Order = () => {
    const [form] = Form.useForm();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user?.id;
    const { fetchCartCount } = useContext(CartContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!userId) {
            message.warning('Bạn cần đăng nhập để thanh toán');
            navigate('/login');
            return;
        }
        fetchCart();
    }, [userId]);

    const fetchCart = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/carts/${userId}`);
            const items = Array.isArray(res.data?.data?.items) ? res.data.data.items : [];
            setCartItems(items);
        } catch (err) {
            message.error('Không thể tải giỏ hàng');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmOrder = async (values) => {
        setSubmitting(true);
        try {
            const items = cartItems.map(item => ({
                productId: item.productId,
                sizeId: item.sizeId,
                quantity: item.quantity,
                price: item.price
            }));

            const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

            const res = await axios.post(`${API_URL}/orders`, {
                userId,
                items,
                totalPrice,
                note: values.note || '',
                shipping_address: values.address,
                paymentMethod: values.paymentMethod.toLowerCase()
            });

            if (values.paymentMethod === 'paypal' && res.data.approveUrl) {
                window.location.href = res.data.approveUrl;
                return;
            }

            await axios.delete(`${API_URL}/carts/clear/${userId}`);
            fetchCartCount();
            message.success('Đặt hàng thành công!');
            navigate('/payment-success');
        } catch (error) {
            message.error('Lỗi khi xử lý đơn hàng');
        } finally {
            setSubmitting(false);
        }
    };

    const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div style={{ background: '#f8f9fa', minHeight: '100vh', padding: '40px 20px' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                <Title level={2} style={{ marginBottom: 32 }}>
                    <ShoppingOutlined /> Thanh toán đơn hàng
                </Title>

                {cartItems.length === 0 && !loading ? (
                    <Card style={{ textAlign: 'center', borderRadius: 16 }}>
                        <Empty description="Giỏ hàng trống" />
                        <Button type="primary" onClick={() => navigate('/product')}>Quay lại mua sắm</Button>
                    </Card>
                ) : (
                    <Form 
                        form={form} 
                        layout="vertical" 
                        onFinish={handleConfirmOrder}
                        initialValues={{
                            fullname: `${user.lastname || ''} ${user.firstname || ''}`.trim(),
                            phone: user.phone || '',
                            paymentMethod: 'COD'
                        }}
                    >
                        <Row gutter={[32, 32]}>
                            {/* CỘT TRÁI: THÔNG TIN GIAO HÀNG */}
                            <Col xs={24} lg={15}>
                                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                    <Card title={<><UserOutlined /> Thông tin nhận hàng</>} bordered={false} style={{ borderRadius: 16 }}>
                                        <Row gutter={16}>
                                            <Col span={12}>
                                                <Form.Item name="fullname" label="Họ và tên" rules={[{ required: true }]}>
                                                    <Input placeholder="Nhập tên người nhận" />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true }]}>
                                                    <Input placeholder="Số điện thoại liên lạc" prefix={<PhoneOutlined />} />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Form.Item name="address" label="Địa chỉ chi tiết" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ giao hàng' }]}>
                                            <TextArea rows={3} placeholder="Số nhà, tên đường, phường/xã..." prefix={<EnvironmentOutlined />} />
                                        </Form.Item>
                                        <Form.Item name="note" label="Ghi chú đơn hàng">
                                            <TextArea placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi đến..." />
                                        </Form.Item>
                                    </Card>

                                    <Card title={<><CreditCardOutlined /> Phương thức thanh toán</>} bordered={false} style={{ borderRadius: 16 }}>
                                        <Form.Item name="paymentMethod">
                                            <Radio.Group style={{ width: '100%' }}>
                                                <Space direction="vertical" style={{ width: '100%' }}>
                                                    <Radio.Button value="COD" style={paymentButtonStyle}>
                                                        <CarOutlined /> Thanh toán khi nhận hàng (COD)
                                                    </Radio.Button>
                                                    <Radio.Button value="paypal" style={paymentButtonStyle}>
                                                        <span style={{ color: '#003087', fontWeight: 'bold' }}>Pay</span>
                                                        <span style={{ color: '#009cde', fontWeight: 'bold' }}>Pal</span> 
                                                        <Text type="secondary" style={{ marginLeft: 8 }}>(Visa, Mastercard)</Text>
                                                    </Radio.Button>
                                                </Space>
                                            </Radio.Group>
                                        </Form.Item>
                                    </Card>
                                </Space>
                            </Col>

                            {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG */}
                            <Col xs={24} lg={9}>
                                <Card 
                                    title="Tóm tắt đơn hàng" 
                                    bordered={false} 
                                    style={{ borderRadius: 16, position: 'sticky', top: 24, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                                >
                                    <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: 20 }}>
                                        {cartItems.map(item => (
                                            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                                                <Space align="start">
                                                    <Avatar shape="square" size={48} src={item.product?.image} />
                                                    <div>
                                                        <Text strong style={{ display: 'block' }}>{item.product?.name}</Text>
                                                        <Text type="secondary" size="small">x{item.quantity} - {item.size?.name}</Text>
                                                    </div>
                                                </Space>
                                                <Text strong>{formatCurrency(item.price * item.quantity)}</Text>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <Divider />
                                    <Space direction="vertical" style={{ width: '100%' }} size="small">
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Text type="secondary">Tạm tính</Text>
                                            <Text>{formatCurrency(totalAmount)}</Text>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Text type="secondary">Phí vận chuyển</Text>
                                            <Tag color="green">Miễn phí</Tag>
                                        </div>
                                        <Divider style={{ margin: '12px 0' }} />
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Title level={4}>Tổng cộng</Title>
                                            <Title level={4} style={{ color: '#ff4d4f', margin: 0 }}>
                                                {formatCurrency(totalAmount)}
                                            </Title>
                                        </div>
                                    </Space>

                                    <Button
                                        type="primary"
                                        size="large"
                                        block
                                        htmlType="submit"
                                        loading={submitting}
                                        style={{ marginTop: 24, height: 54, borderRadius: 12, fontSize: 18, fontWeight: 'bold' }}
                                    >
                                        Xác nhận đặt hàng
                                    </Button>
                                    <Text type="secondary" style={{ textAlign: 'center', display: 'block', marginTop: 12, fontSize: 12 }}>
                                        Bằng cách đặt hàng, bạn đồng ý với các điều khoản của chúng tôi.
                                    </Text>
                                </Card>
                            </Col>
                        </Row>
                    </Form>
                )}
            </div>
        </div>
    );
};

const paymentButtonStyle = {
    width: '100%',
    height: 'auto',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #d9d9d9'
};

export default Order;