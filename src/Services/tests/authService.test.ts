import { beforeEach, describe, expect, it, vi } from "vitest";
import { loginUser, logoutUser, registerUser } from "../authService";

const { mockPost, mockSetAccessToken } = vi.hoisted(() => ({
    mockPost: vi.fn(),
    mockSetAccessToken: vi.fn(),
}));

vi.mock("../api", () => ({
    api: {
        post: mockPost,
    },
    setAccessToken: mockSetAccessToken,
}));


describe("loginUser", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("sends login request and saves access token", async () => {
        mockPost.mockResolvedValue({
            data: { accessToken: "test-token" },
        });

        const data = {
            email: "test@example.com",
            password: "password123",
        };

        await loginUser(data);

        expect(mockPost).toHaveBeenCalledWith("/api/auth/login", data);
        expect(mockSetAccessToken).toHaveBeenCalledWith("test-token");
    });
});


it("throws an error when access token is missing", async () => {
    mockPost.mockResolvedValue({
        data: {},
    });

    const data = {
        email: "test@example.com",
        password: "password123",
    };

    await expect(loginUser(data)).rejects.toThrow(
        "Invalid email or password",
    );

    expect(mockSetAccessToken).not.toHaveBeenCalled();
});


it("throws an error when access token is empty", async () => {
    mockPost.mockResolvedValue({
        data: { accessToken: "" },
    });

    const data = {
        email: "test@example.com",
        password: "password123",
    };

    await expect(loginUser(data)).rejects.toThrow(
        "Invalid email or password",
    );

    expect(mockSetAccessToken).not.toHaveBeenCalled();
});


describe("logoutUser", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("sends logout request", async () => {
        mockPost.mockResolvedValue({});

        await logoutUser();

        expect(mockPost).toHaveBeenCalledWith("/api/auth/logout");
    });
});



describe("registerUser", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("sends registration request and returns response", async () => {
        const data = {
            username: "testuser",
            firstName: "Test",
            lastName: "User",
            email: "test@example.com",
            password: "password123",
        };

        const mockResponse = {
            data: { message: "User registered successfully" },
        };

        mockPost.mockResolvedValue(mockResponse);

        const result = await registerUser(data);

        expect(mockPost).toHaveBeenCalledWith(
            "/api/auth/register",
            data,
        );
        expect(result).toBe(mockResponse);
    });
});
