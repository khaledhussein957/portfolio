import { create } from "zustand";
import axios from "axios";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5001/api/v1"
    : "/api/v1";
axios.defaults.withCredentials = true;

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
  createProject: (title: string, description: string, technologies: string[], githubLink: string, status: string, image: File | null) => Promise<void>;
  updateProject: (id: string, title: string, description: string, technologies: string[], githubLink: string, status: string, image: File | null) => Promise<void>;
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

  createProject: async (title: string, description: string, technologies: string[], githubLink: string, status: string, image: File | null) => {
    try {
      set({ isLoading: true, error: null });
      const res = await axios.post(`${API_URL}/project`, {title, description, technologies, githubLink, status, image});
      set({ projects: [res.data, ...get().projects], isLoading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to create project",
        isLoading: false,
      });
    }
  },

  updateProject: async (id: string, title: string, description: string, technologies: string[], githubLink: string, status: string, image: File | null) => {
    try {
      set({ isLoading: true, error: null });
      const res = await axios.put(`${API_URL}/project/${id}`, {title, description, technologies, githubLink, status, image});
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
