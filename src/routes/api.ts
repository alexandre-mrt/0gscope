import { Hono } from "hono";
import { getAddressInfo, getBlock, getNetworkStats, getRecentBlocks, getTransaction } from "../services/chain";

export const apiRouter = new Hono();

const VALID_NETWORKS = new Set(["testnet", "mainnet"]);

function validateNetwork(network: string): network is "testnet" | "mainnet" {
	return VALID_NETWORKS.has(network);
}

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
	if (!validateNetwork(network)) {
		return c.json({ error: "Invalid network" }, 400);
	}
	const count = Math.min(Math.max(1, Number(c.req.query("count") || "10") || 10), 25);

	try {
		const blocks = await getRecentBlocks(network, count);
		return c.json({ success: true, data: { blocks } });
	} catch (error) {
		return c.json({ error: error instanceof Error ? error.message : "Failed" }, 500);
	}
});

apiRouter.get("/block/:network/:number", async (c) => {
	const network = c.req.param("network") as "testnet" | "mainnet";
	if (!validateNetwork(network)) {
		return c.json({ error: "Invalid network" }, 400);
	}

	const blockNum = Number(c.req.param("number"));
	if (Number.isNaN(blockNum) || blockNum < 0 || !Number.isInteger(blockNum)) {
		return c.json({ error: "Block number must be a non-negative integer" }, 400);
	}

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
	if (!validateNetwork(network)) {
		return c.json({ error: "Invalid network" }, 400);
	}

	const hash = c.req.param("hash");

	if (!hash.startsWith("0x") || hash.length !== 66) {
		return c.json({ error: "Invalid transaction hash. Must be 0x + 64 hex chars." }, 400);
	}

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
	if (!validateNetwork(network)) {
		return c.json({ error: "Invalid network" }, 400);
	}

	const address = c.req.param("address");

	if (!address.startsWith("0x") || address.length !== 42) {
		return c.json({ error: "Invalid address. Must be 0x + 40 hex chars." }, 400);
	}

	try {
		const info = await getAddressInfo(network, address);
		return c.json({ success: true, data: info });
	} catch (error) {
		return c.json({ error: error instanceof Error ? error.message : "Failed" }, 500);
	}
});
