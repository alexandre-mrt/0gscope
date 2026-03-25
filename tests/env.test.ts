import { describe, expect, test } from "bun:test";
describe("Env defaults", () => {
	test("PORT defaults to 3000", () => { expect(Number(process.env.PORT || 3000)).toBe(3000); });
	test("testnet RPC has default", () => { expect(process.env.ZG_EVM_RPC || "https://evmrpc-testnet.0g.ai").toContain("0g.ai"); });
});

describe("Mainnet RPC", () => {
	test("mainnet RPC has default", () => { expect(process.env.ZG_MAINNET_RPC || "https://evmrpc.0g.ai").toContain("0g.ai"); });
});
