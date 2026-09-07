import type { Category } from "./category";
import type { User } from "./user";

export interface Transaction {
  id: string;
  amount: number;
  transactionDate: string;
  merchant: string;
  description?: string;
  type: "INCOME" | "EXPENSE" | "TRANSFER";
  category?: Category | "OTHER";
  user: User;
}
