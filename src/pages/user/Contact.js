import React, { useState } from 'react';
import { Row, Col, Form, Input, Button, Card, Typography, message, Divider, Space, ConfigProvider } from 'antd';
import { MailOutlined, PhoneOutlined, HomeOutlined, SendOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const Contact = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/contacts`, values);
            if (response.data.success) {
                message.success('Cảm ơn bạn! Chúng tôi sẽ phản hồi sớm nhất.');
                form.resetFields();
            } else {
                message.error(response.data.message);
            }
        } catch (error) {
            message.error('Không thể gửi tin nhắn. Vui lòng thử lại sau!');
        } finally {
            setLoading(false);
        }
    };

    const infoItemStyle = {
        padding: '16px',
        borderRadius: '12px',
        background: '#f0f2f5',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        transition: 'all 0.3s'
    };

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#1890ff',
                    borderRadius: 10,
                },
            }}
        >
            <div style={{ background: 'linear-gradient(180deg, #e6f7ff 0%, #ffffff 300px)', minHeight: '100vh', padding: '40px 20px' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto' }}>

                    {/* Header Section */}
                    <div style={{ textAlign: 'center', marginBottom: 48 }}>
                        <Title level={1} style={{ marginBottom: 12 }}>Liên hệ với chúng tôi</Title>
                        <Paragraph style={{ fontSize: 16, color: '#595959' }}>
                            Bạn có câu hỏi hay cần tư vấn? Đừng ngần ngại để lại lời nhắn cho chúng tôi.
                        </Paragraph>
                    </div>

                    <Row gutter={[40, 40]}>
                        {/* Left: Contact Form */}
                        <Col xs={24} lg={14}>
                            <Card
                                bordered={false}
                                style={{ boxShadow: '0 10px 25px rgba(0,0,0,0.05)', borderRadius: 20 }}
                                bodyStyle={{ padding: '32px' }}
                            >
                                <Title level={3} style={{ marginBottom: 24 }}>Gửi tin nhắn</Title>
                                <Form
                                    layout="vertical"
                                    form={form}
                                    onFinish={handleSubmit}
                                    size="large"
                                >
                                    <Row gutter={16}>
                                        <Col xs={24} md={12}>
                                            <Form.Item
                                                name="name"
                                                label="Họ và tên"
                                                rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
                                            >
                                                <Input placeholder="Nguyễn Văn A" prefix={<Text type="secondary" />} />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={12}>
                                            <Form.Item
                                                name="email"
                                                label="Email"
                                                rules={[
                                                    { required: true, message: 'Vui lòng nhập email' },
                                                    { type: 'email', message: 'Email không hợp lệ' }
                                                ]}
                                            >
                                                <Input placeholder="example@gmail.com" />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Form.Item
                                        name="phone"
                                        label="Số điện thoại"
                                        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                                    >
                                        <Input placeholder="09xx xxx xxx" />
                                    </Form.Item>

                                    <Form.Item
                                        name="subject"
                                        label="Tiêu đề"
                                        rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
                                    >
                                        <Input placeholder="Tôi muốn tư vấn về..." />
                                    </Form.Item>

                                    <Form.Item
                                        name="message"
                                        label="Nội dung"
                                        rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
                                    >
                                        <TextArea rows={4} placeholder="Nhập nội dung chi tiết..." style={{ borderRadius: 12 }} />
                                    </Form.Item>

                                    <Form.Item style={{ marginBottom: 0 }}>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            loading={loading}
                                            icon={<SendOutlined />}
                                            block
                                            style={{ height: 50, fontSize: 16, fontWeight: 600 }}
                                        >
                                            Gửi liên hệ ngay
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </Card>
                        </Col>

                        {/* Right: Info & Map */}
                        <Col xs={24} lg={10}>
                            <div style={{ padding: '10px' }}>
                                <Title level={3} style={{ marginBottom: 24 }}>Thông tin hỗ trợ</Title>

                                <div style={infoItemStyle}>
                                    <AvatarIcon icon={<HomeOutlined />} color="#1890ff" />
                                    <div style={{ marginLeft: 16 }}>
                                        <Text type="secondary" style={{ display: 'block', fontSize: 12 }}>Địa chỉ</Text>
                                        <Text strong>123 Đường ABC, Quận 1, TP.HCM</Text>
                                    </div>
                                </div>

                                <div style={infoItemStyle}>
                                    <AvatarIcon icon={<PhoneOutlined />} color="#52c41a" />
                                    <div style={{ marginLeft: 16 }}>
                                        <Text type="secondary" style={{ display: 'block', fontSize: 12 }}>Hotline</Text>
                                        <Text strong>0909 123 456</Text>
                                    </div>
                                </div>

                                <div style={infoItemStyle}>
                                    <AvatarIcon icon={<MailOutlined />} color="#faad14" />
                                    <div style={{ marginLeft: 16 }}>
                                        <Text type="secondary" style={{ display: 'block', fontSize: 12 }}>Email</Text>
                                        <Text strong>contact@company.com</Text>
                                    </div>
                                </div>

                                <Divider style={{ margin: '32px 0' }}>Bản đồ</Divider>

                                <div style={{ borderRadius: 20, overflow: 'hidden', boxShadow: '0 8px 20px rgba(0,0,0,0.1)', height: 260 }}>
                                    <iframe
                                        title="Electric Power University"
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.2404132751766!2d105.7849436!3d21.046388!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135abb158a2305d%3A0x5c357d21c785ea3d!2sElectric%20Power%20University!5e0!3m2!1sen!2s!4v1718800000000!5m2!1sen!2s"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen=""
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    />
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </ConfigProvider>
    );
};

// Helper Component cho Icon
const AvatarIcon = ({ icon, color }) => (
    <div style={{
        width: 44,
        height: 44,
        borderRadius: '12px',
        background: '#fff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 20,
        color: color,
        boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
    }}>
        {icon}
    </div>
);

export default Contact;