import { useState, useMemo, useCallback } from "react";
import GameReview from "./gameReview";
import LazyImage from "./lazyImage";
import { FaApple, FaLinux, FaWindows } from "react-icons/fa";

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

const newTrendingData: GameItem[] = [
    {
        id: 1,
        title: "Diablo® IV",
        finalPrice: 50,
        basePrice: 70,
        discount: 28,
        rating: 4.8,
        genres: ["RPG", "Action"],
        os: ["Windows", "Mac"],
        image: "https://via.placeholder.com/184x69?text=Diablo+IV",
        imageReview: [
            "https://via.placeholder.com/600x338?text=Diablo+IV+Review+1",
            "https://via.placeholder.com/600x338?text=Diablo+IV+Review+2",
            "https://via.placeholder.com/600x338?text=Diablo+IV+Review+1",
            "https://via.placeholder.com/600x338?text=Diablo+IV+Review+2",
            "https://via.placeholder.com/600x338?text=Diablo+IV+Review+2",
        ],
    },
    {
        id: 2,
        title: "Diablo® IV: Vessel of Hatred™ - Expansion Bundle",
        finalPrice: 60,
        basePrice: 80,
        discount: 25,
        rating: 3.4,
        genres: ["RPG", "Adventure"],
        os: ["Windows", "Mac"],
        image: "https://via.placeholder.com/231x87?text=Baldur's+Gate+3",
        imageReview: [
            "https://via.placeholder.com/600x338?text=Baldur's+Gate+3+Review+1",
            "https://via.placeholder.com/600x338?text=Baldur's+Gate+3+Review+2",
            "https://via.placeholder.com/600x338?text=Baldur's+Gate+3+Review+1",
            "https://via.placeholder.com/600x338?text=Baldur's+Gate+3+Review+2",
            "https://via.placeholder.com/600x338?text=Baldur's+Gate+3+Review+2",
        ],
    },
    {
        id: 3,
        title: "S.T.A.L.K.E.R. 2: Heart of Chornobyl",
        finalPrice: 60,
        basePrice: 80,
        discount: 25,
        rating: 4.9,
        genres: ["RPG", "Adventure"],
        os: ["Windows", "Mac"],
        image: "https://via.placeholder.com/231x87?text=Baldur's+Gate+3",
        imageReview: [
            "https://via.placeholder.com/600x338?text=Baldur's+Gate+3+Review+1",
            "https://via.placeholder.com/600x338?text=Baldur's+Gate+3+Review+2",
            "https://via.placeholder.com/600x338?text=Baldur's+Gate+3+Review+1",
            "https://via.placeholder.com/600x338?text=Baldur's+Gate+3+Review+2",
            "https://via.placeholder.com/600x338?text=Baldur's+Gate+3+Review+2",
        ],
    },
    {
        id: 12,
        title: "PockeDate! - Pocket Dating Simulator",
        finalPrice: 0,
        rating: 4.9,
        genres: ["RPG", "Adventure"],
        os: ["Windows", "Mac"],
        image: "https://via.placeholder.com/40x25?text=Baldur's+Gate+3",
        imageReview: [
            "https://via.placeholder.com/600x338?text=Baldur's+Gate+3+Review+1",
            "https://via.placeholder.com/600x338?text=Baldur's+Gate+3+Review+2",
            "https://via.placeholder.com/600x338?text=Baldur's+Gate+3+Review+1",
            "https://via.placeholder.com/600x338?text=Baldur's+Gate+3+Review+2",
            "https://via.placeholder.com/600x338?text=Baldur's+Gate+3+Review+2",
        ],
    },
    {
        id: 13,
        title: "PockeDate! - Pocket Dating Simulator",
        finalPrice: 0,
        rating: 4.9,
        genres: ["RPG", "Adventure"],
        os: ["Windows", "Mac"],
        image: "https://via.placeholder.com/40x25?text=Baldur's+Gate+3",
        imageReview: [
            "https://via.placeholder.com/600x338?text=Baldur's+Gate+3+Review+1",
            "https://via.placeholder.com/600x338?text=Baldur's+Gate+3+Review+2",
            "https://via.placeholder.com/600x338?text=Baldur's+Gate+3+Review+1",
            "https://via.placeholder.com/600x338?text=Baldur's+Gate+3+Review+2",
            "https://via.placeholder.com/600x338?text=Baldur's+Gate+3+Review+2",
        ],
    },
    {
        id: 14,
        title: "PockeDate! - Pocket Dating Simulator",
        finalPrice: 0,
        rating: 4.9,
        genres: ["RPG", "Adventure"],
        os: ["Windows", "Mac"],
        image: "https://via.placeholder.com/40x25?text=Baldur's+Gate+3",
        imageReview: [
            "https://via.placeholder.com/600x338?text=Baldur's+Gate+3+Review+1",
            "https://via.placeholder.com/600x338?text=Baldur's+Gate+3+Review+2",
            "https://via.placeholder.com/600x338?text=Baldur's+Gate+3+Review+1",
            "https://via.placeholder.com/600x338?text=Baldur's+Gate+3+Review+2",
            "https://via.placeholder.com/600x338?text=Baldur's+Gate+3+Review+2",
        ],
    },
    {
        id: 15,
        title: "PockeDate! - Pocket Dating Simulator",
        finalPrice: 0,
        rating: 4.9,
        genres: ["RPG", "Adventure", "Adventure", "Adventure", "Adventure", "Adventure", "Adventure"],
        os: ["Windows", "Mac"],
        image: "https://via.placeholder.com/40x25?text=Baldur's+Gate+3",
        imageReview: [
            "https://via.placeholder.com/600x338?text=Baldur's+Gate+3+Review+1",
            "https://via.placeholder.com/600x338?text=Baldur's+Gate+3+Review+2",
            "https://via.placeholder.com/600x338?text=Baldur's+Gate+3+Review+1",
            "https://via.placeholder.com/600x338?text=Baldur's+Gate+3+Review+2",
            "https://via.placeholder.com/600x338?text=Baldur's+Gate+3+Review+2",
        ],
    },
    {
        id: 16,
        title: "PockeDate! - Pocket Dating Simulator",
        finalPrice: 0,
        rating: 4.9,
        genres: ["RPG", "Adventure"],
        os: ["Windows", "Mac"],
        image: "https://via.placeholder.com/40x25?text=Baldur's+Gate+3",
        imageReview: [
            "https://via.placeholder.com/600x338?text=Baldur's+Gate+3+Review+1",
            "https://via.placeholder.com/600x338?text=Baldur's+Gate+3+Review+2",
            "https://via.placeholder.com/600x338?text=Baldur's+Gate+3+Review+1",
            "https://via.placeholder.com/600x338?text=Baldur's+Gate+3+Review+2",
            "https://via.placeholder.com/600x338?text=Baldur's+Gate+3+Review+2",
        ],
    },
];

