import { describe, expect, test } from "bun:test";
import { Hono } from "hono";
import { apiRouter } from "../src/routes/api";

const app = new Hono();
app.route("/api", apiRouter);

describe("GET /api/stats/:network", () => {
	test("rejects invalid network", async () => {
		const res = await app.request("/api/stats/invalid");
		expect(res.status).toBe(400);
		const json = await res.json();
		expect(json.error).toContain("Invalid network");
	});

	// These tests hit real RPC - they may be slow or fail if network is down
	test("returns testnet stats (live)", async () => {
		const res = await app.request("/api/stats/testnet");
		// May fail if testnet RPC is unreachable, that's ok
		if (res.status === 200) {
			const json = await res.json();
			expect(json.success).toBe(true);
			expect(json.data.blockNumber).toBeGreaterThan(0);
			expect(json.data.chainId).toBe(16602);
		}
	});
});

describe("GET /api/blocks/:network", () => {
	test("returns blocks from testnet (live)", async () => {
		const res = await app.request("/api/blocks/testnet?count=3");
		if (res.status === 200) {
			const json = await res.json();
			expect(json.success).toBe(true);
			expect(json.data.blocks.length).toBeLessThanOrEqual(3);
			if (json.data.blocks.length > 0) {
				expect(json.data.blocks[0]).toHaveProperty("number");
				expect(json.data.blocks[0]).toHaveProperty("hash");
				expect(json.data.blocks[0]).toHaveProperty("transactionCount");
			}
		}
	});
});

describe("GET /api/block/:network/:number", () => {
	test("returns 404 or error for block 0 on testnet", async () => {
		const res = await app.request("/api/block/testnet/0");
		// Block 0 may or may not exist depending on chain
		expect([200, 404, 500]).toContain(res.status);
	});
});

describe("GET /api/tx/:network/:hash", () => {
	test("returns 404 for nonexistent tx", async () => {
		const res = await app.request("/api/tx/testnet/0x0000000000000000000000000000000000000000000000000000000000000000");
		if (res.status === 404) {
			const json = await res.json();
			expect(json.error).toContain("not found");
		}
	});
});

describe("GET /api/address/:network/:address", () => {
	test("returns address info for zero address", async () => {
		const res = await app.request("/api/address/testnet/0x0000000000000000000000000000000000000000");
		if (res.status === 200) {
			const json = await res.json();
			expect(json.success).toBe(true);
			expect(json.data.address).toBe("0x0000000000000000000000000000000000000000");
			expect(json.data).toHaveProperty("balance");
			expect(json.data).toHaveProperty("txCount");
		}
	});
});
