import { Info } from "lucide-react";

const COLUMNS = [
  { name: "amount", required: true },
  { name: "merchant", required: true },
  { name: "date", required: false },
  { name: "description", required: false },
  { name: "type", required: false },
  { name: "category", required: false },
];

export default function CsvFormatHint() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_1px_4px_rgba(0,0,0,0.05)] p-5 flex gap-3">
      <Info size={16} className="text-slate-400 shrink-0 mt-0.5" />
      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-800 mb-1">CSV format</p>
        <p className="text-xs text-slate-500 mb-3">
          The first row must be a header. Dates use YYYY-MM-DD, and the type is
          INCOME, EXPENSE or TRANSFER. Without a type, the sign of the amount
          decides it.
        </p>
        <div className="flex flex-wrap gap-2">
          {COLUMNS.map(({ name, required }) => (
            <code
              key={name}
              className={`px-2 py-0.5 rounded-md text-[11px] ${required ? "bg-emerald-50 text-emerald-700 font-semibold" : "bg-slate-100 text-slate-500"}`}
            >
              {name}
              {required && " *"}
            </code>
          ))}
        </div>
      </div>
    </div>
  );
}
