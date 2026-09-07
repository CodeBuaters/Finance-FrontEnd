export default function TopBar() {
  return (
    <header className="flex h-[84px] items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-8">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-600">
          Personal finance
        </p>
        <h1 className="mt-1 text-[18px] font-bold tracking-[-0.03em] text-slate-950">
          Transactions
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <label className="hidden h-10 w-[205px] items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-[12px] text-slate-400 sm:flex">
          <span className="text-base">⌕</span>
          <input
            className="w-full bg-transparent outline-none placeholder:text-slate-400"
            placeholder="Search transactions..."
          />
        </label>
        <button
          aria-label="Notifications"
          className="relative grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-sm text-slate-500 hover:bg-slate-50"
        >
          ♧
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
        </button>
        <div className="hidden items-center gap-2 sm:flex">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-cyan-500 text-[10px] font-bold text-white">
            SL
          </span>
          <span className="text-[12px] font-semibold text-slate-700">
            Sofia
          </span>
          <span className="text-xs text-slate-400">⌄</span>
        </div>
      </div>
    </header>
  );
}
