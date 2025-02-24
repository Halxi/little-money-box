export type Investment = {
  id: string;
  date: string;
  stockName: string;
  stockPrice: number;
  relatedIncomes: string[]; // Store IDs of incomes used for investment
};
