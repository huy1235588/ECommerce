import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/swiper-bundle.css';

interface GameItem {
    src: string;
    title: string;
}

const discoverData1: GameItem[] = [
    {
        src: "/discover-section/Ace_Angler_Fishing_Spirits.png",
        title: "Black Myth: Wukong",
    },
    {
        src: "/discover-section/DRAGON_BALL_Sparking_ZERO.png",
        title: "Black Myth: Wukong",
    },
    {
        src: "/discover-section/ELDEN_RING.jpg",
        title: "Black Myth: Wukong",
    },
    {
        src: "/discover-section/FINAL_FANTASY_PIXEL_REMASTER_SERIES.jpg",
        title: "Black Myth: Wukong",
    },
    {
        src: "/discover-section/FINAL_FANTASY_VII_REBIRTH.png",
        title: "Black Myth: Wukong",
    },
    {
        src: "/discover-section/GUNDAM_BREAKER_4.png",
        title: "Black Myth: Wukong",
    },
    {
        src: "/discover-section/Little_Nightmares_III.jpg",
        title: "Black Myth: Wukong",
    },
    {
        src: "/discover-section/NARUTO_X_BORUTO_Ultimate_Ninja_STORM_CONNECTIONS.png",
        title: "Black Myth: Wukong",
    },
];

const discoverData2: GameItem[] = [
    {
        src: "/discover-section/ONE_PIECE_ODYSSEY.png",
        title: "Black Myth: Wukong",
    },
    {
        src: "/discover-section/ONE_PIECE_PIRATE_WARRIORS_4.png",
        title: "Black Myth: Wukong",
    },
    {
        src: "/discover-section/Slime_ISEKAI_Chronicles.png",
        title: "Black Myth: Wukong",
    },
    {
        src: "/discover-section/Taiko_Rhythm_Festival.png",
        title: "Black Myth: Wukong",
    },
    {
        src: "/discover-section/Tales_of_Arise.png",
        title: "Black Myth: Wukong",
    },
    {
        src: "/discover-section/TEKKEN_8.png",
        title: "Black Myth: Wukong",
    },
];

function DiscoverSection() {

    return (
        <section className="relative w-full mb-16 py-10 bg-white text-black">
            <h2 className="text-center text-4xl mb-10 font-semibold">
                Discover fun for all
            </h2>

            <div className="container mx-auto overflow-hidden select-none">
                <Swiper
                    slidesPerView={3.33247} // Số lượng hình ảnh hiển thị trên mỗi slide
                    spaceBetween={30} // Khoảng cách giữa các hình ảnh
                    grabCursor={true} // Hiệu ứng kéo bằng chuột
                    loop={true} // Quay lại đầu khi kéo hết
                    initialSlide={0}
                    effect=""
                    className="swiper-container mb-6"
                >
                    {discoverData1.map((discover, index) => (
                        <SwiperSlide
                            key={index}
                            className="overflow-hidden"
                        >
                            <img
                                src={discover.src}
                                alt="Image 1"
                                className="h-[209px] rounded-3xl duration-300 hover:scale-125"
                            />
                        </SwiperSlide>
                    ))}

                </Swiper>

                <Swiper
                    slidesPerView={3.33247} // Số lượng hình ảnh hiển thị trên mỗi slide
                    spaceBetween={30} // Khoảng cách giữa các hình ảnh
                    grabCursor={true} // Hiệu ứng kéo bằng chuột
                    loop={true} // Quay lại đầu khi kéo hết
                    initialSlide={0}
                    effect="fade"
                    autoplay={{
                        delay: 2500,  // Đặt thời gian chuyển slide là 2.5 giây
                        disableOnInteraction: true  // Đảm bảo autoplay tiếp tục dù người dùng tương tác
                    }}
                    className="swiper-container"
                >
                    {discoverData2.map((discover, index) => (
                        <SwiperSlide
                            key={index}
                            className="overflow-hidden rounded-3xl"
                        >
                            <img
                                src={discover.src}
                                alt="Image 1"
                                className="h-[209px] rounded-3xl duration-300 hover:scale-125"
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            <div className="flex justify-center">
                <div className="mt-14">
                    <a href="" className="block px-7 py-3 rounded-3xl duration-300 bg-green-500 text-white hover:bg-green-600">
                        See all games
                    </a>
                </div>
            </div>
        </section>
    )
}

export default DiscoverSection;