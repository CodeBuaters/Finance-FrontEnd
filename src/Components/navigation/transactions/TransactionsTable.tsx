import type { Transaction } from "../../../Types/transaction";
import TransactionRow from "./TransactionRow";

interface TransactionsTableProps {
  transactions: Transaction[];
}

export default function TransactionsTable({
  transactions,
}: TransactionsTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left">
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
          <tbody>
            {transactions.map((transaction) => (
              <TransactionRow key={transaction.id} transaction={transaction} />
            ))}
          </tbody>
        </table>
      </div>
      {transactions.length === 0 && (
        <p className="px-5 py-10 text-center text-sm text-slate-400">
          No transactions match those filters.
        </p>
      )}
    </div>
  );
}
