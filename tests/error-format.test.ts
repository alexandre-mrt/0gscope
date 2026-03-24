import { describe, expect, test } from "bun:test";
import { Hono } from "hono";
import { apiRouter } from "../src/routes/api";
const app = new Hono();
app.route("/api", apiRouter);

describe("Error format", () => {
	test("error is always a string", async () => {
		const res = await app.request("/api/stats/bad");
		const json = await res.json();
		expect(typeof json.error).toBe("string");
		expect(json.error.length).toBeGreaterThan(0);
	});
	test("no success field in errors", async () => {
		const json = await (await app.request("/api/block/testnet/abc")).json();
		expect(json).not.toHaveProperty("success");
	});
});
