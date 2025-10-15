import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Game, GameFilters } from '@/types';

interface GameState {
    // Current filters
    filters: GameFilters;
    // Selected game for detailed view
    selectedGame: Game | null;
    // Favorite games
    favoriteGameIds: number[];
    // Recently viewed games
    recentlyViewedGameIds: number[];
    // Loading states
    isLoading: boolean;
    error: string | null;
}

const initialState: GameState = {
    filters: {},
    selectedGame: null,
    favoriteGameIds: [],
    recentlyViewedGameIds: [],
    isLoading: false,
    error: null,
};

const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        // Set filters
        setFilters: (state, action: PayloadAction<GameFilters>) => {
            state.filters = { ...state.filters, ...action.payload };
        },

        // Clear filters
        clearFilters: (state) => {
            state.filters = {};
        },

        // Set selected game
        setSelectedGame: (state, action: PayloadAction<Game | null>) => {
            state.selectedGame = action.payload;
            if (action.payload) {
                // Add to recently viewed (avoid duplicates)
                const gameId = action.payload.appId;
                state.recentlyViewedGameIds = [
                    gameId,
                    ...state.recentlyViewedGameIds.filter(id => id !== gameId)
                ].slice(0, 10); // Keep only last 10
            }
        },

        // Toggle favorite game
        toggleFavoriteGame: (state, action: PayloadAction<number>) => {
            const gameId = action.payload;
            const index = state.favoriteGameIds.indexOf(gameId);
            if (index > -1) {
                state.favoriteGameIds.splice(index, 1);
            } else {
                state.favoriteGameIds.push(gameId);
            }
        },

        // Add to favorites
        addToFavorites: (state, action: PayloadAction<number>) => {
            const gameId = action.payload;
            if (!state.favoriteGameIds.includes(gameId)) {
                state.favoriteGameIds.push(gameId);
            }
        },

        // Remove from favorites
        removeFromFavorites: (state, action: PayloadAction<number>) => {
            state.favoriteGameIds = state.favoriteGameIds.filter(id => id !== action.payload);
        },

        // Clear favorites
        clearFavorites: (state) => {
            state.favoriteGameIds = [];
        },

        // Clear recently viewed
        clearRecentlyViewed: (state) => {
            state.recentlyViewedGameIds = [];
        },

        // Set loading state
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },

        // Set error
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
            state.isLoading = false;
        },

        // Clear error
        clearError: (state) => {
            state.error = null;
        },
    },
});

export const {
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
} = gameSlice.actions;

// Selectors
export const selectGameState = (state: { game: GameState }) => state.game;
export const selectGameFilters = (state: { game: GameState }) => state.game.filters;
export const selectSelectedGame = (state: { game: GameState }) => state.game.selectedGame;
export const selectFavoriteGameIds = (state: { game: GameState }) => state.game.favoriteGameIds;
export const selectRecentlyViewedGameIds = (state: { game: GameState }) => state.game.recentlyViewedGameIds;
export const selectGameIsLoading = (state: { game: GameState }) => state.game.isLoading;
export const selectGameError = (state: { game: GameState }) => state.game.error;

export default gameSlice.reducer;