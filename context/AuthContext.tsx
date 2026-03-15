"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/lib/api/types";
import { authService } from "@/lib/api/auth";

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
    updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem("bufc_token");
        if (storedToken) {
            setToken(storedToken);
            verifyUserToken(storedToken);
        } else {
            setIsLoading(false);
        }
    }, []);

    const verifyUserToken = async (storedToken: string) => {
        try {
            const userData = await authService.verifyToken(storedToken);
            setUser(userData);
        } catch (error: unknown) {
            const err = error as { message?: string };
            console.error("Token verification failed:", err.message || error);
            localStorage.removeItem("bufc_token");
            setToken(null);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const login = (newToken: string, userData: User) => {
        setToken(newToken);
        setUser(userData);
        localStorage.setItem("bufc_token", newToken);
    };

    const logout = async () => {
        if (token) {
            try {
                await authService.logout(token);
            } catch (error) {
                console.error("Logout error:", error);
            }
        }
        setToken(null);
        setUser(null);
        localStorage.removeItem("bufc_token");
    };

    const updateUser = (userData: User) => {
        setUser(userData);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: !!user,
                isLoading,
                login,
                logout,
                updateUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
