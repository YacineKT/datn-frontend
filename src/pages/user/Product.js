/* eslint-disable no-dupe-keys */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Row,
    Col,
    Card,
    Button,
    Typography,
    message,
    Menu,
    Empty,
    Image,
    Pagination,
    Tag,
    Badge,
    Input,
    Space 
} from 'antd';
import { ShoppingCartOutlined, SearchOutlined, EyeOutlined } from '@ant-design/icons';
import { formatCurrency } from '../../utils/helpers';
import { CartContext } from './CartContext';

const { Title, Text } = Typography;
const { Meta } = Card;

// Link ảnh mặc định nếu sản phẩm không có ảnh hoặc ảnh lỗi
const DEFAULT_IMAGE = "https://www.unfe.org/wp-content/uploads/2019/04/SM-placeholder.png"; 

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const { fetchCartCount } = useContext(CartContext);

    const pageSize = 12;
    const API_URL = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${API_URL}/categories`)
            .then(res => setCategories(res.data.data))
            .catch(() => message.error('Không tải được danh mục'));

        axios.get(`${API_URL}/products/with-sizes`)
            .then(res => {
                const filtered = res.data.data.filter(p => p.size_name === 'S');
                setProducts(filtered);
            })
            .catch(() => message.error('Lỗi khi tải sản phẩm'));
    }, []);

    const filteredProducts = products.filter(p => {
        const matchesCategory = selectedCategory === 'all' || p.category_name === selectedCategory;
        const matchesSearch = p.product_name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const paginatedProducts = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const handleAddToCart = async (product) => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user?.id) {
                message.warning('Vui lòng đăng nhập để đặt hàng');
                navigate('/auth/login');
                return;
            }
            const payload = { userId: user.id, productId: product.product_id, sizeId: product.size_id, quantity: 1 };
            const response = await axios.post(`${API_URL}/carts/add`, payload);
            if (response.status === 200) {
                message.success(`Đã thêm ${product.product_name} vào giỏ`);
                fetchCartCount ? fetchCartCount() : console.log("Cart updated");
            }
        } catch (error) {
            message.error('Thêm thất bại, vui lòng thử lại');
        }
    };

    return (
        <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', padding: '40px 0' }}>
            <div style={{ maxWidth: 1300, margin: '0 auto', padding: '0 20px' }}>
                <Row gutter={[32, 32]}>
                    {/* SIDEBAR */}
                    <Col xs={24} lg={6}>
                        <div style={{ position: 'sticky', top: 100 }}>
                            <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                                <Title level={4} style={{ marginBottom: 20 }}>Khám phá</Title>
                                <Input
                                    prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                                    placeholder="Tìm tên sản phẩm..."
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    style={{ marginBottom: 20, borderRadius: 8 }}
                                    allowClear
                                />
                                <Menu
                                    mode="inline"
                                    selectedKeys={[selectedCategory]}
                                    style={{ border: 'none' }}
                                    onClick={({ key }) => {
                                        setSelectedCategory(key);
                                        setCurrentPage(1);
                                    }}
                                    items={[
                                        { key: 'all', label: 'Tất cả sản phẩm' },
                                        ...categories.map(cat => ({ key: cat.name, label: cat.name })),
                                    ]}
                                />
                            </Card>
                        </div>
                    </Col>

                    {/* PRODUCT GRID */}
                    <Col xs={24} lg={18}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                            <Title level={3} style={{ margin: 0 }}>
                                {selectedCategory === 'all' ? 'Tất cả sản phẩm' : selectedCategory}
                                <Text type="secondary" style={{ marginLeft: 12, fontSize: 14, fontWeight: 400 }}>
                                    ({filteredProducts.length} món)
                                </Text>
                            </Title>
                        </div>

                        {paginatedProducts.length === 0 ? (
                            <Card style={{ borderRadius: 16, textAlign: 'center', padding: '60px 0' }}>
                                <Empty description="Không tìm thấy món bạn yêu cầu" />
                            </Card>
                        ) : (
                            <Row gutter={[20, 20]}>
                                {paginatedProducts.map(product => {
                                    const finalPrice = parseFloat(product.final_price);
                                    const originalPrice = parseFloat(product.price_with_additional);
                                    const discountPercent = Math.round(((originalPrice - finalPrice) / originalPrice) * 100);

                                    return (
                                        <Col xs={12} sm={12} md={8} lg={8} xl={6} key={product.product_id + '-' + product.size_id}>
                                            <Badge.Ribbon
                                                text={`-${discountPercent}%`}
                                                color="#e63946"
                                                style={{ display: finalPrice < originalPrice ? 'block' : 'none' }}
                                            >
                                                <Card
                                                    hoverable
                                                    style={{ borderRadius: 16, overflow: 'hidden', height: '100%', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                                                    cover={
                                                        <div style={{ position: 'relative', overflow: 'hidden', height: 180, backgroundColor: '#eee' }}>
                                                            <img
                                                                alt={product.product_name}
                                                                // Xử lý nếu product.image null hoặc rỗng thì dùng ảnh mặc định
                                                                src={product.image && product.image !== "" ? product.image : DEFAULT_IMAGE}
                                                                // Xử lý nếu link ảnh lỗi (404)
                                                                onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_IMAGE; }}
                                                                style={{
                                                                    width: '100%',
                                                                    height: '100%',
                                                                    objectFit: 'cover',
                                                                    filter: product.is_active === 0 ? 'grayscale(1)' : 'none',
                                                                    transition: 'transform 0.3s ease'
                                                                }}
                                                                className="product-image"
                                                            />
                                                            {product.is_active === 0 && (
                                                                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                                    <Tag color="black">HẾT HÀNG</Tag>
                                                                </div>
                                                            )}
                                                        </div>
                                                    }
                                                    actions={[
                                                        <Button type="text" icon={<EyeOutlined />} onClick={() => navigate(`/product/${product.product_id}`)}>Chi tiết</Button>,
                                                        <Button 
                                                            type="text" 
                                                            icon={<ShoppingCartOutlined style={{ color: product.is_active !== 0 ? '#1890ff' : '#bfbfbf' }} />} 
                                                            disabled={product.is_active === 0}
                                                            onClick={() => handleAddToCart(product)}
                                                        >Thêm</Button>
                                                    ]}
                                                >
                                                    <Meta
                                                        title={<Text strong style={{ fontSize: 15 }}>{product.product_name}</Text>}
                                                        description={
                                                            <div style={{ marginTop: 8 }}>
                                                                <Space direction="vertical" size={0}>
                                                                    <Text style={{ fontSize: 16, color: '#a0522d', fontWeight: 700 }}>
                                                                        {formatCurrency(finalPrice)}
                                                                    </Text>
                                                                    {finalPrice < originalPrice && (
                                                                        <Text delete type="secondary" style={{ fontSize: 12 }}>
                                                                            {formatCurrency(originalPrice)}
                                                                        </Text>
                                                                    )}
                                                                </Space>
                                                            </div>
                                                        }
                                                    />
                                                </Card>
                                            </Badge.Ribbon>
                                        </Col>
                                    );
                                })}
                            </Row>
                        )}

                        <div style={{ marginTop: 40, textAlign: 'center' }}>
                            <Pagination
                                current={currentPage}
                                pageSize={pageSize}
                                total={filteredProducts.length}
                                onChange={setCurrentPage}
                                showSizeChanger={false}
                                hideOnSinglePage
                            />
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default ProductList;