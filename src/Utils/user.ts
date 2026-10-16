import type { User } from "../Types/user";

// First letters of first and last name, falling back to the username's first letter
export const getInitials = (user: User | null) => {
  const initials = `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`;
  return (initials || user?.username?.[0] || "?").toUpperCase();
};
