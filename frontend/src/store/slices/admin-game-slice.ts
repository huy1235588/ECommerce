import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Game } from '@/types';

/**
 * Admin Game Management State
 * Quản lý trạng thái cho trang admin quản lý game
 * Riêng biệt với game-slice dùng cho user
 */

interface AdminGameState {
    // Danh sách game hiện tại trên trang
    games: Game[];
    totalGames: number;

    // Pagination
    pagination: {
        page: number;
        size: number;
        totalPages: number;
    };

    // Filters
    filters: {
        search: string;
        genre: string;
        platform: string;
        isFree: boolean | null;
        type: string;
    };

    // Sorting
    sort: {
        field: string;
        order: 'asc' | 'desc';
    };

    // Selection (cho bulk actions)
    selectedGameIds: number[];

    // Modal states
    modals: {
        isCreateModalOpen: boolean;
        isEditModalOpen: boolean;
        isDeleteModalOpen: boolean;
        isDetailModalOpen: boolean;
        isBulkUploadModalOpen: boolean;
    };

    // Currently editing/viewing game
    currentGame: Game | null;

    // UI States
    isLoading: boolean;
    error: string | null;

    // View mode (grid/list)
    viewMode: 'grid' | 'list';
}

const initialState: AdminGameState = {
    games: [],
    totalGames: 0,

    pagination: {
        page: 1,
        size: 20,
        totalPages: 0,
    },

    filters: {
        search: '',
        genre: '',
        platform: '',
        isFree: null,
        type: '',
    },

    sort: {
        field: 'name',
        order: 'asc',
    },

    selectedGameIds: [],

    modals: {
        isCreateModalOpen: false,
        isEditModalOpen: false,
        isDeleteModalOpen: false,
        isDetailModalOpen: false,
        isBulkUploadModalOpen: false,
    },

    currentGame: null,
    isLoading: false,
    error: null,
    viewMode: 'grid',
};

const adminGameSlice = createSlice({
    name: 'adminGame',
    initialState,
    reducers: {
        // Set games list
        setGames: (state, action: PayloadAction<{ games: Game[]; total: number; totalPages: number }>) => {
            state.games = action.payload.games;
            state.totalGames = action.payload.total;
            state.pagination.totalPages = action.payload.totalPages;
            state.isLoading = false;
        },

        // Pagination
        setPage: (state, action: PayloadAction<number>) => {
            state.pagination.page = action.payload;
        },

        setPageSize: (state, action: PayloadAction<number>) => {
            state.pagination.size = action.payload;
            state.pagination.page = 1; // Reset to first page
        },

        // Filters
        setFilters: (state, action: PayloadAction<Partial<AdminGameState['filters']>>) => {
            state.filters = { ...state.filters, ...action.payload };
            state.pagination.page = 1; // Reset to first page when filtering
        },

        clearFilters: (state) => {
            state.filters = initialState.filters;
            state.pagination.page = 1;
        },

        // Sorting
        setSort: (state, action: PayloadAction<{ field: string; order: 'asc' | 'desc' }>) => {
            state.sort = action.payload;
        },

        toggleSortOrder: (state) => {
            state.sort.order = state.sort.order === 'asc' ? 'desc' : 'asc';
        },

        // Selection
        toggleSelectGame: (state, action: PayloadAction<number>) => {
            const gameId = action.payload;
            const index = state.selectedGameIds.indexOf(gameId);

            if (index > -1) {
                state.selectedGameIds.splice(index, 1);
            } else {
                state.selectedGameIds.push(gameId);
            }
        },

        selectAllGames: (state) => {
            state.selectedGameIds = state.games.map(game => game.appId);
        },

        deselectAllGames: (state) => {
            state.selectedGameIds = [];
        },

        // Modal management
        openCreateModal: (state) => {
            state.modals.isCreateModalOpen = true;
            state.currentGame = null;
        },

        closeCreateModal: (state) => {
            state.modals.isCreateModalOpen = false;
            state.currentGame = null;
        },

        openEditModal: (state, action: PayloadAction<Game>) => {
            state.modals.isEditModalOpen = true;
            state.currentGame = action.payload;
        },

        closeEditModal: (state) => {
            state.modals.isEditModalOpen = false;
            state.currentGame = null;
        },

        openDeleteModal: (state, action: PayloadAction<Game>) => {
            state.modals.isDeleteModalOpen = true;
            state.currentGame = action.payload;
        },

        closeDeleteModal: (state) => {
            state.modals.isDeleteModalOpen = false;
            state.currentGame = null;
        },

        openDetailModal: (state, action: PayloadAction<Game>) => {
            state.modals.isDetailModalOpen = true;
            state.currentGame = action.payload;
        },

        closeDetailModal: (state) => {
            state.modals.isDetailModalOpen = false;
            state.currentGame = null;
        },

        openBulkUploadModal: (state) => {
            state.modals.isBulkUploadModalOpen = true;
        },

        closeBulkUploadModal: (state) => {
            state.modals.isBulkUploadModalOpen = false;
        },

        // Current game
        setCurrentGame: (state, action: PayloadAction<Game | null>) => {
            state.currentGame = action.payload;
        },

        // Loading and error states
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },

        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
            state.isLoading = false;
        },

        clearError: (state) => {
            state.error = null;
        },

        // View mode
        setViewMode: (state, action: PayloadAction<'grid' | 'list'>) => {
            state.viewMode = action.payload;
        },

        // Reset all state
        resetAdminGameState: () => initialState,
    },
});

