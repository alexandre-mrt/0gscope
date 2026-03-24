import { describe, expect, test } from "bun:test";
import { Hono } from "hono";
import { apiRouter } from "../src/routes/api";

const app = new Hono();
app.route("/api", apiRouter);

describe("GET /api/networks", () => {
	test("returns supported networks", async () => {
		const res = await app.request("/api/networks");
		expect(res.status).toBe(200);
		const json = await res.json();
		expect(json.success).toBe(true);
		expect(json.data.networks.length).toBe(2);
	});

	test("includes testnet with correct chain ID", async () => {
		const json = await (await app.request("/api/networks")).json();
		const testnet = json.data.networks.find((n: { id: string }) => n.id === "testnet");
		expect(testnet.chainId).toBe(16602);
		expect(testnet.name).toBe("Galileo");
	});

	test("includes mainnet with correct chain ID", async () => {
		const json = await (await app.request("/api/networks")).json();
		const mainnet = json.data.networks.find((n: { id: string }) => n.id === "mainnet");
		expect(mainnet.chainId).toBe(16661);
		expect(mainnet.name).toBe("Aristotle");
	});

	test("all networks have RPC URLs", async () => {
		const json = await (await app.request("/api/networks")).json();
		for (const net of json.data.networks) {
			expect(net.rpc).toMatch(/^https:\/\//);
		}
	});
});
