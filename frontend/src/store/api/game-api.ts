import { baseApi } from './base-api';
import {
    Game, GameQueryParams,
    BulkCreateGamesRequest,
    BulkCreateGamesResponse,
    GameScreenshotsResponse,
    GenresResponse,
    CategoriesResponse,
    ApiResponse,
    ApiListResponse
} from '@/types';

export const gameApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Get list of games with filters and pagination
        getGames: builder.query<ApiListResponse<Game>, GameQueryParams>({
            query: (params) => ({
                url: '/games',
                method: 'GET',
                params,
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.data.map(({ appId }) => ({ type: 'Game' as const, id: appId })),
                        { type: 'Game', id: 'LIST' },
                    ]
                    : [{ type: 'Game', id: 'LIST' }],
        }),

        // Get game by ID
        getGameById: builder.query<ApiResponse<Game>, string>({
            query: (id) => ({
                url: `/games/${id}`,
                method: 'GET',
            }),
            providesTags: (result, error, id) => [{ type: 'Game', id: id }],
        }),

        // Create a new game (admin only)
        createGame: builder.mutation<ApiResponse<Game>, Omit<Game, 'createdAt' | 'updatedAt'>>({
            query: (gameData) => ({
                url: '/games',
                method: 'POST',
                body: gameData,
            }),
            invalidatesTags: [{ type: 'Game', id: 'LIST' }],
        }),

        // Create multiple games (admin only)
        createGamesBulk: builder.mutation<BulkCreateGamesResponse, BulkCreateGamesRequest>({
            query: (bulkData) => ({
                url: '/games/bulk',
                method: 'POST',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'Game', id: 'LIST' }],
        }),

        // Update game (admin only)
        updateGame: builder.mutation<ApiResponse<Game>, { appId: number; gameData: Partial<Game> }>({
            query: ({ appId, gameData }) => ({
                url: `/games/${appId}`,
                method: 'PUT',
                body: gameData,
            }),
            invalidatesTags: (result, error, { appId }) => [
                { type: 'Game', id: appId },
                { type: 'Game', id: 'LIST' },
            ],
        }),

        // Delete game (admin only)
        deleteGame: builder.mutation<void, number>({
            query: (appId) => ({
                url: `/games/${appId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, appId) => [
                { type: 'Game', id: appId },
                { type: 'Game', id: 'LIST' },
            ],
        }),

        // Get game screenshots
        getGameScreenshots: builder.query<GameScreenshotsResponse, { appId: number; limit?: number; offset?: number }>({
            query: ({ appId, limit = 50, offset = 0 }) => ({
                url: `/games/${appId}/screenshots`,
                method: 'GET',
                params: { limit, offset },
            }),
        }),

        // Get all genres
        getGenres: builder.query<GenresResponse, void>({
            query: () => ({
                url: '/genres',
                method: 'GET',
            }),
            providesTags: [{ type: 'Genre', id: 'LIST' }],
        }),

        // Get all categories
        getCategories: builder.query<CategoriesResponse, void>({
            query: () => ({
                url: '/categories',
                method: 'GET',
            }),
            providesTags: [{ type: 'Category', id: 'LIST' }],
        }),
    }),
});

export const {
    useGetGamesQuery,
    useGetGameByIdQuery,
    useCreateGameMutation,
    useCreateGamesBulkMutation,
    useUpdateGameMutation,
    useDeleteGameMutation,
    useGetGameScreenshotsQuery,
    useGetGenresQuery,
    useGetCategoriesQuery,
} = gameApi;