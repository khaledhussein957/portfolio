import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5001/api/auth": "/api/auth";


const API_URL_PROJECT = import.meta.env.MODE === "development" ? "http://localhost:5001/api/project" : "/api/project";


const API_URL_SKILLS = import.meta.env.MODE === "development" ? "http://localhost:5001/api/skills" : "/api/skills";


axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,

  signup: async (email, password, name, image) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/signup`, {
        email,
        password,
        name,
        image,
      });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response.data.message || "Error signing up",
        isLoading: false,
      });
      throw error;
    }
  },
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      set({
        isAuthenticated: true,
        user: response.data.user,
        error: null,
        isLoading: false,
      });
      console.log(`response: ${response}`);
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error logging in",
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/logout`);
      set({
        user: null,
        isAuthenticated: false,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      set({ error: "Error logging out", isLoading: false });

      throw error;
    }
  },
  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/verify-email`, { code });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });

      return response.data;
    } catch (error) {
      set({
        error: error.response.data.message || "Error verifying email",
        isLoading: false,
      });
      throw error;
    }
  },
  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/check-auth`);
      set({
        user: response.data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch (err) {
      set({ error: null, isCheckingAuth: false, isAuthenticated: false });
      throw err;
    }
  },
  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, {
        email,
      });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error:
          error.response.data.message || "Error sending reset password email",
      });
      throw error;
    }
  },
  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/reset-password/${token}`, {
        password,
      });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response.data.message || "Error resetting password",
      });
      throw error;
    }
  },
}));


export const useProjectStore = create((set) => ({
  projects: [],
  error: null,
  isLoading: false,

  fetchProjects: async () => {
      set({ isLoading: true, error: null });
      try {
          const response = await axios.get(API_URL_PROJECT);
          set({ projects: response.data.projects, isLoading: false });
      } catch (error) {
          set({ error: error.response?.data?.message || "Error fetching projects", isLoading: false });
          throw error;
      }
  },

  createProject: async (projectData) => {
      set({ isLoading: true, error: null });
      try {
          const response = await axios.post(API_URL_PROJECT, projectData);
          set((state) => ({ projects: [...state.projects, response.data.project], isLoading: false }));
      } catch (error) {
          set({ error: error.response?.data?.message || "Error creating project", isLoading: false });
          throw error;
      }
  },

  updateProject: async (id, projectData) => {
      set({ isLoading: true, error: null });
      try {
          const response = await axios.put(`${API_URL_PROJECT}/${id}`, projectData);
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
          await axios.delete(`${API_URL_PROJECT}/${id}`);
          set((state) => ({ projects: state.projects.filter((project) => project.id !== id), isLoading: false }));
      } catch (error) {
          set({ error: error.response?.data?.message || "Error deleting project", isLoading: false });
          throw error;
      }
  },
}));


export const useSkillStore = create((set) => ({
  skills: [],
  error: null,
  isLoading: false,

  fetchSkills: async () => {
      set({ isLoading: true, error: null });
      try {
          const response = await axios.get(API_URL_SKILLS);
          set({ skills: response.data.skills, isLoading: false });
      } catch (error) {
          set({ error: error.response?.data?.message || "Error fetching skills", isLoading: false });
          throw error;
      }
  },

  addSkill: async (skillData) => {
      set({ isLoading: true, error: null });
      try {
          const response = await axios.post(API_URL_SKILLS, skillData);
          set((state) => ({ skills: [...state.skills, response.data.skill], isLoading: false }));
      } catch (error) {
          set({ error: error.response?.data?.message || "Error adding skill", isLoading: false });
          throw error;
      }
  },

  updateSkill: async (id, skillData) => {
      set({ isLoading: true, error: null });
      try {
          const response = await axios.put(`${API_URL_SKILLS}/${id}`, skillData);
          set((state) => ({
              skills: state.skills.map((skill) => (skill.id === id ? response.data.skill : skill)),
              isLoading: false,
          }));
      } catch (error) {
          set({ error: error.response?.data?.message || "Error updating skill", isLoading: false });
          throw error;
      }
  },

  deleteSkill: async (id) => {
      set({ isLoading: true, error: null });
      try {
          await axios.delete(`${API_URL_SKILLS}/${id}`);
          set((state) => ({ skills: state.skills.filter((skill) => skill.id !== id), isLoading: false }));
      } catch (error) {
          set({ error: error.response?.data?.message || "Error deleting skill", isLoading: false });
          throw error;
      }
  },
}));