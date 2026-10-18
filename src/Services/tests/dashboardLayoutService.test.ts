import { beforeEach, describe, expect, it, vi } from "vitest";
import {
    getDashboardLayout,
    saveDashboardLayout,
} from "../dashboardLayoutService";
import { createDefaultLayout } from "../../Utils/dashboardLayout";

const { mockGet, mockPut } = vi.hoisted(() => ({
    mockGet: vi.fn(),
    mockPut: vi.fn(),
}));

vi.mock("../api", () => ({
    api: {
        get: mockGet,
        put: mockPut,
    },
}));

describe("dashboardLayoutService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns null when the dashboard has not been customized", async () => {
        mockGet.mockResolvedValue({ status: 204, data: "" });

        expect(await getDashboardLayout()).toBeNull();
        expect(mockGet).toHaveBeenCalledWith("/api/profile/dashboard");
    });

    it("returns the saved layout", async () => {
        const layout = createDefaultLayout();
        mockGet.mockResolvedValue({ status: 200, data: layout });

        expect(await getDashboardLayout()).toEqual(layout);
    });

    it("saves the layout with PUT", async () => {
        const layout = createDefaultLayout();
        mockPut.mockResolvedValue({ status: 200, data: layout });

        await saveDashboardLayout(layout);

        expect(mockPut).toHaveBeenCalledWith("/api/profile/dashboard", layout);
    });
});