const topSellersData: GameItem[] = [
    {
        id: 10,
        title: "Counter-Strike 2",
        finalPrice: 0,
        rating: 4.6,
        genres: ["FPS", "Multiplayer"],
        os: ["Windows", "Linux"],
        image: "https://via.placeholder.com/150?text=Counter-Strike+2",
        imageReview: [
            "https://via.placeholder.com/150?text=Counter-Strike+2+Review+1",
            "https://via.placeholder.com/150?text=Counter-Strike+2+Review+2",
        ],
    },
    {
        id: 11,
        title: "FIFA 24",
        finalPrice: 70,
        basePrice: 90,
        discount: 22,
        rating: 4.2,
        genres: ["Sports", "Simulation"],
        os: ["Windows"],
        image: "https://via.placeholder.com/150?text=FIFA+24",
        imageReview: [
            "https://via.placeholder.com/150?text=FIFA+24+Review+1",
            "https://via.placeholder.com/150?text=FIFA+24+Review+2",
        ],
    },
];

const popularUpcomingData: GameItem[] = [
    {
        id: 5,
        title: "Starfield",
        finalPrice: 70,
        rating: 4.7,
        genres: ["RPG", "Sci-fi"],
        os: ["Windows"],
        image: "https://via.placeholder.com/150?text=Starfield",
        imageReview: [
            "https://via.placeholder.com/150?text=Starfield+Review+1",
            "https://via.placeholder.com/150?text=Starfield+Review+2",
        ],
    },
    {
        id: 6,
        title: "The Elder Scrolls VI",
        finalPrice: 0,
        rating: 4.9,
        genres: ["RPG", "Fantasy"],
        os: ["Windows", "Mac"],
        image: "https://via.placeholder.com/150?text=Elder+Scrolls+VI",
        imageReview: [
            "https://via.placeholder.com/150?text=Elder+Scrolls+VI+Review+1",
            "https://via.placeholder.com/150?text=Elder+Scrolls+VI+Review+2",
        ],
    },
];

