import React from 'react';
import { Row, Col, Typography, Image, Card, Divider, Space, Tag, ConfigProvider } from 'antd';
import {
    CoffeeOutlined,
    WifiOutlined,
    SmileOutlined,
    ClockCircleOutlined,
    EnvironmentOutlined,
    PhoneOutlined,
    HeartOutlined,
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const AboutCafe = () => {
    // Cấu hình style chung để code gọn gàng, dễ bảo trì và không lỗi ESLint
    const sectionStyle = {
        background: '#fafafa',
        minHeight: '100vh',
        padding: 'clamp(24px, 5vw, 64px) 0',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial',
    };

    const cardStyle = {
        borderRadius: 16,
        height: '100%',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        border: 'none',
    };

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#9254de',
                    borderRadius: 12,
                },
            }}
        >
            <div style={sectionStyle}>
                <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>

                    {/* Section 1: Giới thiệu chính */}
                    <Row gutter={[48, 32]} align="middle">
                        <Col xs={24} md={12}>
                            <div style={{ borderRadius: 20, overflow: 'hidden', lineHeight: 0 }}>
                                <Image
                                    src="https://cms.saymee.vn/images/notifications/1685084153857_dscf6620.mp4_.19_15_01_23.still001%20(1).jpg"
                                    alt="Tranquil Cafe Interior"
                                    style={{
                                        width: '100%',
                                        aspectRatio: '4/3',
                                        objectFit: 'cover',
                                    }}
                                    preview={true}
                                />
                            </div>
                        </Col>

                        <Col xs={24} md={12}>
                            <Space direction="vertical" size="large" style={{ display: 'flex' }}>
                                <div>
                                    <Tag color="purple" style={{ marginBottom: 12 }}>SINCE 2024</Tag>
                                    <Title level={1} style={{ margin: 0, fontSize: 'clamp(24px, 5vw, 38px)' }}>
                                        Chào mừng đến với <span style={{ color: '#9254de' }}>Cafe Tranquil</span>
                                    </Title>
                                </div>

                                <Paragraph style={{ fontSize: 16, lineHeight: 1.8, color: '#434343', margin: 0 }}>
                                    Tọa lạc giữa lòng thành phố nhộn nhịp, <strong>Cafe Tranquil</strong> là điểm đến lý tưởng cho những ai yêu thích sự thanh bình và một tách cà phê nguyên chất đậm đà.
                                </Paragraph>

                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Text type="secondary">Trải nghiệm</Text>
                                        <div style={{ fontSize: 20, fontWeight: 'bold' }}>Không gian mở</div>
                                    </Col>
                                    <Col span={12}>
                                        <Text type="secondary">Chất lượng</Text>
                                        <div style={{ fontSize: 20, fontWeight: 'bold' }}>Premium Beans</div>
                                    </Col>
                                </Row>
                            </Space>
                        </Col>
                    </Row>

                    <Divider style={{ margin: '48px 0' }} />

                    {/* Section 2: Tiện ích - Card hover được xử lý qua thuộc tính hoverable của AntD */}
                    <Row gutter={[24, 24]}>
                        {[
                            { icon: <CoffeeOutlined />, title: 'Cà phê nguyên chất', desc: 'Hương vị đậm đà từ hạt Robusta & Arabica chọn lọc.' },
                            { icon: <WifiOutlined />, title: 'Wi-Fi Tốc độ cao', desc: 'Phục vụ nhu cầu làm việc và học tập hiệu quả.' },
                            { icon: <SmileOutlined />, title: 'Không gian yên tĩnh', desc: 'Tách biệt khỏi tiếng ồn, thư giãn tuyệt đối.' },
                        ].map((item, index) => (
                            <Col xs={24} sm={8} key={index}>
                                <Card
                                    hoverable
                                    style={{ ...cardStyle, textAlign: 'center' }}
                                    styles={{ body: { padding: '32px 20px' } }}
                                >
                                    <div style={{ fontSize: 40, color: '#9254de', marginBottom: 16 }}>
                                        {item.icon}
                                    </div>
                                    <Title level={4}>{item.title}</Title>
                                    <Text type="secondary">{item.desc}</Text>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    <Divider style={{ margin: '48px 0' }} />

                    {/* Section 3: Thông tin chi tiết */}
                    <Row gutter={[24, 24]}>
                        <Col xs={24} md={12}>
                            <Card
                                title={<Space><ClockCircleOutlined /> Giờ mở cửa</Space>}
                                style={cardStyle}
                            >
                                <Row justify="space-between" style={{ marginBottom: 12 }}>
                                    <Text>Thứ 2 - Thứ 6:</Text>
                                    <Text strong>07:00 - 22:00</Text>
                                </Row>
                                <Row justify="space-between" style={{ marginBottom: 20 }}>
                                    <Text>Thứ 7 - Chủ nhật:</Text>
                                    <Text strong>08:00 - 23:00</Text>
                                </Row>
                                <div style={{ padding: 12, background: '#f9f0ff', borderRadius: 8 }}>
                                    <Text type="secondary" style={{ fontSize: 13 }}>
                                        <HeartOutlined style={{ marginRight: 4 }} />
                                        Lưu ý: Đặt chỗ trước cho nhóm trên 6 người.
                                    </Text>
                                </div>
                            </Card>
                        </Col>

                        <Col xs={24} md={12}>
                            <Card
                                title={<Space><EnvironmentOutlined /> Thông tin liên hệ</Space>}
                                style={cardStyle}
                            >
                                <Paragraph>
                                    <Text type="secondary">Địa chỉ:</Text><br />
                                    <Text strong>123 Tranquil Street, Quận 1, TP. Hồ Chí Minh</Text>
                                </Paragraph>
                                <Paragraph style={{ marginBottom: 0 }}>
                                    <Text type="secondary">Hotline:</Text><br />
                                    <a href="tel:0123456789" style={{ fontSize: 18, fontWeight: 'bold', color: '#9254de' }}>
                                        <PhoneOutlined style={{ marginRight: 8 }} />
                                        0123 456 789
                                    </a>
                                </Paragraph>
                            </Card>
                        </Col>
                    </Row>

                    {/* Section 4: Bản đồ */}
                    <div style={{ marginTop: 48 }}>
                        <Title level={4} style={{ marginBottom: 20 }}>Vị trí trên bản đồ</Title>
                        <div style={{ borderRadius: 16, overflow: 'hidden', height: 350, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
                            <iframe
                                title="Cafe Map"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4602324283407!2d106.6914569!3d10.7760194!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f3adb37910d%3A0x600b3d647a4f669e!2zRGluaCDEkOG7mWMgTOG6rXA!5e0!3m2!1svi!2svn!4v1700000000000!5m2!1svi!2svn"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </ConfigProvider>
    );
};

export default AboutCafe;