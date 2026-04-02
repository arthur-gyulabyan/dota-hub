# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Dota Hub — AI-powered Dota 2 draft analysis tool. Users select allied/enemy heroes and get pick recommendations from Claude (Anthropic API) with reasoning, confidence scores, and role suggestions.

## Architecture

Separate client and server packages (no workspace). Each has its own `package.json`, `node_modules`, and `tsconfig.json`. A shared `tsconfig.base.json` at the root provides common compiler options.

- **`server/`** — Express 5 + TypeScript API (ESM, port 3001)
- **`client/`** — React 19 + Vite + TypeScript SPA (port 5173, proxies `/api` to server)
- **`docs/`** — Domain model (`workflow.json`) and OpenAPI spec (`openapi.yaml`) from Qlerify

### Server layers
`routes/` → `controllers/` → `services/` → `store/`

The AI integration lives in `services/draftAnalysisService.ts` using `@anthropic-ai/sdk` with `claude-sonnet-4-6` and extended thinking enabled.

Data is stored in-memory (`store/inMemoryStore.ts`) — no database yet.

### Client layers
`pages/` → `components/` + `hooks/` → `api/`

State management via `useDraftAnalysis` hook (state machine: idle → submitting → analyzing → done/error). API calls go through typed wrappers in `api/client.ts`.

Hero list is in `data/heroes.ts`.

## Build & Run

```bash
# Server
cd server
npm install
cp .env.example .env   # add ANTHROPIC_API_KEY
npm run dev             # tsx watch, port 3001

# Client (separate terminal)
cd client
npm install
npm run dev             # vite, port 5173
```

### Other commands
```bash
# Server
cd server && npx tsc --noEmit    # type-check
cd server && npm run build       # compile to dist/

# Client
cd client && npm run build       # tsc + vite build
cd client && npm run lint        # eslint
```

## API Endpoints

All under `/api/v1`:
- `POST /submit-draft` — `{ userTeam, alliedPicks, enemyPicks }` → DraftState
- `POST /analyze-draft` — `{ draftStateId }` → HeroRecommendation[]
- `GET /recommendations/:draftStateId` → HeroRecommendation[]

## Domain Model

Managed in Qlerify (project "Dota Hub", workflow "Best Pick", bounded context "Draft Analysis"). The source of truth for entities and API contracts is in `docs/`.

Two entities: `DraftState` (userTeam, alliedPicks, enemyPicks) and `HeroRecommendation` (heroName, reasoning, confidence, role).

## Conventions

- Server uses `.js` extensions in imports (ESM requirement with TypeScript)
- Client uses `type` imports for interfaces (`import type { ... }`)
- Client tsconfig has `verbatimModuleSyntax` — type-only imports are enforced
- Express 5 route params are `string | string[]` — cast with `as string`

## Code Style

- Arrow functions only — no `function` declarations (exceptions: class/object methods)
- Always wrap parameters in parentheses, even single params: `(x) => ...` not `x => ...`
- The last `return` statement in a function must be preceded by one empty line
- No one-line `if` statements without braces — always use `{ }`
- Always use semicolons
- No section comments in JSX templates or CSS (no `{/* Header */}`, `/* ═══ Section ═══ */` etc.)