const specialsData: GameItem[] = [
    {
        id: 7,
        title: "Cyberpunk 2077",
        finalPrice: 30,
        basePrice: 60,
        discount: 50,
        rating: 4.5,
        genres: ["RPG", "Action"],
        os: ["Windows", "Mac"],
        image: "https://via.placeholder.com/150?text=Cyberpunk+2077",
        imageReview: [
            "https://via.placeholder.com/150?text=Cyberpunk+2077+Review+1",
            "https://via.placeholder.com/150?text=Cyberpunk+2077+Review+2",
        ],
    },
    {
        id: 8,
        title: "Red Dead Redemption 2",
        finalPrice: 40,
        basePrice: 80,
        discount: 50,
        rating: 4.8,
        genres: ["Adventure", "Action"],
        os: ["Windows"],
        image: "https://via.placeholder.com/150?text=Red+Dead+Redemption+2",
        imageReview: [
            "https://via.placeholder.com/150?text=Red+Dead+Redemption+2+Review+1",
            "https://via.placeholder.com/150?text=Red+Dead+Redemption+2+Review+2",
        ],
    },
];

const trendingFreeData: GameItem[] = [
    {
        id: 9,
        title: "Dota 2",
        finalPrice: 0,
        rating: 4.3,
        genres: ["MOBA"],
        os: ["Windows", "Mac", "Linux"],
        image: "https://via.placeholder.com/150?text=Dota+2",
        imageReview: [
            "https://via.placeholder.com/150?text=Dota+2+Review+1",
            "https://via.placeholder.com/150?text=Dota+2+Review+2",
        ],
    },
    {
        id: 10,
        title: "Team Fortress 2",
        finalPrice: 0,
        rating: 4.4,
        genres: ["FPS", "Multiplayer"],
        os: ["Windows", "Mac", "Linux"],
        image: "https://via.placeholder.com/150?text=Team+Fortress+2",
        imageReview: [
            "https://via.placeholder.com/150?text=Team+Fortress+2+Review+1",
            "https://via.placeholder.com/150?text=Team+Fortress+2+Review+2",
        ],
    },
];


const tabHeaderData = [
    "New & Trending",
    "Top Sellers",
    "Popular Upcoming",
    "Specials",
    "Trending Free",
];

const getGameDataByTab = (activeTab: number): GameItem[] => {
    switch (activeTab) {
        case 0: return newTrendingData;
        case 1: return topSellersData;
        case 2: return popularUpcomingData;
        case 3: return specialsData;
        case 4: return trendingFreeData;
        default: return [];
    }
};

