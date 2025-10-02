# {{title}}

> **Ngày tạo**: {{date:YYYY-MM-DD}}  
> **Tác giả**: {{author}}  
> **Loại**: Redux Store  
> **Slice Name**: {{sliceName}}  
> **Trạng thái**: [[Draft]] / [[In Progress]] / [[Review]] / [[Done]]

## 📝 Mô Tả

### Mục đích
Mô tả về slice này quản lý state gì và tại sao cần thiết.

### Phạm vi quản lý
- Entity nào được quản lý
- Lifecycle của data
- Relationship với các slice khác

## 🗂️ State Structure

### Initial State
```typescript
interface {{SliceName}}State {
  // Entities
  entities: EntityState<{{EntityType}}>;
  
  // UI State
  loading: boolean;
  error: string | null;
  
  // Filters & Pagination
  filters: {{FilterType}};
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  
  // Selected items
  selectedIds: string[];
  
  // Modal/Dialog states
  modals: {
    isCreateModalOpen: boolean;
    isEditModalOpen: boolean;
    isDeleteModalOpen: boolean;
    editingItem: {{EntityType}} | null;
  };
  
  // Additional state
  lastUpdated: string | null;
  cache: {
    [key: string]: {
      data: any;
      timestamp: number;
      ttl: number;
    };
  };
}
```

### Entity Adapter
```typescript
import { createEntityAdapter, EntityState } from '@reduxjs/toolkit';

// Entity adapter for normalized state
const {{entityName}}Adapter = createEntityAdapter<{{EntityType}}>({
  selectId: (entity) => entity.id,
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt),
});

// Initial state with entity adapter
const initialState: {{SliceName}}State = {
  ...{{entityName}}Adapter.getInitialState(),
  loading: false,
  error: null,
  filters: {
    search: '',
    category: '',
    status: 'all',
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
  selectedIds: [],
  modals: {
    isCreateModalOpen: false,
    isEditModalOpen: false,
    isDeleteModalOpen: false,
    editingItem: null,
  },
  lastUpdated: null,
  cache: {},
};
```

## 🎯 Actions & Reducers

### Async Thunks
```typescript
import { createAsyncThunk } from '@reduxjs/toolkit';

// Fetch entities
export const fetch{{EntityName}}s = createAsyncThunk(
  '{{sliceName}}/fetch{{EntityName}}s',
  async (params: Fetch{{EntityName}}sParams, { rejectWithValue }) => {
    try {
      const response = await {{apiService}}.get{{EntityName}}s(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create entity
export const create{{EntityName}} = createAsyncThunk(
  '{{sliceName}}/create{{EntityName}}',
  async (data: Create{{EntityName}}Data, { rejectWithValue }) => {
    try {
      const response = await {{apiService}}.create{{EntityName}}(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update entity
export const update{{EntityName}} = createAsyncThunk(
  '{{sliceName}}/update{{EntityName}}',
  async ({ id, data }: { id: string; data: Update{{EntityName}}Data }, { rejectWithValue }) => {
    try {
      const response = await {{apiService}}.update{{EntityName}}(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete entity
export const delete{{EntityName}} = createAsyncThunk(
  '{{sliceName}}/delete{{EntityName}}',
  async (id: string, { rejectWithValue }) => {
    try {
      await {{apiService}}.delete{{EntityName}}(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
```

