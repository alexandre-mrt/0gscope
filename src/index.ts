import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { apiRouter } from "./routes/api";
import { getAddressInfo, getBlock, getNetworkStats, getRecentBlocks, getTransaction } from "./services/chain";
import { addressPage, blockPage, dashboardPage, errorPage, txPage } from "./ui";

const app = new Hono();

app.use("*", cors());
app.use("*", logger());

app.route("/api", apiRouter);

app.get("/", async (c) => {
	const network = (c.req.query("network") || "testnet") as "testnet" | "mainnet";

	try {
		const [stats, blocks] = await Promise.all([
			getNetworkStats(network),
			getRecentBlocks(network, 15),
		]);
		return c.html(dashboardPage(stats, blocks, network));
	} catch (error) {
		return c.html(errorPage(`Failed to connect to ${network}: ${error instanceof Error ? error.message : "unknown"}`));
	}
});

app.get("/block/:number", async (c) => {
	const network = (c.req.query("network") || "testnet") as "testnet" | "mainnet";
	const blockNum = Number(c.req.param("number"));

	try {
		const block = await getBlock(network, blockNum);
		if (!block) return c.html(errorPage("Block not found"));
		return c.html(blockPage(block, network));
	} catch (error) {
		return c.html(errorPage("Failed to fetch block"));
	}
});

app.get("/tx/:hash", async (c) => {
	const network = (c.req.query("network") || "testnet") as "testnet" | "mainnet";
	const hash = c.req.param("hash");

	try {
		const tx = await getTransaction(network, hash);
		if (!tx) return c.html(errorPage("Transaction not found"));
		return c.html(txPage(tx, network));
	} catch (error) {
		return c.html(errorPage("Failed to fetch transaction"));
	}
});

app.get("/address/:address", async (c) => {
	const network = (c.req.query("network") || "testnet") as "testnet" | "mainnet";
	const address = c.req.param("address");

	try {
		const info = await getAddressInfo(network, address);
		return c.html(addressPage(info, network));
	} catch (error) {
		return c.html(errorPage("Failed to fetch address info"));
	}
});

app.get("/health", (c) => c.json({ status: "ok" }));

const PORT = Number(process.env.PORT || 3000);
console.log(`0GScope running on http://localhost:${PORT}`);

export default { port: PORT, fetch: app.fetch };
