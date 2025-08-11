import { create } from "zustand";
import axios from "axios";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5001/api/v1"
    : "/api/v1";
axios.defaults.withCredentials = true;

export type Education = {
  institution: string;
  degree: string;
  startYear: string;
  endYear: string;
};

export type Experience = {
  company: string;
  position: string;
  startYear: string;
  endYear: string;
};

type User = {
  _id: string;
  name: string;
  email: string;
  title?: string;
  bio?: string;
  education?: Education[];
  experience?: Experience[];
  image?: string;
};

type AuthStore = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isCheckingAuth: boolean;
  error: string | null;

  signup: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;

  verifyEmail: (code: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;

  setUser: (user: User | null) => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isCheckingAuth: false,
  error: null,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  signup: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, {
        email,
        password,
        name,
      });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        set({
          error: err.response?.data?.message || "Error message",
          isLoading: false,
        });
      } else {
        set({
          error: "Unexpected error occurred",
          isLoading: false,
        });
      }
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      set({
        isAuthenticated: true,
        user: response.data.user,
        error: null,
        isLoading: false,
      });
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        set({
          error: err.response?.data?.message || "Error message",
          isLoading: false,
        });
      } else {
        set({
          error: "Unexpected error occurred",
          isLoading: false,
        });
      }
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/auth/logout`);
      set({
        user: null,
        isAuthenticated: false,
        error: null,
        isLoading: false,
      });
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        set({
          error: err.response?.data?.message || "Error message",
          isLoading: false,
        });
      } else {
        set({
          error: "Unexpected error occurred",
          isLoading: false,
        });
      }
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/auth/check-auth`);
      set({
        user: response.data.user,
        isAuthenticated: true,
      });
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        set({
          error: err.response?.data?.message || "Error message",
          isLoading: false,
        });
      } else {
        set({
          error: "Unexpected error occurred",
          isLoading: false,
        });
      }
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/auth/verify-email`, {
        code,
      });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });

      return response.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        set({
          error: err.response?.data?.message || "Error message",
          isLoading: false,
        });
      } else {
        set({
          error: "Unexpected error occurred",
          isLoading: false,
        });
      }
    }
  },

  forgotPassword: async (email: string) => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/auth/forgot-password`, { email });
      set({ isLoading: false });
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        set({
          error: err.response?.data?.message || "Error message",
          isLoading: false,
        });
      } else {
        set({
          error: "Unexpected error occurred",
          isLoading: false,
        });
      }
    }
  },

  resetPassword: async (token: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      await axios.put(`${API_URL}/auth/reset-password/${token}`, { password });
      set({ isLoading: false });
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        set({
          error: err.response?.data?.message || "Error message",
          isLoading: false,
        });
      } else {
        set({
          error: "Unexpected error occurred",
          isLoading: false,
        });
      }
    }
  },
}));
