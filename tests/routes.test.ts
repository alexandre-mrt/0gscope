import { describe, expect, test } from "bun:test";
import { Hono } from "hono";
import { dashboardPage, blockPage, txPage, addressPage, errorPage } from "../src/ui";

const app = new Hono();
app.get("/health", (c) => c.json({ status: "ok" }));

describe("Health endpoint", () => {
	test("returns ok", async () => {
		const res = await app.request("/health");
		expect(res.status).toBe(200);
		const json = await res.json();
		expect(json.status).toBe("ok");
	});
});

describe("UI edge cases", () => {
	test("errorPage renders and escapes HTML", () => {
		const html = errorPage('<script>alert("xss")</script>');
		expect(html).toContain("0GScope");
		expect(html).toContain("&lt;script&gt;");
	});

	test("blockPage handles block zero", () => {
		const html = blockPage({
			number: 0,
			hash: "0x" + "0".repeat(64),
			parentHash: "0x" + "0".repeat(64),
			timestamp: Math.floor(Date.now() / 1000),
			gasUsed: "0",
			gasLimit: "0",
			transactionCount: 0,
			miner: "0x" + "0".repeat(40),
		}, "testnet");
		expect(html).toContain("Block #0");
	});

	test("txPage shows contract creation for null to", () => {
		const html = txPage({
			hash: "0xabc", from: "0xfrom", to: null,
			value: "0", gasPrice: "0", gasUsed: "0",
			blockNumber: 1, timestamp: 0, status: true,
		}, "testnet");
		expect(html).toContain("Contract Creation");
	});

	test("txPage shows failed badge", () => {
		const html = txPage({
			hash: "0x1", from: "0x2", to: "0x3",
			value: "1.5", gasPrice: "2", gasUsed: "21000",
			blockNumber: 100, timestamp: Math.floor(Date.now() / 1000), status: false,
		}, "mainnet");
		expect(html).toContain("Failed");
		expect(html).toContain("badge-fail");
	});

	test("dashboardPage shows Galileo for testnet", () => {
		const html = dashboardPage(
			{ network: "testnet", blockNumber: 100, gasPrice: "1.0", chainId: 16602, timestamp: Date.now() },
			[], "testnet",
		);
		expect(html).toContain("Galileo");
	});

	test("dashboardPage shows Aristotle for mainnet", () => {
		const html = dashboardPage(
			{ network: "mainnet", blockNumber: 500000, gasPrice: "0.5", chainId: 16661, timestamp: Date.now() },
			[], "mainnet",
		);
		expect(html).toContain("Aristotle");
	});

	test("addressPage renders all fields", () => {
		const html = addressPage({ address: "0xdeadbeef", balance: "42.5", txCount: 100 }, "testnet");
		expect(html).toContain("0xdeadbeef");
		expect(html).toContain("42.5 0G");
		expect(html).toContain("100");
	});
});
