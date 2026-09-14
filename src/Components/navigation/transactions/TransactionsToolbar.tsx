import type { Category } from "../../../Types/category";
import type { Transaction } from "../../../Types/transaction";

type TransactionFilter = "ALL" | Transaction["type"];

interface TransactionsToolbarProps {
  query: string;
  type: TransactionFilter;
  category: string;
  categories: Array<Category | "OTHER">;
  onQueryChange: (query: string) => void;
  onTypeChange: (type: TransactionFilter) => void;
  onCategoryChange: (category: string) => void;
}

export default function TransactionsToolbar({
  query,
  type,
  category,
  categories,
  onQueryChange,
  onTypeChange,
  onCategoryChange,
}: TransactionsToolbarProps) {
  return (
    <div className="mb-4 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-[0_2px_8px_rgba(15,23,42,0.03)] sm:flex-row">
      <label className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-lg border border-slate-200 px-3 text-slate-400">
        <span className="text-base">⌕</span>
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          className="w-full text-[12px] outline-none placeholder:text-slate-400"
          placeholder="Search transactions..."
        />
      </label>
      <select
        value={type}
        onChange={(event) =>
          onTypeChange(event.target.value as TransactionFilter)
        }
        className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-[12px] text-slate-600 outline-none"
      >
        <option value="ALL">All</option>
        <option value="INCOME">Income</option>
        <option value="EXPENSE">Expense</option>
        <option value="TRANSFER">Transfer</option>
      </select>
      <select
        value={category}
        onChange={(event) => onCategoryChange(event.target.value)}
        className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-[12px] text-slate-600 outline-none"
      >
        <option>All</option>
        {categories.map((itemCategory) => (
          <option key={itemCategory}>{itemCategory}</option>
        ))}
      </select>
    </div>
  );
}
