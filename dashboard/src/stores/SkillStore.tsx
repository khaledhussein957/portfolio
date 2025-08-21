import { create } from "zustand";
import axios from "axios";

const API_URL = "https://portfolio-seven-rho-rfb06n69c8.vercel.app/api/v1";

axios.defaults.withCredentials = true;

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
