# CLAUDE.md

## Project Overview
ElevateOS App Builder Platform - A Next.js 16 application with Cloudflare deployment.

## Tech Stack
- Next.js 16.1.4 with App Router
- React 19
- TypeScript (strict mode)
- Tailwind CSS 4
- Supabase for database
- Anthropic SDK for AI features
- OpenNext for Cloudflare deployment

## Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run cf:build     # Build for Cloudflare
npm run cf:deploy    # Build and deploy to Cloudflare
npm run cf:dev       # Run Cloudflare dev environment
```

## Project Structure
```
app/                 # Next.js App Router pages and API routes
  api/               # API routes
  elevate/           # Elevate feature pages
components/          # React components
  ui/                # UI components
lib/                 # Utilities and type definitions
  elevate-types.ts   # Type definitions
  supabase.ts        # Supabase client
```

## Path Aliases
- `@/*` maps to project root

## Code Conventions
- Use TypeScript with strict mode
- Follow Next.js App Router patterns
- Use Tailwind CSS for styling
