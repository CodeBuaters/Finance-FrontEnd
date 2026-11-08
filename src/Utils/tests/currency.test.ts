import { afterEach, describe, expect, it } from "vitest";
import {
    formatCurrency,
    formatSignedAmount,
    formatWholeCurrency,
    saveCurrency,
} from "../currency";

afterEach(() => localStorage.clear());

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

describe("chosen currency", () => {
    it("converts the amount and uses the euro symbol", () => {
        saveCurrency("EUR");
        expect(formatCurrency(10)).toBe("€8.60");
        expect(formatSignedAmount("EXPENSE", 10)).toBe("-€8.60");
    });

    it("puts a space after word symbols", () => {
        saveCurrency("RON");
        expect(formatCurrency(-10)).toBe("-lei 43.70");
        expect(formatWholeCurrency(10)).toBe("lei 44");
    });

    it("falls back to US dollars for an unknown currency", () => {
        saveCurrency("XYZ");
        expect(formatCurrency(10)).toBe("$10.00");
    });
});
