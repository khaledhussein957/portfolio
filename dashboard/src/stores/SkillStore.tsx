import { create } from "zustand";
import axios from "axios";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5001/api/v1"
    : "/api/v1";
axios.defaults.withCredentials = true;

export type Skill = {
  _id: string;
  skill: string;
  proficiency: string;
  createdAt: string;
};

type SkillStore = {
  skills: Skill[];
  isLoading: boolean;
  error: string | null;

  getSkills: () => Promise<void>;
  addSkill: (skill: string, proficiency: string) => Promise<void>;
  updateSkill: (id: string, data: Partial<Skill>) => Promise<void>;
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

  addSkill: async (skill: string, proficiency: string) => {
    try {
      set({ isLoading: true, error: null });
      const res = await axios.post(`${API_URL}/skill`, { skill, proficiency });
      set({ skills: [res.data, ...get().skills], isLoading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.error || "Failed to add skill",
        isLoading: false,
      });
    }
  },

  updateSkill: async (id, data) => {
    try {
      set({ isLoading: true, error: null });
      const res = await axios.put(`${API_URL}/skill/${id}`, data);
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
