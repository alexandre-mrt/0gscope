import { describe, expect, test } from "bun:test";
import { dashboardPage } from "../src/ui";
import type { BlockInfo, NetworkStats } from "../src/services/chain";

const stats: NetworkStats = {
	network: "testnet",
	blockNumber: 5000000,
	gasPrice: "2.5",
	chainId: 16602,
	timestamp: Date.now(),
};

const blocks: BlockInfo[] = [
	{
		number: 5000000, hash: "0x" + "a".repeat(64), parentHash: "0x" + "b".repeat(64),
		timestamp: Math.floor(Date.now() / 1000) - 5, gasUsed: "1500000", gasLimit: "30000000",
		transactionCount: 25, miner: "0x" + "c".repeat(40),
	},
	{
		number: 4999999, hash: "0x" + "d".repeat(64), parentHash: "0x" + "e".repeat(64),
		timestamp: Math.floor(Date.now() / 1000) - 10, gasUsed: "800000", gasLimit: "30000000",
		transactionCount: 12, miner: "0x" + "f".repeat(40),
	},
];

describe("Dashboard with real data", () => {
	test("renders block numbers", () => {
		const page = dashboardPage(stats, blocks, "testnet");
		expect(page).toContain("5000000");
		expect(page).toContain("4999999");
	});

	test("renders transaction counts", () => {
		const page = dashboardPage(stats, blocks, "testnet");
		expect(page).toContain("25");
		expect(page).toContain("12");
	});

	test("renders gas used", () => {
		const page = dashboardPage(stats, blocks, "testnet");
		expect(page).toContain("1,500,000");
		expect(page).toContain("800,000");
	});

	test("renders gas price", () => {
		const page = dashboardPage(stats, blocks, "testnet");
		expect(page).toContain("2.5");
	});

	test("block rows have links", () => {
		const page = dashboardPage(stats, blocks, "testnet");
		expect(page).toContain("/block/5000000");
		expect(page).toContain("/block/4999999");
	});

	test("renders block time as relative", () => {
		const page = dashboardPage(stats, blocks, "testnet");
		expect(page).toContain("ago");
	});
});
