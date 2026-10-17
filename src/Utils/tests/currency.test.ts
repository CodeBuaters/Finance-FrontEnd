import { describe, expect, it } from "vitest";
import { formatSignedAmount } from "../currency";

describe("formatSignedAmount", () => {
    it("formats income with a plus sign and two decimal places", () => {
        expect(formatSignedAmount("INCOME", 12)).toBe("+$12.00");
    });

    it("formats expenses with a minus sign", () => {
        expect(formatSignedAmount("EXPENSE", 12.5)).toBe("-$12.50");
    });

    it("displays a negative amount as a positive number with the transaction sign", () => {
        expect(formatSignedAmount("INCOME", -12)).toBe("+$12.00");
    });
});