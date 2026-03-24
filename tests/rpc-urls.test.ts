import { describe, expect, test } from "bun:test";

describe("RPC URL format", () => {
	test("testnet URL has testnet in path", () => {
		expect("https://evmrpc-testnet.0g.ai").toContain("testnet");
	});

	test("mainnet URL does not have testnet", () => {
		expect("https://evmrpc.0g.ai").not.toContain("testnet");
	});

	test("both URLs use HTTPS", () => {
		expect("https://evmrpc-testnet.0g.ai").toMatch(/^https:\/\//);
		expect("https://evmrpc.0g.ai").toMatch(/^https:\/\//);
	});
});
