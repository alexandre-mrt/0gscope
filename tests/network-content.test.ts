import { describe, expect, test } from "bun:test";
import { Hono } from "hono";
import { apiRouter } from "../src/routes/api";

const app = new Hono();
app.route("/api", apiRouter);

describe("Network content", () => {
	test("testnet is named Galileo", async () => {
		const json = await (await app.request("/api/networks")).json();
		const tn = json.data.networks.find((n: any) => n.id === "testnet");
		expect(tn.name).toBe("Galileo");
	});

	test("mainnet is named Aristotle", async () => {
		const json = await (await app.request("/api/networks")).json();
		const mn = json.data.networks.find((n: any) => n.id === "mainnet");
		expect(mn.name).toBe("Aristotle");
	});
});
