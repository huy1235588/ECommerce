import React, { useState } from "react";

// Định nghĩa kiểu dữ liệu cho danh sách video
interface VideoItem {
    src: string;
    title: string;
}

// Dữ liệu mẫu cho danh sách "Mới phát hành" và "Sắp ra mắt"
const newReleasesData: VideoItem[] = [
    {
        src: "/releases-section/new-releases/black-myth-wukong.webp",
        title: "Black Myth: Wukong",
    },
    {
        src: "/releases-section/new-releases/call-of-duty-black-ops-6.webp",
        title: "Call of Duty®: Black Ops 6",
    },
    {
        src: "/releases-section/new-releases/dragons-dogma-2.webp",
        title: "Dragon's Dogma 2",
    },
    {
        src: "/releases-section/new-releases/final-fantasy-vii-rebirth.webp",
        title: "Final Fantasy VII Rebirth",
    },
    {
        src: "/releases-section/new-releases/god-of-war-ragnarök.jpg",
        title: "God of War™ Ragnarok",
    },
    {
        src: "/releases-section/new-releases/hades-ii.png",
        title: "Hades II",
    },
    {
        src: "/releases-section/new-releases/resident-evil-village.jpg",
        title: "Resident Evil Village",
    },
    {
        src: "/releases-section/new-releases/rise-of-the-ronin.webp",
        title: "Rise of the Ronin",
    },
    {
        src: "/releases-section/new-releases/stellar-blade.webp",
        title: "Stellar Blade™",
    },
    {
        src: "/releases-section/new-releases/tekken-8.jpg",
        title: "TEKKEN 8",
    },
    {
        src: "/releases-section/new-releases/The-last-of-us-part-ii.webp",
        title: "The Last of Us Part II Remastered",
    },

];

const comingSoonData: VideoItem[] = [
    {
        src: "/releases-section/coming-soon/doom-the-dark-ages.jpg",
        title: "Doom: The Dark Ages",
    },
    {
        src: "/releases-section/coming-soon/elden-ring-shadow-of-the-erdtree.jpg",
        title: "Elden Ring: Shadow of the Erdtree",
    },
    {
        src: "/releases-section/coming-soon/Ghost-of-Yotei.webp",
        title: "Ghost of Yōtei",
    },
    {
        src: "/releases-section/coming-soon/gta6.jpg",
        title: "Grand Theft Auto VI",
    },
    {
        src: "/releases-section/coming-soon/little-nightmares-3.jpg",
        title: "Little Nightmares III",
    },
    {
        src: "/releases-section/coming-soon/Pokemon-Legends-Z-A.jpg",
        title: "Pokemon Legends: Z-A",
    },
    {
        src: "/releases-section/coming-soon/spine.jpg",
        title: "Spine",
    },
    {
        src: "/releases-section/coming-soon/the-witcher-4.jpg",
        title: "The Witcher 4: Polaris",
    },
    {
        src: "/releases-section/coming-soon/wolverine-marvel.jpg",
        title: "Marvel's Wolverine",
    },
    {
        src: "/releases-section/coming-soon/wuchang-fallen-feathers.jpg",
        title: "Wuchang: Fallen Feathers",
    },
    {
        src: "/releases-section/coming-soon/zenless-zone-zero.png",
        title: "Zenless Zone Zero",
    },
];

const ReleasesSection: React.FC = () => {
    // Quản lý trạng thái tab đang chọn: "newReleases" hoặc "comingSoon"
    const [activeTab, setActiveTab] = useState<"newReleases" | "comingSoon">("newReleases");

    return (
        <section className="relative w-full mb-16">
            <h2 className="text-center text-4xl pb-4">
                New Releases and Comming soon
            </h2>

            {/* Vùng chứa các nút chuyển tab */}
            <div className="flex justify-center px-10 pt-1 pb-4 mt-4 pb-4">
                <div className="rounded-full bg-slate-900">
                    {/* Nút "Mới phát hành" */}
                    <button
                        onClick={() => setActiveTab("newReleases")}
                        className={`py-3 px-4 rounded-full ${activeTab === "newReleases" ? "bg-white text-black" : "bg-transparent text-white"
                            }`}
                    >
                        New Releases
                    </button>
                    {/* Nút "Sắp ra mắt" */}
                    <button
                        onClick={() => setActiveTab("comingSoon")}
                        className={`py-3 px-4 rounded-full ${activeTab === "comingSoon" ? "bg-white text-black" : "bg-transparent text-white"
                            }`}
                    >
                        Coming soon
                    </button>
                </div>
            </div>

            {/* Danh sách "Mới phát hành" */}
            <ul
                className={`relative flex flex-wrap justify-center gap-y-6 mt-5
                        ${activeTab === "newReleases" ? "block" : "hidden"
                    }`}
            >
                {newReleasesData.map((video, index) => (
                    <li
                        key={index}
                        className="flex-shrink-0 ml-4 releases-item"
                    >
                        <a href="" className="releases-item-a">
                            <img src={video.src} className="w-full" alt={video.title} />
                            <p className="mt-3 text-base text-center">{video.title}</p>
                        </a>
                    </li>
                ))}
            </ul>

            {/* Danh sách "Sắp ra mắt" */}
            <ul
                className={`relative flex flex-wrap justify-center gap-y-6 mt-5 ${activeTab === "comingSoon" ? "block" : "hidden"}`}
            >
                {comingSoonData.map((video, index) => (
                    <li
                        key={index}
                        className={`flex-shrink-0 ml-4 releases-item`}
                    >
                        <a href="" className="releases-item-a">
                            <img src={video.src} className="w-full" alt={video.title} />
                            <p className="mt-3 text-base text-center">{video.title}</p>
                        </a>
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default ReleasesSection;