### Slice Definition
```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const {{sliceName}}Slice = createSlice({
  name: '{{sliceName}}',
  initialState,
  reducers: {
    // Synchronous actions
    setFilters: (state, action: PayloadAction<Partial<{{FilterType}}>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1; // Reset to first page
    },
    
    setPagination: (state, action: PayloadAction<Partial<PaginationState>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    
    setSelectedIds: (state, action: PayloadAction<string[]>) => {
      state.selectedIds = action.payload;
    },
    
    toggleSelection: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const index = state.selectedIds.indexOf(id);
      if (index > -1) {
        state.selectedIds.splice(index, 1);
      } else {
        state.selectedIds.push(id);
      }
    },
    
    selectAll: (state) => {
      state.selectedIds = state.entities.ids as string[];
    },
    
    deselectAll: (state) => {
      state.selectedIds = [];
    },
    
    // Modal actions
    openCreateModal: (state) => {
      state.modals.isCreateModalOpen = true;
    },
    
    closeCreateModal: (state) => {
      state.modals.isCreateModalOpen = false;
    },
    
    openEditModal: (state, action: PayloadAction<{{EntityType}}>) => {
      state.modals.isEditModalOpen = true;
      state.modals.editingItem = action.payload;
    },
    
    closeEditModal: (state) => {
      state.modals.isEditModalOpen = false;
      state.modals.editingItem = null;
    },
    
    openDeleteModal: (state) => {
      state.modals.isDeleteModalOpen = true;
    },
    
    closeDeleteModal: (state) => {
      state.modals.isDeleteModalOpen = false;
    },
    
    // Cache actions
    setCache: (state, action: PayloadAction<{ key: string; data: any; ttl?: number }>) => {
      const { key, data, ttl = 300000 } = action.payload; // 5 minutes default
      state.cache[key] = {
        data,
        timestamp: Date.now(),
        ttl,
      };
    },
    
    clearCache: (state, action: PayloadAction<string>) => {
      delete state.cache[action.payload];
    },
    
    clearAllCache: (state) => {
      state.cache = {};
    },
    
    // Error handling
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch entities
    builder
      .addCase(fetch{{EntityName}}s.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetch{{EntityName}}s.fulfilled, (state, action) => {
        state.loading = false;
        {{entityName}}Adapter.setAll(state, action.payload.items);
        state.pagination = {
          ...state.pagination,
          total: action.payload.total,
          hasNextPage: action.payload.hasNextPage,
          hasPreviousPage: action.payload.hasPreviousPage,
        };
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetch{{EntityName}}s.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // Create entity
    builder
      .addCase(create{{EntityName}}.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(create{{EntityName}}.fulfilled, (state, action) => {
        state.loading = false;
        {{entityName}}Adapter.addOne(state, action.payload);
        state.modals.isCreateModalOpen = false;
      })
      .addCase(create{{EntityName}}.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // Update entity
    builder
      .addCase(update{{EntityName}}.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(update{{EntityName}}.fulfilled, (state, action) => {
        state.loading = false;
        {{entityName}}Adapter.upsertOne(state, action.payload);
        state.modals.isEditModalOpen = false;
        state.modals.editingItem = null;
      })
      .addCase(update{{EntityName}}.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // Delete entity
    builder
      .addCase(delete{{EntityName}}.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(delete{{EntityName}}.fulfilled, (state, action) => {
        state.loading = false;
        {{entityName}}Adapter.removeOne(state, action.payload);
        state.selectedIds = state.selectedIds.filter(id => id !== action.payload);
        state.modals.isDeleteModalOpen = false;
      })
      .addCase(delete{{EntityName}}.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setFilters,
  setPagination,
  setSelectedIds,
  toggleSelection,
  selectAll,
  deselectAll,
  openCreateModal,
  closeCreateModal,
  openEditModal,
  closeEditModal,
  openDeleteModal,
  closeDeleteModal,
  setCache,
  clearCache,
  clearAllCache,
  clearError,
} = {{sliceName}}Slice.actions;

export default {{sliceName}}Slice.reducer;
```

## 🔍 Selectors

### Basic Selectors
```typescript
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/store';

// Base selector
const select{{SliceName}}State = (state: RootState) => state.{{sliceName}};

// Entity selectors using adapter
export const {
  selectAll: selectAll{{EntityName}}s,
  selectById: select{{EntityName}}ById,
  selectIds: select{{EntityName}}Ids,
  selectEntities: select{{EntityName}}Entities,
  selectTotal: select{{EntityName}}Total,
} = {{entityName}}Adapter.getSelectors(select{{SliceName}}State);

// Loading and error selectors
export const select{{SliceName}}Loading = createSelector(
  select{{SliceName}}State,
  (state) => state.loading
);

export const select{{SliceName}}Error = createSelector(
  select{{SliceName}}State,
  (state) => state.error
);

// Filter and pagination selectors
export const select{{SliceName}}Filters = createSelector(
  select{{SliceName}}State,
  (state) => state.filters
);

export const select{{SliceName}}Pagination = createSelector(
  select{{SliceName}}State,
  (state) => state.pagination
);

// Selection selectors
export const select{{SliceName}}SelectedIds = createSelector(
  select{{SliceName}}State,
  (state) => state.selectedIds
);

export const select{{SliceName}}SelectedItems = createSelector(
  [selectAll{{EntityName}}s, select{{SliceName}}SelectedIds],
  (items, selectedIds) => items.filter(item => selectedIds.includes(item.id))
);

// Modal selectors
export const select{{SliceName}}Modals = createSelector(
  select{{SliceName}}State,
  (state) => state.modals
);

export const select{{SliceName}}EditingItem = createSelector(
  select{{SliceName}}State,
  (state) => state.modals.editingItem
);
```

