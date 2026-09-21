interface TransactionsPaginationProps {
  count: number;
}

export default function TransactionsPagination({
  count,
}: TransactionsPaginationProps) {
  return (
    <div className="flex items-center justify-between border-t border-slate-100 bg-white px-4 py-3 text-[11px] text-slate-400 sm:px-5">
      <span>Showing {count} transactions</span>
      <div className="flex items-center gap-1">
        <button className="grid h-7 w-7 place-items-center rounded border border-slate-200 text-slate-400">
          ‹
        </button>
        <button className="grid h-7 w-7 place-items-center rounded bg-emerald-500 text-white">
          1
        </button>
        <button className="grid h-7 w-7 place-items-center rounded border border-slate-200 text-slate-400">
          ›
        </button>
      </div>
    </div>
  );
}
