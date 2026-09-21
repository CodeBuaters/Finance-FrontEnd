import { CheckCircle, AlertCircle } from "lucide-react";

export default function StatusBadge({
  status,
  count,
}: {
  status: "categorized" | "needs-review";
  count: number;
}) {
  if (status === "categorized") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full">
        <CheckCircle size={11} /> {count} Categorized
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-full">
      <AlertCircle size={11} /> {count} Needs Review
    </span>
  );
}
