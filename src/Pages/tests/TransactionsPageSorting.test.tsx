import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import TransactionsPage from "../TransactionsPage";
import type { Transaction } from "../../Types/transaction";

const transaction = (
    id: string,
    transactionDate: string,
    overrides: Partial<Transaction> = {},
): Transaction =>
    ({
        id,
        amount: -10,
        transactionDate,
        merchant: `Shop ${id}`,
        transactionType: "EXPENSE",
        category: null,
        ...overrides,
    }) as Transaction;

// Merchant names of the table body rows, top to bottom
const merchantOrder = () => {
    const [, tbody] = screen.getAllByRole("rowgroup");
    return within(tbody)
        .getAllByRole("row")
        .map((row) => within(row).getAllByRole("cell")[1].textContent);
};

const sortButton = () => screen.getByRole("button", { name: /date/i });

afterEach(() => {
    cleanup();
});

describe("TransactionsPage date sorting", () => {
    const transactions = [
        transaction("mid", "2026-05-10"),
        transaction("old", "2025-12-31"),
        transaction("new", "2026-10-18"),
    ];

    it("shows the newest transactions first by default", () => {
        render(<TransactionsPage transactions={transactions} />);

        expect(merchantOrder()).toEqual(["Shop new", "Shop mid", "Shop old"]);
        expect(sortButton().textContent).toContain("↓");
    });

    it("shows the oldest transactions first after clicking the date header", () => {
        render(<TransactionsPage transactions={transactions} />);

        fireEvent.click(sortButton());

        expect(merchantOrder()).toEqual(["Shop old", "Shop mid", "Shop new"]);
        expect(sortButton().textContent).toContain("↑");
    });

    it("goes back to newest first after clicking the date header twice", () => {
        render(<TransactionsPage transactions={transactions} />);

        fireEvent.click(sortButton());
        fireEvent.click(sortButton());

        expect(merchantOrder()).toEqual(["Shop new", "Shop mid", "Shop old"]);
        expect(sortButton().textContent).toContain("↓");
    });

    it("sorts by time when transactions share a date", () => {
        render(
            <TransactionsPage
                transactions={[
                    transaction("morning", "2026-10-18T08:00:00"),
                    transaction("evening", "2026-10-18T20:00:00"),
                    transaction("noon", "2026-10-18T12:00:00"),
                ]}
            />,
        );

        expect(merchantOrder()).toEqual([
            "Shop evening",
            "Shop noon",
            "Shop morning",
        ]);
    });

    it("keeps the sort order when the list is filtered", () => {
        render(
            <TransactionsPage
                transactions={[
                    ...transactions,
                    transaction("income", "2026-01-01", {
                        transactionType: "INCOME",
                    }),
                ]}
            />,
        );

        fireEvent.click(sortButton());
        // First <select> in the toolbar is the transaction type filter
        fireEvent.change(screen.getAllByRole("combobox")[0], {
            target: { value: "EXPENSE" },
        });

        expect(merchantOrder()).toEqual(["Shop old", "Shop mid", "Shop new"]);
    });

    it("does not reorder the transactions prop it was given", () => {
        const input = [...transactions];
        render(<TransactionsPage transactions={input} />);

        fireEvent.click(sortButton());

        expect(input.map((t) => t.id)).toEqual(["mid", "old", "new"]);
    });
});
