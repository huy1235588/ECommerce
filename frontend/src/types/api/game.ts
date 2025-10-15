
//===============================================================
//
//  Model
//
//===============================================================
export interface Game {
    id: string;
    appId: number;
    type: 'game' | 'dlc' | 'demo' | 'advertising' | 'mod' | 'video';
    name: string;
    requiredAge?: number;
    isFree: boolean;
    detailedDescription: string;
    aboutTheGame: string;
    shortDescription: string;
    headerImage?: string;
    capsuleImage?: string;
    capsuleImagev5?: string;
    background?: string;
    backgroundRaw?: string;
    website?: string;
    screenshots?: Screenshot[];
    movies?: Movie[];
    platforms: Platforms;
    releaseDate: ReleaseDate;
    createdAt?: string;
    updatedAt?: string;
}

export interface Platforms {
    windows: boolean;
    mac: boolean;
    linux: boolean;
}

export interface ReleaseDate {
    comingSoon: boolean;
    date: string;
}

export interface Screenshot {
    id: number;
    pathThumbnail: string;
    pathFull: string;
}

export interface Movie {
    id: number;
    name: string;
    thumbnail: string;
    webm: {
        '480': string;
        max: string;
    };
    mp4?: {
        '480': string;
        max: string;
    };
}

export interface Genre {
    id: string;
    description: string;
    count: number;
}

export interface Category {
    id: number;
    description: string;
    count: number;
}

//===============================================================
//
//  Request 
//
//===============================================================

export interface GameFilters {
    genre?: string;
    platform?: 'windows' | 'mac' | 'linux';
    isFree?: boolean;
    maxPrice?: number;
    minPrice?: number;
    category?: string;
    search?: string;
}


export interface GameQueryParams extends GameFilters {
    page?: number;
    size?: number;
    sort?: string;
}

export interface BulkCreateGamesRequest {
    games: Game[];
}

//===============================================================
//
//  Response
//
//===============================================================

export interface BulkCreateGamesResponse {
    success: boolean;
    message: string;
    data: {
        created: number;
        failed: number;
        errors?: string[];
    };
    timestamp: string;
}

export interface GameScreenshotsResponse {
    screenshots: Screenshot[];
    total: number;
}

export interface GenresResponse {
    genres: Genre[];
}

export interface CategoriesResponse {
    categories: Category[];
}