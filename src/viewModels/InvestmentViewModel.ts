import { create } from 'zustand';
import { Investment } from '../models/Investment';

interface InvestmentState {
  investments: Investment[];
  addInvestment: (investment: Investment) => void;
}

export const useInvestmentStore = create<InvestmentState>((set) => ({
  investments: [],
  addInvestment: (investment) =>
    set((state) => ({ investments: [...state.investments, investment] })),
}));
