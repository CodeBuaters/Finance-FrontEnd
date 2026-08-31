import { Outlet } from "react-router-dom";
import Sidebar from "../Components/navigation/Sidebar";
import TopBar from "../Components/navigation/TopBar";

const AppLayout = () => {
  return (
    <div>
      <Sidebar />

      <div>
        <TopBar />

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
