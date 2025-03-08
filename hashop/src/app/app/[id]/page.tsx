'use client'

import { getProductById } from '@/store/product';
import { AppDispatch } from '@/store/store';
import { Product, ProductField } from '@/types/product';
import { Typography, Button, Chip, Grid2, Box } from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import './style.css';
import { GridCheckIcon } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Scrollbar, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';
import 'swiper/css/thumbs';

// Khởi tạo product ban đầu
const initialProduct: Product = {
    productId: -1,
    title: '',
    type: '',
    description: '',
    price: 0,
    discount: 0,
    discountStartDate: null,
    discountEndDate: null,
    releaseDate: null,
    developer: [],
    publisher: [],
    platform: [],
    rating: 0,
    isActive: false,
    genres: [],
    tags: [],
    features: [],
    headerImage: null,
    screenshots: [],
    videos: [{
        thumbnail: '',
        mp4: '',
        webm: ''
    }],
    systemRequirements: {
        win: [
            { title: "OS", minimum: "", recommended: "" },
            { title: "Processor", minimum: "", recommended: "" },
            { title: "Memory", minimum: "", recommended: "" },
            { title: "Graphics", minimum: "", recommended: "" },
            { title: "DirectX", minimum: "", recommended: "" },
            { title: "Storage", minimum: "", recommended: "" },
            { title: "Sound Card", minimum: "", recommended: "" },
            { title: "Additional Notes", minimum: "", recommended: "" },
        ],
    },
};

