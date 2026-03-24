import { describe, expect, test } from "bun:test";
import { Hono } from "hono";
import { apiRouter } from "../src/routes/api";

const app = new Hono();
app.route("/api", apiRouter);

describe("Networks endpoint edge cases", () => {
	test("returns JSON content-type", async () => {
		const res = await app.request("/api/networks");
		expect(res.headers.get("content-type")).toContain("json");
	});

	test("networks have unique IDs", async () => {
		const json = await (await app.request("/api/networks")).json();
		const ids = json.data.networks.map((n: { id: string }) => n.id);
		expect(new Set(ids).size).toBe(ids.length);
	});

	test("networks have unique chain IDs", async () => {
		const json = await (await app.request("/api/networks")).json();
		const chainIds = json.data.networks.map((n: { chainId: number }) => n.chainId);
		expect(new Set(chainIds).size).toBe(chainIds.length);
	});
});
