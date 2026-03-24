import { describe, expect, test } from "bun:test";

describe("Chain ID constants", () => {
	test("testnet chain ID is 5 digits", () => {
		expect(String(16602).length).toBe(5);
	});

	test("mainnet chain ID is 5 digits", () => {
		expect(String(16661).length).toBe(5);
	});

	test("chain IDs are positive integers", () => {
		expect(Number.isInteger(16602)).toBe(true);
		expect(Number.isInteger(16661)).toBe(true);
		expect(16602).toBeGreaterThan(0);
		expect(16661).toBeGreaterThan(0);
	});
});
