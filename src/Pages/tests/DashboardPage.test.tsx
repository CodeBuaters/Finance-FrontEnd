import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import DashboardPage from "../DashboardPage";
import type { DashboardLayout } from "../../Types/dashboardLayout";
import { createDefaultLayout, setWidgetVisible } from "../../Utils/dashboardLayout";

const { mockGetLayout, mockSaveLayout } = vi.hoisted(() => ({
    mockGetLayout: vi.fn(),
    mockSaveLayout: vi.fn(),
}));

vi.mock("../../Services/dashboardLayoutService", () => ({
    getDashboardLayout: mockGetLayout,
    saveDashboardLayout: mockSaveLayout,
}));

vi.mock("../../Context/userContextType", () => ({
    useUserContext: () => ({ user: { id: 1, firstName: "Matti" } }),
}));

// The widgets themselves are tested separately; here only the layout matters
const notLoaded = { data: null, error: null, isLoading: true };
vi.mock("../../Hooks/useMonthlySpending", () => ({ useMonthlySpending: () => notLoaded }));
vi.mock("../../Hooks/useTransactions", () => ({ useTransactions: () => notLoaded }));
vi.mock("../../Hooks/useExpensesByCategory", () => ({ useExpensesByCategory: () => notLoaded }));
vi.mock("../../Hooks/useDashboardKpis", () => ({
    useDashboardKpis: () => ({ kpis: null, error: null, isLoading: true }),
}));
vi.mock("../../Components/dashboard/DashboardWidget", () => ({
    default: ({ widget }: { widget: { id: string } }) => (
        <div data-testid="widget">{widget.id}</div>
    ),
}));

const shownWidgets = () =>
    screen.queryAllByTestId("widget").map((widget) => widget.textContent);

afterEach(() => {
    cleanup();
});

describe("DashboardPage customization", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockGetLayout.mockResolvedValue(null);
        mockSaveLayout.mockResolvedValue(undefined);
    });

    it("shows the default widgets when the dashboard has not been customized", async () => {
        render(<DashboardPage />);

        await screen.findByRole("button", { name: /customize/i });
        expect(shownWidgets()).toEqual([
            "kpis",
            "monthlySpending",
            "expensesByCategory",
            "recentTransactions",
        ]);
    });

    it("shows the saved layout", async () => {
        mockGetLayout.mockResolvedValue(
            setWidgetVisible(createDefaultLayout(), "kpis", false),
        );

        render(<DashboardPage />);

        await screen.findByRole("button", { name: /customize/i });
        expect(shownWidgets()).toEqual([
            "monthlySpending",
            "expensesByCategory",
            "recentTransactions",
        ]);
    });

    it("saves the customized layout", async () => {
        render(<DashboardPage />);

        fireEvent.click(await screen.findByRole("button", { name: /customize/i }));
        fireEvent.click(screen.getByRole("button", { name: "Hide Recent Transactions" }));
        fireEvent.click(screen.getByRole("button", { name: "Move Expenses by Category up" }));
        fireEvent.change(screen.getByRole("combobox", { name: "Months" }), {
            target: { value: "12" },
        });
        fireEvent.click(screen.getByRole("button", { name: "Save" }));

        await screen.findByRole("button", { name: /customize/i });
        const saved: DashboardLayout = mockSaveLayout.mock.calls[0][0];
        expect(saved.widgets.map((widget) => [widget.id, widget.visible])).toEqual([
            ["kpis", true],
            ["expensesByCategory", true],
            ["monthlySpending", true],
            ["recentTransactions", false],
        ]);
        expect(saved.widgets[2].settings).toEqual({ months: 12 });
        expect(shownWidgets()).toEqual(["kpis", "expensesByCategory", "monthlySpending"]);
    });

    it("can show a hidden widget again", async () => {
        mockGetLayout.mockResolvedValue(
            setWidgetVisible(createDefaultLayout(), "kpis", false),
        );
        render(<DashboardPage />);

        fireEvent.click(await screen.findByRole("button", { name: /customize/i }));
        fireEvent.click(screen.getByRole("button", { name: "Key figures" }));

        expect(screen.queryByText("Hidden widgets:")).toBeNull();
        expect(shownWidgets()).toContain("kpis");
    });

    it("keeps the changes in customize mode when saving fails", async () => {
        mockSaveLayout.mockRejectedValue(new Error("Network error"));
        render(<DashboardPage />);

        fireEvent.click(await screen.findByRole("button", { name: /customize/i }));
        fireEvent.click(screen.getByRole("button", { name: "Hide Key figures" }));
        fireEvent.click(screen.getByRole("button", { name: "Save" }));

        expect(await screen.findByText(/could not save your dashboard/i)).toBeTruthy();
        expect(screen.getByRole("button", { name: "Save" })).toBeTruthy();
        expect(shownWidgets()).not.toContain("kpis");
    });

    it("discards the changes when cancelling", async () => {
        render(<DashboardPage />);

        fireEvent.click(await screen.findByRole("button", { name: /customize/i }));
        fireEvent.click(screen.getByRole("button", { name: "Hide Key figures" }));
        fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

        expect(mockSaveLayout).not.toHaveBeenCalled();
        expect(shownWidgets()).toContain("kpis");
    });
});
