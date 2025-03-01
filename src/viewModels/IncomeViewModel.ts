import { create } from 'zustand';
import { Income } from '../models/Income';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface IncomeState {
  incomes: Income[];
  addIncome: (income: Income) => void;
  isHydrated: boolean;
  setHydrated: () => void; // Define setHydrated in the type
  sortBy: 'date' | 'profit' | 'category'; // Define sortBy field
  sortOrder: 'asc' | 'desc'; // Define sortOrder field
  setSorting: (field: 'date' | 'profit' | 'category') => void; // Define setSorting in the type
  editIncome: (updatedIncome: Income) => void;
  deleteIncome: (id: string) => void;
}

// Create store
export const useIncomeStore = create<IncomeState>()(
  persist(
    (set) => ({
      incomes: [],
      isHydrated: false, // Initially false
      sortBy: 'date', // Default sorting field
      sortOrder: 'desc', // 'asc' or 'desc'

      addIncome: (income) =>
        set((state) => ({
          incomes: [...state.incomes, income],
        })),

      setHydrated: () => set({ isHydrated: true }), // Set hydration state

      setSorting: (field) =>
        set((state) => ({
          sortBy: field,
          sortOrder: state.sortOrder === 'asc' ? 'desc' : 'asc', // Toggle order
        })),
      editIncome: (updatedIncome) =>
        set((state) => ({
          incomes: state.incomes.map((income) =>
            income.id === updatedIncome.id ? updatedIncome : income,
          ),
        })),
      deleteIncome: (id) =>
        set((state) => ({
          incomes: state.incomes.filter((income) => income.id !== id),
        })),
    }),
    {
      name: 'income-storage',
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

export class IncomeViewModel {
  incomes: {
    date: string;
    category: string;
    profit: number;
    comments?: string;
    owner: string;
  }[] = [];
  totalIncome: number = 0;

  addIncome(income: {
    date: string;
    category: string;
    profit: number;
    comments?: string;
    owner: string;
  }) {
    this.incomes.push(income);
    this.totalIncome += income.profit;
  }

  shouldShowInvestmentPopup(): boolean {
    return this.totalIncome >= 300;
  }

  resetIncomeAfterInvestment() {
    this.totalIncome -= 300; // Deduct 300 when the user decides to invest
  }
}
