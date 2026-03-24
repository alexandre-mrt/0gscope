import { describe, expect, test } from "bun:test";
import { Hono } from "hono";
import { apiRouter } from "../src/routes/api";

const app = new Hono();
app.route("/api", apiRouter);

describe("Valid network names", () => {
	test("testnet accepted", async () => {
		const res = await app.request("/api/blocks/testnet?count=1");
		expect([200, 500]).toContain(res.status); // 500 if RPC down
	});

	test("devnet rejected", async () => {
		expect((await app.request("/api/blocks/devnet")).status).toBe(400);
	});
});
