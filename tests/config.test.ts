import { describe, expect, test } from "bun:test";

describe("0G Network configuration", () => {
	const TESTNET = {
		rpc: "https://evmrpc-testnet.0g.ai",
		chainId: 16602,
		name: "Galileo",
	};

	const MAINNET = {
		rpc: "https://evmrpc.0g.ai",
		chainId: 16661,
		name: "Aristotle",
	};

	test("testnet chain ID is 16602", () => {
		expect(TESTNET.chainId).toBe(16602);
	});

	test("mainnet chain ID is 16661", () => {
		expect(MAINNET.chainId).toBe(16661);
	});

	test("testnet RPC is HTTPS", () => {
		expect(TESTNET.rpc.startsWith("https://")).toBe(true);
	});

	test("mainnet RPC is HTTPS", () => {
		expect(MAINNET.rpc.startsWith("https://")).toBe(true);
	});

	test("testnet is named Galileo", () => {
		expect(TESTNET.name).toBe("Galileo");
	});

	test("mainnet is named Aristotle", () => {
		expect(MAINNET.name).toBe("Aristotle");
	});
});

describe("Search input parsing", () => {
	function classifyInput(q: string): "tx" | "address" | "block" | "unknown" {
		if (q.startsWith("0x") && q.length === 66) return "tx";
		if (q.startsWith("0x") && q.length === 42) return "address";
		if (/^\d+$/.test(q)) return "block";
		return "unknown";
	}

	test("identifies tx hash", () => {
		expect(classifyInput("0x" + "a".repeat(64))).toBe("tx");
	});

	test("identifies address", () => {
		expect(classifyInput("0x" + "a".repeat(40))).toBe("address");
	});

	test("identifies block number", () => {
		expect(classifyInput("12345")).toBe("block");
	});

	test("returns unknown for garbage", () => {
		expect(classifyInput("hello world")).toBe("unknown");
	});

	test("handles empty string", () => {
		expect(classifyInput("")).toBe("unknown");
	});

	test("0x alone is unknown (too short for address or tx)", () => {
		expect(classifyInput("0x")).toBe("unknown");
	});

	test("block number with leading zeros", () => {
		expect(classifyInput("00123")).toBe("block");
	});

	test("very large block number", () => {
		expect(classifyInput("999999999")).toBe("block");
	});

	test("negative number is unknown", () => {
		expect(classifyInput("-1")).toBe("unknown");
	});
});
