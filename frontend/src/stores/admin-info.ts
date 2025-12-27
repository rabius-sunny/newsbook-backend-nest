import { signKey, verifyKey } from '@/lib/crypto-utils';
import { create } from 'zustand';
import { createJSONStorage, persist, StateStorage } from 'zustand/middleware';

type TAdmin = {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  bio?: string;
};

type AdminStoreState = {
  adminInfo: TAdmin | null;
  setAdminInfo: (adminData: TAdmin | undefined) => void;
  clearAdminInfo: () => void;
};

const storage: StateStorage = {
  getItem(key: string): string | Promise<string | null> | null {
    const value = localStorage.getItem(key);

    if (value) {
      return verifyKey(value);
    }

    return null;
  },

  setItem(
    key: string,
    value: string | number | boolean | object | Array<undefined>,
  ): void {
    const encrypted = signKey(value);
    localStorage.setItem(key, encrypted);
  },

  removeItem(key: string): void {
    localStorage.removeItem(key);
  },
};

export const useAdminStore = create<AdminStoreState>()(
  persist(
    (set) => ({
      adminInfo: null,
      setAdminInfo: (adminData: TAdmin | undefined) =>
        set({ adminInfo: adminData }),
      clearAdminInfo: () => set({ adminInfo: null }),
    }),
    {
      name: 'adminInfo',
      storage: createJSONStorage(() => storage),
    },
  ),
);
