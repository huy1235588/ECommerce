import React, { useState } from "react";
import { Tabs, Tab, Card, CardMedia, CardContent, Typography, Box } from "@mui/material";
import Grid from '@mui/material/Grid2';
import Link from "next/link";

// Định nghĩa kiểu dữ liệu cho danh sách video
interface GameItem {
    src: string;
    title: string;
    link?: '';
}

// Dữ liệu mẫu cho danh sách "Mới phát hành" và "Sắp ra mắt"
const newReleasesData: GameItem[] = [
    {
        src: "/image/section/releases-section/new-releases/black-myth-wukong.webp",
        title: "Black Myth: Wukong",
    },
    {
        src: "/image/section/releases-section/new-releases/call-of-duty-black-ops-6.webp",
        title: "Call of Duty®: Black Ops 6",
    },
    {
        src: "/image/section/releases-section/new-releases/dragons-dogma-2.webp",
        title: "Dragon's Dogma 2",
    },
    {
        src: "/image/section/releases-section/new-releases/final-fantasy-vii-rebirth.webp",
        title: "Final Fantasy VII Rebirth",
    },
    {
        src: "/image/section/releases-section/new-releases/god-of-war-ragnarök.jpg",
        title: "God of War™ Ragnarok",
    },
    {
        src: "/image/section/releases-section/new-releases/hades-ii.png",
        title: "Hades II",
    },
    {
        src: "/image/section/releases-section/new-releases/resident-evil-village.jpg",
        title: "Resident Evil Village",
    },
    {
        src: "/image/section/releases-section/new-releases/rise-of-the-ronin.webp",
        title: "Rise of the Ronin",
    },
    {
        src: "/image/section/releases-section/new-releases/stellar-blade.webp",
        title: "Stellar Blade™",
    },
    {
        src: "/image/section/releases-section/new-releases/tekken-8.jpg",
        title: "TEKKEN 8",
    },
    {
        src: "/image/section/releases-section/new-releases/The-last-of-us-part-ii.webp",
        title: "The Last of Us Part II Remastered",
    },

];

const comingSoonData: GameItem[] = [
    {
        src: "/image/section/releases-section/coming-soon/doom-the-dark-ages.jpg",
        title: "Doom: The Dark Ages",
    },
    {
        src: "/image/section/releases-section/coming-soon/elden-ring-shadow-of-the-erdtree.jpg",
        title: "Elden Ring: Shadow of the Erdtree",
    },
    {
        src: "/image/section/releases-section/coming-soon/Ghost-of-Yotei.webp",
        title: "Ghost of Yōtei",
    },
    {
        src: "/image/section/releases-section/coming-soon/gta6.jpg",
        title: "Grand Theft Auto VI",
    },
    {
        src: "/image/section/releases-section/coming-soon/little-nightmares-3.jpg",
        title: "Little Nightmares III",
    },
    {
        src: "/image/section/releases-section/coming-soon/Pokemon-Legends-Z-A.jpg",
        title: "Pokemon Legends: Z-A",
    },
    {
        src: "/image/section/releases-section/coming-soon/spine.jpg",
        title: "Spine",
    },
    {
        src: "/image/section/releases-section/coming-soon/the-witcher-4.jpg",
        title: "The Witcher 4: Polaris",
    },
    {
        src: "/image/section/releases-section/coming-soon/wolverine-marvel.jpg",
        title: "Marvel's Wolverine",
    },
    {
        src: "/image/section/releases-section/coming-soon/wuchang-fallen-feathers.jpg",
        title: "Wuchang: Fallen Feathers",
    },
    {
        src: "/image/section/releases-section/coming-soon/zenless-zone-zero.png",
        title: "Zenless Zone Zero",
    },
];

const ReleasesSection: React.FC = () => {
    const [activeTab, setActiveTab] = useState<"newReleases" | "comingSoon">("newReleases");

    const handleTabChange = (event: React.SyntheticEvent, newValue: "newReleases" | "comingSoon") => {
        setActiveTab(newValue);
    };

    const renderGameCards = (data: GameItem[]) => (
        <Grid container spacing={3} justifyContent="center">
            {data.map((game, index) => (
                <Grid className="release-item-container"
                    key={index}
                    size={{ sm: 6, md: 4, lg: 2, }}
                >
                    <Link href={game.link ? game.link : '/'} style={{ textDecoration: 'none' }}>

                        <Card className="release-item">
                            <CardMedia className="release-item-img"
                                component="img"
                                image={game.src}
                                alt={game.title}
                            />
                            <CardContent className="release-item-content">
                                <Typography variant="body1" align="center">
                                    {game.title}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Link>
                </Grid>
            ))}
        </Grid>
    );

    return (
        <section className="release-section">
            <Typography variant="h4" align="center" gutterBottom>
                New Releases and Coming Soon
            </Typography>

            {/* Tabs */}
            <div className="release-tabs">
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    textColor="primary"
                    TabIndicatorProps={{
                        sx: {
                            display: 'none'
                        }
                    }}
                    centered
                >
                    <Tab
                        className="release-tab"
                        label="New Releases"
                        value="newReleases"
                    />
                    <Tab
                        className="coming-soon-tab"
                        label="Coming Soon"
                        value="comingSoon"
                    />
                </Tabs>
            </div>

            {/* Tab Panels */}
            <Box sx={{ px: 2 }}>
                {activeTab === "newReleases" && renderGameCards(newReleasesData)}
                {activeTab === "comingSoon" && renderGameCards(comingSoonData)}
            </Box>
        </section>
    );
};

export default ReleasesSection;
