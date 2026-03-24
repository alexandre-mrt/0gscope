import { describe, expect, test } from "bun:test";
import { Hono } from "hono";
import { apiRouter } from "../src/routes/api";

const app = new Hono();
app.route("/api", apiRouter);

describe("API envelope consistency", () => {
	test("success responses have { success: true, data }", async () => {
		const res = await app.request("/api/stats/testnet");
		if (res.status === 200) {
			const json = await res.json();
			expect(json.success).toBe(true);
			expect(json).toHaveProperty("data");
		}
	});

	test("400 errors have { error } string", async () => {
		const res = await app.request("/api/stats/invalid");
		expect(res.status).toBe(400);
		const json = await res.json();
		expect(json).toHaveProperty("error");
		expect(typeof json.error).toBe("string");
	});

	test("block validation 400 has error", async () => {
		const res = await app.request("/api/block/testnet/abc");
		expect(res.status).toBe(400);
		const json = await res.json();
		expect(json).toHaveProperty("error");
	});

	test("tx validation 400 has error", async () => {
		const res = await app.request("/api/tx/testnet/invalid");
		expect(res.status).toBe(400);
		const json = await res.json();
		expect(json).toHaveProperty("error");
	});

	test("address validation 400 has error", async () => {
		const res = await app.request("/api/address/testnet/invalid");
		expect(res.status).toBe(400);
		const json = await res.json();
		expect(json).toHaveProperty("error");
	});
});
