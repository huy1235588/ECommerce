'use client'

import { getAchievements, getProductById, getSupportedLanguages } from '@/store/product';
import { AppDispatch } from '@/store/store';
import { Product, ProductAchievement, ProductField, ProductLanguage } from '@/types/product';
import { Typography, Button, Chip, Grid2, Box } from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useMemo, useRef } from 'react';
import { useDispatch } from 'react-redux';
import './style.css';
import { GridCheckIcon } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
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

// Khởi tạo product language ban đầu
const initialProductLanguage: ProductLanguage = {
    productId: -1,
    languages: [],
}

// Khởi tạo product achievement ban đầu
const initialProductAchievement: ProductAchievement = {
    productId: -1,
    achievements: [],
}

function ProductDetailPage() {
    const router = useRouter();
    const pathname = usePathname()
    const dispatch = useDispatch<AppDispatch>();

    // Khai báo state
    const [product, setProduct] = useState<Product>(initialProduct); // Sản phẩm
    const [productLanguage, setProductLanguage] = useState<ProductLanguage>(initialProductLanguage); // Sản phẩm
    const [productAchievement, setProductAchievement] = useState<ProductAchievement>(initialProductAchievement); // Sản phẩm

    // Swiper
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null); // Swiper thumbnail
    const [mainSwiper, setMainSwiper] = useState<SwiperType | null>(null); // Swiper chính
    const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0); // Index của slide hiện tại
    const timerRef = useRef<NodeJS.Timeout | null>(null);

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
                    'detail',
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
                    'features',
                    'systemRequirements',
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
                }

                // Gọi action lấy ngôn ngữ
                const resultActionLanguages = await dispatch(getSupportedLanguages(
                    Number(id),
                ));

                // Lấy thông tin ngôn ngữ thành công
                if (resultActionLanguages.meta.requestStatus === 'fulfilled') {
                    const fetchedProductLanguage = unwrapResult(resultActionLanguages);
                    setProductLanguage(fetchedProductLanguage);
                }

                // Gọi action lấy thành tựu
                const resultActionAchievement = await dispatch(getAchievements({
                    id: Number(id),
                    slice: 4
                }));

                // Lấy thông tin thành tựu thành công
                if (resultActionAchievement.meta.requestStatus === 'fulfilled') {
                    const fetchedProductAchievement = unwrapResult(resultActionAchievement);
                    setProductAchievement(fetchedProductAchievement);
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

    // Media
    const mediaItems = useMemo(() => [
        ...product.videos.map(video => ({ type: 'video', src: video.mp4 })),
        ...product.screenshots.map(screenshot => ({ type: 'image', src: screenshot }))
    ], [product.videos, product.screenshots]);

    // Thumbs
    const thumbItems = [
        ...product.videos.map(video => ({
            type: 'video',
            src: video.mp4,
            thumbnail: video.thumbnail
        })),
        ...product.screenshots.map(screenshot => ({
            type: 'image',
            src: screenshot,
            thumbnail: screenshot
        }))
    ];

    // Xử lý khi video kết thúc
    const handleVideoEnded = () => {
        if (mainSwiper) {
            mainSwiper.slideNext();
        }
    };

    // Xử lý tự động chuyển slide cho hình ảnh (8s) khi slide thay đổi
    useEffect(() => {
        // Xóa timer cũ nếu có
        if (timerRef.current) clearTimeout(timerRef.current);

        // Nếu slide hiện tại là hình ảnh và swiper chính đã sẵn sàng
        if (mediaItems[currentSlideIndex]?.type === 'image' && mainSwiper) {
            // Tạo timer mới
            timerRef.current = setTimeout(() => {
                mainSwiper.slideNext();
            }, 8000);
        }

        // Dọn dẹp timer khi component unmount hoặc currentSlideIndex thay đổi
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [currentSlideIndex, mainSwiper, mediaItems]);

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
                    sx={{
                        position: 'relative',
                    }}
                >
                    {/* Player chính */}
                    <Swiper
                        onSwiper={(swiper) => {
                            setMainSwiper(swiper);
                        }}
                        onSlideChange={(swiper) => {
                            setCurrentSlideIndex(swiper.activeIndex);
                        }}
                        freeMode={false}
                        navigation
                        rewind={true}
                        thumbs={{ swiper: thumbsSwiper }}
                        className="main-player-swiper"
                        style={{
                            position: 'unset',
                            width: '703px',
                            height: '395px',
                            backgroundColor: '#000'
                        }}
                        modules={[Navigation, Thumbs]}
                    >
                        {mediaItems.map((media, index) => (
                            <SwiperSlide key={index}>
                                {media.type === 'image' ? (
                                    <Image
                                        src={media.src || 'https://placehold.co/703x395/000/000/png'}
                                        alt="Screenshot"
                                        width={703}
                                        height={395}
                                        priority
                                    />
                                ) : (
                                    media.src ? (
                                        <video
                                            src={media.src}
                                            controls
                                            autoPlay
                                            muted
                                            onEnded={handleVideoEnded}
                                            style={{
                                                width: '703px',
                                                height: '395px',
                                            }}
                                        />
                                    ) : (
                                        <Image
                                            src={'https://placehold.co/703x395/000/000/png'}
                                            alt="Video"
                                            width={703}
                                            height={395}
                                            priority
                                        />
                                    )
                                )}
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Thumbnail */}
                    <Swiper
                        onSwiper={(swiper) => {
                            setThumbsSwiper(swiper);
                        }}
                        spaceBetween={10}
                        slidesPerView={4}
                        freeMode={true}
                        watchSlidesProgress={true}
                        className="thumb-swiper"
                        style={{ marginTop: '16px' }}
                        scrollbar={{ draggable: true }}
                        rewind={true}
                        autoplay={{ delay: 5000 }}
                        modules={[FreeMode, Scrollbar]}
                    >
                        {/* Hiển thị video nhỏ */}
                        {thumbItems.map((media, index) => (
                            <SwiperSlide key={index}>
                                <Image
                                    src={media.thumbnail || 'https://placehold.co/175x98/000/000/png'}
                                    alt={`Video ${index + 1}`}
                                    width={175}
                                    height={98}
                                    style={{
                                        userSelect: 'none',
                                        cursor: 'pointer',
                                        border: currentSlideIndex === index ? '3px solid #fff' : 'none',
                                    }}
                                    priority
                                />

                                {/* Highlight movie marker */}
                                {media.type === 'video' && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        width: '32px',
                                        height: '32px',
                                        backgroundImage: 'url(/image/play_video_button.png)',
                                    }}
                                    />
                                )}
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
                        priority
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

            {/* Thông tin chi tiết */}
            <Grid2 container spacing={2}>
                {/*  */}
                <Grid2
                    size={{
                        xs: 12,
                        md: 8,
                    }}
                    sx={{
                        marginTop: 2,
                    }}
                >
                    {/* Tiêu đề */}
                    <Box sx={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: '#333',
                        padding: '16px',
                        paddingBottom: '26px',
                        marginBottom: 2,
                        borderRadius: '5px',
                        color: '#fff',
                    }}>
                        {/* Tiêu đề */}
                        <Typography variant="h5" sx={{ color: '#fff' }}>
                            Buy {product.title}
                        </Typography>

                        {/* Platform */}
                        {product.platform.map((platform, index) => (
                            <Typography
                                key={index}
                                variant="body2"
                                sx={{
                                    color: '#fff',
                                    marginRight: '8px',
                                }}
                            >
                                <Image
                                    src={`/icons/platforms/${platform}.svg`}
                                    alt={platform}
                                    width={20}
                                    height={20}
                                    style={{
                                        verticalAlign: 'middle',
                                        marginRight: '4px',
                                        filter: 'invert(80%)',
                                    }}
                                />
                            </Typography>
                        ))}

                        {/* Giá tiền */}
                        <Box sx={{
                            position: 'absolute',
                            right: '16px',
                            bottom: '-17px',
                        }}>
                            {/* Giá gốc */}
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                backgroundColor: '#000',
                                height: '36px',
                                verticalAlign: 'bottom',
                            }}>
                                {/* Giá tiền */}
                                <Typography variant="body1" sx={{
                                    color: '#fff',
                                    padding: '8px 12px',
                                }}>
                                    990.000đ
                                </Typography>

                                {/* Nút thêm vào giỏ hàng */}
                                <Button variant="contained" color="success">
                                    Add to Cart
                                </Button>
                            </Box>
                        </Box>
                    </Box>

                    {/* Chi tiết */}
                    <div className="product-detail-container collapsed">
                        <div className="product-detail-auto-collapse">
                            {/* Chi tiết */}
                            <div className="product-detail-area"
                                dangerouslySetInnerHTML={{ __html: product.detail || "" }}
                            />
                        </div>
                        {/* Nút xem thêm */}
                        <div className="product-detail-toggle">
                            <div className='product-detail-toggle-button'
                                onClick={() => {
                                    const productDetail = document.querySelector('.product-detail-container');

                                    if (productDetail) {
                                        productDetail.classList.toggle('collapsed');
                                    }
                                }}
                            >
                                Show More
                            </div>
                        </div>
                    </div>

                    {/* Bảng cấu hình */}
                    <div className='product-sysReq-container'>
                        <h2 className='product-sysReq-title'>
                            System Requirements
                        </h2>

                        <div className="sysReq_contents">
                            <div className="game_area_sys_req sysReq_content active" data-os="win">
                                <div className="game_area_sys_req_leftCol">
                                    <h3>Minimum:</h3>
                                    <ul className="sysReq_leftCol">
                                        {product.systemRequirements.win.map((item, index) => {
                                            return item.minimum && item.recommended ? (
                                                <li key={index}>
                                                    <strong>{item.title}: </strong>
                                                    <span>{item.minimum}</span>
                                                </li>
                                            ) : null;
                                        })}
                                    </ul>
                                </div>
                                <div className="game_area_sys_req_rightCol">
                                    <h3>Recommended:</h3>
                                    <ul className="sysReq_rightCol">
                                        {product.systemRequirements.win.map((item, index) => {
                                            return item.minimum && item.recommended ? (
                                                <li key={index}>
                                                    <strong>{item.title}: </strong>
                                                    <span>{item.recommended}</span>
                                                </li>
                                            ) : null;
                                        })}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </Grid2>

                {/* Thông tin */}
                <Grid2
                    size={{
                        xs: 12,
                        md: 4,
                    }}
                    sx={{
                        marginTop: 2,
                    }}
                >
                    {/* Features */}
                    <div className="product-features-container">
                        <Typography variant="h6" sx={{ color: '#fff' }}>
                            Features
                        </Typography>
                        <div className='product-features-list'>
                            {product.features?.map((feature, index) => (
                                <a className='product-features-item'
                                    href="#"
                                    key={index}
                                >
                                    <div className='product-features-icon'>
                                        <Image
                                            src={`https://store.fastly.steamstatic.com/public/images/v6/ico/ico_singlePlayer.png`}
                                            alt={feature}
                                            width={26}
                                            height={16}
                                        />
                                    </div>
                                    <div className='product-features-text'>
                                        {feature}
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Languages */}
                    <div className="product-languages-container">
                        <Typography variant="h6" sx={{ color: '#fff' }}>
                            Languages
                        </Typography>
                        <div className='product-languages-list'>
                            <table className='product-languages-table'>
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th className='checkCol'>Interface</th>
                                        <th className='checkCol'>Full Audio</th>
                                        <th className='checkCol'>Subtitles</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productLanguage.languages.map((language, index) => (
                                        <tr key={index}>
                                            <td>{language.language}</td>
                                            <td className='checkCol'>
                                                {language.interface && (
                                                    <span>
                                                        ✔
                                                    </span>
                                                )}
                                            </td>
                                            <td className='checkCol'>
                                                {language.fullAudio && (
                                                    <span>
                                                        ✔
                                                    </span>
                                                )}
                                            </td>
                                            <td className='checkCol'>
                                                {language.subtitles && (
                                                    <span>
                                                        ✔
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Achievements */}
                    <div className="product-achievements-container">
                        <Typography variant="h6" sx={{ color: '#fff' }}>
                            Achievements
                        </Typography>
                        <div className='product-achievements-list'>
                            {productAchievement.achievements.map((achievement, index) => (
                                <div className='product-achievements-item'
                                    key={index}
                                >
                                    <Image
                                        src={achievement.image}
                                        alt={achievement.title}
                                        width={64}
                                        height={64}
                                    />
                                </div>
                            ))}

                            {/* Nút xem thêm */}
                            <a className='product-achievements-view-all'
                                href="#">
                                View  all 42
                            </a>
                        </div>
                    </div>
                </Grid2>
            </Grid2>
        </Box >
    );
};

export default ProductDetailPage;