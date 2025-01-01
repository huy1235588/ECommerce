import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import "swiper/swiper-bundle.css";
import { useState, useEffect } from "react";
import Image from "next/image";

interface GameItem {
    src: string;
    title: string;
}

const discoverData1: GameItem[] = [
    { src: "/image/section/discover-section/Ace_Angler_Fishing_Spirits.png", title: "Ace Angler: Fishing Spirits" },
    { src: "/image/section/discover-section/DRAGON_BALL_Sparking_ZERO.png", title: "Dragon Ball Sparking ZERO" },
    { src: "/image/section/discover-section/ELDEN_RING.jpg", title: "Elden Ring" },
    { src: "/image/section/discover-section/FINAL_FANTASY_PIXEL_REMASTER_SERIES.jpg", title: "Final Fantasy Pixel Remaster" },
    { src: "/image/section/discover-section/FINAL_FANTASY_VII_REBIRTH.png", title: "Final Fantasy VII Rebirth" },
    { src: "/image/section/discover-section/GUNDAM_BREAKER_4.png", title: "Gundam Breaker 4" },
    { src: "/image/section/discover-section/Little_Nightmares_III.jpg", title: "Little Nightmares III" },
    { src: "/image/section/discover-section/NARUTO_X_BORUTO_Ultimate_Ninja_STORM_CONNECTIONS.png", title: "Naruto x Boruto" },
];

const discoverData2: GameItem[] = [
    { src: "/image/section/discover-section/ONE_PIECE_ODYSSEY.png", title: "One Piece Odyssey" },
    { src: "/image/section/discover-section/ONE_PIECE_PIRATE_WARRIORS_4.png", title: "One Piece Pirate Warriors 4" },
    { src: "/image/section/discover-section/Slime_ISEKAI_Chronicles.png", title: "Slime Isekai Chronicles" },
    { src: "/image/section/discover-section/Taiko_Rhythm_Festival.png", title: "Taiko Rhythm Festival" },
    { src: "/image/section/discover-section/Tales_of_Arise.png", title: "Tales of Arise" },
    { src: "/image/section/discover-section/TEKKEN_8.png", title: "TEKKEN 8" },
];

function DiscoverSection() {
    const [slidesPerView, setSlidesPerView] = useState<number>(window.innerWidth / 384);

    useEffect(() => {
        const handleResize = () => setSlidesPerView(window.innerWidth / 358);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <section className="discover-section">
            <h2 className="heading-section">Discover fun for all</h2>

            <div className="discover-swiper-container">
                <Swiper
                    modules={[FreeMode, Autoplay]}
                    lazyPreloadPrevNext={2}
                    slidesPerView={slidesPerView}
                    spaceBetween={30}
                    grabCursor={true}
                    loop={true}
                    autoplay={{ delay: 4000, disableOnInteraction: false }}
                    className="discover-swiper"
                >
                    {discoverData1.map((discover, index) => (
                        <SwiperSlide key={index}>
                            <a href="#" className="discover-slide">
                                <Image
                                    src={discover.src}
                                    alt={discover.title}
                                    width={358}
                                    height={209}
                                    className="discover-image"
                                    loading="lazy"
                                />
                                <div className="discover-overlay">
                                    <p className="discover-title-overlay">{discover.title}</p>
                                </div>
                            </a>
                        </SwiperSlide>
                    ))}
                </Swiper>

                <div className="reversed-container">
                    <Swiper
                        modules={[FreeMode, Autoplay]}
                        lazyPreloadPrevNext={2}
                        slidesPerView={slidesPerView}
                        spaceBetween={30}
                        grabCursor={true}
                        loop={true}
                        autoplay={{ delay: 4000, disableOnInteraction: false, reverseDirection: true }}
                        className="discover-swiper reversed"
                    >
                        {discoverData2.map((discover, index) => (
                            <SwiperSlide key={index}>
                                <a href="#" className="discover-slide">
                                    <Image
                                        src={discover.src}
                                        alt={discover.title}
                                        width={358}
                                        height={209}
                                        className="discover-image"
                                        loading="lazy"
                                    />
                                    <div className="discover-overlay">
                                        <p className="discover-title-overlay">{discover.title}</p>
                                    </div>
                                </a>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>

            <div className="discover-footer">
                <a href="#" className="discover-see-all">See all games</a>
            </div>
        </section>
    );
}

export default DiscoverSection;
