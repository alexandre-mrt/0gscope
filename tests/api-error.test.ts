import { describe, expect, test } from "bun:test";
import { Hono } from "hono";
import { apiRouter } from "../src/routes/api";

const app = new Hono();
app.route("/api", apiRouter);

describe("API error consistency", () => {
	test("all 400 errors return JSON with error field", async () => {
		const badRequests = [
			"/api/stats/badnet",
			"/api/block/testnet/abc",
			"/api/tx/testnet/short",
			"/api/address/testnet/short",
		];
		for (const url of badRequests) {
			const res = await app.request(url);
			expect(res.status).toBe(400);
			const json = await res.json();
			expect(json).toHaveProperty("error");
		}
	});
});
