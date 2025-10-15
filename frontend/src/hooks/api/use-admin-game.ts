import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/index';
import {
    useGetGamesQuery, useCreateGameMutation,
    useUpdateGameMutation,
    useDeleteGameMutation,
    useCreateGamesBulkMutation
} from '@/store/api/game-api';
import {
    selectAdminGames,
    selectAdminGamesPagination,
    selectAdminGamesFilters,
    selectAdminGamesSort,
    selectAdminGamesSelectedIds,
    selectAdminGamesModals,
    selectAdminGamesCurrentGame,
    selectAdminGamesIsLoading,
    selectAdminGamesError,
    selectAdminGamesViewMode,
    selectAdminGamesTotalGames,
    selectIsAllGamesSelected,
    selectHasSelectedGames,
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
    closeBulkUploadModal, setLoading,
    setError,
    clearError,
    setViewMode,
    resetAdminGameState
} from '@/store/slices/admin-game-slice';
import { Game, GameQueryParams } from '@/types';
import { toast } from 'sonner';

/**
 * Custom hook for admin game management
 * Tích hợp Redux state và RTK Query mutations
 */
export const useAdminGame = () => {
    const dispatch = useAppDispatch();

    // Selectors
    const games = useAppSelector(selectAdminGames);
    const pagination = useAppSelector(selectAdminGamesPagination);
    const filters = useAppSelector(selectAdminGamesFilters);
    const sort = useAppSelector(selectAdminGamesSort);
    const selectedGameIds = useAppSelector(selectAdminGamesSelectedIds);
    const modals = useAppSelector(selectAdminGamesModals);
    const currentGame = useAppSelector(selectAdminGamesCurrentGame);
    const isLoading = useAppSelector(selectAdminGamesIsLoading);
    const error = useAppSelector(selectAdminGamesError);
    const viewMode = useAppSelector(selectAdminGamesViewMode);
    const totalGames = useAppSelector(selectAdminGamesTotalGames);
    const isAllSelected = useAppSelector(selectIsAllGamesSelected);
    const hasSelectedGames = useAppSelector(selectHasSelectedGames);

    // Build query params from current state
    const queryParams: GameQueryParams = {
        page: pagination.page,
        size: pagination.size,
        sort: `${sort.field}:${sort.order}`,
        ...(filters.search && { search: filters.search }),
        ...(filters.genre && { genre: filters.genre }),
        ...(filters.platform && { platform: filters.platform as any }),
        ...(filters.isFree !== null && { isFree: filters.isFree }),
        ...(filters.type && { type: filters.type }),
    };

    // RTK Query hooks
    const { data: gamesData, isLoading: isGamesLoading, error: gamesError, refetch } = useGetGamesQuery(queryParams);
    const [createGame, { isLoading: isCreating }] = useCreateGameMutation();
    const [updateGame, { isLoading: isUpdating }] = useUpdateGameMutation();
    const [deleteGame, { isLoading: isDeleting }] = useDeleteGameMutation();
    const [createGamesBulk, { isLoading: isBulkUploading }] = useCreateGamesBulkMutation();

    // Sync data from API to Redux store
    useEffect(() => {
        if (gamesData) {
            dispatch(setGames({
                games: gamesData.data,
                total: gamesData.pagination.totalElements,
                totalPages: gamesData.pagination.totalPages,
            }));
        }
    }, [gamesData, dispatch]);

    // Sync loading state
    useEffect(() => {
        dispatch(setLoading(isGamesLoading));
    }, [isGamesLoading, dispatch]);

    // Sync error state
    useEffect(() => {
        if (gamesError) {
            const errorMessage = 'message' in gamesError
                ? gamesError.message
                : 'Failed to load games';
            dispatch(setError(errorMessage || 'Failed to load games'));
        }
    }, [gamesError, dispatch]);

    // Actions - Pagination
    const handleSetPage = useCallback((page: number) => {
        dispatch(setPage(page));
    }, [dispatch]);

    const handleSetPageSize = useCallback((size: number) => {
        dispatch(setPageSize(size));
    }, [dispatch]);

    const handleNextPage = useCallback(() => {
        if (pagination.page < pagination.totalPages) {
            dispatch(setPage(pagination.page + 1));
        }
    }, [dispatch, pagination]);

    const handlePrevPage = useCallback(() => {
        if (pagination.page > 1) {
            dispatch(setPage(pagination.page - 1));
        }
    }, [dispatch, pagination]);

    // Actions - Filters
    const handleSetFilters = useCallback((newFilters: Partial<typeof filters>) => {
        dispatch(setFilters(newFilters));
    }, [dispatch]);

    const handleClearFilters = useCallback(() => {
        dispatch(clearFilters());
    }, [dispatch]);

    // Actions - Sorting
    const handleSetSort = useCallback((field: string, order: 'asc' | 'desc') => {
        dispatch(setSort({ field, order }));
    }, [dispatch]);

    const handleToggleSortOrder = useCallback(() => {
        dispatch(toggleSortOrder());
    }, [dispatch]);

    // Actions - Selection
    const handleToggleSelectGame = useCallback((gameId: number) => {
        dispatch(toggleSelectGame(gameId));
    }, [dispatch]);

    const handleSelectAllGames = useCallback(() => {
        dispatch(selectAllGames());
    }, [dispatch]);

    const handleDeselectAllGames = useCallback(() => {
        dispatch(deselectAllGames());
    }, [dispatch]);

    // Actions - Modals
    const handleOpenCreateModal = useCallback(() => {
        dispatch(openCreateModal());
    }, [dispatch]);

    const handleCloseCreateModal = useCallback(() => {
        dispatch(closeCreateModal());
    }, [dispatch]);

    const handleOpenEditModal = useCallback((game: Game) => {
        dispatch(openEditModal(game));
    }, [dispatch]);

    const handleCloseEditModal = useCallback(() => {
        dispatch(closeEditModal());
    }, [dispatch]);

    const handleOpenDeleteModal = useCallback((game: Game) => {
        dispatch(openDeleteModal(game));
    }, [dispatch]);

    const handleCloseDeleteModal = useCallback(() => {
        dispatch(closeDeleteModal());
    }, [dispatch]);

    const handleOpenDetailModal = useCallback((game: Game) => {
        dispatch(openDetailModal(game));
    }, [dispatch]);

    const handleCloseDetailModal = useCallback(() => {
        dispatch(closeDetailModal());
    }, [dispatch]);

    const handleOpenBulkUploadModal = useCallback(() => {
        dispatch(openBulkUploadModal());
    }, [dispatch]);

    const handleCloseBulkUploadModal = useCallback(() => {
        dispatch(closeBulkUploadModal());
    }, [dispatch]);

    // Actions - CRUD operations
    const handleCreateGame = useCallback(async (gameData: Omit<Game, 'createdAt' | 'updatedAt'>) => {
        try {
            await createGame(gameData).unwrap();
            toast.success('Game created successfully!');
            dispatch(closeCreateModal());
            refetch();
        } catch (error: any) {
            const errorMessage = error?.data?.message || 'Failed to create game';
            toast.error(errorMessage);
            dispatch(setError(errorMessage));
        }
    }, [createGame, dispatch, refetch]);

    const handleUpdateGame = useCallback(async (appId: number, gameData: Partial<Game>) => {
        try {
            await updateGame({ appId, gameData }).unwrap();
            toast.success('Game updated successfully!');
            dispatch(closeEditModal());
            refetch();
        } catch (error: any) {
            const errorMessage = error?.data?.message || 'Failed to update game';
            toast.error(errorMessage);
            dispatch(setError(errorMessage));
        }
    }, [updateGame, dispatch, refetch]);

    const handleDeleteGame = useCallback(async (appId: number) => {
        try {
            await deleteGame(appId).unwrap();
            toast.success('Game deleted successfully!');
            dispatch(closeDeleteModal());
            dispatch(deselectAllGames());
            refetch();
        } catch (error: any) {
            const errorMessage = error?.data?.message || 'Failed to delete game';
            toast.error(errorMessage);
            dispatch(setError(errorMessage));
        }
    }, [deleteGame, dispatch, refetch]);

    const handleBulkUpload = useCallback(async (games: Game[]) => {
        try {
            const result = await createGamesBulk({ games }).unwrap();
            toast.success(`Successfully created ${result.data.created} games!`);
            if (result.data.failed > 0) {
                toast.warning(`Failed to create ${result.data.failed} games`);
            }
            dispatch(closeBulkUploadModal());
            refetch();
        } catch (error: any) {
            const errorMessage = error?.data?.message || 'Failed to bulk upload games';
            toast.error(errorMessage);
            dispatch(setError(errorMessage));
        }
    }, [createGamesBulk, dispatch, refetch]);

    const handleDeleteSelected = useCallback(async () => {
        try {
            dispatch(setLoading(true));

            // Delete all selected games
            await Promise.all(
                selectedGameIds.map(appId => deleteGame(appId).unwrap())
            );

            toast.success(`Successfully deleted ${selectedGameIds.length} games!`);
            dispatch(deselectAllGames());
            refetch();
        } catch (error: any) {
            const errorMessage = error?.data?.message || 'Failed to delete selected games';
            toast.error(errorMessage);
            dispatch(setError(errorMessage));
        } finally {
            dispatch(setLoading(false));
        }
    }, [selectedGameIds, deleteGame, dispatch, refetch]);

    // Actions - View mode
    const handleSetViewMode = useCallback((mode: 'grid' | 'list') => {
        dispatch(setViewMode(mode));
    }, [dispatch]);

    // Actions - Error handling
    const handleClearError = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    // Actions - Reset
    const handleResetState = useCallback(() => {
        dispatch(resetAdminGameState());
    }, [dispatch]);

    // Actions - Refresh
    const handleRefresh = useCallback(() => {
        refetch();
    }, [refetch]);

    return {
        // State
        games,
        pagination,
        filters,
        sort,
        selectedGameIds,
        modals,
        currentGame,
        isLoading: isLoading || isCreating || isUpdating || isDeleting || isBulkUploading,
        error,
        viewMode,
        totalGames,
        isAllSelected,
        hasSelectedGames,

        // Query state
        isGamesLoading,
        isCreating,
        isUpdating,
        isDeleting,
        isBulkUploading,

        // Actions - Pagination
        setPage: handleSetPage,
        setPageSize: handleSetPageSize,
        nextPage: handleNextPage,
        prevPage: handlePrevPage,

        // Actions - Filters
        setFilters: handleSetFilters,
        clearFilters: handleClearFilters,

        // Actions - Sorting
        setSort: handleSetSort,
        toggleSortOrder: handleToggleSortOrder,

        // Actions - Selection
        toggleSelectGame: handleToggleSelectGame,
        selectAllGames: handleSelectAllGames,
        deselectAllGames: handleDeselectAllGames,

        // Actions - Modals
        openCreateModal: handleOpenCreateModal,
        closeCreateModal: handleCloseCreateModal,
        openEditModal: handleOpenEditModal,
        closeEditModal: handleCloseEditModal,
        openDeleteModal: handleOpenDeleteModal,
        closeDeleteModal: handleCloseDeleteModal,
        openDetailModal: handleOpenDetailModal,
        closeDetailModal: handleCloseDetailModal,
        openBulkUploadModal: handleOpenBulkUploadModal,
        closeBulkUploadModal: handleCloseBulkUploadModal,

        // Actions - CRUD
        createGame: handleCreateGame,
        updateGame: handleUpdateGame,
        deleteGame: handleDeleteGame,
        bulkUpload: handleBulkUpload,
        deleteSelected: handleDeleteSelected,

        // Actions - View
        setViewMode: handleSetViewMode,

        // Actions - Utils
        clearError: handleClearError,
        resetState: handleResetState,
        refresh: handleRefresh,
    };
};
