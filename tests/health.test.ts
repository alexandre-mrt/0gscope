import { describe, expect, test } from "bun:test";
import { Hono } from "hono";

const app = new Hono();
app.get("/health", (c) => c.json({ status: "ok" }));

describe("Health endpoint", () => {
	test("returns 200 with status", async () => {
		const res = await app.request("/health");
		expect(res.status).toBe(200);
		const json = await res.json();
		expect(json.status).toBe("ok");
	});

	test("responds to GET only", async () => {
		const res = await app.request("/health", { method: "POST" });
		expect(res.status).toBe(404);
	});
});
