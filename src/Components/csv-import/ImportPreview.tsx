import {
  getImportStatus,
  type ImportedTransaction,
} from "../../Types/importedTransaction";
import ImportPreviewRow from "./ImportPreviewRow";
import StatusBadge from "./StatusBadge";

interface ImportPreviewProps {
  transactions: ImportedTransaction[];
  saving: boolean;
  saved: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ImportPreview({
  transactions,
  saving,
  saved,
  onConfirm,
  onCancel,
}: ImportPreviewProps) {
  const categorized = transactions.filter(
    (transaction) => getImportStatus(transaction) === "categorized",
  ).length;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_1px_4px_rgba(0,0,0,0.05)] overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-800">
          Imported Transactions
        </p>
        <div className="flex items-center gap-3">
          <StatusBadge status="categorized" count={categorized} />
          <StatusBadge
            status="needs-review"
            count={transactions.length - categorized}
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead className="bg-slate-50/60">
            <tr>
              {["Date", "Merchant", "Category", "Amount", "Status"].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3 text-left text-xs font-medium text-slate-400 last:text-right"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <ImportPreviewRow key={index} transaction={transaction} />
            ))}
          </tbody>
        </table>
      </div>
      {transactions.length === 0 && (
        <p className="px-5 py-10 text-center text-sm text-slate-400">
          The file didn't contain any transactions.
        </p>
      )}
      {!saved && transactions.length > 0 && (
        <div className="px-5 py-4 border-t border-slate-100 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 rounded-xl transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={saving}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-60"
          >
            {saving ? "Saving..." : `Save ${transactions.length} transactions`}
          </button>
        </div>
      )}
    </div>
  );
}
