import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Box, Card, CardContent, CardMedia, Typography } from '@mui/material';
import { Product } from '@/types/product';
import axios from "@/config/axios";
import axiosLib from "axios";
import { convertCurrency } from '@/utils/currencyConverter';
import Link from 'next/link';
import { Navigation, Scrollbar } from 'swiper/modules';

// Query GraphQL để lấy sản phẩm liên quan
const GET_RELATED_PRODUCTS = `
    query RelatedProducts($productId: Int!, $limit: Int!) {
        relatedProducts(product_id: $productId, limit: $limit) {
            _id
            name
            type    
            header_image    
            price_overview {
                currency
                initial
                final
                discount_percent
            }
        }
    }
`;

// Component hiển thị từng sản phẩm
const ProductCard = ({ product }: { product: Product }) => {
    return (
        <Link
            href={`/app/${product._id}`}
            passHref
        >
            <Card>
                <CardMedia
                    component="img"
                    height="140"
                    image={product.header_image}
                    alt={product.name}
                />
                <CardContent>
                    <Typography variant="h5" component="div">
                        {product.name}
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            minHeight: '36px',
                            alignItems: 'center',
                            justifyContent: 'right',
                            marginTop: '8px',
                            color: '#BEEE11',
                        }}
                    >
                        {product.price_overview?.discount_percent ? (
                            <Typography
                                variant="body2"
                                sx={{
                                    height: '100%',
                                    lineHeight: '30px',
                                    backgroundColor: '#4c6b22', // Nền vàng cho nhãn giảm giá
                                    color: '#BEEE11', // Chữ đen
                                    padding: '4px 8px',
                                    marginRight: '8px',
                                    fontWeight: 'bold',
                                }}
                            >
                                -{product.price_overview.discount_percent}%
                            </Typography>
                        ) : null}

                        <Box
                            sx={{
                                marginRight: '8px'
                            }}
                        >
                            {/* Giá gốc */}
                            {product.price_overview?.discount_percent ? (
                                <p
                                    style={{
                                        textDecoration: 'line-through',
                                        color: '#A0A0A0',
                                        marginRight: '8px',
                                        fontSize: '13px'
                                    }}
                                >
                                    {product.price_overview.initial != null
                                        ? `$${product.price_overview.initial.toFixed(2)}`
                                        : 'Free'
                                    }
                                </p>
                            ) : null}

                            {/* Giá bán */}
                            <p style={{
                                color: product.price_overview?.discount_percent ? '#BEEE11' : '#A0A0A0',
                                fontSize: '16px'
                            }}>
                                {product.price_overview?.final != null
                                    ? `$${product.price_overview.final.toFixed(2)}`
                                    : 'Free'
                                }
                            </p>
                        </Box>
                    </Box>

                </CardContent>
            </Card>
        </Link>
    );
};

// Component chính hiển thị danh sách sản phẩm liên quan
const RelatedProducts = ({ product }: { product: Product }) => {
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    // Lấy danh sách sản phẩm liên quan
    useEffect(() => {
        const fetchRelatedProducts = async () => {
            try {
                // Đang tải dữ liệu
                setLoading(true);


                // Nếu không có _id thì không cần tải
                if (!product._id || product._id === -1) {
                    return;
                }

                // Gửi yêu cầu lấy sản phẩm liên quan
                const response = await axios.post('/graphql', {
                    query: GET_RELATED_PRODUCTS,
                    variables: {
                        productId: Number(product._id),
                        limit: 12
                    }
                });

                // Lấy danh sách sản phẩm liên quan
                const fetchedProduct = await response.data.data.relatedProducts;

                // Chuyển đổi giá tiền cuối cùng sang USD
                fetchedProduct.forEach((product: Product) => {
                    if (product.price_overview && product.price_overview.currency) {
                        // Chuyển đổi giá tiền cuối cùng sang USD
                        product.price_overview.final = convertCurrency(
                            product.price_overview.final / 100,
                            product.price_overview.currency,
                            'USD'
                        );

                        // Chuyển đổi giá tiền gốc sang USD
                        product.price_overview.initial = convertCurrency(
                            product.price_overview.initial / 100,
                            product.price_overview.currency,
                            'USD'
                        );
                    }
                });

                // Lưu danh sách sản phẩm
                setRelatedProducts(fetchedProduct || []);


            } catch (error) {
                if (axiosLib.isAxiosError(error) && error.response) {
                    // Xử lý lỗi GraphQL
                    if (error.response?.data?.errors) {
                        console.log({
                            message: error.response.data.message,
                            errors: error.response.data.errors
                        });
                        setError(error.response.data.message);
                    }
                }

                // Lỗi khác
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        // Lấy danh sách sản phẩm liên quan
        fetchRelatedProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [product._id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error fetching related products.</div>;
    }

    if (relatedProducts.length === 0) {
        return <div>No related products found.</div>;
    }

    return (
        <Box
            sx={{
                position: 'relative',
                marginTop: 4,
                marginX: -4,
                paddingX: 4,       
            }}
        >
            <Typography variant="h4" component="h2" gutterBottom>
                More like this
            </Typography>

            <Swiper
                className='related-products-swiper'
                spaceBetween={10}
                slidesPerView={3}
                navigation
                rewind
                scrollbar={{ draggable: true }}
                modules={[
                    Scrollbar,
                    Navigation
                ]}
            >
                {relatedProducts.map((product: Product) => (
                    <SwiperSlide key={product._id}>
                        <ProductCard product={product} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </Box>
    );
};

export default RelatedProducts;