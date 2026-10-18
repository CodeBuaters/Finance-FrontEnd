import type { Transaction } from "../../Types/transaction";
import Skeleton from "../common/Skeleton";
import TransactionRow from "./TransactionRow";

interface TransactionsTableProps {
  transactions: Transaction[];
  isLoading?: boolean;
  error?: boolean;
}

const SKELETON_ROWS = 8;

// Placeholder row with the same cells as TransactionRow
function SkeletonRow() {
  return (
    <tr className="border-b border-slate-100 last:border-0">
      <td className="px-4 py-[15px] sm:px-5">
        <Skeleton className="h-3 w-16" />
      </td>
      <td className="px-4 py-[15px] sm:px-5">
        <Skeleton className="h-3.5 w-28" />
      </td>
      <td className="px-4 py-[15px] sm:px-5">
        <Skeleton className="h-3.5 w-36" />
      </td>
      <td className="px-4 py-[15px] sm:px-5">
        <Skeleton className="h-5 w-16 rounded-full" />
      </td>
      <td className="px-4 py-[15px] sm:px-5">
        <Skeleton className="ml-auto h-3.5 w-14" />
      </td>
      {[0, 1, 2].map((index) => (
        <td key={index} className="px-4 py-[15px] sm:px-5">
          <Skeleton className="h-4 w-4" />
        </td>
      ))}
    </tr>
  );
}

export default function TransactionsTable({
  transactions,
  isLoading = false,
  error = false,
}: TransactionsTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
      <div className="overflow-x-auto">
        <table
          className="w-full min-w-[720px] border-collapse text-left"
          aria-busy={isLoading}
        >
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
              <th className="px-4 py-3 font-semibold sm:px-5">Date</th>
              <th className="px-4 py-3 font-semibold sm:px-5">Merchant</th>
              <th className="px-4 py-3 font-semibold sm:px-5">Description</th>
              <th className="px-4 py-3 font-semibold sm:px-5">Category</th>
              <th className="px-4 py-3 text-right font-semibold sm:px-5">
                Amount
              </th>
            </tr>
          </thead>
          {isLoading ? (
            <tbody>
              {Array.from({ length: SKELETON_ROWS }, (_, index) => (
                <SkeletonRow key={index} />
              ))}
            </tbody>
          ) : (
            // Rows fade in once loaded. The tbody stays mounted while filtering,
            // so the animation only plays when the data first arrives.
            <tbody className="animate-content-in motion-reduce:animate-none">
              {transactions.map((transaction) => (
                <TransactionRow key={transaction.id} transaction={transaction} />
              ))}
            </tbody>
          )}
        </table>
      </div>
      {error ? (
        <p className="px-5 py-10 text-center text-sm text-red-500">
          Could not load your transactions. Please try again later.
        </p>
      ) : (
        !isLoading &&
        transactions.length === 0 && (
          <p className="px-5 py-10 text-center text-sm text-slate-400">
            No transactions match those filters.
          </p>
        )
      )}
    </div>
  );
}
