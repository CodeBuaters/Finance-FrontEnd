import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Components/navigation/Sidebar";
import TopBar from "../Components/navigation/TopBar";

const AppLayout = () => {
  // Menu on small screens (hamburger): open or closed
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#eef2f6] text-slate-900">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* Dark background behind the open menu. Click on it closes the menu */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <div className="min-w-0 flex-1">
        <TopBar onMenuClick={() => setMenuOpen(true)} />

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
