## Plan: GitHub Contributions Proxy API

Build a server-side Astro API proxy at `/api/contributions/:username` that fetches `https://github.com/{username}.contribs`, normalizes failures into consistent JSON errors, and adds in-memory caching with 5-minute TTL plus stale-if-error fallback to improve resilience and reduce upstream load.

**Steps**
1. Phase 1: Route Contract and Validation
2. Confirm and document route contract in [src/pages/api/contributions/[username].ts](src/pages/api/contributions/[username].ts): `GET /api/contributions/:username` with JSON output only.
3. Add input validation for `params.username` (required, trimmed, GitHub-safe character policy, max length guard).
4. Define a consistent response envelope for both success and errors so the frontend can rely on predictable shape.
5. Phase 2: Upstream Fetch and Error Normalization (depends on Phase 1)
6. Implement upstream request construction for `https://github.com/{username}.contribs` with timeout via `AbortController`.
7. Parse upstream response defensively; if payload is malformed JSON, return `502` with a stable error code.
8. Normalize missing-user behavior to `404` with standard JSON error payload regardless of upstream variation.
9. Map operational failures to explicit statuses:
10. `400` invalid username input.
11. `404` username not found/no contribution data.
12. `502` upstream bad response/non-JSON/unexpected status.
13. `504` upstream timeout.
14. `500` unexpected internal failure.
15. Ensure explicit `Content-Type: application/json` and include optional `Cache-Control` hints for clients.
16. Phase 3: Caching Layer (depends on Phase 2)
17. Add module-scope in-memory cache in [src/pages/api/contributions/[username].ts](src/pages/api/contributions/[username].ts) keyed by username.
18. Cache successful upstream responses for 5 minutes (`expiresAt`).
19. Add stale fallback window (recommended 30 minutes beyond TTL) for outage handling (`staleUntil`).
20. On request: return fresh cached data first; otherwise fetch upstream.
21. On upstream failure: if stale entry exists within grace window, return stale payload with metadata flag (for example `stale: true`) and warning header.
22. Add bounded cache policy to prevent unbounded growth (simple max-entry cap + oldest/expired cleanup on writes).
23. Phase 4: Observability and Hardening (parallel with verification prep)
24. Add structured server logs for cache hit/miss/stale-serve and upstream failures (no sensitive data).
25. Add lightweight internal error codes in JSON (for example `INVALID_USERNAME`, `UPSTREAM_TIMEOUT`, `UPSTREAM_BAD_RESPONSE`) for easier debugging.
26. Keep `export const prerender = false` and typed `APIRoute` usage aligned with repo conventions.
27. Phase 5: Verification (depends on Phases 2-4)
28. Validate happy path with real usernames using curl.
29. Validate invalid username handling (`400`).
30. Validate normalized missing-user response (`404`).
31. Simulate upstream timeout/failure path and verify `504`/`502` mapping.
32. Verify cache behavior manually:
33. First request causes upstream fetch (miss).
34. Immediate second request serves cache hit.
35. After TTL expiry but within stale window, force upstream failure and confirm stale response path.
36. Confirm headers and JSON schema consistency across all responses.

**Relevant files**
- `c:/Users/eugen/source/repos/mona-mayhem/src/pages/api/contributions/[username].ts` — primary implementation target for validation, fetch, normalization, and cache.
- `c:/Users/eugen/source/repos/mona-mayhem/src/pages/index.astro` — optional consumer updates only if UI needs to display stale/error metadata.
- `c:/Users/eugen/source/repos/mona-mayhem/.github/copilot-instructions.md` — reference for required API conventions (typed handlers, explicit statuses, JSON headers, non-prerendered dynamic routes).

**Verification**
1. Run `npm run dev` and call `GET /api/contributions/octocat` to verify `200` JSON and cache insertion.
2. Repeat same call immediately to verify cache hit behavior.
3. Call invalid usernames to verify `400` and stable error code.
4. Call clearly non-existent username to verify normalized `404` response.
5. Temporarily force upstream timeout/failure (short timeout or disconnected network) to validate `504/502` mapping and stale fallback.
6. Inspect response headers and body shape for consistency across success, stale success, and error cases.

**Decisions**
- Cache TTL: 5 minutes.
- Stale policy: serve stale cached data during temporary upstream failures.
- Missing user behavior: normalize to `404` with standard JSON error payload.
- Included scope: route-level proxy logic, validation, error normalization, in-memory caching, basic observability.
- Excluded scope: distributed cache (Redis), auth/rate-limiting, ETag revalidation, multi-instance cache coherence.

**Further Considerations**
1. Stale grace recommendation: 30 minutes is a good default; increase only if availability is more important than freshness.
2. Add a small max cache size (for example 500 usernames) to avoid memory pressure in long-running instances.
3. If deployed behind multiple instances, plan a follow-up to move cache to shared storage for consistency.