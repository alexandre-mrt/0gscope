import { describe, expect, test } from "bun:test";
import { Hono } from "hono";
import { apiRouter } from "../src/routes/api";

const app = new Hono();
app.route("/api", apiRouter);

describe("Input validation comprehensive", () => {
	test("all endpoints reject 'invalid' network", async () => {
		const endpoints = [
			"/api/stats/invalid",
			"/api/blocks/invalid",
			"/api/block/invalid/1",
		];
		for (const ep of endpoints) {
			const res = await app.request(ep);
			expect(res.status).toBe(400);
		}
	});

	test("block endpoint accepts 0", async () => {
		const res = await app.request("/api/block/testnet/0");
		// 0 is valid (may return block or 404/500 from RPC)
		expect([200, 404, 500]).toContain(res.status);
	});

	test("block endpoint rejects float", async () => {
		const res = await app.request("/api/block/testnet/1.5");
		expect(res.status).toBe(400);
	});

	test("tx hash must be exactly 66 chars", async () => {
		const short = await app.request("/api/tx/testnet/0x" + "a".repeat(63));
		expect(short.status).toBe(400);

		const long = await app.request("/api/tx/testnet/0x" + "a".repeat(65));
		expect(long.status).toBe(400);
	});

	test("address must be exactly 42 chars", async () => {
		const short = await app.request("/api/address/testnet/0x" + "a".repeat(39));
		expect(short.status).toBe(400);

		const long = await app.request("/api/address/testnet/0x" + "a".repeat(41));
		expect(long.status).toBe(400);
	});
});
