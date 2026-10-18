import { api } from "./api";
import type { Transaction } from "../Types/transaction";
import type {
  CategorySpending,
  DashboardSummary,
  MonthlySpending,
} from "../Types/dashboard";
import { getSignedAmount } from "../Utils/currency";
import {
  getPreviousMonth,
  getStartOfMonth,
  isSameMonth,
  parseTransactionDate,
} from "../Utils/date";
import { getTransactionsByUserId } from "./transactionService";

// Imported expenses are stored with a negative amount, so the backend's expense
// totals can come back negative. Everything below works with positive expense sums.
export async function getDashboardSummary(): Promise<DashboardSummary> {
  const response = await api.get<DashboardSummary>("/api/dashboard/summary");
  const income = Math.abs(response.data.income);
  const expenses = Math.abs(response.data.expenses);

  return { ...response.data, income, expenses, balance: income - expenses };
}

export async function getMonthlySpending(): Promise<MonthlySpending[]> {
  const response = await api.get<MonthlySpending[]>("/api/dashboard/monthly");

  return response.data.map((month) => ({
    ...month,
    total: Math.abs(month.total),
  }));
}

export async function getExpensesByCategory(): Promise<CategorySpending[]> {
  const response = await api.get<CategorySpending[]>(
    "/api/dashboard/categories",
  );

  return response.data.map((category) => ({
    ...category,
    total: Math.abs(category.total),
  }));
}

// The last `maxMonths` months for the spending chart. The backend always returns
// 12 months, so months before the first one with any spending are dropped
// (e.g. a new user only sees the months they have actually used the app).
export const getRecentMonthlySpending = (
  monthlySpending: MonthlySpending[],
  maxMonths = 6,
) => {
  const recent = monthlySpending.slice(-maxMonths);
  const firstWithSpending = recent.findIndex((month) => month.total > 0);
  return firstWithSpending === -1 ? [] : recent.slice(firstWithSpending);
};

export type KpiValue = {
  value: number;
  // Percentage change compared to the previous month, null when there is nothing to compare against
  changePercent: number | null;
};

export type DashboardKpis = {
  totalBalance: KpiValue;
  monthlyIncome: KpiValue;
  monthlyExpenses: KpiValue;
};

const sumBy = (
  transactions: Transaction[],
  getAmount: (transaction: Transaction) => number,
) => transactions.reduce((total, transaction) => total + getAmount(transaction), 0);

export const calculateChangePercent = (current: number, previous: number) =>
  previous === 0 ? null : ((current - previous) / Math.abs(previous)) * 100;

export const calculateBalance = (transactions: Transaction[], until?: Date) =>
  sumBy(
    until
      ? transactions.filter(
          (transaction) =>
            parseTransactionDate(transaction.transactionDate) < until,
        )
      : transactions,
    getSignedAmount,
  );

export const calculateMonthlyIncome = (
  transactions: Transaction[],
  month: Date,
) =>
  sumBy(
    transactions.filter(
      (transaction) =>
        transaction.transactionType === "INCOME" &&
        isSameMonth(parseTransactionDate(transaction.transactionDate), month),
    ),
    (transaction) => Math.abs(transaction.amount),
  );

// The monthly endpoint is ordered oldest first, so the last two entries are this and last month
const getMonthlySpendingChange = (monthlySpending: MonthlySpending[]) => {
  const [previous, current] = monthlySpending.slice(-2);
  return previous && current
    ? calculateChangePercent(current.total, previous.total)
    : null;
};

// Income and expenses come from the backend. The backend has no all-time balance
// or monthly income history yet, so those are still calculated from the transactions.
export function calculateDashboardKpis(
  summary: DashboardSummary,
  monthlySpending: MonthlySpending[],
  transactions: Transaction[],
  referenceDate = new Date(),
): DashboardKpis {
  const balance = calculateBalance(transactions);
  // Balance at the end of last month = everything before this month started
  const previousBalance = calculateBalance(
    transactions,
    getStartOfMonth(referenceDate),
  );
  const previousIncome = calculateMonthlyIncome(
    transactions,
    getPreviousMonth(referenceDate),
  );

  return {
    totalBalance: {
      value: balance,
      changePercent: calculateChangePercent(balance, previousBalance),
    },
    monthlyIncome: {
      value: summary.income,
      changePercent: calculateChangePercent(summary.income, previousIncome),
    },
    monthlyExpenses: {
      value: summary.expenses,
      changePercent: getMonthlySpendingChange(monthlySpending),
    },
  };
}

export async function getDashboardKpis(userId: number): Promise<DashboardKpis> {
  const [summary, monthlySpending, transactions] = await Promise.all([
    getDashboardSummary(),
    getMonthlySpending(),
    getTransactionsByUserId(userId),
  ]);
  return calculateDashboardKpis(summary, monthlySpending, transactions);
}

export const formatChangePercent = (changePercent: number | null) =>
  changePercent === null
    ? "No data for last month"
    : `${changePercent >= 0 ? "+" : ""}${changePercent.toFixed(1)}% vs last month`;
