import { describe, expect, it } from "vitest";
import type { Transaction } from "../../Types/transaction";
import {
    getRecentMonthlySpending,
    getRecentTransactions,
} from "../dashboardService";

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

const transaction = (id: string, transactionDate: string) =>
    ({ id, transactionDate }) as Transaction;

describe("getRecentTransactions", () => {
    it("returns the newest transactions first, up to the limit", () => {
        const result = getRecentTransactions(
            [
                transaction("1", "2026-08-24"),
                transaction("2", "2026-08-28"),
                transaction("3", "2026-08-26"),
            ],
            2,
        );
        expect(result.map((t) => t.id)).toEqual(["2", "3"]);
    });

    it("puts the most recently added transaction first on the same day", () => {
        const result = getRecentTransactions(
            [transaction("4", "2026-08-27"), transaction("9", "2026-08-27")],
            6,
        );
        expect(result.map((t) => t.id)).toEqual(["9", "4"]);
    });

    it("does not reorder the original list", () => {
        const transactions = [
            transaction("1", "2026-08-24"),
            transaction("2", "2026-08-28"),
        ];
        getRecentTransactions(transactions, 6);
        expect(transactions.map((t) => t.id)).toEqual(["1", "2"]);
    });
});
