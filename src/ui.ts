import type { BlockInfo, NetworkStats } from "./services/chain";

function esc(s: string): string {
	return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function truncate(s: string, len = 16): string {
	return s.length > len ? `${s.slice(0, len / 2)}...${s.slice(-len / 2 + 2)}` : s;
}

function timeAgo(ts: number): string {
	const s = Math.floor(Date.now() / 1000 - ts);
	if (s < 60) return `${s}s ago`;
	if (s < 3600) return `${Math.floor(s / 60)}m ago`;
	return `${Math.floor(s / 3600)}h ago`;
}

const CSS = `
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,monospace;background:#050505;color:#e5e5e5;font-size:14px}
a{color:#60a5fa;text-decoration:none}a:hover{text-decoration:underline}
.header{border-bottom:1px solid #1a1a1a;padding:0.75rem 2rem;display:flex;align-items:center;justify-content:space-between}
.header h1{font-size:1.125rem;font-weight:800;color:#60a5fa}
.header nav{display:flex;gap:1rem;font-size:0.8rem}
.header nav a{color:#737373}
.header nav a:hover{color:#e5e5e5}
.search-bar{max-width:600px;margin:1.5rem auto;padding:0 2rem;display:flex;gap:0.5rem}
.search-bar input{flex:1;background:#111;border:1px solid #222;border-radius:0.375rem;padding:0.5rem 0.75rem;color:#e5e5e5;font-family:inherit}
.search-bar button{background:#1d4ed8;color:white;border:none;border-radius:0.375rem;padding:0.5rem 1rem;cursor:pointer;font-weight:600}
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;max-width:900px;margin:0 auto;padding:1rem 2rem}
.stat{background:#111;border:1px solid #1a1a1a;border-radius:0.5rem;padding:1rem;text-align:center}
.stat .val{font-size:1.5rem;font-weight:700;color:#60a5fa}
.stat .lbl{font-size:0.7rem;color:#525252;margin-top:0.25rem}
.section{max-width:900px;margin:1.5rem auto;padding:0 2rem}
.section h2{font-size:1rem;font-weight:700;margin-bottom:0.75rem;color:#a3a3a3}
table{width:100%;border-collapse:collapse}
th{text-align:left;font-size:0.7rem;color:#525252;padding:0.5rem;border-bottom:1px solid #1a1a1a;text-transform:uppercase}
td{padding:0.5rem;border-bottom:1px solid #111;font-size:0.8rem}
tr:hover{background:#111}
.badge{display:inline-block;padding:0.125rem 0.375rem;border-radius:0.25rem;font-size:0.625rem;font-weight:600}
.badge-success{background:#052e16;color:#4ade80}
.badge-fail{background:#2e0505;color:#f87171}
.net-switch{display:flex;gap:0.5rem;align-items:center}
.net-switch a{padding:0.25rem 0.75rem;border-radius:1rem;font-size:0.75rem;background:#1a1a1a;color:#737373}
.net-switch a.active{background:#1d4ed8;color:white}
.mono{font-family:monospace}
`;

function layout(title: string, body: string): string {
	return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>${esc(title)} | 0GScope</title><style>${CSS}</style></head><body>
<header class="header">
	<a href="/"><h1>0GScope</h1></a>
	<nav>
		<a href="/">Dashboard</a>
		<a href="/?network=mainnet">Mainnet</a>
		<a href="/?network=testnet">Testnet</a>
	</nav>
</header>
${body}
<script>
function search(){const q=document.getElementById('q').value;if(q.startsWith('0x')&&q.length===66)location.href='/tx/'+q;else if(q.startsWith('0x')&&q.length===42)location.href='/address/'+q;else if(!isNaN(q))location.href='/block/'+q;else alert('Enter a tx hash, address, or block number');}
</script>
</body></html>`;
}

export function dashboardPage(
	stats: NetworkStats,
	blocks: BlockInfo[],
	network: string,
): string {
	const blockRows = blocks.map((b) => `
<tr>
	<td><a href="/block/${b.number}?network=${network}">${b.number}</a></td>
	<td class="mono">${truncate(b.hash, 20)}</td>
	<td>${b.transactionCount}</td>
	<td>${Number(b.gasUsed).toLocaleString()}</td>
	<td>${timeAgo(b.timestamp)}</td>
</tr>`).join("");

	return layout("Dashboard", `
<div class="search-bar">
	<input id="q" placeholder="Search by tx hash, address, or block number..." onkeydown="if(event.key==='Enter')search()" />
	<button onclick="search()">Search</button>
</div>

<div class="stats">
	<div class="stat"><div class="val">${stats.blockNumber.toLocaleString()}</div><div class="lbl">Block Height</div></div>
	<div class="stat"><div class="val">${Number(stats.gasPrice).toFixed(2)}</div><div class="lbl">Gas Price (Gwei)</div></div>
	<div class="stat"><div class="val">${stats.chainId}</div><div class="lbl">Chain ID</div></div>
	<div class="stat"><div class="val">${network === "mainnet" ? "Aristotle" : "Galileo"}</div><div class="lbl">Network</div></div>
</div>

<div class="section">
	<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem">
		<h2>Recent Blocks</h2>
		<div class="net-switch">
			<a href="/?network=testnet" class="${network === "testnet" ? "active" : ""}">Testnet</a>
			<a href="/?network=mainnet" class="${network === "mainnet" ? "active" : ""}">Mainnet</a>
		</div>
	</div>
	<table>
		<thead><tr><th>Block</th><th>Hash</th><th>Txns</th><th>Gas Used</th><th>Time</th></tr></thead>
		<tbody>${blockRows}</tbody>
	</table>
</div>`);
}

export function blockPage(block: BlockInfo, network: string): string {
	return layout(`Block #${block.number}`, `
<div class="section" style="margin-top:2rem">
	<h2>Block #${block.number}</h2>
	<table style="margin-top:1rem">
		<tr><td style="color:#525252;width:150px">Block Hash</td><td class="mono">${esc(block.hash)}</td></tr>
		<tr><td style="color:#525252">Parent Hash</td><td class="mono">${esc(block.parentHash)}</td></tr>
		<tr><td style="color:#525252">Timestamp</td><td>${new Date(block.timestamp * 1000).toISOString()} (${timeAgo(block.timestamp)})</td></tr>
		<tr><td style="color:#525252">Transactions</td><td>${block.transactionCount}</td></tr>
		<tr><td style="color:#525252">Gas Used</td><td>${Number(block.gasUsed).toLocaleString()}</td></tr>
		<tr><td style="color:#525252">Gas Limit</td><td>${Number(block.gasLimit).toLocaleString()}</td></tr>
		<tr><td style="color:#525252">Miner</td><td class="mono"><a href="/address/${block.miner}?network=${network}">${esc(block.miner)}</a></td></tr>
		<tr><td style="color:#525252">Network</td><td>${network}</td></tr>
	</table>
</div>`);
}

export function txPage(tx: { hash: string; from: string; to: string | null; value: string; gasPrice: string; gasUsed: string; blockNumber: number; timestamp: number; status: boolean }, network: string): string {
	return layout(`Tx ${truncate(tx.hash)}`, `
<div class="section" style="margin-top:2rem">
	<h2>Transaction Details</h2>
	<table style="margin-top:1rem">
		<tr><td style="color:#525252;width:150px">Tx Hash</td><td class="mono">${esc(tx.hash)}</td></tr>
		<tr><td style="color:#525252">Status</td><td><span class="badge ${tx.status ? "badge-success" : "badge-fail"}">${tx.status ? "Success" : "Failed"}</span></td></tr>
		<tr><td style="color:#525252">Block</td><td><a href="/block/${tx.blockNumber}?network=${network}">${tx.blockNumber}</a></td></tr>
		<tr><td style="color:#525252">Timestamp</td><td>${tx.timestamp ? new Date(tx.timestamp * 1000).toISOString() : "pending"}</td></tr>
		<tr><td style="color:#525252">From</td><td class="mono"><a href="/address/${tx.from}?network=${network}">${esc(tx.from)}</a></td></tr>
		<tr><td style="color:#525252">To</td><td class="mono">${tx.to ? `<a href="/address/${tx.to}?network=${network}">${esc(tx.to)}</a>` : "Contract Creation"}</td></tr>
		<tr><td style="color:#525252">Value</td><td>${tx.value} 0G</td></tr>
		<tr><td style="color:#525252">Gas Price</td><td>${tx.gasPrice} Gwei</td></tr>
		<tr><td style="color:#525252">Gas Used</td><td>${Number(tx.gasUsed).toLocaleString()}</td></tr>
	</table>
</div>`);
}

export function addressPage(info: { address: string; balance: string; txCount: number }, network: string): string {
	return layout(`Address ${truncate(info.address)}`, `
<div class="section" style="margin-top:2rem">
	<h2>Address</h2>
	<table style="margin-top:1rem">
		<tr><td style="color:#525252;width:150px">Address</td><td class="mono">${esc(info.address)}</td></tr>
		<tr><td style="color:#525252">Balance</td><td>${info.balance} 0G</td></tr>
		<tr><td style="color:#525252">Transactions</td><td>${info.txCount}</td></tr>
		<tr><td style="color:#525252">Network</td><td>${network}</td></tr>
	</table>
</div>`);
}

export function errorPage(msg: string): string {
	return layout("Error", `<div style="text-align:center;padding:4rem;color:#525252"><p>${esc(msg)}</p><a href="/" style="display:inline-block;margin-top:1rem">Back to dashboard</a></div>`);
}
