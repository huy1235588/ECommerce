import { useState, useMemo } from "react";

interface GameItem {
    title: string;         // Tên của game
    finalPrice: number;    // Giá cuối cùng của game sau giảm giá
    basePrice?: number;    // Giá gốc của game (nếu có)
    discount?: number;     // Phần trăm giảm giá (nếu có)
    genres: string[];      // Danh sách các thể loại game
    os: string[];          // Danh sách các hệ điều hành hỗ trợ (ví dụ: Windows, Mac, Linux)
    image: string;         // URL hình ảnh của game
}

const newTrendingData: GameItem[] = [
    {
        title: "Diablo® IV",
        finalPrice: 50,
        basePrice: 70,
        discount: 28,
        genres: ["RPG", "Action"],
        os: ["Windows", "Mac"],
        image: "https://via.placeholder.com/150?text=Diablo+IV",
    },
    {
        title: "Baldur's Gate 3",
        finalPrice: 60,
        basePrice: 80,
        discount: 25,
        genres: ["RPG", "Adventure"],
        os: ["Windows", "Mac"],
        image: "https://via.placeholder.com/150?text=Baldur's+Gate+3",
    },
];

const topSellersData: GameItem[] = [
    {
        title: "Counter-Strike 2",
        finalPrice: 0,
        genres: ["FPS", "Multiplayer"],
        os: ["Windows", "Linux"],
        image: "https://via.placeholder.com/150?text=Counter-Strike+2",
    },
    {
        title: "FIFA 24",
        finalPrice: 70,
        basePrice: 90,
        discount: 22,
        genres: ["Sports", "Simulation"],
        os: ["Windows"],
        image: "https://via.placeholder.com/150?text=FIFA+24",
    },
];

const popularUpcomingData: GameItem[] = [
    {
        title: "Starfield",
        finalPrice: 70,
        genres: ["RPG", "Sci-fi"],
        os: ["Windows"],
        image: "https://via.placeholder.com/150?text=Starfield",
    },
    {
        title: "The Elder Scrolls VI",
        finalPrice: 0,
        genres: ["RPG", "Fantasy"],
        os: ["Windows", "Mac"],
        image: "https://via.placeholder.com/150?text=Elder+Scrolls+VI",
    },
];

const specialsData: GameItem[] = [
    {
        title: "Cyberpunk 2077",
        finalPrice: 30,
        basePrice: 60,
        discount: 50,
        genres: ["RPG", "Action"],
        os: ["Windows", "Mac"],
        image: "https://via.placeholder.com/150?text=Cyberpunk+2077",
    },
    {
        title: "Red Dead Redemption 2",
        finalPrice: 40,
        basePrice: 80,
        discount: 50,
        genres: ["Adventure", "Action"],
        os: ["Windows"],
        image: "https://via.placeholder.com/150?text=Red+Dead+Redemption+2",
    },
];

const trendingFreeData: GameItem[] = [
    {
        title: "Dota 2",
        finalPrice: 0,
        genres: ["MOBA"],
        os: ["Windows", "Mac", "Linux"],
        image: "https://via.placeholder.com/150?text=Dota+2",
    },
    {
        title: "Team Fortress 2",
        finalPrice: 0,
        genres: ["FPS", "Multiplayer"],
        os: ["Windows", "Mac", "Linux"],
        image: "https://via.placeholder.com/150?text=Team+Fortress+2",
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

function TableProduct() {
    const [activeTab, setActiveTab] = useState(0);

    const gameData = useMemo(() => getGameDataByTab(activeTab), [activeTab]);

    return (
        <section className="bg-sky-950">
            {/* Header */}
            <div>
                <ul className="flex">
                    {tabHeaderData.map((tabHeader, index) => (
                        <li
                            key={index}
                            className={`cursor-pointer p-2 ${activeTab === index ? "text-blue-500 font-bold" : "text-white"
                                }`}
                            onClick={() => setActiveTab(index)}
                        >
                            {tabHeader}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Content */}
            <div>
                <h2 className="text-white font-bold text-lg my-4">
                    {tabHeaderData[activeTab]}
                </h2>
                <ul>
                    {gameData.map((game, index) => (
                        <li
                            key={index}
                            className="text-white p-2 border-b border-gray-700"
                        >
                            {/* Hình ảnh game */}
                            <img
                                src={game.image}
                                alt={game.title}
                                className="w-20 h-20 object-cover rounded mr-4"
                            />
                            {/* Thông tin game */}
                            <div>
                                <h3 className="font-bold">{game.title}</h3>
                                <p>Price: ${game.finalPrice}</p>
                                {game.discount && (
                                    <p>Discount: {game.discount}%</p>
                                )}
                                <p>Genres: {game.genres.join(", ")}</p>
                                <p>OS: {game.os.join(", ")}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}

export default TableProduct;