import { beforeEach, describe, expect, it, vi } from "vitest";
import { getTransaction, getTransactionsByUserId } from "../transactionService";


const { mockGet } = vi.hoisted(() => ({
    mockGet: vi.fn(),
}));

vi.mock("../api", () => ({
    api: {
        get: mockGet,
    },
}));


describe("getTransaction", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("fetches transactions and returns response data", async () => {
        const transactions = [
            { id: 1, amount: 25 },
            { id: 2, amount: 50 },
        ];

        mockGet.mockResolvedValue({ data: transactions });

        const result = await getTransaction();

        expect(mockGet).toHaveBeenCalledWith("/api/transactions");
        expect(result).toEqual(transactions);
    });
});

describe("getTransactionsByUserId", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("fetches transactions for the given user", async () => {
        const transactions = [{ id: 1, amount: 25 }];

        mockGet.mockResolvedValue({ data: transactions });

        const result = await getTransactionsByUserId(7);

        expect(mockGet).toHaveBeenCalledWith("/api/user/7/transactions");
        expect(result).toEqual(transactions);
    });
});
