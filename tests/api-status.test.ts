import { describe, expect, test } from "bun:test";
import { Hono } from "hono";
import { apiRouter } from "../src/routes/api";

const app = new Hono();
app.route("/api", apiRouter);

describe("API status codes", () => {
	test("networks is 200", async () => {
		expect((await app.request("/api/networks")).status).toBe(200);
	});

	test("invalid network is 400", async () => {
		expect((await app.request("/api/stats/bad")).status).toBe(400);
	});

	test("bad block number is 400", async () => {
		expect((await app.request("/api/block/testnet/xyz")).status).toBe(400);
	});
});
