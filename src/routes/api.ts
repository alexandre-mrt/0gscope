import { Hono } from "hono";
import { getAddressInfo, getBlock, getNetworkStats, getRecentBlocks, getTransaction } from "../services/chain";

export const apiRouter = new Hono();

apiRouter.get("/stats/:network", async (c) => {
	const network = c.req.param("network") as "testnet" | "mainnet";
	if (network !== "testnet" && network !== "mainnet") {
		return c.json({ error: "Invalid network" }, 400);
	}

	try {
		const stats = await getNetworkStats(network);
		return c.json({ success: true, data: stats });
	} catch (error) {
		return c.json({ error: error instanceof Error ? error.message : "Failed" }, 500);
	}
});

apiRouter.get("/blocks/:network", async (c) => {
	const network = c.req.param("network") as "testnet" | "mainnet";
	const count = Math.min(Number(c.req.query("count") || "10"), 25);

	try {
		const blocks = await getRecentBlocks(network, count);
		return c.json({ success: true, data: { blocks } });
	} catch (error) {
		return c.json({ error: error instanceof Error ? error.message : "Failed" }, 500);
	}
});

apiRouter.get("/block/:network/:number", async (c) => {
	const network = c.req.param("network") as "testnet" | "mainnet";
	const blockNum = Number(c.req.param("number"));

	try {
		const block = await getBlock(network, blockNum);
		if (!block) return c.json({ error: "Block not found" }, 404);
		return c.json({ success: true, data: block });
	} catch (error) {
		return c.json({ error: error instanceof Error ? error.message : "Failed" }, 500);
	}
});

apiRouter.get("/tx/:network/:hash", async (c) => {
	const network = c.req.param("network") as "testnet" | "mainnet";
	const hash = c.req.param("hash");

	try {
		const tx = await getTransaction(network, hash);
		if (!tx) return c.json({ error: "Transaction not found" }, 404);
		return c.json({ success: true, data: tx });
	} catch (error) {
		return c.json({ error: error instanceof Error ? error.message : "Failed" }, 500);
	}
});

apiRouter.get("/address/:network/:address", async (c) => {
	const network = c.req.param("network") as "testnet" | "mainnet";
	const address = c.req.param("address");

	try {
		const info = await getAddressInfo(network, address);
		return c.json({ success: true, data: info });
	} catch (error) {
		return c.json({ error: error instanceof Error ? error.message : "Failed" }, 500);
	}
});
