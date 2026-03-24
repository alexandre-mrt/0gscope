import { describe, expect, test } from "bun:test";

function truncate(s: string, len = 16): string {
	return s.length > len ? `${s.slice(0, len / 2)}...${s.slice(-len / 2 + 2)}` : s;
}

describe("truncate utility", () => {
	test("short string unchanged", () => {
		expect(truncate("0x1234", 16)).toBe("0x1234");
	});

	test("exactly at limit unchanged", () => {
		expect(truncate("0x" + "a".repeat(14), 16)).toBe("0x" + "a".repeat(14));
	});

	test("long string truncated", () => {
		const long = "0x" + "a".repeat(64);
		const result = truncate(long, 16);
		expect(result).toContain("...");
		expect(result.length).toBeLessThan(long.length);
	});

	test("custom length", () => {
		const result = truncate("0x" + "b".repeat(40), 20);
		expect(result).toContain("...");
	});
});

describe("Number formatting", () => {
	test("toLocaleString adds commas", () => {
		expect((1234567).toLocaleString()).toBe("1,234,567");
	});

	test("small numbers no commas", () => {
		expect((999).toLocaleString()).toBe("999");
	});

	test("zero", () => {
		expect((0).toLocaleString()).toBe("0");
	});
});
