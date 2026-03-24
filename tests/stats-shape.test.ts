import { describe, expect, test } from "bun:test";
import { Hono } from "hono";
import { apiRouter } from "../src/routes/api";

const app = new Hono();
app.route("/api", apiRouter);

describe("Stats response shape", () => {
	test("testnet stats have all fields when available", async () => {
		const res = await app.request("/api/stats/testnet");
		if (res.status === 200) {
			const json = await res.json();
			expect(json.data).toHaveProperty("network");
			expect(json.data).toHaveProperty("blockNumber");
			expect(json.data).toHaveProperty("gasPrice");
			expect(json.data).toHaveProperty("chainId");
			expect(json.data).toHaveProperty("timestamp");
			expect(json.data.network).toBe("testnet");
		}
	});
});
