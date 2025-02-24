import { create } from 'zustand';
import { Income } from '../models/Income';
import { persist } from 'zustand/middleware';

interface IncomeState {
  incomes: Income[];
  addIncome: (income: Income) => void;
}

export const useIncomeStore = create<IncomeState>()(
  persist(
    (set) => ({
      incomes: [],
      addIncome: (income) =>
        set((state) => ({ incomes: [...state.incomes, income] })),
    }),
    { name: 'income-storage' }, // Stores data persistently
  ),
);
