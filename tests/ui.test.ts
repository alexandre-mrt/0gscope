import { describe, expect, test } from "bun:test";
import { dashboardPage, blockPage, txPage, addressPage, errorPage } from "../src/ui";
import type { BlockInfo, NetworkStats } from "../src/services/chain";

const mockStats: NetworkStats = {
	network: "testnet",
	blockNumber: 1234567,
	gasPrice: "1.5",
	chainId: 16602,
	timestamp: Date.now(),
};

const mockBlock: BlockInfo = {
	number: 1234567,
	hash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
	parentHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
	timestamp: Math.floor(Date.now() / 1000) - 60,
	gasUsed: "500000",
	gasLimit: "30000000",
	transactionCount: 15,
	miner: "0xabcdef1234567890abcdef1234567890abcdef12",
};

describe("UI - dashboardPage", () => {
	test("renders network stats", () => {
		const page = dashboardPage(mockStats, [mockBlock], "testnet");
		expect(page).toContain("0GScope");
		expect(page).toContain("1,234,567");
		expect(page).toContain("1.5");
		expect(page).toContain("16602");
		expect(page).toContain("Galileo");
	});

	test("renders blocks table", () => {
		const page = dashboardPage(mockStats, [mockBlock], "testnet");
		expect(page).toContain("1234567");
		expect(page).toContain("15"); // tx count
		expect(page).toContain("500,000"); // gas used
	});

	test("shows mainnet label", () => {
		const mainnetStats = { ...mockStats, network: "mainnet" };
		const page = dashboardPage(mainnetStats, [], "mainnet");
		expect(page).toContain("Aristotle");
	});

	test("includes search bar", () => {
		const page = dashboardPage(mockStats, [], "testnet");
		expect(page).toContain("Search");
		expect(page).toContain("search()");
	});
});

describe("UI - blockPage", () => {
	test("renders block details", () => {
		const page = blockPage(mockBlock, "testnet");
		expect(page).toContain("Block #1234567");
		expect(page).toContain(mockBlock.hash);
		expect(page).toContain("15"); // tx count
		expect(page).toContain("500,000");
	});
});

describe("UI - txPage", () => {
	test("renders transaction details", () => {
		const page = txPage({
			hash: "0xtxhash123",
			from: "0xfrom123",
			to: "0xto456",
			value: "1.5",
			gasPrice: "2.0",
			gasUsed: "21000",
			blockNumber: 100,
			timestamp: Math.floor(Date.now() / 1000),
			status: true,
		}, "testnet");
		expect(page).toContain("0xtxhash123");
		expect(page).toContain("0xfrom123");
		expect(page).toContain("0xto456");
		expect(page).toContain("1.5 0G");
		expect(page).toContain("Success");
	});

	test("shows Failed for failed tx", () => {
		const page = txPage({
			hash: "0x1",
			from: "0x2",
			to: "0x3",
			value: "0",
			gasPrice: "0",
			gasUsed: "0",
			blockNumber: 1,
			timestamp: 0,
			status: false,
		}, "testnet");
		expect(page).toContain("Failed");
	});
});

describe("UI - addressPage", () => {
	test("renders address info", () => {
		const page = addressPage({ address: "0xMyAddr", balance: "100.5", txCount: 42 }, "testnet");
		expect(page).toContain("0xMyAddr");
		expect(page).toContain("100.5 0G");
		expect(page).toContain("42");
	});
});

describe("UI - errorPage", () => {
	test("renders error", () => {
		const page = errorPage("Connection failed");
		expect(page).toContain("Connection failed");
	});
});
