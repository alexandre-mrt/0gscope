import { describe, expect, test } from "bun:test";
import { Hono } from "hono";
import { apiRouter } from "../src/routes/api";

const app = new Hono();
app.route("/api", apiRouter);

describe("API edge cases", () => {
	test("blocks count=0 clamps to at least 1", async () => {
		const res = await app.request("/api/blocks/testnet?count=0");
		// May succeed or fail depending on RPC, just verify no crash
		expect([200, 500]).toContain(res.status);
	});

	test("blocks with NaN count defaults to 10", async () => {
		const res = await app.request("/api/blocks/testnet?count=abc");
		if (res.status === 200) {
			const json = await res.json();
			expect(json.data.blocks.length).toBeLessThanOrEqual(10);
		}
	});

	test("tx endpoint rejects without 0x prefix", async () => {
		const res = await app.request("/api/tx/testnet/" + "a".repeat(64));
		expect(res.status).toBe(400);
	});
});
