export type Category =
  | 'Second-hand Sell'
  | 'Fruit Sell'
  | 'Cashback'
  | 'Investment';
export type Income = {
  id: string;
  category: Category;
  date: Date;
  profit: number;
  comments?: string;
  owner: string;
  totalIncomeAtTime: number;
};
