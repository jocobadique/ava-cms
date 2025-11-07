import { create } from "zustand";

interface UserState {
  isAuthenticated: boolean;
  user: {
    firstName: string;
    accessToken: string;
    cms_role: string;
  } | null;
  setUser: (user: {
    firstName: string;
    accessToken: string;
    cms_role: string;
  }) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  isAuthenticated: false,
  user: null,
  setUser: (user) =>
    set({
      isAuthenticated: true,
      user,
    }),
  clearUser: () =>
    set({
      isAuthenticated: false,
      user: null,
    }),
}));
