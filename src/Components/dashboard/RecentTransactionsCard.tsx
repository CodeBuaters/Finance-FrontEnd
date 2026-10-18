import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { getRecentTransactions } from "../../Services/dashboardService";
import type { Transaction } from "../../Types/transaction";
import { formatCurrency } from "../../Utils/currency";
import { formatMonthDay } from "../../Utils/date";
import TransactionCategoryBadge from "../transactions/TransactionCategoryBadge";
import DashboardCard from "./DashboardCard";

// Income is highlighted with a plus sign, expenses are shown as plain amounts and
// transfers keep their own sign
const formatAmount = (transaction: Transaction) =>
  transaction.transactionType === "INCOME"
    ? `+${formatCurrency(Math.abs(transaction.amount))}`
    : transaction.transactionType === "EXPENSE"
      ? formatCurrency(Math.abs(transaction.amount))
      : formatCurrency(transaction.amount);

export default function RecentTransactionsCard({
  transactions,
  limit = 6,
}: {
  transactions: Transaction[];
  limit?: number;
}) {
  const recent = getRecentTransactions(transactions, limit);

  return (
    <DashboardCard
      title="Recent Transactions"
      action={
        <Link
          to="/transactions"
          className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
        >
          View all
          <ArrowRight size={12} strokeWidth={2.5} />
        </Link>
      }
    >
      {recent.length === 0 ? (
        <p className="py-10 text-center text-sm text-slate-400">
          No transactions yet.
        </p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-xs text-slate-400">
              <th className="pb-3 pr-4 font-medium">Date</th>
              <th className="pb-3 pr-4 font-medium">Merchant</th>
              <th className="hidden pb-3 pr-4 font-medium sm:table-cell">
                Category
              </th>
              <th className="pb-3 text-right font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((transaction) => (
              <tr
                key={transaction.id}
                className="border-b border-slate-100 last:border-0"
              >
                <td className="whitespace-nowrap py-3 pr-4 text-xs text-slate-500">
                  {formatMonthDay(transaction.transactionDate)}
                </td>
                <td className="py-3 pr-4 font-medium text-slate-800">
                  {transaction.merchant}
                </td>
                <td className="hidden py-3 pr-4 sm:table-cell">
                  <TransactionCategoryBadge category={transaction.category} />
                </td>
                <td
                  className={`whitespace-nowrap py-3 text-right font-bold ${
                    transaction.transactionType === "INCOME"
                      ? "text-emerald-600"
                      : "text-slate-800"
                  }`}
                >
                  {formatAmount(transaction)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </DashboardCard>
  );
}
