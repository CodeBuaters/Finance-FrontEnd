import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../Context/userContextType";
import {
  changePassword,
  deleteAccount,
  updateProfile,
} from "../Services/userService";

export default function SettingsPage() {
  const { user, setUser, logout } = useUserContext();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [message, setMessage] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      // Saves the new name also in the context, so the whole app shows it right away
      setUser(await updateProfile(firstName, lastName));
      setMessage("Profile updated!");
    } catch {
      setMessage("Could not update profile.");
    }
  };

  const handlePasswordSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordMessage("New passwords do not match.");
      return;
    }
    try {
      await changePassword(currentPassword, newPassword);
      setPasswordMessage("Password changed!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setPasswordMessage("Current password is wrong.");
    }
  };

  const handleDeleteAccount = async () => {
    // Browser popup: OK = delete, Cancel = do nothing
    if (!window.confirm("Are you sure you want to delete your account? This cannot be undone.")) {
      return;
    }
    try {
      await deleteAccount();
      logout();
      navigate("/login");
    } catch {
      alert("Could not delete account.");
    }
  };

  // Shared styles: white card, input, button
  const card = "flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6";
  const input =
    "rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500";
  const button = "rounded-lg py-2.5 text-sm font-semibold text-white";

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6">
      <h1 className="text-center text-2xl font-bold">Settings</h1>

      <form onSubmit={handleSubmit} className={card}>
        <h2 className="font-semibold">Profile</h2>
        {message && <p className="text-sm text-slate-500">{message}</p>}
        <input
          className={input}
          placeholder="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          className={input}
          placeholder="Last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <button className={`${button} bg-emerald-600 hover:bg-emerald-700`} type="submit">
          Save
        </button>
      </form>

      <form onSubmit={handlePasswordSubmit} className={card}>
        <h2 className="font-semibold">Change password</h2>
        {passwordMessage && <p className="text-sm text-slate-500">{passwordMessage}</p>}
        <input
          className={input}
          type="password"
          placeholder="Current password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
        {/* minLength: the browser asks for at least 8 characters */}
        <input
          className={input}
          type="password"
          placeholder="New password (min 8 characters)"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          minLength={8}
          required
        />
        <input
          className={input}
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button className={`${button} bg-emerald-600 hover:bg-emerald-700`} type="submit">
          Change password
        </button>
      </form>

      <div className={card}>
        <h2 className="font-semibold text-red-600">Delete account</h2>
        <p className="text-sm text-slate-500">
          Your account, transactions and budgets will be deleted permanently.
        </p>
        <button className={`${button} bg-red-600 hover:bg-red-700`} onClick={handleDeleteAccount}>
          Delete my account
        </button>
      </div>
    </div>
  );
}
