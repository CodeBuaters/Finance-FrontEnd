import type { Category } from "./category";

export interface Transaction {
  id: string;
  amount: number;
  transactionDate: string;
  merchant: string;
  description?: string;
  type: "INCOME" | "EXPENSE";
  category: Category;
}
