import { CheckCircle, AlertCircle } from "lucide-react";
import type { ImportStatus } from "../../Types/importedTransaction";

export default function StatusBadge({
  status,
  count,
}: {
  status: ImportStatus;
  count?: number;
}) {
  const prefix = count === undefined ? "" : `${count} `;
  if (status === "categorized") {
    return (
      <span className="inline-flex items-center gap-1.5 whitespace-nowrap px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full">
        <CheckCircle size={11} /> {prefix}Categorized
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-full">
      <AlertCircle size={11} /> {prefix}Needs Review
    </span>
  );
}
