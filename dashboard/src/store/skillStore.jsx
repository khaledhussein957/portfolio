import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5001/api/skills" : "/api/skills";

axios.defaults.withCredentials = true;

export const useSkillStore = create((set) => ({
    skills: [],
    error: null,
    isLoading: false,

    fetchSkills: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get(API_URL);
            set({ skills: response.data.skills, isLoading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || "Error fetching skills", isLoading: false });
            throw error;
        }
    },

    addSkill: async (skillData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(API_URL, skillData);
            set((state) => ({ skills: [...state.skills, response.data.skill], isLoading: false }));
        } catch (error) {
            set({ error: error.response?.data?.message || "Error adding skill", isLoading: false });
            throw error;
        }
    },

    updateSkill: async (id, skillData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.put(`${API_URL}/${id}`, skillData);
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
            await axios.delete(`${API_URL}/${id}`);
            set((state) => ({ skills: state.skills.filter((skill) => skill.id !== id), isLoading: false }));
        } catch (error) {
            set({ error: error.response?.data?.message || "Error deleting skill", isLoading: false });
            throw error;
        }
    },
}));