import { create } from "zustand";
import axios from "axios";

const API_URL = "https://server-six-roan.vercel.app/api/v1";
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

export type User = {
  _id: string;
  name: string;
  email: string;
  title?: string;
  bio?: string;
  education?: Education[];
  experience?: Experience[];
  image?: string;
};

type UserStore = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  networkError: boolean;
  isUpdating: boolean;
  updateError: string | null;
  isDeleting: boolean;
  deleteError: string | null;
  getUser: () => Promise<void>;
  updateUser: (
    name: string,
    title: string,
    bio: string,
    education: Education[],
    experience: Experience[],
    image: string | File
  ) => Promise<any>;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
  deleteUser: () => Promise<void>;
  setUser: (user: User | null) => void;
};

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,
  networkError: false,
  isUpdating: false,
  updateError: null,
  isDeleting: false,
  deleteError: null,

  setUser: (user) => set({ user }),

  getUser: async () => {
    try {
      set({ isLoading: true, error: null, networkError: false });
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

  updateUser: async (
    name: string,
    title: string,
    bio: string,
    education: Education[],
    experience: Experience[],
    image: string | File
  ) => {
    set({ isUpdating: true, updateError: null });

    try {
      let formData = null;
      const hasFile = image instanceof File;

      if (hasFile) {
        formData = new FormData();
        formData.append("name", name);
        formData.append("title", title);
        formData.append("bio", bio);
        formData.append("education", JSON.stringify(education));
        formData.append("experience", JSON.stringify(experience));
        formData.append("image", image); // backend expects 'image'?
      }

      const res = await axios.put(
        `${API_URL}/user/update-profile`,
        formData || { name, title, bio, education, experience },
        {
          headers: hasFile
            ? { "Content-Type": "multipart/form-data" }
            : { "Content-Type": "application/json" },
        }
      );

      set({ user: res.data.user, isUpdating: false });
      return { success: true, data: res.data };
    } catch (error: any) {
      const message = error?.response?.data?.message || "Update failed";
      set({ updateError: message, isUpdating: false });
      return { success: false, message };
    }
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const user = get().user;
    if (!user) {
      set({ updateError: "User not found" });
      return;
    }

    set({ isUpdating: true, updateError: null });

    try {
      const res = await axios.put(`${API_URL}/user/update-password`, {
        currentPassword,
        newPassword,
      });
      set({ user: res.data.user, isUpdating: false });
    } catch (error: any) {
      set({
        updateError: error?.response?.data?.message || "Update failed",
        isUpdating: false,
      });
    }
  },

  deleteUser: async () => {
    const user = get().user;
    if (!user) {
      set({ deleteError: "User not found" });
      return;
    }

    set({ isDeleting: true, deleteError: null });

    try {
      await axios.delete(`${API_URL}/user`);
      set({ user: null, isDeleting: false });
    } catch (error: any) {
      set({
        deleteError: error?.response?.data?.message || "Delete failed",
        isDeleting: false,
      });
    }
  },
}));
