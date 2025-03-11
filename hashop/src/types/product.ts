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

// Tạo type cho product
export type Product = {
    _id?: number;

    name: string;
    type: string;
    dlc?: string[];

    short_description: string;
    detailed_description?: string;
    about_the_game?: string;
    supported_languages?: string;
    reviews?: string;

    header_image: string;
    capsule_image?: string;
    background?: string;
    background_raw?: string;

    developers?: string[];
    publishers?: string[];

    price_overview: {
        currency: string
        initial: number
        final: number
        discount_percent: number
    };
    packages?: number[];
    platform?: {
        windows: boolean,
        mac: boolean,
        linux: boolean
    }

    categories?: {
        id: number,
        description: string
    }[];
    genres: {
        id: number,
        description: string
    }[];
    tags: ProductTags[];


    release_date: {
        coming_soon: boolean,
        date: Dayjs
    };

    screenshots: ProductScreenshot[];
    movies: ProductMovie[];

    achievements?: Achievement;

    pc_requirements?: Requirement;
    mac_requirements?: Requirement;
    linux_requirements?: Requirement;

    created_at?: Dayjs;
    updated_at?: Dayjs;
};

type ProductTags = {
    productId: number;
    id: number;
    name: string;
}

type ProductScreenshot = {
    productId: number;
    id: number;
    path_thumbnail: string;
    path_full: string;
}

export type ProductMovie = {
    productId: number;
    id: number;
    name: string;
    thumbnail: string;
    webm: {
        480: string,
        max: string,
    };
    mp4: {
        480: string,
        max: string,
    }
    highlight: boolean;
}

type Achievement = {
    productId: number;
    total: number;
    highlighted: {
        name: string,
        path: string,
    }[];
}

type Requirement = {
    productId: number;
    type: string;
    minimum: string;
    recommended: string;
}

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