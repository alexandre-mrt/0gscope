import { describe, expect, test } from "bun:test";
import { Hono } from "hono";
import { apiRouter } from "../src/routes/api";

const app = new Hono();
app.route("/api", apiRouter);

describe("Networks endpoint details", () => {
	test("each network has id, name, chainId, rpc", async () => {
		const json = await (await app.request("/api/networks")).json();
		for (const net of json.data.networks) {
			expect(net).toHaveProperty("id");
			expect(net).toHaveProperty("name");
			expect(net).toHaveProperty("chainId");
			expect(net).toHaveProperty("rpc");
			expect(typeof net.chainId).toBe("number");
		}
	});
});
