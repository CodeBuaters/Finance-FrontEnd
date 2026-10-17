import { describe, expect, it } from "vitest";
import { getInitials } from "../user";
import type { User } from "../../Types/user";

describe("getInitials", () => {
    it("returns initials from first and last name", () => {
        const user: User = {
            firstName: "Matti",
            lastName: "Meikäläinen",
            username: "matti123",
        };

        expect(getInitials(user)).toBe("MM");
    });

    it("falls back to username when names are empty", () => {
        const user: User = {
            firstName: "",
            lastName: "",
            username: "matti123",
        };

        expect(getInitials(user)).toBe("M");
    });

    it("returns a question mark when user is null", () => {
        expect(getInitials(null)).toBe("?");
    });
});