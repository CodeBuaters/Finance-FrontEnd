import { beforeEach, describe, expect, it, vi } from "vitest";
import { createFamily, getFamily, joinFamily, leaveFamily } from "../familyService";

const { mockGet, mockPost } = vi.hoisted(() => ({
    mockGet: vi.fn(),
    mockPost: vi.fn(),
}));

vi.mock("../api", () => ({
    api: {
        get: mockGet,
        post: mockPost,
    },
}));

const family = {
    id: 1,
    name: "Smith family",
    code: "K7P2XQ9M",
    members: [{ id: 7, firstName: "Anna", lastName: "Smith" }],
};

describe("familyService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns null when the user is not in a family", async () => {
        mockGet.mockResolvedValue({ data: "" });

        expect(await getFamily()).toBeNull();
        expect(mockGet).toHaveBeenCalledWith("/api/family");
    });

    it("returns the family with its code and members", async () => {
        mockGet.mockResolvedValue({ data: family });

        expect(await getFamily()).toEqual(family);
    });

    it("sends the name to create and the code to join", async () => {
        mockPost.mockResolvedValue({ data: family });

        await createFamily("Smith family");
        await joinFamily("k7p2xq9m");

        expect(mockPost).toHaveBeenCalledWith("/api/family", { name: "Smith family" });
        expect(mockPost).toHaveBeenCalledWith("/api/family/join", { code: "k7p2xq9m" });
    });

    it("sends a request to leave the family", async () => {
        mockPost.mockResolvedValue({});

        await leaveFamily();

        expect(mockPost).toHaveBeenCalledWith("/api/family/leave");
    });
});
