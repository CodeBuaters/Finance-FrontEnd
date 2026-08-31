import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div>
      <div>
        <div>
          <h1>FinSight</h1>
          <p>Understand your money.</p>
        </div>

        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
