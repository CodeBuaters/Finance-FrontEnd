import { useState } from "react";
import { CheckCircle, AlertCircle } from "lucide-react";
import StatusBadge from "./StatusBadge";
import TransactionCategoryBadge from "..transactions/TransactionCategoryBadge";

export default function ImportPreview() {
  const [phase, setPhase] = useState<"idle" | "uploading" | "done">("done");
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_1px_4px_rgba(0,0,0,0.05)] p-6">
      <h2 className="text-base font-semibold text-slate-900 mb-1">
        Import bank transactions
      </h2>
      <p className="text-sm text-slate-500 mb-5">
        Upload a CSV export from your bank. We'll automatically categorize your
        transactions.
      </p>

      {phase === "done" && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_1px_4px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-800">
              Imported Transactions
            </p>
            <div className="flex items-center gap-3">
              <StatusBadge status="categorized" count={4} />
              <StatusBadge status="needs-review" count={2} />
            </div>
          </div>
          <table className="w-full">
            <thead className="bg-slate-50/60">
              <tr>
                {["Date", "Merchant", "Category", "Amount", "Status"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-xs font-medium text-slate-400 last:text-right"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {DEMO_ROWS.map((row) => (
                <tr
                  key={row.id}
                  className="border-t border-slate-50 hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-5 py-3.5 text-xs text-slate-500">
                    {row.date}
                  </td>
                  <td className="px-5 py-3.5 text-sm font-medium text-slate-800">
                    {row.merchant}
                  </td>
                  <td className="px-5 py-3.5">
                    <TransactionCategoryBadge category={row.category} />
                  </td>
                  <td
                    className={`px-5 py-3.5 text-sm font-semibold ${row.amount > 0 ? "text-emerald-600" : "text-slate-800"}`}
                  >
                    {row.amount > 0 ? "+" : ""}$
                    {Math.abs(row.amount).toFixed(2)}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    {row.status === "categorized" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full">
                        <CheckCircle size={11} /> Categorized
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-full">
                        <AlertCircle size={11} /> Needs Review
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
