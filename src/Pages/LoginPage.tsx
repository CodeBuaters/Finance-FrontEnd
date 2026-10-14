import { useState } from "react";
import type { LoginRequest } from "../Types/loginRequest";
import { loginUser } from "../Services/authService";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "../Context/userContextType";
import { getUserByEmail } from "../Services/userService";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser } = useUserContext();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const loginData: LoginRequest = {
      email,
      password,
    };

    try {
      await loginUser(loginData);
      try {
        const currentUser = await getUserByEmail(email);
        setUser(currentUser);
      } catch {
        setError("Login succeeded, but your user profile could not be loaded.");
      }
      navigate("/");
    } catch {
      setError("Invalid email or password");
    }
  };

  // Same style for both inputs
  const inputClass =
    "rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-normal outline-none focus:border-emerald-500";

  return (
    <div className="w-full max-w-sm rounded-2xl border border-slate-200 p-8 shadow-sm">
      <h1 className="text-xl font-bold text-slate-900">Welcome back</h1>
      <p className="mb-6 mt-1 text-[15px] tracking-tight text-slate-500">
        Sign in to your account
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>
        )}
        <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
          Email
          <input
            className={inputClass}
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
          Password
          <input
            className={inputClass}
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button
          className="mt-2 rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
          type="submit"
        >
          Sign in
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Don't have an account?{" "}
        <Link to="/register" className="font-semibold text-slate-900 hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}
