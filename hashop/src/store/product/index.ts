import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Product, ProductResponse } from "@/types/product";
import axios from "@/config/axios";
import axiosLib, { AxiosResponse } from "axios";
import { GraphQLErrorResponse } from "@/types/graphql";

// Trạng thái ban đầu
const initialState = {
    products: [] as Product[],
    loading: false,
    error: null as GraphQLErrorResponse | null
};

// Lấy danh sách sản phẩm
export const AllProduct = createAsyncThunk<
    ProductResponse,
    string[],
    { rejectValue: GraphQLErrorResponse }
>(
    "/product/all",
    async (
        fields,
        { rejectWithValue }
    ) => {
        try {
            const response: AxiosResponse<ProductResponse> = await axios.post(
                '/graphql',
                {
                    query: `query {
                        products {
                            ${fields.join(" ")
                        }                        
                    }`
                }
            );

            return response.data;

        } catch (error) {
            if (axiosLib.isAxiosError(error) && error.response) {
                // Xử lý lỗi GraphQL
                if (error.response?.data?.errors) {
                    return rejectWithValue({
                        errors: error.response.data.errors
                    });
                }

                // Xử lý lỗi mạng/HTTP khác
                return rejectWithValue({
                    errors: [{
                        message: error.message,
                        locations: [],
                        extensions: {
                            code: "HTTP_ERROR",
                            stacktrace: error.stack?.split('\n')
                        }
                    }]
                });
            }

            // Xử lý lỗi không xác định
            return rejectWithValue({
                errors: [{
                    message: "Unknown error occurred",
                    locations: [],
                    extensions: {
                        code: "UNKNOWN_ERROR"
                    }
                }]
            });
        }
    }
);

//
export const paginatedProducts = createAsyncThunk<
    ProductResponse,
    {
        fields: string[];
        page: number;
        limit: number;
        sortColumn?: keyof Product;
        sortOrder?: 'asc' | 'desc';
        query?: string;
        slice?: string;
    },
    { rejectValue: GraphQLErrorResponse }
>(
    "/product/paginated",
    async (
        {
            fields,
            page,
            limit,
            sortColumn,
            sortOrder,
            query,
            slice
        },
        { rejectWithValue }
    ) => {
        try {
            const response: AxiosResponse<ProductResponse> = await axios.post(
                '/graphql',
                {
                    query: `query PaginatedProducts(
                        $page: Int!
                        $limit: Int!
                        $sortColumn: String
                        $sortOrder: String
                        $query: String
                        $slice: String
                    ) {
                        paginatedProducts(
                            page: $page
                            limit: $limit
                            sortColumn: $sortColumn
                            sortOrder: $sortOrder
                            query: $query
                            slice: $slice
                        ) {
                            products {
                                ${fields.join(" ")}
                            }
                            totalProducts
                        }
                    }`,
                    variables: {
                        page,
                        limit,
                        sortColumn: sortColumn || undefined,
                        sortDirection: sortOrder || undefined,
                        query: query || undefined,
                        slice: slice || undefined
                    }
                }
            );

            return {
                data: {
                    paginatedProducts: response.data.data.paginatedProducts
                }
            } as ProductResponse;

        } catch (error) {
            if (axiosLib.isAxiosError(error) && error.response) {
                // Xử lý lỗi GraphQL
                if (error.response?.data?.errors) {
                    return rejectWithValue({
                        errors: error.response.data.errors
                    });
                }

                // Xử lý lỗi mạng/HTTP khác
                return rejectWithValue({
                    errors: [{
                        message: error.message,
                        locations: [],
                        extensions: {
                            code: "HTTP_ERROR",
                            stacktrace: error.stack?.split('\n')
                        }
                    }]
                });
            }

            // Xử lý lỗi không xác định
            return rejectWithValue({
                errors: [{
                    message: "Unknown error occurred",
                    locations: [],
                    extensions: {
                        code: "UNKNOWN_ERROR"
                    }
                }]
            });
        }
    }
);

// Tạo Product slice
const productSlice = createSlice({
    name: "product",
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Lấy danh sách sản phẩm
            .addCase(AllProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(AllProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.products = action.payload.data.products || [];
            })
            .addCase(AllProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || {
                    errors: [{
                        message: "Unexpected error occurred",
                        locations: [],
                        extensions: { code: "HTTP_ERROR" }
                    }]
                };
            })

            // Lấy danh sách sản phẩm phân trang
            .addCase(paginatedProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(paginatedProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.products = action.payload.data.paginatedProducts.products || [];
            })
            .addCase(paginatedProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || {
                    errors: [{
                        message: "Unexpected error occurred",
                        locations: [],
                        extensions: { code: "HTTP_ERROR" }
                    }]
                };
            });
    }
});

// Export reducer
export default productSlice.reducer;