// Actions
export const {
    setGames,
    setPage,
    setPageSize,
    setFilters,
    clearFilters,
    setSort,
    toggleSortOrder,
    toggleSelectGame,
    selectAllGames,
    deselectAllGames,
    openCreateModal,
    closeCreateModal,
    openEditModal,
    closeEditModal,
    openDeleteModal,
    closeDeleteModal,
    openDetailModal,
    closeDetailModal,
    openBulkUploadModal,
    closeBulkUploadModal,
    setCurrentGame,
    setLoading,
    setError,
    clearError,
    setViewMode,
    resetAdminGameState,
} = adminGameSlice.actions;

// Selectors
export const selectAdminGameState = (state: { adminGame: AdminGameState }) => state.adminGame;
export const selectAdminGames = (state: { adminGame: AdminGameState }) => state.adminGame.games;
export const selectAdminGamesPagination = (state: { adminGame: AdminGameState }) => state.adminGame.pagination;
export const selectAdminGamesFilters = (state: { adminGame: AdminGameState }) => state.adminGame.filters;
export const selectAdminGamesSort = (state: { adminGame: AdminGameState }) => state.adminGame.sort;
export const selectAdminGamesSelectedIds = (state: { adminGame: AdminGameState }) => state.adminGame.selectedGameIds;
export const selectAdminGamesModals = (state: { adminGame: AdminGameState }) => state.adminGame.modals;
export const selectAdminGamesCurrentGame = (state: { adminGame: AdminGameState }) => state.adminGame.currentGame;
export const selectAdminGamesIsLoading = (state: { adminGame: AdminGameState }) => state.adminGame.isLoading;
export const selectAdminGamesError = (state: { adminGame: AdminGameState }) => state.adminGame.error;
export const selectAdminGamesViewMode = (state: { adminGame: AdminGameState }) => state.adminGame.viewMode;
export const selectAdminGamesTotalGames = (state: { adminGame: AdminGameState }) => state.adminGame.totalGames;

// Computed selectors
export const selectIsAllGamesSelected = (state: { adminGame: AdminGameState }) => {
    const { games, selectedGameIds } = state.adminGame;
    return games.length > 0 && games.length === selectedGameIds.length;
};

export const selectHasSelectedGames = (state: { adminGame: AdminGameState }) => {
    return state.adminGame.selectedGameIds.length > 0;
};

export default adminGameSlice.reducer;
