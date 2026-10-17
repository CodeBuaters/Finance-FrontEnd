import { useState } from "react";
import type { RegisterRequest } from "../Types/registerRequest";
import { registerUser } from "../Services/authService";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterPage() {

  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const registerData: RegisterRequest = {
      username,
      firstName,
      lastName,
      email,
      password
    };

    try {
      const response = await registerUser(registerData);
      //console.log testausta varten
      console.log(response);
      navigate("/login");
    } catch {
      setError("Username or email is already in use!")
    }

  };

  // Same styles as on the login page
  const labelClass = "flex flex-col gap-1.5 text-sm font-medium text-slate-700";
  const inputClass =
    "rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-normal outline-none focus:border-emerald-500";

  return (
    <div className="w-full max-w-sm rounded-2xl border border-slate-200 p-8 shadow-sm">
      <h1 className="text-xl font-bold text-slate-900">Create an account</h1>
      <p className="mb-6 mt-1 text-[15px] tracking-tight text-slate-500">
        Start tracking your money
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>
        )}
        <label className={labelClass}>
          Username
          <input
            className={inputClass}
            type="text"
            placeholder="johndoe"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        {/* First and last name side by side */}
        <div className="grid grid-cols-2 gap-3">
          <label className={labelClass}>
            First name
            <input
              className={inputClass}
              type="text"
              placeholder="John"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </label>
          <label className={labelClass}>
            Last name
            <input
              className={inputClass}
              type="text"
              placeholder="Doe"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </label>
        </div>
        <label className={labelClass}>
          Email
          <input
            className={inputClass}
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className={labelClass}>
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
          Create account
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-slate-900 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
