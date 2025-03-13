'use client';

import { ProductMovie, ProductScreenshot } from "@/types/product";
import { Button, Grid2 } from "@mui/material";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { GridCheckIcon } from "@mui/x-data-grid";
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { FreeMode, Navigation, Scrollbar, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';
import 'swiper/css/thumbs';
interface HighlightPlayerProps {
    screenshots: ProductScreenshot[];
    movies: ProductMovie[];
}

const HighlightPlayer: React.FC<HighlightPlayerProps> = ({
    screenshots,
    movies
}) => {
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0); // Index của slide hiện tại
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null); // Swiper thumbnail
    const [mainSwiper, setMainSwiper] = useState<SwiperType | null>(null); // Swiper chính


    // Media
    const mediaItems = useMemo(() => [
        ...movies.map(video => ({ type: 'video', src: video.mp4.max })),
        ...screenshots.map(screenshot => ({ type: 'image', src: screenshot.path_thumbnail }))
    ], [movies, screenshots]);

    // Thumbs
    const thumbItems = [
        ...movies.map(video => ({
            type: 'video',
            src: video.mp4,
            thumbnail: video.thumbnail
        })),
        ...screenshots.map(screenshot => ({
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


    return (
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
    )
};

export default HighlightPlayer;