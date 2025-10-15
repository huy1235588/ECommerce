import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/index';
import {
    useGetGamesQuery,
    useGetGameByIdQuery,
    useCreateGameMutation,
    useCreateGamesBulkMutation,
    useUpdateGameMutation,
    useDeleteGameMutation,
    useGetGameScreenshotsQuery,
    useGetGenresQuery,
    useGetCategoriesQuery,
} from '@/store/api/game-api';
import {
    selectGameFilters,
    selectSelectedGame,
    selectFavoriteGameIds,
    selectRecentlyViewedGameIds,
    selectGameIsLoading,
    selectGameError,
    setFilters,
    clearFilters,
    setSelectedGame,
    toggleFavoriteGame,
    addToFavorites,
    removeFromFavorites,
    clearFavorites,
    clearRecentlyViewed,
    setLoading,
    setError,
    clearError,
} from '@/store/slices/game-slice';
import { Game, GameQueryParams, GameFilters } from '@/types';

export const useGame = () => {
    const dispatch = useAppDispatch();

    // Selectors
    const filters = useAppSelector(selectGameFilters);
    const selectedGame = useAppSelector(selectSelectedGame);
    const favoriteGameIds = useAppSelector(selectFavoriteGameIds);
    const recentlyViewedGameIds = useAppSelector(selectRecentlyViewedGameIds);
    const isLoading = useAppSelector(selectGameIsLoading);
    const error = useAppSelector(selectGameError);

    // API hooks
    const getGamesQuery = useGetGamesQuery;
    const getGameByIdQuery = useGetGameByIdQuery;
    const [createGameMutation] = useCreateGameMutation();
    const [createGamesBulkMutation] = useCreateGamesBulkMutation();
    const [updateGameMutation] = useUpdateGameMutation();
    const [deleteGameMutation] = useDeleteGameMutation();
    const getGameScreenshotsQuery = useGetGameScreenshotsQuery;
    const getGenresQuery = useGetGenresQuery;
    const getCategoriesQuery = useGetCategoriesQuery;

    // Actions
    const updateFilters = useCallback((newFilters: Partial<GameFilters>) => {
        dispatch(setFilters(newFilters));
    }, [dispatch]);

    const clearAllFilters = useCallback(() => {
        dispatch(clearFilters());
    }, [dispatch]);

    const selectGame = useCallback((game: Game | null) => {
        dispatch(setSelectedGame(game));
    }, [dispatch]);

    const toggleFavorite = useCallback((gameId: number) => {
        dispatch(toggleFavoriteGame(gameId));
    }, [dispatch]);

    const addFavorite = useCallback((gameId: number) => {
        dispatch(addToFavorites(gameId));
    }, [dispatch]);

    const removeFavorite = useCallback((gameId: number) => {
        dispatch(removeFromFavorites(gameId));
    }, [dispatch]);

    const clearAllFavorites = useCallback(() => {
        dispatch(clearFavorites());
    }, [dispatch]);

    const clearAllRecentlyViewed = useCallback(() => {
        dispatch(clearRecentlyViewed());
    }, [dispatch]);

    const setGameLoading = useCallback((loading: boolean) => {
        dispatch(setLoading(loading));
    }, [dispatch]);

    const setGameError = useCallback((errorMessage: string | null) => {
        dispatch(setError(errorMessage));
    }, [dispatch]);

    const clearGameError = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    // Helper functions
    const isGameFavorite = useCallback((gameId: number) => {
        return favoriteGameIds.includes(gameId);
    }, [favoriteGameIds]);

    const isGameRecentlyViewed = useCallback((gameId: number) => {
        return recentlyViewedGameIds.includes(gameId);
    }, [recentlyViewedGameIds]);

    return {
        // State
        filters,
        selectedGame,
        favoriteGameIds,
        recentlyViewedGameIds,
        isLoading,
        error,

        // API hooks
        getGamesQuery,
        getGameByIdQuery,
        createGameMutation,
        createGamesBulkMutation,
        updateGameMutation,
        deleteGameMutation,
        getGameScreenshotsQuery,
        getGenresQuery,
        getCategoriesQuery,

        // Actions
        updateFilters,
        clearAllFilters,
        selectGame,
        toggleFavorite,
        addFavorite,
        removeFavorite,
        clearAllFavorites,
        clearAllRecentlyViewed,
        setGameLoading,
        setGameError,
        clearGameError,

        // Helpers
        isGameFavorite,
        isGameRecentlyViewed,
    };
};

// Hook for getting games list with current filters
export const useGamesList = (additionalParams?: Partial<GameQueryParams>) => {
    const { filters } = useGame();
    const queryParams: GameQueryParams = {
        ...filters,
        ...additionalParams,
    };

    return useGetGamesQuery(queryParams);
};

// Hook for getting game details
export const useGameDetails = (id: string | undefined) => {
    return useGetGameByIdQuery(id!, {
        skip: !id,
    });
};

// Hook for game screenshots
export const useGameScreenshots = (appId: number | undefined, limit = 50, offset = 0) => {
    return useGetGameScreenshotsQuery(
        { appId: appId!, limit, offset },
        { skip: !appId }
    );
};

// Hook for genres
export const useGenres = () => {
    return useGetGenresQuery();
};

// Hook for categories
export const useCategories = () => {
    return useGetCategoriesQuery();
};