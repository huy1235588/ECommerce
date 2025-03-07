import { Dayjs } from "dayjs";

export const TypeData = [
    'Game',
    'DLC',
    'Software',
    'Bundle',
    'Other'
];

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

export type ProductVideos = {
    thumbnail: string,
    mp4: string,
    webm: string,
}

export type ProductSystemRequirements = {
    title: "OS" | "Processor" | "Memory" | "Graphics" | "DirectX" | "Storage" | "Sound Card" | "Additional Notes",
    minimum: string,
    recommended: string
}

export type ProductOS = {
    win: ProductSystemRequirements[],
    mac?: ProductSystemRequirements[],
    linux?: ProductSystemRequirements[]
}

export type Product = {
    _id?: number;
    productId: number;
    title: string;
    type: string;
    description?: string;
    detail?: string;
    price: number;

    discount?: number;
    discountStartDate: Dayjs | null;
    discountEndDate: Dayjs | null;

    releaseDate: Dayjs | null;

    developer: string[];
    publisher: string[];
    platform: string[];

    rating?: number;
    isActive?: boolean;

    headerImage: File | string | null;
    screenshots: string[];
    videos: ProductVideos[];

    genres?: string[];
    tags?: string[];
    features?: string[];

    systemRequirements: ProductOS;

    createdAt?: Date;
    updatedAt?: Date;
};



// GraphQL
interface PaginationInfo {
    page: number;
    limit: number;
}

interface PaginatedProducts {
    products: Product[];
    totalProducts: number;
    previous: PaginationInfo | null;
    next: PaginationInfo | null;
}

export interface ProductResponse {
    data: {
        paginatedProducts: PaginatedProducts;
        products: Product[];
        product: Product;
    };
}