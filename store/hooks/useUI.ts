"use client";

import { useAppDispatch, useAppSelector } from "../hooks";
import { openAuthModal as openModal, closeAuthModal as closeModal } from "../slices/uiSlice";

export function useUI() {
    const dispatch = useAppDispatch();
    const { isAuthModalOpen, authMode } = useAppSelector((state) => state.ui);

    return {
        isAuthModalOpen,
        authMode,
        openAuthModal: (mode?: "signin" | "signup") => dispatch(openModal(mode)),
        closeAuthModal: () => dispatch(closeModal()),
    };
}
