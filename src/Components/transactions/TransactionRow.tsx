import type { Transaction } from "../../Types/transaction";
import TransactionCategoryBadge from "./TransactionCategoryBadge";

const formatAmount = (
  transactionType: Transaction["transactionType"],
  amount: number,
) =>
  `${transactionType === "INCOME" ? "+" : "-"}$${Math.abs(amount).toFixed(2)}`;

export default function TransactionRow({
  transaction,
}: {
  transaction: Transaction;
}) {
  const amountTone =
    transaction.transactionType === "INCOME"
      ? "text-emerald-600"
      : "text-red-700";
  return (
    <tr className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60">
      <td className="whitespace-nowrap px-4 py-[15px] text-[11px] text-slate-500 sm:px-5">
        {transaction.transactionDate}
      </td>
      <td className="whitespace-nowrap px-4 py-[15px] text-[12px] font-semibold text-slate-800 sm:px-5">
        {transaction.merchant}
      </td>
      <td className="px-4 py-[15px] text-[12px] text-slate-500 sm:px-5">
        {transaction.description}
      </td>
      <td className="px-4 py-[15px] sm:px-5">
        <TransactionCategoryBadge category={transaction.category} />
      </td>
      <td
        className={`whitespace-nowrap px-4 py-[15px] text-right text-[12px] font-bold sm:px-5 ${amountTone}`}
      >
        {formatAmount(transaction.transactionType, transaction.amount)}
      </td>
      <td className="px-4 py-[15px] sm:px-5">
        {transaction.transactionType === "TRANSFER" &&
        transaction.amount > 0 ? (
          <span className="text-emerald-700">↔</span>
        ) : transaction.transactionType === "TRANSFER" &&
          transaction.amount < 0 ? (
          <span className="text-red-700">↔</span>
        ) : transaction.transactionType === "INCOME" ? (
          <span className="text-emerald-600">↗</span>
        ) : (
          <span className="text-red-700">↘</span>
        )}
      </td>
      <td className="px-4 py-[15px] sm:px-5">
        <button className="text-slate-500 hover:text-slate-700">
          <span className="text-base">✎</span>
        </button>
      </td>
      <td className="px-4 py-[15px] sm:px-5">
        <button className="text-slate-500 hover:text-slate-700">
          <span className="text-base">🗑</span>
        </button>
      </td>
    </tr>
  );
}
