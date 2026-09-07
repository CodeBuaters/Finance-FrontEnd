import type { Transaction } from "../../../Types/transaction";
import TransactionCategoryBadge from "./TransactionCategoryBadge";

const formatAmount = (amount: number) =>
  `${amount > 0 ? "+" : ""}$${Math.abs(amount).toFixed(2)}`;

export default function TransactionRow({
  transaction,
}: {
  transaction: Transaction;
}) {
  const amountTone =
    transaction.type === "INCOME"
      ? "text-emerald-600"
      : transaction.type === "TRANSFER"
        ? "text-slate-500"
        : "text-slate-800";
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
        {formatAmount(transaction.amount)}
      </td>
    </tr>
  );
}
