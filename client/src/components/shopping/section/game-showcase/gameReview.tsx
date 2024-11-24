
import React from "react";
import { FaRegStar, FaStar } from "react-icons/fa";

interface GameItem {
    id: number;
    title: string;         // Tên của game
    finalPrice: number;    // Giá cuối cùng của game sau giảm giá
    basePrice?: number;    // Giá gốc của game (nếu có)
    discount?: number;     // Phần trăm giảm giá (nếu có)
    rating: number;        // Đánh giá trung bình (trên thang điểm 5 hoặc 10)
    genres: string[];      // Danh sách các thể loại game
    os: string[];          // Danh sách các hệ điều hành hỗ trợ (ví dụ: Windows, Mac, Linux)
    image: string;         // URL hình ảnh của game
    imageReview: string[]; // Danh sách URL các hình ảnh đánh giá hoặc minh họa
}

interface GameReviewProps {
    game: GameItem;
    index: number;
    gameReview: number | null;
}

const GameReview: React.FC<GameReviewProps> = ({ game, gameReview }) => {
    return (
        <div
            className={`absolute top-0 left-0 w-full p-4 border-gray-700 text-black
                    ${game.id === gameReview ? "opacity-100 block" : "opacity-0 none"}
                `}
        >
            {/* Title */}
            <h2 className="font-bold pb-2 text-lg truncate w-ff">
                {game.title}
            </h2>

            {/* Rating */}
            <div className="flex items-center mb-2">
                <div className="relative flex mr-1" >
                    {/* Hiển thị 5 ngôi sao rỗng */}
                    {[...Array(5)].map((_, index) => (
                        <FaRegStar key={index} />
                    ))}

                    {/* Phần tràn ngôi sao đầy */}
                    <div className={`absolute overflow-hidden `}
                        style={{
                            width: `${(game.rating / 5 * 100).toFixed(0)}%`, // Tính toán phần trăm dựa trên rating
                        }}
                    >
                        {/* Hiển thị 5 ngôi sao đầy */}
                        <div className="w-[80px] flex">
                            {[...Array(5)].map((_, index) => (
                                <FaStar key={index} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Điểm số đánh giá */}
                <div className="" >
                    {game.rating}
                </div>
            </div>

            {/* Genres */}
            <div className="h-6 overflow-hidden">
                {game.genres.map((genre, index) => (
                    <a href=""
                        className="inline-block px-2 py-[2px] mr-1 rounded bg-[#2636454d] text-[#fff9] text-sm"
                        key={index}
                    >
                        {genre}
                    </a>
                ))}
            </div>

            {/* Image */}
            <div className="w-full flex flex-col items-center">
                {game.imageReview.map((img, index) => (
                    <img
                        key={index}
                        src={img}
                        alt={game.title}
                        loading="lazy"
                        className="w-[258px] h-[134px] object-cover rounded mt-4"
                    />
                ))}
            </div>
        </div>
    );
};

export default GameReview;