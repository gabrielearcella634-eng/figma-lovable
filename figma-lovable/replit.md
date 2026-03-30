# figma-lovable

A React + Vite web application for design variants.

## Architecture

- **Frontend**: React 18 + TypeScript + Vite
- **Entry point**: `src/main.tsx`
- **Root component**: `src/App.tsx`

## Project Structure

```
figma-lovable/
├── src/
│   ├── main.tsx        # App entry point
│   ├── App.tsx         # Root component
│   ├── App.css         # App-level styles
│   └── index.css       # Global styles
├── index.html          # HTML template
├── vite.config.ts      # Vite configuration
├── tsconfig.json       # TypeScript config (references)
├── tsconfig.app.json   # TypeScript config for src
├── tsconfig.node.json  # TypeScript config for Node/Vite
└── package.json        # Dependencies and scripts
```

## Development

The app runs on port 5000. Start with:

```
npm run dev
```

The Vite dev server is configured with:
- `host: '0.0.0.0'` — accessible via proxy in Replit
- `allowedHosts: true` — allows Replit's iframe proxy

## Tech Stack

- React 18
- TypeScript
- Vite
- Node.js 20
