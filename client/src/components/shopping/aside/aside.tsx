import { useRef, useState } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

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
            finalPrice: 59.99
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

    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [dragging, setDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [offsetX, setOffsetX] = useState(0);

    const [isTransitioning, setIsTransitioning] = useState<boolean>(true);

    const slideContainerRef = useRef<HTMLUListElement>(null);

    const handlePrev = () => {
        if (currentIndex === 0) {
            setIsTransitioning(false);
        }
        else {
            setIsTransitioning(true);
        }

        setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
    };

    const handleNext = () => {
        if (currentIndex === slides.length - 1) {
            setIsTransitioning(false);
        }
        else {
            setIsTransitioning(true);
        }

        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        setDragging(true);
        setStartX(e.clientX);  // Lưu vị trí chuột khi nhấn xuống
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!dragging) return;
        const moveX = e.clientX - startX;  // Tính sự di chuyển của chuột
        setOffsetX(moveX);  // Cập nhật sự thay đổi
    };

    const handleMouseUp = () => {
        setDragging(false);
        if (Math.abs(offsetX) > 100) {
            // Nếu kéo qua một khoảng lớn hơn 100px, chuyển đến slide tiếp theo hoặc trước đó
            if (offsetX > 0) {
                handlePrev();
            } else {
                handleNext();
            }
        }
        // Reset trạng thái kéo
        setOffsetX(0);
    };

    const [hoverBothSide, setHoverBothSide] = useState(0);
    const [hoverLeft, setHoverLeft] = useState<number | null>(null);
    const [hoverRight, setHoverRight] = useState<number | null>(null);

    return (
        <aside className="relative flex flex-col w-full items-center overflow-hidden">
            <div className="relative w-[80%]">
                {/* Left */}
                <div className="absolute top-0 w-full h-full cursor-pointer z-100 z-10"
                    style={{ right: `calc(100% + 16px)` }}
                    onClick={handlePrev}
                    onMouseEnter={() => {
                        setHoverBothSide(30);
                        setHoverLeft((currentIndex - 1 + slides.length) % slides.length);
                    }}
                    onMouseLeave={() => {
                        setHoverBothSide(0);
                        setHoverLeft(null);
                    }}
                ></div>
                {/* Right */}
                <div className="absolute top-0 w-full h-full cursor-pointer z-100 z-10"
                    style={{ left: `calc(100% + 16px)` }}
                    onClick={handleNext}
                    onMouseEnter={() => {
                        setHoverBothSide(-30);
                        setHoverRight((currentIndex + 1) % slides.length);
                    }}
                    onMouseLeave={() => {
                        setHoverBothSide(0);
                        setHoverRight(null);
                    }}
                ></div>
                {/* Slider Container */}
                <ul
                    ref={slideContainerRef}
                    className={`flex transition-transform ${isTransitioning ? "duration-500 ease-in-out" : ""}`}
                    style={{
                        transform: `translateX(calc(-${(currentIndex) * 100}% + ${offsetX}px + ${hoverBothSide}px))`,
                    }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}  // Dừng kéo khi chuột rời khỏi
                >
                    {slides.map((slide, index) => (
                        <li
                            key={index}
                            className="flex-shrink-0 relative w-full mr-4"
                            style={{
                                flexBasis: "calc(100% - 16px)",
                                maxWidth: "100%",
                            }}
                        >
                            <a
                                href="#"
                                className={`block relative w-full h-[550px]
                                        ${index === currentIndex || index === hoverLeft || index === hoverRight ? "opacity-100" : "opacity-10"}
                                     `}
                                draggable="false"
                            >
                                <img
                                    className="w-full h-full object-cover object-center select-none"
                                    src={slide.src}
                                    alt={slide.title}
                                    draggable="false"
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
                                        <button className="px-6 py-2 bg-blue-500 rounded hover:bg-blue-600">
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </a>
                        </li>
                    ))}
                </ul>
                {/* Indicators */}
                <div className="flex justify-center mt-3">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            className={`h-1 w-1 rounded-full mx-1 py-1 px-5 ${index === currentIndex ? "bg-blue-500" : "bg-gray-300"
                                }`}
                            onClick={() => setCurrentIndex(index)}
                        ></button>
                    ))}
                </div>
            </div>

            {/* Navigation Buttons */}
            <button
                className="absolute top-1/2 left-24 transform -translate-y-1/2 bg-gray-700 text-white p-4 rounded-full hover:bg-purple-600 z-20"
                onClick={handlePrev}
            >
                <FaAngleLeft />
            </button>
            <button
                className="absolute top-1/2 right-28 transform -translate-y-1/2 bg-gray-700 text-white p-4 rounded-full hover:bg-purple-600 z-20"
                onClick={handleNext}
            >
                <FaAngleRight />
            </button>
        </aside>
    )
}

export default ShoppingHomeAside;