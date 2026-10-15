import type { Category } from "./category";

// GET /api/dashboard/summary – totals for the current month
export interface DashboardSummary {
  income: number;
  expenses: number;
  // Income minus expenses of the current month, not the all-time balance
  balance: number;
  // Always 0 until savings goals are added to the backend
  savings: number;
}

// GET /api/dashboard/monthly – expenses for each of the last 12 months, oldest first
export interface MonthlySpending {
  month: string; // "YYYY-MM"
  total: number;
}

// GET /api/dashboard/categories – current month's expenses grouped by category
export interface CategorySpending {
  category: Category;
  total: number;
}
