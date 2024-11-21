import { useRef, useState } from "react";

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

    const slideContainerRef = useRef<HTMLUListElement>(null);

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
    };

    const handleNext = () => {
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

    return (
        <aside className="relative flex flex-col w-full items-center">
            <div className="relative w-[80%] overflow-hidden">
                {/* Slider Container */}
                <ul
                    ref={slideContainerRef}
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{
                        transform: `translateX(calc(-${(currentIndex) * 100}% + ${offsetX}px))`,
                    }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}  // Dừng kéo khi chuột rời khỏi
                >
                    {slides.map((slide, index) => (
                        <li
                            key={index}
                            className="flex-shrink-0 relative w-full"
                            style={{
                                flexBasis: "100%",
                                maxWidth: "100%",
                            }}
                        >
                            <a
                                href="#"
                                className="block relative w-full h-[550px]"
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
                                        <p className="flex items-center mr-3">
                                            {/* Discount */}
                                            {slide.discount && (
                                                <p className="p-3 mr-2 text-xl rounded-md text-lime-300 bg-green-800">
                                                    {`-${slide.discount}%`}
                                                </p>
                                            )}
                                            {/* Final price and Baseprice */}
                                            <p>
                                                {slide.basePrice && (
                                                    <p className="line-through text-lg text-gray-300">
                                                        ${slide.basePrice}
                                                    </p>
                                                )}
                                                <p className="text-2xl font-semibold">
                                                    {slide.finalPrice === 0 ? "Free to Play" : `$${slide.finalPrice}`}
                                                </p>
                                            </p>
                                        </p>
                                        <button className="px-6 py-2 bg-blue-500 rounded hover:bg-blue-600">
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </a>
                        </li>
                    ))}
                </ul>
                {/* Navigation Buttons */}
                <button
                    className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full"
                    onClick={handlePrev}
                >
                    ❮
                </button>
                <button
                    className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full"
                    onClick={handleNext}
                >
                    ❯
                </button>
            </div>
            {/* Indicators */}
            <div className="flex justify-center mt-4">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        className={`h-1 w-1 rounded-full mx-1 py-1 px-3 ${index === currentIndex ? "bg-blue-500" : "bg-gray-300"
                            }`}
                        onClick={() => setCurrentIndex(index)}
                    ></button>
                ))}
            </div>
        </aside>
    )
}

export default ShoppingHomeAside;