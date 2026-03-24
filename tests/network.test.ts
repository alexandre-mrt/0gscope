import { describe, expect, test } from "bun:test";

describe("Network constants", () => {
	const VALID_NETWORKS = new Set(["testnet", "mainnet"]);

	test("only testnet and mainnet are valid", () => {
		expect(VALID_NETWORKS.has("testnet")).toBe(true);
		expect(VALID_NETWORKS.has("mainnet")).toBe(true);
		expect(VALID_NETWORKS.has("devnet")).toBe(false);
		expect(VALID_NETWORKS.has("")).toBe(false);
	});

	test("network names are lowercase", () => {
		for (const net of VALID_NETWORKS) {
			expect(net).toBe(net.toLowerCase());
		}
	});

	test("exactly 2 networks", () => {
		expect(VALID_NETWORKS.size).toBe(2);
	});
});
