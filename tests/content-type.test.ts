import { describe, expect, test } from "bun:test";
import { Hono } from "hono";
import { apiRouter } from "../src/routes/api";

const app = new Hono();
app.route("/api", apiRouter);

describe("Content-Type headers", () => {
	test("400 errors return JSON", async () => {
		const res = await app.request("/api/stats/invalid");
		expect(res.headers.get("content-type")).toContain("json");
	});

	test("block validation error returns JSON", async () => {
		const res = await app.request("/api/block/testnet/abc");
		expect(res.headers.get("content-type")).toContain("json");
	});

	test("address validation error returns JSON", async () => {
		const res = await app.request("/api/address/testnet/bad");
		expect(res.headers.get("content-type")).toContain("json");
	});
});
