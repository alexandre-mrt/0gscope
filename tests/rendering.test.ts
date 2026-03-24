import { describe, expect, test } from "bun:test";
import { dashboardPage, blockPage, txPage, addressPage, errorPage } from "../src/ui";

describe("HTML structure validation", () => {
	test("all pages have DOCTYPE", () => {
		const pages = [
			dashboardPage({ network: "testnet", blockNumber: 1, gasPrice: "1", chainId: 16602, timestamp: Date.now() }, [], "testnet"),
			blockPage({ number: 1, hash: "0x" + "a".repeat(64), parentHash: "0x" + "b".repeat(64), timestamp: Math.floor(Date.now()/1000), gasUsed: "0", gasLimit: "0", transactionCount: 0, miner: "0x" + "0".repeat(40) }, "testnet"),
			txPage({ hash: "0x1", from: "0x2", to: "0x3", value: "0", gasPrice: "0", gasUsed: "0", blockNumber: 1, timestamp: 0, status: true }, "testnet"),
			addressPage({ address: "0x" + "0".repeat(40), balance: "0", txCount: 0 }, "testnet"),
			errorPage("test"),
		];

		for (const page of pages) {
			expect(page).toContain("<!DOCTYPE html>");
			expect(page).toContain("0GScope");
			expect(page).toContain("</html>");
		}
	});

	test("dashboard has search bar", () => {
		const page = dashboardPage(
			{ network: "testnet", blockNumber: 100, gasPrice: "1", chainId: 16602, timestamp: Date.now() },
			[], "testnet",
		);
		expect(page).toContain("search");
		expect(page).toContain("placeholder");
	});

	test("block page links back to miner address", () => {
		const miner = "0x" + "d".repeat(40);
		const page = blockPage({
			number: 42, hash: "0x" + "a".repeat(64), parentHash: "0x" + "b".repeat(64),
			timestamp: Math.floor(Date.now()/1000), gasUsed: "21000", gasLimit: "30000000",
			transactionCount: 5, miner,
		}, "testnet");
		expect(page).toContain(`/address/${miner}`);
	});

	test("tx page links to block", () => {
		const page = txPage({
			hash: "0xabc", from: "0xfrom", to: "0xto",
			value: "1.5", gasPrice: "2", gasUsed: "21000",
			blockNumber: 99, timestamp: Math.floor(Date.now()/1000), status: true,
		}, "mainnet");
		expect(page).toContain("/block/99");
		expect(page).toContain("network=mainnet");
	});

	test("address page shows network", () => {
		const page = addressPage(
			{ address: "0x" + "f".repeat(40), balance: "100", txCount: 50 },
			"mainnet",
		);
		expect(page).toContain("mainnet");
		expect(page).toContain("100 0G");
	});
});
