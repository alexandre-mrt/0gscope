import { describe, expect, test } from "bun:test";
import { Hono } from "hono";
import { apiRouter } from "../src/routes/api";

const app = new Hono();
app.route("/api", apiRouter);

describe("Network list completeness", () => {
	test("exactly 2 networks returned", async () => {
		const json = await (await app.request("/api/networks")).json();
		expect(json.data.networks.length).toBe(2);
	});

	test("both have rpc starting with https", async () => {
		const json = await (await app.request("/api/networks")).json();
		for (const n of json.data.networks) {
			expect(n.rpc.startsWith("https://")).toBe(true);
		}
	});
});
