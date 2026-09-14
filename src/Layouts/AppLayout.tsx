import { Outlet } from "react-router-dom";
import Sidebar from "../Components/navigation/Sidebar";
import TopBar from "../Components/navigation/TopBar";

const AppLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#eef2f6] text-slate-900">
      <Sidebar />

      <div className="min-w-0 flex-1">
        <TopBar />

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
