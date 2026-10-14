import {
  getImportStatus,
  type ImportedTransaction,
} from "../../Types/importedTransaction";
import { formatSignedAmount } from "../../Utils/currency";
import TransactionCategoryBadge from "../transactions/TransactionCategoryBadge";
import StatusBadge from "./StatusBadge";

export default function ImportPreviewRow({
  transaction,
}: {
  transaction: ImportedTransaction;
}) {
  const amountTone =
    transaction.transactionType === "INCOME"
      ? "text-emerald-600"
      : "text-slate-800";
  return (
    <tr className="border-t border-slate-50 hover:bg-slate-50/50 transition-colors">
      <td className="whitespace-nowrap px-5 py-3.5 text-xs text-slate-500">
        {transaction.transactionDate}
      </td>
      <td className="px-5 py-3.5 text-sm font-medium text-slate-800">
        {transaction.merchant}
      </td>
      <td className="px-5 py-3.5">
        <TransactionCategoryBadge category={transaction.category} />
      </td>
      <td
        className={`whitespace-nowrap px-5 py-3.5 text-sm font-semibold ${amountTone}`}
      >
        {formatSignedAmount(transaction.transactionType, transaction.amount)}
      </td>
      <td className="px-5 py-3.5 text-right">
        <StatusBadge status={getImportStatus(transaction)} />
      </td>
    </tr>
  );
}
