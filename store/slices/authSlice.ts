import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/lib/api/types";
import { authService } from "@/lib/api/auth";

interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    token: null,
    isLoading: true,
    error: null,
};

// Verify token then fetch full profile (with avatar/headerImage)
export const verifyAndFetchProfile = createAsyncThunk(
    "auth/verifyAndFetchProfile",
    async (token: string, { rejectWithValue }) => {
        try {
            // Step 1: Validate token is still valid
            await authService.verifyToken(token);

            // Step 2: Fetch full profile with avatar/headerImage
            const user = await authService.getProfile(token);
            return { user, token };
        } catch (error: unknown) {
            const err = error as { message?: string };
            localStorage.removeItem("bufc_token");
            return rejectWithValue(err.message || "Token verification failed");
        }
    }
);

export const logoutUser = createAsyncThunk(
    "auth/logout",
    async (token: string) => {
        try {
            await authService.logout(token);
        } catch (error) {
            console.error("Logout error:", error);
        }
        localStorage.removeItem("bufc_token");
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginSuccess(state, action: PayloadAction<{ token: string; user: User }>) {
            state.token = action.payload.token;
            state.user = action.payload.user;
            state.isLoading = false;
            state.error = null;
            localStorage.setItem("bufc_token", action.payload.token);
        },
        updateUser(state, action: PayloadAction<User>) {
            state.user = action.payload;
        },
        setLoadingComplete(state) {
            state.isLoading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(verifyAndFetchProfile.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(verifyAndFetchProfile.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isLoading = false;
                state.error = null;
            })
            .addCase(verifyAndFetchProfile.rejected, (state, action) => {
                state.user = null;
                state.token = null;
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.token = null;
                state.error = null;
            });
    },
});

export const { loginSuccess, updateUser, setLoadingComplete } = authSlice.actions;
export default authSlice.reducer;
