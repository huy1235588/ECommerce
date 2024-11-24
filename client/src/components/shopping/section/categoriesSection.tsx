import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Pagination, Navigation } from "swiper/modules";
import 'swiper/swiper-bundle.css';
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

interface Category {
    src: string;
    title: string;
}

const categoryData: Category[] = [
    { src: "/categories-section/action.webp", title: "Action" },
    { src: "/categories-section/adventure.webp", title: "Adventure" },
    { src: "/categories-section/anime.webp", title: "Anime" },
    { src: "/categories-section/casual.webp", title: "Casual" },
    { src: "/categories-section/exploration_open_world.webp", title: "Open World" },
    { src: "/categories-section/fighting_martial_arts.webp", title: "Fighting" },
    { src: "/categories-section/freetoplay.webp", title: "Free To Play" },
    { src: "/categories-section/horror.webp", title: "Horror" },
    { src: "/categories-section/multiplayer_coop.webp", title: "Co-Operative" },
    { src: "/categories-section/puzzle_matching.webp", title: "Puzzle" },
    { src: "/categories-section/rogue_like_rogue_lite.webp", title: "Rogue-Like" },
    { src: "/categories-section/rpg.webp", title: "Role-Playing" },
    { src: "/categories-section/science_fiction.webp", title: "Sci-Fi & Cyberpunk" },
    { src: "/categories-section/simulation.webp", title: "Simulation" },
    { src: "/categories-section/sports.webp", title: "All Sports" },
    { src: "/categories-section/story_rich.webp", title: "Story-Rich" },
    { src: "/categories-section/strategy_cities_settlements.webp", title: "City & Settlement" },
    { src: "/categories-section/strategy.webp", title: "Strategy" },
    { src: "/categories-section/visual_novel.webp", title: "Visual Novel" },
];


function CategoriesSection() {
    return (
        <section className="category-section relative w-full pb-16">
            <h2 className="text-center text-4xl pb-4 mb-10">
                Browse by category
            </h2>

            <div className="w-4/5 h-auto mx-auto">
                <div className="relative">
                    <Swiper
                        modules={[Navigation, Pagination, A11y]}
                        lazyPreloadPrevNext={2}
                        slidesPerView={4} // Số lượng hình ảnh hiển thị trên mỗi slide
                        spaceBetween={30} // Khoảng cách giữa các hình ảnh
                        grabCursor={true} // Hiệu ứng kéo bằng chuột
                        loop={true} // Quay lại đầu khi kéo hết
                        navigation={{
                            nextEl: ".cate-swiper-button-next",
                            prevEl: ".cate-swiper-button-prev",
                        }}
                        pagination={{
                            clickable: true,
                        }}

                        className="h-full"
                    >
                        {categoryData.map((category, index) => (
                            <SwiperSlide
                                key={index}
                            >
                                <a href=""
                                    className="relative block overflow-hidden rounded-3xl select-none cate"
                                >
                                    {/* Image */}
                                    <img
                                        alt="Image 1"
                                        srcSet={category.src}
                                        loading="lazy"
                                        className="w-full h-full max-w-[480px] max-h-[466px] rounded-3xl duration-300 hover:scale-125"
                                    />
                                    <div className="swiper-lazy-preloader"></div>

                                    {/* Title */}
                                    <p className="absolute bottom-12 w-full p-4 text-center duration-300 transition-transform ease-in-out z-10">
                                        <span className="px-3 py-2 rounded-sm font-bold bg-white text-cyan-600">
                                            {category.title}
                                        </span>
                                    </p>

                                    <div className="absolute top-0 w-full h-full duration-300 transition-opacity ease-in-out"
                                        style={{
                                            background: "radial-gradient(115% 120% at 0% 0%, transparent, #2880a6)"
                                        }}
                                    ></div>
                                </a>
                            </SwiperSlide>
                        ))}

                    </Swiper>
                    {/* Navigation Buttons */}
                    <button className="cate-swiper-button-prev absolute top-[45%] -left-12 flex justify-center items-center w-12 h-28 p-0 rounded-sm after:!content-none transform -translate-y-1/2 m-0 bg-gray-700 text-white hover:bg-purple-600 z-20">
                        <FaAngleLeft className="w-5 h-10" />
                    </button>
                    <button className="cate-swiper-button-next absolute top-[45%] -right-12 flex justify-center items-center w-12 h-28 p-0 rounded-sm after:!content-none transform -translate-y-1/2 m-0 bg-gray-700 text-white hover:bg-purple-600 z-20">
                        <FaAngleRight className="w-5 h-10" />
                    </button>
                </div>
            </div>
        </section>
    )
}

export default CategoriesSection;