import { beforeEach, describe, expect, it, vi } from "vitest";
import { getUserByEmail, getUserById, updateProfile, changePassword, deleteAccount } from "../userService";

const { mockGet, mockPut, mockDelete } = vi.hoisted(() => ({
    mockGet: vi.fn(),
    mockPut: vi.fn(),
    mockDelete: vi.fn(),
}));

vi.mock("../api", () => ({
    api: {
        get: mockGet,
        put: mockPut,
        delete: mockDelete,
    },
}));



describe("userService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("gets a user by email and encodes the email in the URL", async () => {
        const user = {
            id: 1,
            username: "testuser",
            firstName: "Test",
            lastName: "User",
        };

        mockGet.mockResolvedValue({ data: user });

        const result = await getUserByEmail("test+user@example.com");

        expect(mockGet).toHaveBeenCalledWith(
            "/api/user/email/test%2Buser%40example.com",
        );
        expect(result).toEqual(user);
    });

    it("gets a user by ID", async () => {
        const user = {
            id: 7,
            username: "testuser",
            firstName: "Test",
            lastName: "User",
        };

        mockGet.mockResolvedValue({ data: user });

        const result = await getUserById(7);

        expect(mockGet).toHaveBeenCalledWith("/api/user/7");
        expect(result).toEqual(user);
    });

    it("updates the profile and returns the updated user", async () => {
        const user = {
            id: 7,
            username: "testuser",
            firstName: "New",
            lastName: "Name",
        };

        mockPut.mockResolvedValue({ data: user });

        const result = await updateProfile("New", "Name");

        expect(mockPut).toHaveBeenCalledWith("/api/profile", {
            firstName: "New",
            lastName: "Name",
        });
        expect(result).toEqual(user);
    });

    it("sends the current and new password when changing password", async () => {
        mockPut.mockResolvedValue({});

        await changePassword("old-password", "new-password");

        expect(mockPut).toHaveBeenCalledWith("/api/profile/password", {
            currentPassword: "old-password",
            newPassword: "new-password",
        });
    });

    it("sends a request to delete the account", async () => {
        mockDelete.mockResolvedValue({});

        await deleteAccount();

        expect(mockDelete).toHaveBeenCalledWith("/api/profile");
    });
});
