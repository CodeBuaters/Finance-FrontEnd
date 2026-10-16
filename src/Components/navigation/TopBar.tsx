import { removeAccessToken, getAccessToken } from "../../Services/api";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../Context/userContextType";
import { logoutUser } from "../../Services/authService";
import { getInitials } from "../../Utils/user";

export default function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const navigate = useNavigate();

  const { user, logout } = useUserContext();
  const isLoggedIn = getAccessToken() !== null;
  const username = user?.username || localStorage.getItem("username") || "User";

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {
      // Ignore failures (e.g. token already expired) - still clear local session below.
    }
    removeAccessToken();
    logout();
    navigate("/login");
  };

  return (
    <header className="flex h-[84px] items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-8">
      <div className="flex items-center gap-4">
        {/* Hamburger button, only on small screens */}
        <button aria-label="Open menu" className="text-2xl lg:hidden" onClick={onMenuClick}>
          ☰
        </button>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-600">
            Personal finance
          </p>
          <h1 className="mt-1 text-[18px] font-bold tracking-[-0.03em] text-slate-950">
            Transactions
          </h1>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <div className="hidden items-center gap-2 sm:flex">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-cyan-500 text-[10px] font-bold text-white">
              {getInitials(user)}
            </span>
            <span className="text-[12px] font-semibold text-slate-700">
              {username}
            </span>

            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <button onClick={() => navigate("/login")}>Login</button>
        )}
      </div>
    </header>
  );
}
