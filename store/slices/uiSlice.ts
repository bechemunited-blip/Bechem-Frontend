import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
    isAuthModalOpen: boolean;
    authMode: "signin" | "signup";
}

const initialState: UIState = {
    isAuthModalOpen: false,
    authMode: "signin",
};

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        openAuthModal(state, action: PayloadAction<"signin" | "signup" | undefined>) {
            state.authMode = action.payload || "signin";
            state.isAuthModalOpen = true;
        },
        closeAuthModal(state) {
            state.isAuthModalOpen = false;
        },
    },
});

export const { openAuthModal, closeAuthModal } = uiSlice.actions;
export default uiSlice.reducer;
