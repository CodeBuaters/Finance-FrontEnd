import { NavLink } from "react-router-dom";
import { useUserContext } from "../../Context/userContextType";

export default function Sidebar() {
  const user = useUserContext();
  const firstName = user.user?.firstName || "Sofia";
  const lastName = user.user?.lastName || "Larsson";
  const email = user.user?.email || "";

  return (
    <aside className="hidden w-[224px] shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
      <div className="flex h-[84px] items-center gap-2.5 border-b border-slate-100 px-7">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500 text-white shadow-sm">
          <span className="text-lg font-bold">↗</span>
        </span>
        <span className="text-[17px] font-bold tracking-[-0.04em] text-slate-950">
          FinSight
        </span>
      </div>
      <nav className="flex-1 px-3 py-5">
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
          Workspace
        </p>
        {[
          ["▦", "Dashboard", "/"],
          ["↔", "Transactions", "/transactions"],
          ["◔", "Budgets", "/budgets"],
          ["◇", "Categories", "/categories"],
          ["↥", "Import CSV", "/import-csv"],
          ["⚙", "Settings", "/settings"],
        ].map(([icon, label, path]) => (
          <NavLink
            key={label}
            to={path}
            end={path === "/"}
            className={({ isActive }) =>
              `mb-1 flex h-10 items-center gap-3 rounded-lg px-3 text-[13px] font-medium transition-colors ${isActive ? "bg-emerald-50 text-emerald-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`
            }
          >
            <span className="w-4 text-center text-[17px] leading-none text-current">
              {icon}
            </span>
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-slate-100 p-5">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-cyan-500 text-[11px] font-bold text-white">
            SL
          </span>
          <div className="min-w-0">
            <p className="truncate text-[12px] font-semibold text-slate-800">
              {firstName || "Sofia"} {lastName || "Larsson"}
            </p>
            <p className="truncate text-[11px] text-slate-400">
              {email || "example@example.com"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
