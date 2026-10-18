import type { Category } from "./category";
import type { User } from "./user";

export interface Transaction {
  id: string;
  amount: number;
  transactionDate: string;
  merchant: string;
  description?: string;
  transactionType: "INCOME" | "EXPENSE" | "TRANSFER";
  category?: Category | null;
  user: User;
}

/* category?: Category | "OTHER"; */