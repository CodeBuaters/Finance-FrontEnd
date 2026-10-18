import { describe, expect, it } from "vitest";
import { getRecentMonthlySpending } from "../dashboardService";

const months = (...totals: number[]) =>
    totals.map((total, index) => ({
        month: `2026-${String(index + 1).padStart(2, "0")}`,
        total,
    }));

describe("getRecentMonthlySpending", () => {
    it("returns the last six months", () => {
        const result = getRecentMonthlySpending(months(1, 2, 3, 4, 5, 6, 7, 8));
        expect(result.map((month) => month.total)).toEqual([3, 4, 5, 6, 7, 8]);
    });

    it("drops the months before the first month with spending", () => {
        const result = getRecentMonthlySpending(months(0, 0, 0, 0, 0, 0, 0, 5, 0, 7));
        expect(result.map((month) => month.month)).toEqual([
            "2026-08",
            "2026-09",
            "2026-10",
        ]);
    });

    it("returns nothing when there has been no spending", () => {
        expect(getRecentMonthlySpending(months(0, 0, 0))).toEqual([]);
    });
});