const GameShowcase: React.FC = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [gameReview, setGameReview] = useState<GameItem['id'] | null>(getGameDataByTab(0)[0].id || null);

    const gameData = useMemo(() => getGameDataByTab(activeTab), [activeTab]);

    // Hàm chuyển đổi tab
    const handleTabClick = useCallback((index: number) => {
        setActiveTab(index);
        setGameReview(getGameDataByTab(index)[0].id || null);
    }, []);

    // Hàm hover từng game
    const handleMouseEnter = useCallback((id: GameItem['id']) => {
        setGameReview(id);
    }, []);

    // Hàm chuyển đổi hệ điều hành sang icon
    const renderOSIcon = (os: string) => {
        switch (os) {
            case "Windows":
                return <FaWindows />;
            case "Mac":
                return <FaApple />;
            case "Linux":
                return <FaLinux />;
            default:
                return null;
        }
    };

    // Hàm render preview
    const Preview: React.FC = () => {
        // Memoize game data cho mỗi tab để tránh gọi lại getGameDataByTab nhiều lần
        const previewData = useMemo(() => {
            return tabHeaderData.map((_, index) => getGameDataByTab(index));
        }, []);

        return (
            <div className="w-[25%] mt-12 ml-3 rounded-lg"
                style={{
                    background: "radial-gradient(69% 62% at 100% 16%, #b4cfe1 0%, #95bbd4 100%)",
                }}
            >
                {previewData.map((games, index) => (
                    <ul key={index} className="relative">
                        {games.map((game, gameIndex) => (
                            <GameReview
                                key={gameIndex}
                                game={game}
                                index={gameIndex} // Truyền key của game nếu cần
                                gameReview={gameReview} // Chỉ truyền nếu cần so sánh hay so sáng với gameReview
                            />
                        ))}
                    </ul>
                ))}
            </div>
        );
    };

    return (
        <section className="bg-sky-950 p-1 mt-8 pb-12">
            <div className="w-[90%] flex mx-auto -mt-10">
                {/* Sidebar */}
                <div className="relative flex flex-col w-[75%] bg-transparent">
                    {/* Header */}
                    <div className="mb-2">
                        <ul className="flex">
                            {tabHeaderData.map((tabHeader, index) => (
                                <li
                                    key={index}
                                    className={`cursor-pointer px-3 py-2
                                        ${activeTab === index ? "bg-sky-950 text-white rounded-tr-md rounded-tl-md" : "text-sky-400"
                                        }`}
                                    onClick={() => handleTabClick(index)}
                                >
                                    {tabHeader}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Content */}
                    <ul className="min-h-[770px]">
                        {gameData.map((game, index) => (
                            <li
                                key={index}
                                className="text-white mb-5 border-gray-700"
                                onMouseEnter={() => handleMouseEnter(game.id)} // Khi hover, lưu game vào state
                            >
                                <a href=""
                                    className={`relative block h-[90px] pl-[240px]
                                        ${gameReview == game.id
                                            ? "-mr-6 pe-6 tab-item-hover text-black"
                                            : "mr-0 pe-0 bg-[#00000033] text-white"}
                                        `}
                                >
                                    {/* Hình ảnh game */}
                                    <div className="absolute top-0 left-0 z-10">
                                        <LazyImage
                                            src={game.image}
                                            alt={game.title}
                                            loading="lazy"
                                        />
                                    </div>

                                    {/* Thông tin game */}
                                    <div className="flex justify-between items-center w-full h-full">
                                        {/* Thông chi tiết */}
                                        <div className="flex flex-col justify-center w-[72%]">
                                            {/* Tiêu đề */}
                                            <h3 className="font-semibold pb-2 text-lg truncate w-ff">
                                                {game.title}
                                            </h3>

                                            {/* Os */}
                                            <p className="flex text-gray-500 text-base">
                                                {game.os.map((os, index) => (
                                                    <span
                                                        key={index}
                                                    >
                                                        {renderOSIcon(os)}
                                                    </span>
                                                ))}
                                            </p>

                                            {/* Thể loại */}
                                            <p className=" text-gray-500 text-base truncate">
                                                {game.genres.join(", ")}
                                            </p>
                                        </div>

                                        {/* Giá */}
                                        <div className="flex w-[28%] p-5">
                                            {game.discount && (
                                                <p className="flex items-center">
                                                    <span className="px-2 py-1 text-lg rounded-sm text-lime-300 bg-green-800">
                                                        -{game.discount}%
                                                    </span>
                                                </p>
                                            )}
                                            <p className="flex-1 flex flex-col items-end">
                                                {game.basePrice && (
                                                    <span className="block line-through text-xs text-gray-600">
                                                        ${game.basePrice}
                                                    </span>
                                                )}
                                                <span className="block text-xl font-semibold">
                                                    {game.finalPrice === 0 ? "Free to Play" : `$${game.finalPrice}`}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </a>
                            </li>
                        ))}
                    </ul>

                    {/* See more */}
                    <div className="p-3 text-end bg-[#00000033] text-xs">
                        See more:
                        <a href="" className="p-1 rounded text-white border-gray-100">
                            <span
                                className="border-[#fff6] hover:border-[#fff] border-[1px] px-3 py-1 text-base"
                            >
                                {tabHeaderData[activeTab]}
                            </span>
                        </a>
                    </div>
                </div>

                {/* Preview */}
                <Preview />

            </div>
        </section >
    );
}

export default GameShowcase;