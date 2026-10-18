import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import TransactionsPage from "../TransactionsPage";
import type { Transaction } from "../../Types/transaction";

const transaction = (
    id: string,
    category: Transaction["category"],
): Transaction =>
    ({
        id,
        amount: -10,
        transactionDate: "2026-10-18",
        merchant: `Shop ${id}`,
        transactionType: "EXPENSE",
        category,
    }) as Transaction;

afterEach(() => {
    cleanup();
});

describe("TransactionsPage", () => {
    it("opens when a transaction has no category", () => {
        render(
            <TransactionsPage
                transactions={[
                    transaction("1", null),
                    transaction("2", { id: 1, name: "Food", default: true }),
                ]}
            />,
        );

        expect(screen.getByText("All transactions")).toBeTruthy();
        expect(screen.getByText("Shop 1")).toBeTruthy();
    });

    it("lists each category once in the category filter", () => {
        render(
            <TransactionsPage
                transactions={[
                    transaction("1", { id: 1, name: "Food", default: true }),
                    transaction("2", { id: 1, name: "Food", default: true }),
                    transaction("3", { id: 2, name: "Housing", default: true }),
                ]}
            />,
        );

        expect(screen.getAllByRole("option", { name: "Food" })).toHaveLength(1);
        expect(screen.getAllByRole("option", { name: "Housing" })).toHaveLength(1);
    });
});