function ProductDetailPage() {
    const router = useRouter();
    const pathname = usePathname()
    const dispatch = useDispatch<AppDispatch>();

    // State cho ảnh chính
    const [selectedHighligh, setSelectedHighligh] = useState({
        type: 'image',
        src: '',
    });
    // Khai báo state
    const [product, setProduct] = useState<Product>(initialProduct);

    // Lấy thông tin sản phẩm khi component được render
    useEffect(() => {
        // Hàm lấy thông tin sản phẩm
        const getProduct = async () => {
            try {
                // Lấy id sản phẩm từ url
                const id = pathname.split('/').pop();

                // Các field cần lấy
                const fieldProduct: ProductField[] = [
                    'productId',
                    'title',
                    'description',
                    'price',
                    'discount',
                    'releaseDate',
                    'developer',
                    'publisher',
                    'headerImage',
                    'screenshots',
                    'videos',
                    'platform',
                    'tags',
                ];

                // Gọi action lấy thông tin sản phẩm
                const resultAction = await dispatch(getProductById({
                    id: Number(id),
                    fields: fieldProduct
                }));

                // Lấy thông tin sản phẩm thành công
                if (resultAction.meta.requestStatus === 'fulfilled') {
                    const fetchedProduct = unwrapResult(resultAction);
                    setProduct(fetchedProduct);
                    // Khởi tạo ảnh chính
                    setSelectedHighligh({
                        type: 'image',
                        src: fetchedProduct.videos[0].mp4,
                    });
                }

            } catch (error) {
                console.error('Lỗi lấy thông tin sản phẩm:', error);
            }
        };

        // Gọi hàm lấy thông tin sản phẩm
        getProduct();

        // Nếu không có sản phẩm chuyển về trang chủ
        if (!product) {
            router.push('/');
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <Box sx={{
            padding: 2,
            minHeight: '100vh',
            width: '90%',
            margin: '20px auto',
        }}>
            {/* Tên */}
            <Typography
                variant="h2"
                sx={{
                    color: '#fff',
                    textShadow: '0 0 10px #ff0',
                    marginBottom: 2,
                }}
            >
                {product.title}
            </Typography>

            {/* Nội dung trang */}
            <Grid2 container spacing={2}>
                {/* Cột trái */}
                <Grid2
                    size={{
                        xs: 12,
                        md: 8,
                    }}
                >
                    {/* Player chính */}
                    <Box
                        sx={{
                            position: 'relative',
                            width: '100%',
                            height: '395px',
                            backgroundColor: '#000',
                        }}
                    >
                        {selectedHighligh.type === 'image' ? (
                            <Image
                                src={selectedHighligh.src || 'https://placehold.co/703x395/000/000/png'}
                                alt="Screenshot"
                                width={703}
                                height={395}
                                priority
                            />
                        ) : (
                            <video
                                src={selectedHighligh.src}
                                controls
                                autoPlay
                                loop
                                style={{
                                    width: '100%',
                                    height: '100%',
                                }}
                            />
                        )}
                    </Box>

                    {/* Bộ sưu tập ảnh và video nhỏ với Swiper */}
                    <Swiper
                        spaceBetween={10}
                        slidesPerView={4}
                        freeMode={true}
                        watchSlidesProgress={true}
                        modules={[FreeMode, Navigation, Thumbs, Scrollbar]}
                        className="swiper-screenshots"
                        style={{ marginTop: '16px' }}
                        navigation
                        scrollbar={{ draggable: true }}
                        rewind={true}
                    >
                        {/* Hiển thị video nhỏ */}
                        {product.videos.map((video, index) => (
                            <SwiperSlide key={index}>
                                <Image
                                    src={video.thumbnail || 'https://placehold.co/175x98/000/000/png'}
                                    alt={`Video ${index + 1}`}
                                    width={175}
                                    height={98}
                                    onClick={() => setSelectedHighligh({ type: 'video', src: video.mp4 })}
                                    style={{
                                        userSelect: 'none',
                                        cursor: 'pointer',
                                        border: selectedHighligh.src === video.mp4 ? '3px solid #fff' : 'none'
                                    }}
                                />

                                {/* Highlight movie marker */}
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        width: '32px',
                                        height: '32px',
                                        backgroundImage: 'url(/image/play_video_button.png)',
                                    }}
                                />

                            </SwiperSlide>
                        ))}

                        {/* Hiển thị ảnh nhỏ */}
                        {product.screenshots.map((screenshot, index) => (
                            <SwiperSlide key={index}>
                                <Image
                                    src={screenshot || 'https://placehold.co/175x98/000/000/png'}
                                    alt={`Screenshot ${index + 1}`}
                                    width={175}
                                    height={98}
                                    onClick={() => setSelectedHighligh({ type: 'image', src: screenshot })}
                                    style={{
                                        userSelect: 'none',
                                        cursor: 'pointer',
                                        border: selectedHighligh.src === screenshot ? '3px solid #fff' : 'none'
                                    }}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Nút hành động */}
                    <Grid2 container spacing={1} sx={{ marginTop: 3 }}>
                        <Grid2>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<GridCheckIcon />}
                                sx={{ borderRadius: 1 }}
                            >
                                On Wishlist
                            </Button>
                        </Grid2>
                        <Grid2>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<GridCheckIcon />}
                                sx={{ borderRadius: 1 }}
                            >
                                Following
                            </Button>
                        </Grid2>
                        <Grid2>
                            <Button variant="contained" color="primary" sx={{ borderRadius: 1 }}>
                                Ignore
                            </Button>
                        </Grid2>
                    </Grid2>
                </Grid2>

                {/* Cột phải */}
                <Grid2
                    size={{
                        xs: 12,
                        md: 4,
                    }}
                >
                    {/* Hình ảnh header */}
                    <Image
                        src={product.headerImage
                            ? product.headerImage.toString()
                            : 'https://placehold.co/343x160/000/000/png'
                        }
                        alt="Product"
                        width={343}
                        height={160}
                    />

                    {/* Mô tả trò chơi */}
                    <Typography variant="body1" sx={{ color: '#fff', marginTop: 2 }}>
                        {product.description}
                    </Typography>

                    {/* Đánh giá */}
                    <Typography variant="body2" sx={{ color: 'green', marginTop: 2 }}>
                        Recent Reviews: Very Positive (6,319)
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'green' }}>
                        All Reviews: Very Positive (748,816)
                    </Typography>

                    {/* Thông tin phát hành */}
                    <Typography variant="body2" sx={{ color: '#fff', marginTop: 2 }}>
                        Release Date: {dayjs(product.releaseDate).format('DD/MM/YYYY')}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#fff' }}>
                        Developer: {product.developer.join(', ')}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#fff' }}>
                        Publisher: {product.publisher.join(', ')}
                    </Typography>

                    {/* Thẻ tag */}
                    <Grid2 container
                        spacing={1}
                        sx={{
                            marginTop: 2,
                            height: '78px',
                            overflow: 'hidden',
                        }}
                    >
                        {product.tags?.map((tag) => (
                            <Grid2
                                key={tag}
                            >
                                <Chip
                                    label={tag}
                                    sx={{ backgroundColor: '#1976d2', color: '#fff', '&:hover': { backgroundColor: '#115293' } }}
                                    clickable
                                />
                            </Grid2>
                        ))}
                    </Grid2>
                </Grid2>
            </Grid2>
        </Box>
    );
};

export default ProductDetailPage;