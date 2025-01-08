import { Dayjs } from "dayjs";

export const PlatformData = [
    'Windows',
    'Mac',
    'Linux',
    'PlayStation 4',
    'PlayStation 5',
    'Xbox One',
    'Xbox Series X/S',
    'Nintendo Switch',
    'iOS',
    'Android',
    'Web',
    'Other'
];

export const GenreData = [
    'Action',
    'Adventure',
    'Casual',
    'Indie',
    'Massively Multiplayer',
    'Racing',
    'RPG',
    'Simulation',
    'Sports',
    'Strategy',
    'Other'
];

export const TagData = [
    '2D',
    '3D',
    'Atmospheric',
    'Co-op',
    'Competitive',
    'Crafting',
    'Exploration',
    'Horror',
    'Local Multiplayer',
    'Online Multiplayer',
    'Open World',
    'Puzzle',
    'Rogue-like',
    'Rogue-lite',
    'Sandbox',
    'Sci-fi',
    'Singleplayer',
    'Survival',
    'VR',
    'Other'
];

export const FeatureData = [
    'Achievements',
    'Cloud Saves',
    'Controller Support',
    'Cross-Platform Multiplayer',
    'Leaderboards',
    'Mod Support',
    'Online Co-op',
    'Shared/Split Screen',
    'Steam Workshop',
    'Trading Cards',
    'Other'
];

export type Product = {
    _id?: number;
    title: string;
    type: string;
    description?: string;
    price: number;
    discount?: number;
    discountStartDate: Dayjs | null;
    discountEndDate: Dayjs | null;
    releaseDate: Dayjs | null;
    developer: string;
    publisher: string;
    platform: string[];
    rating?: number;
    isActive?: boolean;
    headerImage: string;

    images?: Array<{
        path: string;
        alt?: string;
    }>;

    videos?: Array<{
        path: string;
        poster: string;
        alt?: string;
    }>;

    genres?: string[];
    tags?: string[];
    features?: string[];

    createdAt?: Date;
    updatedAt?: Date;
};