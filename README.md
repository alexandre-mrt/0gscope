# 0GScope

[![CI](https://github.com/alexandre-mrt/0gscope/actions/workflows/ci.yml/badge.svg)](https://github.com/alexandre-mrt/0gscope/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Analytics dashboard and block explorer for the 0G network.**

Real-time chain analytics for both 0G testnet (Galileo) and mainnet (Aristotle). Search transactions, view blocks, check address balances, and monitor network health.

## Features

- **Network dashboard** - Block height, gas price, chain ID, live metrics
- **Block explorer** - View recent blocks, transaction counts, gas usage
- **Transaction viewer** - Full transaction details with status
- **Address lookup** - Balance and transaction count for any address
- **Multi-network** - Switch between testnet and mainnet
- **Search** - Find blocks, transactions, and addresses instantly
- **REST API** - Programmatic access to all data

## Quick Start

```bash
git clone https://github.com/alexandre-mrt/0gscope.git
cd 0gscope
cp .env.example .env
bun install
bun run dev
```

Open `http://localhost:3000`

## API

| Endpoint | Description |
|----------|-------------|
| `GET /api/stats/:network` | Network statistics |
| `GET /api/blocks/:network` | Recent blocks |
| `GET /api/block/:network/:number` | Block details |
| `GET /api/tx/:network/:hash` | Transaction details |
| `GET /api/address/:network/:address` | Address info |

## Revenue Model

- **API access** ($29/mo for high-rate API access)
- **Premium analytics** ($49/mo for historical data, charts, alerts)
- **Webhook notifications** ($9/mo for tx/block alerts)

## Part of the 0G Ecosystem

- [ZeroStore](https://github.com/alexandre-mrt/zerostorage) - Storage Gateway API
- [0G Agent Kit](https://github.com/alexandre-mrt/0g-agent-kit) - AI Agent SDK
- [ZeroDrop](https://github.com/alexandre-mrt/zerodrop) - File Sharing
- [AgentBazaar](https://github.com/alexandre-mrt/agentbazaar) - AI Agent Marketplace
- [DataVault](https://github.com/alexandre-mrt/datavault) - Data Marketplace

## License

MIT
