"use client";

import { useAppDispatch, useAppSelector } from "../hooks";
import { logoutUser, loginSuccess, updateUser } from "../slices/authSlice";
import { User } from "@/lib/api/types";

export function useAuth() {
    const dispatch = useAppDispatch();
    const { user, token, isLoading } = useAppSelector((state) => state.auth);

    return {
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login: (newToken: string, userData: User) => {
            dispatch(loginSuccess({ token: newToken, user: userData }));
        },
        logout: () => {
            if (token) dispatch(logoutUser(token));
        },
        updateUser: (userData: User) => {
            dispatch(updateUser(userData));
        },
    };
}
