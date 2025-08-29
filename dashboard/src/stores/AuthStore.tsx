import { create } from "zustand";
import axios from "axios";

const API_URL = "https://server-six-roan.vercel.app/api/v1";
axios.defaults.withCredentials = true;


// Auth Store
export type Education = {
  institution: string;
  degree: string;
  startYear: string;
  endYear: string;
  gpa: string;
  uri: string;
};

export type Experience = {
  company: string;
  position: string;
  startYear: string;
  endYear: string;
  uri: string;
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


// Project Store

export type Project = {
  _id: string;
  title: string;
  image?: string;
  description: string;
  technologies: string[];
  githubLink?: string;
  liveLink?: string;
  status: string;
  createdAt?: string;
};

type ProjectStore = {
  projects: Project[];
  isLoading: boolean;
  error: string | null;

  getProjects: () => Promise<void>;
  createProject: (formData: FormData) => Promise<void>;
  updateProject: (id: string, formData: FormData) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
};

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],
  isLoading: false,
  error: null,

  getProjects: async () => {
    try {
      set({ isLoading: true, error: null });
      const res = await axios.get(`${API_URL}/project`);
      set({ projects: res.data, isLoading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to fetch projects",
        isLoading: false,
      });
    }
  },

  createProject: async (formData: FormData) => {
    try {
      set({ isLoading: true, error: null });
      const res = await axios.post(`${API_URL}/project`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      set({ projects: [res.data, ...get().projects], isLoading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to create project",
        isLoading: false,
      });
    }
  },

  updateProject: async (id: string, formData: FormData) => {
    try {
      set({ isLoading: true, error: null });
      const res = await axios.put(`${API_URL}/project/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      const updatedProjects = get().projects.map((p) => (p._id === id ? res.data : p));
      set({ projects: updatedProjects, isLoading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to update project",
        isLoading: false,
      });
    }
  },

  deleteProject: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await axios.delete(`${API_URL}/project/${id}`);
      set({
        projects: get().projects.filter((p) => p._id !== id),
        isLoading: false,
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to delete project",
        isLoading: false,
      });
    }
  },
}));




// Skill Store
export type Skill = {
  _id: string;
  icon: string;
  groupName: string;
  skill: string[];
  createdAt: string;
};

type SkillStore = {
  skills: Skill[];
  isLoading: boolean;
  error: string | null;

  getSkills: () => Promise<void>;
  addSkill: (data: { skill: string[]; groupName: string; icon: File | null }) => Promise<void>;
  updateSkill: (id: string, data: { skill: string[]; groupName: string; icon?: File | null }) => Promise<void>;
  deleteSkill: (id: string) => Promise<void>;
};

export const useSkillStore = create<SkillStore>((set, get) => ({
  skills: [],
  isLoading: false,
  error: null,

  getSkills: async () => {
    try {
      set({ isLoading: true, error: null });
      const res = await axios.get(`${API_URL}/skill`);
      set({ skills: res.data, isLoading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.error || "Failed to fetch skills",
        isLoading: false,
      });
    }
  },

  addSkill: async ({ skill, groupName, icon }) => {
    try {
      set({ isLoading: true, error: null });
      const formData = new FormData();
      skill.forEach((s) => formData.append("skill", s));
      formData.append("groupName", groupName);
      if (icon) formData.append("icon", icon);
      const res = await axios.post(`${API_URL}/skill`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set({ skills: [res.data, ...get().skills], isLoading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.error || "Failed to add skill",
        isLoading: false,
      });
    }
  },

  updateSkill: async (id, { skill, groupName, icon }) => {
    try {
      set({ isLoading: true, error: null });
      const formData = new FormData();
      skill.forEach((s) => formData.append("skill", s));
      formData.append("groupName", groupName);
      if (icon) formData.append("icon", icon);
      const res = await axios.put(`${API_URL}/skill/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const updatedSkills = get().skills.map((s) => (s._id === id ? res.data : s));
      set({ skills: updatedSkills, isLoading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.error || "Failed to update skill",
        isLoading: false,
      });
    }
  },

  deleteSkill: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await axios.delete(`${API_URL}/skill/${id}`);
      set({
        skills: get().skills.filter((s) => s._id !== id),
        isLoading: false,
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.error || "Failed to delete skill",
        isLoading: false,
      });
    }
  },
}));



