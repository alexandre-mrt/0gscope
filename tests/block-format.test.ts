import { describe, expect, test } from "bun:test";

describe("Block data format", () => {
	test("block hash is 66 chars (0x + 64)", () => {
		const hash = "0x" + "a".repeat(64);
		expect(hash.length).toBe(66);
	});

	test("miner address is 42 chars", () => {
		const addr = "0x" + "b".repeat(40);
		expect(addr.length).toBe(42);
	});

	test("gas values are numeric strings", () => {
		expect(Number("500000")).toBe(500000);
		expect(Number("30000000")).toBe(30000000);
	});
});