### Advanced Selectors
```typescript
// Filtered entities
export const selectFiltered{{EntityName}}s = createSelector(
  [selectAll{{EntityName}}s, select{{SliceName}}Filters],
  (items, filters) => {
    return items.filter(item => {
      // Search filter
      if (filters.search && !item.name.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      
      // Category filter
      if (filters.category && filters.category !== 'all' && item.category !== filters.category) {
        return false;
      }
      
      // Status filter
      if (filters.status && filters.status !== 'all' && item.status !== filters.status) {
        return false;
      }
      
      return true;
    });
  }
);

// Paginated entities
export const selectPaginated{{EntityName}}s = createSelector(
  [selectFiltered{{EntityName}}s, select{{SliceName}}Pagination],
  (items, pagination) => {
    const startIndex = (pagination.page - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;
    return items.slice(startIndex, endIndex);
  }
);

// Statistics
export const select{{SliceName}}Stats = createSelector(
  selectAll{{EntityName}}s,
  (items) => ({
    total: items.length,
    byStatus: items.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    byCategory: items.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  })
);

// Cache selectors
export const select{{SliceName}}Cache = createSelector(
  select{{SliceName}}State,
  (state) => state.cache
);

export const select{{SliceName}}CacheItem = (key: string) => createSelector(
  select{{SliceName}}Cache,
  (cache) => {
    const item = cache[key];
    if (!item) return null;
    
    // Check if cache is still valid
    const isValid = Date.now() - item.timestamp < item.ttl;
    return isValid ? item.data : null;
  }
);
```

## 💻 Implementation

### File Structure
```
src/store/slices/{{sliceName}}/
├── index.ts                 # Main export
├── {{sliceName}}Slice.ts    # Slice definition
├── selectors.ts             # Selector functions
├── thunks.ts               # Async thunks
├── types.ts                # Type definitions
└── utils.ts                # Helper utilities
```

### Type Definitions
```typescript
// Entity types
export interface {{EntityType}} {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  updatedAt: string;
  // Additional fields
}

// Filter types
export interface {{FilterType}} {
  search: string;
  category: string;
  status: 'all' | 'active' | 'inactive' | 'pending';
  dateRange?: {
    start: string;
    end: string;
  };
}

// API parameter types
export interface Fetch{{EntityName}}sParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface Create{{EntityName}}Data {
  name: string;
  description: string;
  category: string;
  // Other required fields
}

export interface Update{{EntityName}}Data extends Partial<Create{{EntityName}}Data> {
  // Optional update fields
}

// API response types
export interface {{EntityName}}sResponse {
  items: {{EntityType}}[];
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
```

## 📡 API Integration

### API Service
```typescript
// {{entityName}}Api.ts
import axios from '@/lib/axios';

export const {{entityName}}Api = {
  get{{EntityName}}s: async (params: Fetch{{EntityName}}sParams): Promise<{{EntityName}}sResponse> => {
    const response = await axios.get('/api/{{endpoint}}', { params });
    return response.data;
  },
  
  get{{EntityName}}ById: async (id: string): Promise<{{EntityType}}> => {
    const response = await axios.get(`/api/{{endpoint}}/${id}`);
    return response.data;
  },
  
  create{{EntityName}}: async (data: Create{{EntityName}}Data): Promise<{{EntityType}}> => {
    const response = await axios.post('/api/{{endpoint}}', data);
    return response.data;
  },
  
  update{{EntityName}}: async (id: string, data: Update{{EntityName}}Data): Promise<{{EntityType}}> => {
    const response = await axios.put(`/api/{{endpoint}}/${id}`, data);
    return response.data;
  },
  
  delete{{EntityName}}: async (id: string): Promise<void> => {
    await axios.delete(`/api/{{endpoint}}/${id}`);
  },
};
```

## 🎣 Custom Hooks

