import type { Transaction } from "../Types/transaction";
import { getSignedAmount } from "../Utils/currency";
import {
  getPreviousMonth,
  getStartOfMonth,
  isSameMonth,
  parseTransactionDate,
} from "../Utils/date";
import { getTransactionsByUserId } from "./transactionService";

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

const getTransactionsInMonth = (transactions: Transaction[], month: Date) =>
  transactions.filter((transaction) =>
    isSameMonth(parseTransactionDate(transaction.transactionDate), month),
  );

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
    getTransactionsInMonth(transactions, month).filter(
      (transaction) => transaction.transactionType === "INCOME",
    ),
    (transaction) => Math.abs(transaction.amount),
  );

export const calculateMonthlyExpenses = (
  transactions: Transaction[],
  month: Date,
) =>
  sumBy(
    getTransactionsInMonth(transactions, month).filter(
      (transaction) => transaction.transactionType === "EXPENSE",
    ),
    (transaction) => Math.abs(transaction.amount),
  );

export function calculateDashboardKpis(
  transactions: Transaction[],
  referenceDate = new Date(),
): DashboardKpis {
  const previousMonth = getPreviousMonth(referenceDate);

  const balance = calculateBalance(transactions);
  // Balance at the end of last month = everything before this month started
  const previousBalance = calculateBalance(
    transactions,
    getStartOfMonth(referenceDate),
  );
  const income = calculateMonthlyIncome(transactions, referenceDate);
  const previousIncome = calculateMonthlyIncome(transactions, previousMonth);
  const expenses = calculateMonthlyExpenses(transactions, referenceDate);
  const previousExpenses = calculateMonthlyExpenses(transactions, previousMonth);

  return {
    totalBalance: {
      value: balance,
      changePercent: calculateChangePercent(balance, previousBalance),
    },
    monthlyIncome: {
      value: income,
      changePercent: calculateChangePercent(income, previousIncome),
    },
    monthlyExpenses: {
      value: expenses,
      changePercent: calculateChangePercent(expenses, previousExpenses),
    },
  };
}

export async function getDashboardKpis(userId: number): Promise<DashboardKpis> {
  const transactions = await getTransactionsByUserId(userId);
  return calculateDashboardKpis(transactions);
}

export const formatChangePercent = (changePercent: number | null) =>
  changePercent === null
    ? "No data for last month"
    : `${changePercent >= 0 ? "+" : ""}${changePercent.toFixed(1)}% vs last month`;
