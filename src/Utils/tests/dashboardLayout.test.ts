import { describe, expect, it } from "vitest";
import {
    createDefaultLayout,
    moveWidget,
    normalizeLayout,
    setWidgetVisible,
    shiftWidget,
} from "../dashboardLayout";

const ids = (layout: ReturnType<typeof createDefaultLayout>) =>
    layout.widgets.map((widget) => widget.id);

describe("normalizeLayout", () => {
    it("returns the default layout when nothing is saved", () => {
        expect(normalizeLayout(null)).toEqual(createDefaultLayout());
        expect(normalizeLayout({ widgets: "nope" })).toEqual(createDefaultLayout());
    });

    it("keeps the saved order, visibility, size and settings", () => {
        const layout = normalizeLayout({
            version: 1,
            widgets: [
                { id: "recentTransactions", visible: true, size: "full", settings: { limit: 10 } },
                { id: "kpis", visible: false, size: "half", settings: {} },
                { id: "monthlySpending", visible: true, size: "half", settings: { months: 12 } },
                { id: "expensesByCategory", visible: true, size: "half", settings: {} },
            ],
        });

        expect(ids(layout)).toEqual([
            "recentTransactions",
            "kpis",
            "monthlySpending",
            "expensesByCategory",
        ]);
        expect(layout.widgets[0]).toEqual({
            id: "recentTransactions",
            visible: true,
            size: "full",
            settings: { limit: 10 },
        });
        expect(layout.widgets[1].visible).toBe(false);
        expect(layout.widgets[2].settings).toEqual({ months: 12 });
    });

    it("drops unknown and duplicate widgets and appends missing ones", () => {
        const layout = normalizeLayout({
            widgets: [
                { id: "removedWidget", visible: true },
                { id: "recentTransactions", visible: false },
                { id: "recentTransactions", visible: true },
            ],
        });

        expect(ids(layout)).toEqual([
            "recentTransactions",
            "kpis",
            "monthlySpending",
            "expensesByCategory",
        ]);
        expect(layout.widgets[0].visible).toBe(false);
        expect(layout.widgets.slice(1).every((widget) => widget.visible)).toBe(true);
    });

    it("replaces invalid values with the defaults", () => {
        const layout = normalizeLayout({
            widgets: [
                { id: "recentTransactions", visible: "yes", size: "huge", settings: { limit: 999 } },
            ],
        });

        expect(layout.widgets[0]).toEqual({
            id: "recentTransactions",
            visible: true,
            size: "half",
            settings: { limit: 6 },
        });
    });
});

describe("moveWidget", () => {
    it("moves a widget to the position of the target widget", () => {
        const layout = moveWidget(createDefaultLayout(), "recentTransactions", "kpis");

        expect(ids(layout)).toEqual([
            "recentTransactions",
            "kpis",
            "monthlySpending",
            "expensesByCategory",
        ]);
    });
});

describe("shiftWidget", () => {
    it("skips hidden widgets when moving up or down", () => {
        const layout = shiftWidget(
            setWidgetVisible(createDefaultLayout(), "monthlySpending", false),
            "expensesByCategory",
            -1,
        );

        expect(ids(layout)).toEqual([
            "expensesByCategory",
            "kpis",
            "monthlySpending",
            "recentTransactions",
        ]);
    });

    it("does nothing at the start or end of the list", () => {
        const layout = createDefaultLayout();

        expect(shiftWidget(layout, "kpis", -1)).toBe(layout);
        expect(shiftWidget(layout, "recentTransactions", 1)).toBe(layout);
    });
});