### Basic Hooks
```typescript
// use{{SliceName}}.ts
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { 
  fetch{{EntityName}}s,
  create{{EntityName}},
  update{{EntityName}},
  delete{{EntityName}},
  setFilters,
  setPagination,
} from './{{sliceName}}Slice';

export function use{{SliceName}}() {
  const dispatch = useAppDispatch();
  
  // Selectors
  const items = useAppSelector(selectPaginated{{EntityName}}s);
  const loading = useAppSelector(select{{SliceName}}Loading);
  const error = useAppSelector(select{{SliceName}}Error);
  const filters = useAppSelector(select{{SliceName}}Filters);
  const pagination = useAppSelector(select{{SliceName}}Pagination);
  const selectedIds = useAppSelector(select{{SliceName}}SelectedIds);
  const stats = useAppSelector(select{{SliceName}}Stats);
  
  // Actions
  const actions = {
    fetch: (params?: Fetch{{EntityName}}sParams) => dispatch(fetch{{EntityName}}s(params)),
    create: (data: Create{{EntityName}}Data) => dispatch(create{{EntityName}}(data)),
    update: (id: string, data: Update{{EntityName}}Data) => dispatch(update{{EntityName}}({ id, data })),
    delete: (id: string) => dispatch(delete{{EntityName}}(id)),
    setFilters: (filters: Partial<{{FilterType}}>) => dispatch(setFilters(filters)),
    setPagination: (pagination: Partial<PaginationState>) => dispatch(setPagination(pagination)),
  };
  
  return {
    // Data
    items,
    loading,
    error,
    filters,
    pagination,
    selectedIds,
    stats,
    
    // Actions
    ...actions,
  };
}
```

### Specialized Hooks
```typescript
// use{{EntityName}}Selection.ts
export function use{{EntityName}}Selection() {
  const dispatch = useAppDispatch();
  const selectedIds = useAppSelector(select{{SliceName}}SelectedIds);
  const selectedItems = useAppSelector(select{{SliceName}}SelectedItems);
  
  return {
    selectedIds,
    selectedItems,
    isSelected: (id: string) => selectedIds.includes(id),
    toggle: (id: string) => dispatch(toggleSelection(id)),
    selectAll: () => dispatch(selectAll()),
    deselectAll: () => dispatch(deselectAll()),
    hasSelection: selectedIds.length > 0,
    selectionCount: selectedIds.length,
  };
}

// use{{EntityName}}Modals.ts
export function use{{EntityName}}Modals() {
  const dispatch = useAppDispatch();
  const modals = useAppSelector(select{{SliceName}}Modals);
  const editingItem = useAppSelector(select{{SliceName}}EditingItem);
  
  return {
    modals,
    editingItem,
    
    // Create modal
    openCreateModal: () => dispatch(openCreateModal()),
    closeCreateModal: () => dispatch(closeCreateModal()),
    
    // Edit modal
    openEditModal: (item: {{EntityType}}) => dispatch(openEditModal(item)),
    closeEditModal: () => dispatch(closeEditModal()),
    
    // Delete modal
    openDeleteModal: () => dispatch(openDeleteModal()),
    closeDeleteModal: () => dispatch(closeDeleteModal()),
  };
}
```
## 📊 Performance Optimization

### Memoization
```typescript
// Memoized selectors for expensive computations
export const selectExpensive{{EntityName}}Data = createSelector(
  [selectAll{{EntityName}}s],
  (items) => {
    // Expensive computation
    return items.map(item => ({
      ...item,
      computedValue: expensiveCalculation(item),
    }));
  }
);

// Selector with input validation
export const select{{EntityName}}sByCategory = createSelector(
  [selectAll{{EntityName}}s, (state: RootState, category: string) => category],
  (items, category) => {
    if (!category) return [];
    return items.filter(item => item.category === category);
  }
);
```

### Normalized State Benefits
- O(1) lookups by ID
- Efficient updates
- Avoiding nested state mutations
- Better memory usage
## 📖 Related Documentation

### Internal Links
- [[Store/{{RelatedSlice1}}]]
- [[Store/{{RelatedSlice2}}]]
- [[Component/{{RelatedComponent}}]]
- [[API/{{RelatedAPI}}]]

### External Resources
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [Entity Adapter Guide](https://redux-toolkit.js.org/api/createEntityAdapter)
- [Reselect Documentation](https://github.com/reduxjs/reselect)

## 📅 Changelog

### Version 1.0.0 - {{date:YYYY-MM-DD}}
- Initial slice implementation
- Basic CRUD operations
- Entity adapter integration

### Version 1.1.0 - {{date:YYYY-MM-DD}}
- Added filtering and pagination
- Implemented caching
- Performance optimizations

---

**Tags**: #frontend #redux #state-management #typescript
**Category**: [[Frontend/Store]]
**Priority**: High/Medium/Low
