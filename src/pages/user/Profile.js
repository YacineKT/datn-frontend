import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Upload, message, Card, Typography, Avatar, Row, Col, Divider, Space } from 'antd';
import {
    UploadOutlined, UserOutlined, MailOutlined, PhoneOutlined,
    EditOutlined, SaveOutlined, CloseOutlined, LockOutlined,
    SafetyCertificateOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import normalizeFileName from '../../utils/normalizeFileName';

const { Title, Text } = Typography;

const Profile = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [userData, setUserData] = useState({});
    const [file, setFile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

    const API_URL = process.env.REACT_APP_API_URL;
    const REACT_APP_API_UPLOAD = process.env.REACT_APP_API_UPLOAD;
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            message.warning('Phiên đăng nhập đã hết. Vui lòng đăng nhập lại.');
            navigate('/auth/login');
        }
    }, [navigate]);

    useEffect(() => {
        if (storedUser && storedUser.id) {
            const initialValues = {
                firstname: storedUser.firstname,
                lastname: storedUser.lastname,
                email: storedUser.email,
                phone: storedUser.phone,
            };
            form.setFieldsValue(initialValues);
            setUserData(storedUser);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form]);

    const handleUploadChange = ({ fileList }) => {
        const rawFile = fileList?.[0]?.originFileObj;
        if (!rawFile) return;
        const newFileName = normalizeFileName(rawFile.name);
        const renamedFile = new File([rawFile], newFileName, { type: rawFile.type });
        setFile(renamedFile);
        const reader = new FileReader();
        reader.onload = () => setPreviewImage(reader.result);
        reader.readAsDataURL(renamedFile);
    };

    const onFinish = async (values) => {
        setLoading(true);
        const formData = new FormData();
        Object.keys(values).forEach((key) => {
            if (key === 'password' && !values[key]) return;
            formData.append(key, values[key]);
        });
        if (file) formData.append('image', file);

        try {
            const res = await axios.put(`${API_URL}/users/${storedUser.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            message.success('Cập nhật thông tin thành công!');
            const updatedUser = { ...res.data.data, role: storedUser.role };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUserData(updatedUser);
            setIsEditing(false);
            setFile(null);
            setPreviewImage(null);
            window.dispatchEvent(new Event('userUpdated'));
        } catch (error) {
            message.error('Cập nhật thất bại, vui lòng thử lại');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setPreviewImage(null);
        setFile(null);
        form.setFieldsValue({
            firstname: userData.firstname,
            lastname: userData.lastname,
            email: userData.email,
            phone: userData.phone,
        });
    };

    return (
        <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh', padding: '40px 20px' }}>
            <div style={{ maxWidth: 950, margin: '0 auto' }}>
                <Card
                    bordered={false}
                    style={{ borderRadius: 24, boxShadow: '0 10px 30px rgba(0,0,0,0.08)', overflow: 'hidden' }}
                    bodyStyle={{ padding: 0 }}
                >
                    <Row>
                        {/* CỘT TRÁI: AVATAR & STATS */}
                        <Col xs={24} md={9} style={{
                            backgroundColor: '#fff',
                            padding: '40px 20px',
                            textAlign: 'center',
                            borderRight: '1px solid #f0f0f0'
                        }}>
                            <div style={{ position: 'relative', display: 'inline-block', marginBottom: 20 }}>
                                <Avatar
                                    size={160}
                                    src={previewImage || (userData.image ? `${userData.image}` : null)}
                                    icon={<UserOutlined />}
                                    style={{
                                        boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                                        border: '4px solid #fff',
                                        backgroundColor: '#f5f5f5'
                                    }}
                                />
                                {isEditing && (
                                    <Upload
                                        showUploadList={false}
                                        beforeUpload={() => false}
                                        onChange={handleUploadChange}
                                        accept="image/*"
                                    >
                                        <Button
                                            shape="circle"
                                            icon={<UploadOutlined />}
                                            size="large"
                                            style={{
                                                position: 'absolute',
                                                bottom: 5,
                                                right: 5,
                                                backgroundColor: '#a0522d',
                                                color: '#fff',
                                                border: '2px solid #fff'
                                            }}
                                        />
                                    </Upload>
                                )}
                            </div>

                            <Title level={3} style={{ marginBottom: 4 }}>
                                {userData.lastname} {userData.firstname}
                            </Title>
                            <Text type="secondary"><MailOutlined /> {userData.email}</Text>

                            <Divider style={{ margin: '24px 0' }} />

                            <Space direction="vertical" style={{ width: '100%', textAlign: 'left' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Text type="secondary">Vai trò:</Text>
                                    <Text strong>{userData.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}</Text>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                                    <Text type="secondary">Trạng thái:</Text>
                                    <Text strong style={{ color: '#52c41a' }}>Đang hoạt động</Text>
                                </div>
                            </Space>
                        </Col>

                        {/* CỘT PHẢI: FORM CHI TIẾT */}
                        <Col xs={24} md={15} style={{ padding: '40px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
                                <Title level={4} style={{ margin: 0 }}>Thông tin chi tiết</Title>
                                {!isEditing && (
                                    <Button
                                        type="primary"
                                        icon={<EditOutlined />}
                                        onClick={() => setIsEditing(true)}
                                        style={{ borderRadius: 8, backgroundColor: '#a0522d', borderColor: '#a0522d' }}
                                    >
                                        Chỉnh sửa
                                    </Button>
                                )}
                            </div>

                            <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
                                <Row gutter={20}>
                                    <Col span={12}>
                                        <Form.Item label={<Text strong>Họ</Text>} name="lastname" rules={[{ required: true, message: 'Vui lòng nhập họ' }]}>
                                            <Input
                                                size="large"
                                                placeholder="Họ"
                                                disabled={!isEditing}
                                                prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                                                style={{ borderRadius: 8 }}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label={<Text strong>Tên</Text>} name="firstname" rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
                                            <Input
                                                size="large"
                                                placeholder="Tên"
                                                disabled={!isEditing}
                                                style={{ borderRadius: 8 }}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Form.Item label={<Text strong>Email liên hệ</Text>} name="email">
                                    <Input
                                        size="large"
                                        disabled
                                        prefix={<MailOutlined style={{ color: '#bfbfbf' }} />}
                                        style={{ borderRadius: 8 }}
                                    />
                                </Form.Item>

                                <Form.Item label={<Text strong>Số điện thoại</Text>} name="phone" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}>
                                    <Input
                                        size="large"
                                        disabled={!isEditing}
                                        prefix={<PhoneOutlined style={{ color: '#bfbfbf' }} />}
                                        style={{ borderRadius: 8 }}
                                    />
                                </Form.Item>

                                {isEditing ? (
                                    <>
                                        <Divider orientation="left"><Text type="secondary" style={{ fontSize: 12 }}>ĐỔI MẬT KHẨU</Text></Divider>
                                        <Form.Item label={<Text strong>Mật khẩu mới</Text>} name="password">
                                            <Input.Password
                                                size="large"
                                                prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                                                placeholder="Để trống nếu không muốn thay đổi"
                                                style={{ borderRadius: 8 }}
                                            />
                                        </Form.Item>

                                        <Form.Item style={{ marginTop: 40, marginBottom: 0 }}>
                                            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                                                <Button
                                                    size="large"
                                                    onClick={handleCancel}
                                                    style={{ borderRadius: 8, minWidth: 100 }}
                                                >
                                                    Hủy
                                                </Button>
                                                <Button
                                                    type="primary"
                                                    htmlType="submit"
                                                    size="large"
                                                    loading={loading}
                                                    icon={<SaveOutlined />}
                                                    style={{
                                                        borderRadius: 8,
                                                        minWidth: 120,
                                                        backgroundColor: '#a0522d',
                                                        borderColor: '#a0522d'
                                                    }}
                                                >
                                                    Lưu thay đổi
                                                </Button>
                                            </Space>
                                        </Form.Item>
                                    </>
                                ) : (
                                    <div style={{ marginTop: 20, padding: '15px', backgroundColor: '#fffbe6', borderRadius: 8, border: '1px solid #ffe58f' }}>
                                        <Text type="warning" style={{ fontSize: 13 }}>
                                            <SafetyCertificateOutlined /> Thông tin cá nhân của bạn được bảo mật tuyệt đối theo chính sách của cửa hàng.
                                        </Text>
                                    </div>
                                )}
                            </Form>
                        </Col>
                    </Row>
                </Card>
            </div>
        </div>
    );
};

export default Profile;