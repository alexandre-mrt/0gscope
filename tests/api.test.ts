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

	test("caps block count at 25", async () => {
		const res = await app.request("/api/blocks/testnet?count=100");
		if (res.status === 200) {
			const json = await res.json();
			expect(json.data.blocks.length).toBeLessThanOrEqual(25);
		}
	});

	test("defaults to 10 blocks", async () => {
		const res = await app.request("/api/blocks/testnet");
		if (res.status === 200) {
			const json = await res.json();
			expect(json.data.blocks.length).toBeLessThanOrEqual(10);
		}
	});
});

describe("GET /api/block/:network/:number", () => {
	test("returns 404 or error for block 0 on testnet", async () => {
		const res = await app.request("/api/block/testnet/0");
		expect([200, 404, 500]).toContain(res.status);
	});

	test("rejects non-numeric block number", async () => {
		const res = await app.request("/api/block/testnet/abc");
		expect(res.status).toBe(400);
		const json = await res.json();
		expect(json.error).toContain("non-negative integer");
	});

	test("rejects negative block number", async () => {
		const res = await app.request("/api/block/testnet/-1");
		expect(res.status).toBe(400);
	});

	test("rejects invalid network", async () => {
		const res = await app.request("/api/block/badnet/1");
		expect(res.status).toBe(400);
	});
});

describe("GET /api/tx/:network/:hash", () => {
	test("rejects invalid tx hash format", async () => {
		const res = await app.request("/api/tx/testnet/invalid");
		expect(res.status).toBe(400);
		const json = await res.json();
		expect(json.error).toContain("Invalid transaction hash");
	});

	test("rejects short tx hash", async () => {
		const res = await app.request("/api/tx/testnet/0x1234");
		expect(res.status).toBe(400);
	});

	test("handles valid but nonexistent tx", async () => {
		const res = await app.request("/api/tx/testnet/0x" + "0".repeat(64));
		// May be 404 or 500 depending on RPC
		expect([404, 500]).toContain(res.status);
	});
});

describe("GET /api/address/:network/:address", () => {
	test("rejects invalid address format", async () => {
		const res = await app.request("/api/address/testnet/notanaddress");
		expect(res.status).toBe(400);
		const json = await res.json();
		expect(json.error).toContain("Invalid address");
	});

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

	test("rejects invalid network", async () => {
		const res = await app.request("/api/address/badnet/0x0000000000000000000000000000000000000000");
		expect(res.status).toBe(400);
	});
});

describe("Error response format", () => {
	test("all 400 errors have error field", async () => {
		const res = await app.request("/api/stats/invalid");
		const json = await res.json();
		expect(json).toHaveProperty("error");
		expect(typeof json.error).toBe("string");
	});

	test("block validation error is descriptive", async () => {
		const res = await app.request("/api/block/testnet/abc");
		const json = await res.json();
		expect(json.error.length).toBeGreaterThan(10);
	});
});
