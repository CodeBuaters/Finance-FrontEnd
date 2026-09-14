import { removeAccessToken, getAccessToken } from "../../Services/api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";


export default function TopBar() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(
    getAccessToken() !== null
  );

  const handleLogout = () => {
    removeAccessToken();
    setIsLoggedIn(false);
  }

  return (
    <div>
      <h1>Top Bar</h1>

      {isLoggedIn ? (
        <button onClick={handleLogout}>
          Logout
        </button>
      ) : (
        <button onClick={() => navigate("/login")}>
          Login
        </button>
      )}
    </div>
  );
}
