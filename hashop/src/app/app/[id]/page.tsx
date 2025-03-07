'use client'

import { Grid, Card, CardMedia, Typography, Button } from '@mui/material';
import Head from 'next/head';
import { useEffect, useState } from 'react';

function ProductDetailPage() {
    const [product, setProduct] = useState<Product>({
        id: '',
        title: '',
        description: '',
        price: 0,
        image: '',
        stock: 0,
        specifications: {},
    });
    const [reviews, setReviews] = useState<{ id: string; user: string; comment: string }[]>([]);
    const [loading, setLoading] = useState(true);

    // Lấy thông tin sản phẩm khi component được render
    useEffect(() => {
        const productId = "1";
        if (productId) {
            getProductById(productId).then((product) => {
                setProduct(product);
                setLoading(false);
            });
        }
    }, []);

    // Hàm xử lý thêm vào giỏ hàng (giả lập)
    const handleAddToCart = () => {
        console.log(`${product.title} đã được thêm vào giỏ hàng`);
    };

    return (
        <>
            <Head>
                <title>{product.title} | Cửa hàng của tôi</title>
                <meta name="description" content={product.description} />
            </Head>
            <Grid container spacing={4} sx={{ padding: 4 }}>
                {/* Hình ảnh sản phẩm */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardMedia
                            component="img"
                            height="400"
                            image={product.image}
                            alt={product.title}
                            sx={{ objectFit: 'cover' }}
                        />
                    </Card>
                </Grid>
                {/* Chi tiết sản phẩm */}
                <Grid item xs={12} md={6}>
                    <Typography variant="h4">{product.title}</Typography>
                    <Typography variant="body1" sx={{ marginTop: 2 }}>
                        {product.description}
                    </Typography>
                    <Typography variant="h5" sx={{ marginTop: 2 }}>
                        ${product.price.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color={product.stock > 0 ? 'green' : 'red'}>
                        {product.stock > 0 ? 'Còn hàng' : 'Hết hàng'}
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ marginTop: 2 }}
                        onClick={handleAddToCart}
                        disabled={product.stock <= 0}
                        aria-label="Thêm vào giỏ hàng"
                    >
                        Thêm vào giỏ hàng
                    </Button>
                </Grid>
            </Grid>

            {/* Thông số kỹ thuật */}
            <section>
                <Typography variant="h6">Thông số kỹ thuật</Typography>
                <ul>
                    {Object.entries(product.specifications).map(([key, value]) => (
                        <li key={key}>{`${key}: ${value}`}</li>
                    ))}
                </ul>
            </section>

            {/* Đánh giá */}
            <section>
                <Typography variant="h6">Đánh giá</Typography>
                <ul role="list">
                    {reviews.map((review) => (
                        <li key={review.id} role="listitem">
                            <Typography variant="body2">
                                <strong>{review.user}:</strong> {review.comment}
                            </Typography>
                        </li>
                    ))}
                </ul>
            </section>
        </>
    );
};

export default ProductDetailPage;