import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import Cookie from 'js-cookie'

const cookieStorage = {
    getItem: (key: string): string | null => {
        return Cookie.get(key) || null;
    },
    setItem: (key: string, value: string): void => {
        Cookie.set(key, value, { expires: 7 });
    },
    removeItem: (key: string): void => {
        Cookie.remove(key);
    },
}
/* eslint-disable @typescript-eslint/no-explicit-any */
interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    roleId: string;
    role: string;
}

interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    loading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    setUser: (user: User | null) => void;
    setTokens: (accessToken: string, refreshToken: string) => void;
    clearError: () => void;
}

export const useAuthStore = create<AuthState>()(persist((set) => ({
    user: null,
    accessToken: null,
    refreshToken: null,
    loading: false,
    error: null,
    
    login: async (email: string, password: string) => {
        set({ loading: true, error: null });
        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Login failed");
            }
            
            const data = await response.json();
            set({
                user: data.user,
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
                loading: false,
                error: null,
            });
        } catch (error: any) {
            set({ 
                loading: false, 
                error: error.message || "An error occurred during login" 
            });
            throw error;
        }
    },
    
    logout: () => {
        set({
            user: null,
            accessToken: null,
            refreshToken: null,
            error: null,
        });
    },
    
    setUser: (user: User | null) => {
        set({ user });
    },
    
    setTokens: (accessToken: string, refreshToken: string) => {
        set({ accessToken, refreshToken });
    },
    
    clearError: () => {
        set({ error: null });
    },
}), {
    name: "auth",
    storage: createJSONStorage(() => cookieStorage),
}))
