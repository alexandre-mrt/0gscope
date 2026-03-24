import { describe, expect, test } from "bun:test";

describe("App configuration", () => {
	test("default port is 3000", () => {
		expect(Number(process.env.PORT || 3000)).toBe(3000);
	});

	test("testnet RPC default", () => {
		const rpc = process.env.ZG_EVM_RPC || "https://evmrpc-testnet.0g.ai";
		expect(rpc).toMatch(/^https:\/\//);
	});

	test("mainnet RPC default", () => {
		const rpc = process.env.ZG_MAINNET_RPC || "https://evmrpc.0g.ai";
		expect(rpc).toMatch(/^https:\/\//);
	});
});
