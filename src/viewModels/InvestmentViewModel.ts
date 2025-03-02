import { create } from 'zustand';
import { Investment } from '../models/Investment';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface InvestmentState {
  investments: Investment[];
  addInvestment: (investment: Investment) => void;
  updateInvestment: (updatedInvestment: Investment) => void;
  removeInvestment: (investmentId: string) => void;
  isHydrated: boolean;
  setHydrated: () => void; // Define setHydrated in the type
}

export const useInvestmentStore = create<InvestmentState>()(
  persist(
    (set) => ({
      investments: [],
      isHydrated: false,
      addInvestment: (investment) =>
        set((state) => ({ investments: [...state.investments, investment] })),
      updateInvestment: (updatedInvestment) =>
        set((state) => ({
          investments: state.investments.map((inv) =>
            inv.id === updatedInvestment.id ? updatedInvestment : inv,
          ),
        })),
      removeInvestment: (investmentId) =>
        set((state) => ({
          investments: state.investments.filter(
            (inv) => inv.id !== investmentId,
          ),
        })),
      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: 'investment-storage',
      storage: {
        getItem: async (name) => {
          const item = await AsyncStorage.getItem(name);
          return item
            ? JSON.parse(item, (key, value) =>
                key === 'date' ? new Date(value) : value,
              )
            : null;
        },
        setItem: async (name, value) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name) => {
          await AsyncStorage.removeItem(name);
        },
      },
      onRehydrateStorage: () => (state) => {
        if (state) state.setHydrated(); // Call setHydrated after rehydration
      },
    },
  ),
);
