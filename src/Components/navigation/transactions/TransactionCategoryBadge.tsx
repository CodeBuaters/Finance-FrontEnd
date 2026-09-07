import type { Category } from "../../../Types/category";

const categoryTone: Record<Category, string> = {
  FOOD: "bg-amber-100 text-amber-700",
  TRANSPORTATION: "bg-blue-100 text-blue-700",
  HOUSING: "bg-violet-100 text-violet-700",
  UTILITIES: "bg-indigo-100 text-indigo-700",
  ENTERTAINMENT: "bg-pink-100 text-pink-600",
  SHOPPING: "bg-orange-100 text-orange-700",
  HEALTHCARE: "bg-teal-100 text-teal-700",
  EDUCATION: "bg-cyan-100 text-cyan-700",
  SALARY: "bg-emerald-100 text-emerald-700",
  TRAVEL: "bg-sky-100 text-sky-700",
  TRANSFER: "bg-slate-100 text-slate-700",
  OTHER: "bg-gray-100 text-gray-700",
};

export default function TransactionCategoryBadge({
  category,
}: {
  category?: Category | "OTHER";
}) {
  const label = category ?? "OTHER";
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${categoryTone[label]}`}
    >
      {label}
    </span>
  );
}
