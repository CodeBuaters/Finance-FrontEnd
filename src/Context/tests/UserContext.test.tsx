import { afterEach, describe, expect, it } from "vitest";
import {
  cleanup,
  render,
  screen,
  fireEvent,
  renderHook,
} from "@testing-library/react";
import { UserProvider } from "../UserContext";
import { useUserContext } from "../userContextType";
import type { User } from "../../Types/user";

function UserDisplay() {
  const { user } = useUserContext();

  return (
    <div>
      <span>{user?.username ?? "Ei kirjautunutta käyttäjää"}</span>
    </div>
  );
}

function SetUserButton() {
  const { setUser } = useUserContext();

  const testUser: User = {
    id: 7,
    username: "matti",
    firstName: "Matti",
    lastName: "Meikäläinen",
    email: "matti@example.com",
  };

  return <button onClick={() => setUser(testUser)}>Aseta käyttäjä</button>;
}

function LogoutButton() {
  const { logout } = useUserContext();

  return <button onClick={logout}>Kirjaudu ulos</button>;
}

afterEach(() => {
  cleanup();
  localStorage.clear();
});

describe("UserProvider", () => {
  it("loads the user from localStorage when it starts", () => {
    localStorage.setItem("FINSIGHT_ACCESS_TOKEN", "test-token");
    localStorage.setItem("username", "matti");
    localStorage.setItem("userId", "7");
    localStorage.setItem("firstName", "Matti");
    localStorage.setItem("lastName", "Meikäläinen");

    render(
      <UserProvider>
        <UserDisplay />
      </UserProvider>,
    );

    expect(screen.getByText("matti")).toBeTruthy();
  });

  it("stores the user in localStorage when setUser is called", () => {
    render(
      <UserProvider>
        <SetUserButton />
      </UserProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Aseta käyttäjä" }));

    expect(localStorage.getItem("username")).toBe("matti");
    expect(localStorage.getItem("userId")).toBe("7");
    expect(localStorage.getItem("firstName")).toBe("Matti");
    expect(localStorage.getItem("lastName")).toBe("Meikäläinen");
    expect(localStorage.getItem("userEmail")).toBe("matti@example.com");
  });

  it("clears the user and localStorage when logout is called", () => {
    localStorage.setItem("FINSIGHT_ACCESS_TOKEN", "test-token");
    localStorage.setItem("username", "matti");
    localStorage.setItem("userId", "7");
    localStorage.setItem("firstName", "Matti");
    localStorage.setItem("lastName", "Meikäläinen");
    localStorage.setItem("userEmail", "matti@example.com");

    render(
      <UserProvider>
        <UserDisplay />
        <LogoutButton />
      </UserProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Kirjaudu ulos" }));

    expect(screen.getByText("Ei kirjautunutta käyttäjää")).toBeTruthy();
    expect(localStorage.getItem("FINSIGHT_ACCESS_TOKEN")).toBeNull();
    expect(localStorage.getItem("username")).toBeNull();
    expect(localStorage.getItem("userId")).toBeNull();
    expect(localStorage.getItem("firstName")).toBeNull();
    expect(localStorage.getItem("lastName")).toBeNull();
    expect(localStorage.getItem("userEmail")).toBeNull();
  });
});

it("throws an error when used outside UserProvider", () => {
  expect(() => {
    renderHook(() => useUserContext());
  }).toThrow("useUserContext must be used within a UserProvider");
});
