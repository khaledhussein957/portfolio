import { create } from "zustand";
import axios from "axios";

const API_URL = "https://portfolio-dun-chi-7ndk681w8m.vercel.app/api/v1";

axios.defaults.withCredentials = true;

type Education = {
  institution: string;
  degree: string;
  startYear: string;
  endYear: string;
};

type Experience = {
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

type Project = {
  _id: string;
  title: string;
  image?: string;
  description: string;
  technologies: string[];
  githubLink?: string;
  liveLink?: string;
  status: string;
  createdAt: string;
};

type Skill = {
  _id: string;
  icon: string;
  groupName: string;
  skill: string[];
  createdAt: string;
  updatedAt?: string;
};

type PortfolioStore = {
  user: User | null;
  projects: Project[];
  skills: Skill[];
  isLoading: boolean;
  error: string | null;
  networkError: boolean | null;
  getUser: () => Promise<void>;
  getProjects: () => Promise<void>;
  getSkills: () => Promise<void>;
};

export const usePortfolioStore = create<PortfolioStore>((set) => ({
  user: null,
  projects: [],
  skills: [],
  isLoading: false,
  error: null,
  networkError: null,

  getUser: async () => {
    try {
      set({ isLoading: true, error: null, networkError: null });
      const res = await axios.get(`${API_URL}/user`);
      set({ user: res.data.user, isLoading: false });
    } catch (err: any) {
      if (!err.response) {
        set({ networkError: true, isLoading: false });
      } else {
        set({
          error: err.response?.data?.message || "Failed to fetch user",
          isLoading: false,
        });
      }
    }
  },

  getProjects: async () => {
    try {
      set({ isLoading: true, error: null, networkError: null });
      const res = await axios.get(`${API_URL}/project`);
      set({ projects: res.data, isLoading: false });
    } catch (err: any) {
      if (!err.response) {
        set({ networkError: true, isLoading: false });
      } else {
        set({
          error: err.response?.data?.message || "Failed to fetch projects",
          isLoading: false,
        });
      }
    }
  },

  getSkills: async () => {
    try {
      set({ isLoading: true, error: null, networkError: null });
      const res = await axios.get(`${API_URL}/skill`);
      set({ skills: res.data, isLoading: false });
    } catch (err: any) {
      set({
        networkError: true,
        error: err.response?.data?.error || "Failed to fetch skills",
        isLoading: false,
      });
    }
  },
}));
