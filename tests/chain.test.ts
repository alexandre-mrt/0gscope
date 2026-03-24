import { describe, expect, test } from "bun:test";

// Test chain configuration constants without hitting live RPC
describe("Chain configuration", () => {
	const TESTNET_RPC = "https://evmrpc-testnet.0g.ai";
	const MAINNET_RPC = "https://evmrpc.0g.ai";

	test("testnet RPC URL format", () => {
		expect(TESTNET_RPC).toMatch(/^https:\/\//);
		expect(TESTNET_RPC).toContain("0g.ai");
		expect(TESTNET_RPC).toContain("testnet");
	});

	test("mainnet RPC URL format", () => {
		expect(MAINNET_RPC).toMatch(/^https:\/\//);
		expect(MAINNET_RPC).toContain("0g.ai");
		expect(MAINNET_RPC).not.toContain("testnet");
	});

	test("RPC URLs are different", () => {
		expect(TESTNET_RPC).not.toBe(MAINNET_RPC);
	});
});

describe("Block number parsing", () => {
	function parseBlockNumber(input: string): number | null {
		const num = Number(input);
		if (Number.isNaN(num) || num < 0 || !Number.isInteger(num)) return null;
		return num;
	}

	test("valid block numbers", () => {
		expect(parseBlockNumber("0")).toBe(0);
		expect(parseBlockNumber("1")).toBe(1);
		expect(parseBlockNumber("12345678")).toBe(12345678);
	});

	test("invalid block numbers", () => {
		expect(parseBlockNumber("abc")).toBeNull();
		expect(parseBlockNumber("-1")).toBeNull();
		expect(parseBlockNumber("1.5")).toBeNull();
	});

	test("empty string parses as 0 (valid)", () => {
		// Number("") === 0 in JavaScript
		expect(parseBlockNumber("")).toBe(0);
	});
});

describe("Address validation", () => {
	function isValidAddress(addr: string): boolean {
		return addr.startsWith("0x") && addr.length === 42;
	}

	function isValidTxHash(hash: string): boolean {
		return hash.startsWith("0x") && hash.length === 66;
	}

	test("valid addresses", () => {
		expect(isValidAddress("0x" + "a".repeat(40))).toBe(true);
		expect(isValidAddress("0x0000000000000000000000000000000000000000")).toBe(true);
	});

	test("invalid addresses", () => {
		expect(isValidAddress("0x123")).toBe(false);
		expect(isValidAddress("abc")).toBe(false);
		expect(isValidAddress("")).toBe(false);
	});

	test("valid tx hashes", () => {
		expect(isValidTxHash("0x" + "a".repeat(64))).toBe(true);
	});

	test("invalid tx hashes", () => {
		expect(isValidTxHash("0x123")).toBe(false);
		expect(isValidTxHash("abc")).toBe(false);
	});
});
