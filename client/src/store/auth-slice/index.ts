import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosResponse } from "axios";

// Định nghĩa kiểu cho state
interface authSlice {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: any;
}

const initialState: authSlice = {
    isAuthenticated: false,
    isLoading: false,
    user: null
}

interface AuthResponse {
    [key: string]: any;
}

export const registerUser = createAsyncThunk<
    AuthResponse,
    { rejectValue: { error: string } }
>(
    "/auth/register",
    async (formData, { rejectWithValue }) => {
        try {
            const response: AxiosResponse<AuthResponse> = await axios.post(
                '/api/auth/ha',
                formData,
                { withCredentials: true, }
            );

            return response.data;


        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue({ error: error.response.data.error });
            } else {
                return rejectWithValue({ error: 'An unknown error occurred' });
            }
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<any>) => {

        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
            })
            .addCase(registerUser.rejected, (state) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
            })
    }
})

export const { setUser } = authSlice.actions;
export default authSlice.reducer;