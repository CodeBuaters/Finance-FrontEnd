import { useCallback, useState } from "react";
import type { User } from "../Types/user";
import { UserContext, type UserContextType } from "./userContextType";

function getStoredUser(): User | null {
  const accessToken = localStorage.getItem("FINSIGHT_ACCESS_TOKEN");
  const username = localStorage.getItem("username");
  const userId = localStorage.getItem("userId");
  const firstName = localStorage.getItem("firstName");
  const lastName = localStorage.getItem("lastName");
  const email = localStorage.getItem("userEmail");

  if (!accessToken || !username || !userId) {
    return null;
  }

  return {
    id: Number(userId),
    username,
    email: email || undefined,
    firstName: firstName || "",
    lastName: lastName || "",
  };
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(getStoredUser);

  const setUser = (nextUser: User | null) => {
    setUserState(nextUser);

    if (nextUser) {
      localStorage.setItem("username", nextUser.username);
      localStorage.setItem("userId", String(nextUser.id));
      if (nextUser.firstName) {
        localStorage.setItem("firstName", nextUser.firstName);
      } else {
        localStorage.removeItem("firstName");
      }
      if (nextUser.lastName) {
        localStorage.setItem("lastName", nextUser.lastName);
      } else {
        localStorage.removeItem("lastName");
      }
      if (nextUser.email) {
        localStorage.setItem("userEmail", nextUser.email);
      } else {
        localStorage.removeItem("userEmail");
      }
    }
  };

  const logout = useCallback(() => {
    setUserState(null);
    localStorage.removeItem("FINSIGHT_ACCESS_TOKEN");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    localStorage.removeItem("userEmail");
  }, []);

  const contextValue: UserContextType = { user, setUser, logout };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}
