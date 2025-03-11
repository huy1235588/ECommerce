'use client'

import { getProductById } from '@/store/product';
import { AppDispatch } from '@/store/store';
import { Product } from '@/types/product';
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
import { convertCurrency } from '@/utils/currencyConverter';

// Khởi tạo product ban đầu
const initialProduct: Product = {
    _id: -1,
    name: '',
    type: '',
    short_description: '',
    price_overview: {
        currency: '',
        initial: 0,
        final: 0,
        discount_percent: 0,
    },
    release_date: {
        date: dayjs(),
        coming_soon: false,
    },
    developers: [],
    publishers: [],
    platform: {
        windows: false,
        mac: false,
        linux: false,
    },
    genres: [],
    tags: [],
    categories: [],
    header_image: "",
    screenshots: [],
    movies: [],
};

// Định nghĩa interface cho mỗi ngôn ngữ
interface Language {
    name: string;
    interface: boolean;
    fullAudio: boolean;
    subtitles: boolean;
}

function ProductDetailPage() {
    const router = useRouter();
    const pathname = usePathname()
    const dispatch = useDispatch<AppDispatch>();

    // Khai báo state
    const [product, setProduct] = useState<Product>(initialProduct); // Sản phẩm

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
                const fieldProduct = `
                     _id
                    name
                    short_description
                    detailed_description
                    about_the_game
                    price_overview {
                        initial
                        final
                        discount_percent
                        currency
                    }
                    release_date {
                        date
                    }
                    developers
                    publishers
                    header_image
                    screenshots {
                        path_thumbnail
                    }
                    movies {
                        thumbnail
                        mp4 {
                            _480
                            max
                        }
                        webm {
                            _480
                            max
                        }
                    }
                    platform {
                        windows
                        mac
                        linux
                    }
                     tags {
                        id
                        name
                    }
                    categories {
                        id
                        description
                    }
                    pc_requirements {
                        type
                        minimum
                        recommended
                    }
                    mac_requirements {
                        type
                        minimum
                        recommended
                    }
                    linux_requirements {
                        type
                        minimum
                        recommended
                    }
                    supported_languages
                        achievements {
                        total
                        highlighted {
                            name
                            path
                        }
                    }
                    package_groups {
                        name
                        title
                        description
                        selection_text
                        save_text
                        display_type
                        is_recurring_subscription
                        subs {
                            packageId
                            percent_savings_text
                            percent_savings
                            option_text
                            option_description
                            can_get_free_license
                            is_free_license
                            price_in_cents_with_discount
                        }
                    }
                    achievements {
                        total
                        highlighted {
                            name
                            path
                        }
                    }
                `;

                // Lấy tối đa 5 achievements highlighted
                const slice = {
                    achievements: {
                        highlighted: {
                            limit: 4
                        }
                    }
                }

                // Gọi action lấy thông tin sản phẩm
                const resultAction = await dispatch(getProductById({
                    id: Number(id),
                    fields: fieldProduct,
                    slice: JSON.stringify(slice),
                }));

                // Lấy thông tin sản phẩm thành công
                if (resultAction.meta.requestStatus === 'fulfilled') {
                    // Lấy sản phẩm từ kết quả
                    const fetchedProduct = unwrapResult(resultAction);

                    // Chuyển đổi giá tiền cuối cùng sang USD
                    fetchedProduct.price_overview.final = convertCurrency(
                        fetchedProduct.price_overview.final / 100,
                        fetchedProduct.price_overview.currency,
                        'USD'
                    );

                    // Chuyển đổi giá tiền gốc sang USD
                    fetchedProduct.price_overview.initial = convertCurrency(
                        fetchedProduct.price_overview.initial / 100,
                        fetchedProduct.price_overview.currency,
                        'USD'
                    );

                    // Cập nhật state
                    setProduct(fetchedProduct);
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
        ...product.movies.map(video => ({ type: 'video', src: video.mp4.max })),
        ...product.screenshots.map(screenshot => ({ type: 'image', src: screenshot.path_thumbnail }))
    ], [product.movies, product.screenshots]);

    // Thumbs
    const thumbItems = [
        ...product.movies.map(video => ({
            type: 'video',
            src: video.mp4,
            thumbnail: video.thumbnail
        })),
        ...product.screenshots.map(screenshot => ({
            type: 'image',
            src: screenshot.path_full,
            thumbnail: screenshot.path_thumbnail
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

    // Parse ngôn ngữ hỗ trợ
    const parseSupportedLanguages = (supportedLanguages: string): Language[] => {
        const languages: Language[] = [];
        const languageEntries = supportedLanguages.split(', ');

        languageEntries.forEach(entry => {
            const hasFullAudio = entry.includes('<strong>*</strong>');
            const name = entry.replace('<strong>*</strong>', '').trim();
            languages.push({
                name,
                interface: true,
                fullAudio: hasFullAudio,
                subtitles: true,
            });
        });

        return languages;
    };

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
                {product.name}
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
                            width: '747px',
                            height: '395px',
                            backgroundColor: '#000'
                        }}
                        modules={[Navigation, Thumbs]}
                    >
                        {mediaItems.map((media, index) => (
                            <SwiperSlide key={index}>
                                {media.type === 'image' ? (
                                    <Image
                                        src={media.src || 'https://placehold.co/747x395/000/000/png'}
                                        alt="Screenshot"
                                        width={747}
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
                                                width: '747px',
                                                height: '395px',
                                            }}
                                        />
                                    ) : (
                                        <Image
                                            src={'https://placehold.co/747x395/000/000/png'}
                                            alt="Video"
                                            width={747}
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
                                    src={media.thumbnail.toString() || 'https://placehold.co/175x98/000/000/png'}
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
                        src={product.header_image
                            ? product.header_image
                            : 'https://placehold.co/343x160/000/000/png'
                        }
                        alt="Product"
                        width={343}
                        height={160}
                        priority
                    />

                    {/* Mô tả trò chơi */}
                    <Typography variant="body1" sx={{ color: '#fff', marginTop: 2 }}>
                        {product.short_description}
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
                        Release Date: {dayjs(product.release_date.date).format('DD/MM/YYYY')}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#fff' }}>
                        Developer: {product.developers?.join(', ')}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#fff' }}>
                        Publisher: {product.publishers?.join(', ')}
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
                                key={tag.id}
                            >
                                <Chip
                                    label={tag.name}
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
                            Buy {product.name}
                        </Typography>

                        {/* Platform */}
                        {Object.keys(product.platform || {})
                            .map((platform, index) => {
                                if (!product.platform?.[platform as keyof typeof product.platform]) {
                                    return null;
                                }

                                return (
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
                                )
                            })
                        }

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
                                    ${product.price_overview.initial.toFixed(2)}
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
                                dangerouslySetInnerHTML={{ __html: product.about_the_game || "" }}
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
                                    <div className="product-detail-area"
                                        dangerouslySetInnerHTML={{ __html: product.pc_requirements?.minimum || "" }}
                                    />
                                </div>
                                <div className="game_area_sys_req_rightCol">
                                    <div className="product-detail-area"
                                        dangerouslySetInnerHTML={{ __html: product.pc_requirements?.recommended || "" }}
                                    />
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
                            {product.categories?.map((feature, index) => (
                                <a className='product-features-item'
                                    href="#"
                                    key={index}
                                >
                                    <div className='product-features-icon'>
                                        <Image
                                            src={`https://store.fastly.steamstatic.com/public/images/v6/ico/ico_singlePlayer.png`}
                                            alt={feature.description}
                                            width={26}
                                            height={16}
                                        />
                                    </div>
                                    <div className='product-features-text'>
                                        {feature.description}
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
                                    {product.supported_languages && parseSupportedLanguages(product.supported_languages)
                                        .map((language, index) => (
                                            <tr key={index}>
                                                <td>{language.name}</td>
                                                <td className='checkCol'>
                                                    {language.interface ? '✔' : ''}
                                                </td>
                                                <td className='checkCol'>
                                                    {language.fullAudio ? '✔' : ''}
                                                </td>
                                                <td className='checkCol'>
                                                    {language.subtitles ? '✔' : ''}
                                                </td>
                                            </tr>
                                        ))
                                    }
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
                            {product.achievements?.highlighted.map((achievement, index) => (
                                <div className='product-achievements-item'
                                    key={index}
                                >
                                    <Image
                                        src={achievement.path}
                                        alt={achievement.name}
                                        width={64}
                                        height={64}
                                    />
                                </div>
                            ))}

                            {/* Nút xem thêm */}
                            <a className='product-achievements-view-all'
                                href="#">
                                View all {product.achievements?.total}
                            </a>
                        </div>
                    </div>
                </Grid2>
            </Grid2>
        </Box >
    );
};

export default ProductDetailPage;