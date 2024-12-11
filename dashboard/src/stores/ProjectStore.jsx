import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5001/api/project" : "/api/project";

axios.defaults.withCredentials = true;

export const useProjectStore = create((set) => ({
    projects: [],
    error: null,
    isLoading: false,

    fetchProjects: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get(API_URL);
            set({ projects: response.data.projects, isLoading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || "Error fetching projects", isLoading: false });
            throw error;
        }
    },

    createProject: async (projectData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(API_URL, projectData);
            set((state) => ({ projects: [...state.projects, response.data.project], isLoading: false }));
        } catch (error) {
            set({ error: error.response?.data?.message || "Error creating project", isLoading: false });
            throw error;
        }
    },

    updateProject: async (id, projectData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.put(`${API_URL}/${id}`, projectData);
            set((state) => ({
                projects: state.projects.map((project) => (project.id === id ? response.data.project : project)),
                isLoading: false,
            }));
        } catch (error) {
            set({ error: error.response?.data?.message || "Error updating project", isLoading: false });
            throw error;
        }
    },

    deleteProject: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await axios.delete(`${API_URL}/${id}`);
            set((state) => ({ projects: state.projects.filter((project) => project.id !== id), isLoading: false }));
        } catch (error) {
            set({ error: error.response?.data?.message || "Error deleting project", isLoading: false });
            throw error;
        }
    },
}));