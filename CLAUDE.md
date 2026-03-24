# 0GScope

## Overview
Analytics dashboard and block explorer for the 0G network.
Supports both testnet (Galileo) and mainnet (Aristotle).

## Structure
```
src/
  index.ts            - Server + frontend routes
  ui.ts               - Server-rendered HTML
  routes/api.ts       - REST API
  services/chain.ts   - ethers.js chain queries
```

## Stack
Bun, Hono, ethers v6

## Commands
`bun install && bun run dev`
