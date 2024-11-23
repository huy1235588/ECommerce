import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { useRef } from "react";
import { Swiper as SwiperType } from "swiper";

interface Slide {
    src: string;
    title: string;
    finalPrice: number;
    basePrice?: number;
    discount?: number;
}

function ShoppingHomeAside() {
    const slides: Slide[] = [
        {
            src: "/banner/call-of-duty-black-ops-3.jpg",
            title: "Call of Duty: Black Ops 3",
            finalPrice: 69.99,
        },
        {
            src: "/banner/days-gone.jpg",
            title: "Days Gone",
            finalPrice: 49.99,
        },
        {
            src: "/banner/detroit-become-human_home.jpg",
            title: "Detroit: Become Human",
            basePrice: 39.99,
            finalPrice: 11.99,
            discount: 70,
        },
        {
            src: "/banner/elden-ring.jpg",
            title: "Elden Ring",
            finalPrice: 59.99,
        },
        {
            src: "/banner/RedDeadRedemption2.jpg",
            title: "Red Dead Redemption 2",
            basePrice: 59.99,
            finalPrice: 19.79,
            discount: 67,
        },
        {
            src: "/banner/zenless-zone-zero-1g9cs.jpg",
            title: "Zenless Zone Zero",
            finalPrice: 0,
        },
    ];

    const swiperRef = useRef<SwiperRef>(null);

    const onAutoplayTimeLeft = (s: SwiperType, time: number, progress: number) => {
        console.log(s, time, progress)
        const swiperPaginationBulletActive = document.querySelector(".swiper-pagination-bullet-active") as HTMLElement;
        //         
        // 
        //              CSS after of swiper-pagination-bullet-active
        // 
        //         
        swiperPaginationBulletActive.style.setProperty('--swiper-after-width', `${(100 - progress * 100) <= 99 ? (100 - progress * 100).toFixed(0) : 0}%`);
    };

    return (
        <aside className="relative flex flex-col w-full h-[92vh] items-center overflow-hidden">
            <Swiper
                ref={swiperRef}
                modules={[Navigation, Pagination, A11y, Autoplay]}
                spaceBetween={20} // Khoảng cách giữa các slide
                slidesPerView={1} // Hiển thị một slide mỗi lần.
                centeredSlides={true} // Các slide sẽ được căn giữa
                loop={true} // Khi đến slide cuối, sẽ tự động quay lại slide đầu tiên.
                navigation={{
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev",
                }}
                pagination={{
                    clickable: true,
                }}
                autoplay={{
                    delay: 4000,  // Đặt thời gian chuyển slide là 2.5 giây
                    disableOnInteraction: false,  // Đảm bảo autoplay tiếp tục dù người dùng tương tác
                }}
                onAutoplayTimeLeft={onAutoplayTimeLeft}
                className="w-[76%] h-full overflow-visible"
            >
                {/* Left */}
                <div className="slide-wrapper-left absolute top-0 w-full h-full cursor-pointer z-50"
                    style={{ right: `calc(100% + 16px)` }}
                    onClick={() => {
                        swiperRef.current?.swiper.slidePrev();

                        const element = document.querySelector('.swiper-wrapper') as HTMLElement;
                        if (element) {
                            const transformValue = element.style.transform;

                            // Extract translateX value
                            const translateX = transformValue.split('translate3d(')[1]?.split("px")[0];
                            const newTranslateX = translateX ? parseInt(translateX) + 30 : 0;

                            element.style.transform = `translate3d(${newTranslateX}px, 0px, 0px)`;
                        }
                    }}
                    onMouseEnter={() => {
                        const element = document.querySelector('.swiper-wrapper') as HTMLElement;
                        if (element) {
                            const transformValue = element.style.transform;

                            // Extract translateX value
                            const translateX = transformValue.split('translate3d(')[1]?.split("px")[0];
                            const newTranslateX = translateX ? parseInt(translateX) + 30 : 30;

                            // Apply the new transform value
                            element.style.transitionDuration = '200ms'
                            element.style.transform = `translate3d(${newTranslateX}px, 0px, 0px)`;
                        }
                    }}
                    onMouseLeave={() => {
                        const element = document.querySelector('.swiper-wrapper') as HTMLElement;
                        if (element) {
                            const transformValue = element.style.transform;

                            // Extract translateX value
                            const translateX = transformValue.split('translate3d(')[1]?.split("px")[0];
                            const newTranslateX = translateX ? parseInt(translateX) - 30 : 0;

                            element.style.transform = `translate3d(${newTranslateX}px, 0px, 0px)`;

                            setTimeout(() => {
                                element.style.transitionDuration = '0ms'
                            }, 0);
                        }
                    }}
                >

                </div>
                {/* Right */}
                <div className="slide-wrapper-right absolute top-0 w-full h-full cursor-pointer z-50"
                    style={{ left: `calc(100% + 16px)` }}
                    onClick={() => {
                        swiperRef.current?.swiper.slideNext();

                        const element = document.querySelector('.swiper-wrapper') as HTMLElement;
                        if (element) {
                            const transformValue = element.style.transform;

                            // Extract translateX value
                            const translateX = transformValue.split('translate3d(')[1]?.split("px")[0];
                            const newTranslateX = translateX ? parseInt(translateX) - 30 : 30;

                            // Apply the new transform value
                            element.style.transform = `translate3d(${newTranslateX}px, 0px, 0px)`;
                        }
                    }}
                    onMouseEnter={() => {
                        const element = document.querySelector('.swiper-wrapper') as HTMLElement;
                        if (element) {
                            const transformValue = element.style.transform;

                            // Extract translateX value
                            const translateX = transformValue.split('translate3d(')[1]?.split("px")[0];
                            const newTranslateX = translateX ? parseInt(translateX) - 30 : 0;

                            // Apply the new transform value
                            element.style.transitionDuration = '200ms'
                            element.style.transform = `translate3d(${newTranslateX}px, 0px, 0px)`;
                        }
                    }}
                    onMouseLeave={() => {
                        const element = document.querySelector('.swiper-wrapper') as HTMLElement;
                        if (element) {
                            const transformValue = element.style.transform;

                            // Extract translateX value
                            const translateX = transformValue.split('translate3d(')[1]?.split("px")[0];
                            const newTranslateX = translateX ? parseInt(translateX) + 30 : 0;

                            // Apply the new transform value
                            element.style.transform = `translate3d(${newTranslateX}px, 0px, 0px)`;

                            setTimeout(() => {
                                element.style.transitionDuration = '0ms'
                            }, 0);
                        }
                    }}
                ></div>

                {/* Slider Container */}
                {slides.map((slide, index) => (
                    <SwiperSlide key={index}>
                        <a href="" className="relative w-full h-[86vh] block">
                            <img
                                className=" h-full object-cover object-center select-none"
                                src={slide.src}
                                alt={slide.title}
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 flex justify-between items-center text-white select-none">
                                {/* Title */}
                                <h3 className="text-2xl font-semibold my-5 mx-7">{slide.title}</h3>
                                <div className="flex m-5 h-12 my-5 mx-7">
                                    <div className="flex items-center mr-3">
                                        {/* Discount */}
                                        {slide.discount && (
                                            <p className="p-3 mr-2 text-xl rounded-md text-lime-300 bg-green-800">
                                                {`-${slide.discount}%`}
                                            </p>
                                        )}
                                        {/* Final price and Baseprice */}
                                        <div>
                                            {slide.basePrice && (
                                                <p className="block line-through text-md text-gray-300">
                                                    ${slide.basePrice}
                                                </p>
                                            )}
                                            <p className="block text-2xl font-semibold">
                                                {slide.finalPrice === 0 ? "Free to Play" : `$${slide.finalPrice}`}
                                            </p>
                                        </div>
                                    </div>
                                    <span
                                        className="flex items-center px-6 py-2 bg-blue-500 rounded hover:bg-blue-600 z-30"
                                        onClick={(e) => {
                                            e.preventDefault(); // Ngăn điều hướng của thẻ <a>
                                        }}
                                    >
                                        Add to Cart
                                    </span>
                                </div>
                            </div>
                        </a>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Navigation Buttons */}
            <button className="swiper-button-prev absolute top-1/2 left-32 w-12 h-12 block after:!content-none transform -translate-y-1/2 m-0 bg-gray-700 text-white p-4 rounded-full hover:bg-purple-600 z-20">
                <FaAngleLeft />
            </button>
            <button className="swiper-button-next absolute top-1/2 right-32 w-12 h-12 block after:!content-none transform -translate-y-1/2 m-0 bg-gray-700 text-white p-4 rounded-full hover:bg-purple-600 z-20">
                <FaAngleRight />
            </button>
        </aside >
    );
}

export default ShoppingHomeAside;
