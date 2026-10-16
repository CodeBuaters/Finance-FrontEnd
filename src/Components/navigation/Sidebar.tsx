import { NavLink } from "react-router-dom";
import { useUserContext } from "../../Context/userContextType";
import { getInitials } from "../../Utils/user";
import Logo from "./Logo";

type SidebarProps = {
  open: boolean;
  onClose: () => void;
};

export default function Sidebar({ open, onClose }: SidebarProps) {
  const { user } = useUserContext();
  const fullName = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();

  return (
    // Small screens: hidden, or floating over the page when open. Large screens (lg): always visible
    <aside
      className={`${open ? "fixed inset-y-0 left-0 z-50 flex" : "hidden"} w-[224px] shrink-0 flex-col border-r border-slate-200 bg-white lg:static lg:flex`}
    >
      <div className="flex h-[84px] items-center border-b border-slate-100 px-7">
        <Logo />
      </div>
      <nav className="flex-1 px-3 py-5">
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
            onClick={onClose}
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
            {getInitials(user)}
          </span>
          <div className="min-w-0">
            <p className="truncate text-[12px] font-semibold text-slate-800">
              {fullName || user?.username}
            </p>
            {user?.email && (
              <p className="truncate text-[11px] text-slate-400">{user.email}</p>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
