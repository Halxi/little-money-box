import { create } from 'zustand';
import { Income } from '../models/Income';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { router } from 'expo-router';

interface IncomeState {
  incomes: Income[];
  totalIncome: number;
  addIncome: (income: Income) => void;
  isHydrated: boolean;
  setHydrated: () => void; // Define setHydrated in the type
  sortBy: 'date' | 'profit' | 'category'; // Define sortBy field
  sortOrder: 'asc' | 'desc'; // Define sortOrder field
  setSorting: (field: 'date' | 'profit' | 'category') => void; // Define setSorting in the type
  editIncome: (updatedIncome: Income) => void;
  deleteIncome: (id: string) => void;
}

function handleTotalIncome(state: IncomeState, income: Income) {
  const newTotal = state.totalIncome + income.profit;
  if (newTotal >= 300) {
    Alert.alert(
      'Investment Opportunity',
      'Your total income has reached 300! Consider investing.',
      [
        {
          text: 'Invest Now',
          onPress: () => router.push('/investment'),
        },
      ],
    );
    return {
      incomes: [...state.incomes, income],
      totalIncome: newTotal - 300, // Reset after alert
    };
  }
  return {
    incomes: [...state.incomes, income],
    totalIncome: newTotal,
  };
}

// Create store
export const useIncomeStore = create<IncomeState>()(
  persist(
    (set) => ({
      incomes: [],
      totalIncome: 0, // Initially 0
      isHydrated: false, // Initially false
      sortBy: 'date', // Default sorting field
      sortOrder: 'desc', // 'asc' or 'desc'

      addIncome: (income) => set((state) => handleTotalIncome(state, income)),

      setHydrated: () => set({ isHydrated: true }), // Set hydration state

      setSorting: (field) =>
        set((state) => ({
          sortBy: field,
          sortOrder: state.sortOrder === 'asc' ? 'desc' : 'asc', // Toggle order
        })),
      editIncome: (updatedIncome) =>
        set((state) => {
          const oldIncome = state.incomes.find(
            (inc) => inc.id === updatedIncome.id,
          );
          const oldProfit = oldIncome ? oldIncome.profit : 0;

          // Remove old profit and add new profit
          const adjustedState = {
            ...state,
            totalIncome: state.totalIncome - oldProfit, // Subtract old profit first
            incomes: state.incomes.map((income) =>
              income.id === updatedIncome.id ? updatedIncome : income,
            ),
          };

          return handleTotalIncome(adjustedState, updatedIncome);
        }),
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
