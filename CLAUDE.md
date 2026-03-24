# 0GScope

## Overview
Analytics dashboard and block explorer for the 0G network.
Supports testnet (Galileo, chain ID 16602) and mainnet (Aristotle, chain ID 16661).

## Structure
```
src/
  index.ts            - Server + frontend + error handler
  ui.ts               - Server-rendered HTML (search, blocks, tx, address)
  routes/api.ts       - REST API with input validation
  services/chain.ts   - ethers.js chain queries
```

## Stack
- Runtime: Bun
- Framework: Hono
- Chain: ethers v6
- CI: GitHub Actions
- Tests: 121 tests via bun test

## Commands
- `bun install` - Setup
- `bun run dev` - Start dev server
- `bun test` - Run all 121 tests

## Key Routes
- `GET /` - Dashboard (blocks, stats)
- `GET /block/:number` - Block detail
- `GET /tx/:hash` - Transaction detail
- `GET /address/:address` - Address info
- `GET /api/networks` - Supported networks
- `GET /api/stats/:network` - Network stats
- `GET /api/blocks/:network` - Recent blocks
- `GET /api/block/:network/:number` - Block detail
- `GET /api/tx/:network/:hash` - Transaction detail
- `GET /api/address/:network/:address` - Address info
