import React, { useEffect, useState } from 'react';
import { Table, Card, Spin, message, Typography, Tag, Space, Divider, Empty, Badge, Button, Row, Col } from 'antd';
import { ShoppingOutlined, ClockCircleOutlined, EnvironmentOutlined, FileTextOutlined } from '@ant-design/icons';
import axios from 'axios';
import { formatCurrency } from '../../utils/helpers';

const { Title, Text } = Typography;

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const storedUser = localStorage.getItem('user');
                if (!storedUser) {
                    message.error('Vui lòng đăng nhập để xem lịch sử');
                    return;
                }

                const user = JSON.parse(storedUser);
                const res = await axios.get(`${API_URL}/orders/user/${user.id}/details`);
                setOrders(res.data.data);
            } catch (error) {
                message.error('Lấy lịch sử đơn hàng thất bại');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [API_URL]);

    const getStatusTag = (status) => {
        const statusMap = {
            'pending': { color: 'warning', text: 'Chờ xử lý', icon: <ClockCircleOutlined /> },
            'confirmed': { color: 'blue', text: 'Đã xác nhận', icon: <ShoppingOutlined /> },
            'shipping': { color: 'processing', text: 'Đang giao', icon: <ShoppingOutlined /> },
            'completed': { color: 'success', text: 'Hoàn thành', icon: <ShoppingOutlined /> },
            'cancelled': { color: 'error', text: 'Đã hủy', icon: <ShoppingOutlined /> },
        };
        const config = statusMap[status?.toLowerCase()] || { color: 'default', text: status };
        return <Tag icon={config.icon} color={config.color}>{config.text.toUpperCase()}</Tag>;
    };

    const columns = [
        {
            title: 'Sản phẩm',
            dataIndex: 'product',
            key: 'product',
            render: (text, record) => (
                <Space>
                    {record.image && <img src={record.image} alt="" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} />}
                    <Text strong>{text}</Text>
                </Space>
            )
        },
        { title: 'Size', dataIndex: 'size', key: 'size', align: 'center' },
        { title: 'SL', dataIndex: 'quantity', key: 'quantity', align: 'center' },
        { 
            title: 'Tổng', 
            key: 'total', 
            align: 'right',
            render: (_, record) => formatCurrency(record.price * record.quantity) 
        },
    ];

    return (
        <div style={{ padding: '40px 20px', maxWidth: 1000, margin: '0 auto', minHeight: '80vh' }}>
            <Title level={2} style={{ marginBottom: 32 }}>
                <ShoppingOutlined style={{ marginRight: 12 }} />
                Lịch sử mua hàng
            </Title>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '100px 0' }}>
                    <Spin size="large" tip="Đang tải danh sách đơn hàng..." />
                </div>
            ) : orders.length === 0 ? (
                <Card style={{ textAlign: 'center', padding: '40px 0', borderRadius: 16 }}>
                    <Empty 
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="Bạn chưa có đơn hàng nào"
                    >
                        <Button type="primary" onClick={() => window.location.href = '/product'}>Mua sắm ngay</Button>
                    </Empty>
                </Card>
            ) : (
                orders.map((order) => (
                    <Badge.Ribbon 
                        key={order.id} 
                        text={getStatusTag(order.status)} 
                        color="transparent"
                        style={{ top: 15 }}
                    >
                        <Card
                            hoverable
                            style={{ marginBottom: 24, borderRadius: 16, border: '1px solid #f0f0f0', overflow: 'hidden' }}
                            title={
                                <Space direction="vertical" size={0}>
                                    <Text type="secondary" style={{ fontSize: 11 }}>Mã đơn hàng</Text>
                                    <Text strong>#ORD-{order.id.toString().slice(-6).toUpperCase()}</Text>
                                </Space>
                            }
                        >
                            <Row gutter={[24, 24]}>
                                <Col xs={24} md={8}>
                                    <Space direction="vertical" size={16} style={{ width: '100%' }}>
                                        <div>
                                            <Text type="secondary" style={{ fontSize: 12 }}><ClockCircleOutlined /> Ngày đặt:</Text>
                                            <div style={{ fontWeight: 500 }}>{new Date(order.createdAt).toLocaleString('vi-VN')}</div>
                                        </div>
                                        <div>
                                            <Text type="secondary" style={{ fontSize: 12 }}><EnvironmentOutlined /> Giao đến:</Text>
                                            <div style={{ fontSize: 13 }}>{order.shipping_address}</div>
                                        </div>
                                        {order.note && (
                                            <div>
                                                <Text type="secondary" style={{ fontSize: 12 }}><FileTextOutlined /> Ghi chú:</Text>
                                                <div style={{ fontSize: 13, fontStyle: 'italic' }}>{order.note}</div>
                                            </div>
                                        )}
                                    </Space>
                                </Col>
                                
                                <Col xs={24} md={16}>
                                    <Table
                                        size="small"
                                        columns={columns}
                                        dataSource={order.items.map((item) => ({
                                            key: item.id,
                                            product: item.product?.name,
                                            image: item.product?.image,
                                            size: item.size?.name,
                                            quantity: item.quantity,
                                            price: item.price,
                                        }))}
                                        pagination={false}
                                        bordered={false}
                                    />
                                    <Divider style={{ margin: '16px 0' }} />
                                    <div style={{ textAlign: 'right' }}>
                                        <Text style={{ fontSize: 14 }}>Tổng thanh toán: </Text>
                                        <Text style={{ fontSize: 18, color: '#a0522d', fontWeight: 700 }}>
                                            {formatCurrency(Number(order.total_price))}
                                        </Text>
                                    </div>
                                </Col>
                            </Row>
                        </Card>
                    </Badge.Ribbon>
                ))
            )}
        </div>
    );
};

export default OrderHistory;