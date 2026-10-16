import { Outlet } from "react-router-dom";
import Logo from "../Components/navigation/Logo";

// Shared frame for Login and Register: logo top left, form centered
const AuthLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-white p-6">
      {/* 25% bigger than in the sidebar */}
      <div className="origin-top-left scale-125">
        <Logo />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-6">
        <p className="text-lg font-medium tracking-tight text-slate-600">
          Understand your money.
        </p>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
