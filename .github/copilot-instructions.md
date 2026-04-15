# Project Guidelines

## Project Overview
- This project is a retro arcade-themed Astro web app that compares GitHub contribution activity.
- It uses Astro v5 in server mode with the Node adapter.
- Main UI entry point: src/pages/index.astro.
- API route pattern: src/pages/api/**, including src/pages/api/contributions/[username].ts.

## Build and Dev Commands
- Install dependencies: npm install
- Start local dev server: npm run dev
- Build for production: npm run build
- Preview production build locally: npm run preview

## Astro Best Practices
- Follow Astro file-based routing under src/pages (file path maps to URL path).
- Use dynamic route segments with bracket notation, for example [username].ts.
- Keep Astro page logic in frontmatter and keep markup readable in the template section.
- For API handlers, use typed Astro route exports (APIRoute) and explicit HTTP methods.
- Keep server-only dynamic API routes non-prerendered with export const prerender = false.
- Return explicit status codes and JSON content-type headers from API routes.
- Use public/ for static assets that should be served directly.
- Keep Astro configuration changes centralized in astro.config.mjs.