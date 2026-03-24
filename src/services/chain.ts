import { ethers } from "ethers";

const TESTNET_RPC = process.env.ZG_EVM_RPC || "https://evmrpc-testnet.0g.ai";
const MAINNET_RPC = process.env.ZG_MAINNET_RPC || "https://evmrpc.0g.ai";

export interface NetworkStats {
	network: string;
	blockNumber: number;
	gasPrice: string;
	chainId: number;
	timestamp: number;
}

export interface BlockInfo {
	number: number;
	hash: string;
	parentHash: string;
	timestamp: number;
	gasUsed: string;
	gasLimit: string;
	transactionCount: number;
	miner: string;
}

export interface TxInfo {
	hash: string;
	from: string;
	to: string | null;
	value: string;
	gasPrice: string;
	gasUsed: string;
	blockNumber: number;
	timestamp: number;
	status: boolean;
}

function getProvider(network: "testnet" | "mainnet"): ethers.JsonRpcProvider {
	return new ethers.JsonRpcProvider(network === "mainnet" ? MAINNET_RPC : TESTNET_RPC);
}

export async function getNetworkStats(network: "testnet" | "mainnet"): Promise<NetworkStats> {
	const provider = getProvider(network);
	const [blockNumber, feeData, net] = await Promise.all([
		provider.getBlockNumber(),
		provider.getFeeData(),
		provider.getNetwork(),
	]);

	return {
		network,
		blockNumber,
		gasPrice: feeData.gasPrice ? ethers.formatUnits(feeData.gasPrice, "gwei") : "0",
		chainId: Number(net.chainId),
		timestamp: Date.now(),
	};
}

export async function getRecentBlocks(
	network: "testnet" | "mainnet",
	count: number = 10,
): Promise<BlockInfo[]> {
	const provider = getProvider(network);
	const latest = await provider.getBlockNumber();
	const blocks: BlockInfo[] = [];

	const promises = [];
	for (let i = 0; i < count; i++) {
		promises.push(provider.getBlock(latest - i));
	}

	const results = await Promise.all(promises);

	for (const block of results) {
		if (!block) continue;
		blocks.push({
			number: block.number,
			hash: block.hash ?? "",
			parentHash: block.parentHash,
			timestamp: block.timestamp,
			gasUsed: block.gasUsed.toString(),
			gasLimit: block.gasLimit.toString(),
			transactionCount: block.transactions.length,
			miner: block.miner ?? "",
		});
	}

	return blocks;
}

export async function getBlock(
	network: "testnet" | "mainnet",
	blockNumber: number,
): Promise<BlockInfo | null> {
	const provider = getProvider(network);
	const block = await provider.getBlock(blockNumber, true);
	if (!block) return null;

	return {
		number: block.number,
		hash: block.hash ?? "",
		parentHash: block.parentHash,
		timestamp: block.timestamp,
		gasUsed: block.gasUsed.toString(),
		gasLimit: block.gasLimit.toString(),
		transactionCount: block.transactions.length,
		miner: block.miner ?? "",
	};
}

export async function getTransaction(
	network: "testnet" | "mainnet",
	txHash: string,
): Promise<TxInfo | null> {
	const provider = getProvider(network);
	const [tx, receipt] = await Promise.all([
		provider.getTransaction(txHash),
		provider.getTransactionReceipt(txHash),
	]);

	if (!tx) return null;

	const block = tx.blockNumber ? await provider.getBlock(tx.blockNumber) : null;

	return {
		hash: tx.hash,
		from: tx.from,
		to: tx.to,
		value: ethers.formatEther(tx.value),
		gasPrice: tx.gasPrice ? ethers.formatUnits(tx.gasPrice, "gwei") : "0",
		gasUsed: receipt ? receipt.gasUsed.toString() : "0",
		blockNumber: tx.blockNumber ?? 0,
		timestamp: block?.timestamp ?? 0,
		status: receipt ? receipt.status === 1 : false,
	};
}

export async function getAddressInfo(
	network: "testnet" | "mainnet",
	address: string,
): Promise<{ address: string; balance: string; txCount: number }> {
	const provider = getProvider(network);
	const [balance, txCount] = await Promise.all([
		provider.getBalance(address),
		provider.getTransactionCount(address),
	]);

	return {
		address,
		balance: ethers.formatEther(balance),
		txCount,
	};
}
