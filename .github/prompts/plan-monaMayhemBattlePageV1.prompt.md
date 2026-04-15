## Plan: Mona Mayhem Battle Page V1

Create a simple, functional battle page on the home route that collects two GitHub usernames, triggers the existing API proxy for both players, and renders a clear winner summary plus per-player status in a lightweight layout. Keep implementation in one page file for now, with small scoped styles and no component extraction until behavior is stable.

**Steps**
1. Phase 1: Page Structure and Semantics
2. Replace placeholder content in c:/Users/eugen/source/repos/mona-mayhem/src/pages/index.astro with a semantic layout:
3. Page heading and short subtitle introducing the battle arena.
4. Battle form section containing two labeled text inputs:
5. Player 1 username input.
6. Player 2 username input.
7. Primary Battle button (submit).
8. Results section with:
9. Shared status/message region for loading and top-level errors.
10. Two player result cards (one per player).
11. Battle verdict area showing winner, tie, or incomplete result.
12. Include accessible labels, button text, and ARIA-live region for dynamic status updates.
13. Phase 2: Minimal Styling (depends on Phase 1)
14. Add simple scoped CSS in c:/Users/eugen/source/repos/mona-mayhem/src/pages/index.astro:
15. Constrain content width and center the page.
16. Use a basic responsive two-column layout for inputs and player cards that collapses to one column on small screens.
17. Add clear spacing, borders, and readable type scale.
18. Keep colors neutral and minimal; avoid heavy visual theming at this stage.
19. Add simple state styles for disabled button and error text.
20. Phase 3: Client Interaction Logic (depends on Phase 1)
21. Add a small client-side script in c:/Users/eugen/source/repos/mona-mayhem/src/pages/index.astro to handle form submission.
22. On submit:
23. Prevent default navigation.
24. Read and trim both usernames.
25. Validate both are present and distinct; show immediate inline message if invalid.
26. Set loading state, disable button, clear prior results.
27. Fetch both endpoints in parallel:
28. GET /api/contributions/{player1}
29. GET /api/contributions/{player2}
30. Parse each response JSON and handle partial failures independently.
31. Render each player card with:
32. Username.
33. Contribution total from data.total_contributions when available.
34. API freshness hint from meta.stale.
35. Error code/message when player fetch fails.
36. Compute battle verdict:
37. If both succeed, compare total_contributions and show winner or tie.
38. If only one succeeds, show that player as provisional winner due to opponent error.
39. If both fail, show no contest with retry guidance.
40. Restore button state when requests complete.
41. Phase 4: Robustness and Guards (parallel with Phase 3 polish)
42. Add defensive parsing so missing fields do not break rendering (default totals to 0 only when response is successful and numeric field absent).
43. Handle network exceptions around fetch and convert to user-facing error text.
44. Avoid duplicated submissions while a battle is in progress.
45. Keep all DOM updates centralized in helper functions to reduce state bugs.
46. Phase 5: Verification (depends on Phases 2-4)
47. Manual checks in browser:
48. Empty inputs blocked.
49. Same username blocked.
50. Both valid usernames produce two cards and a verdict.
51. One valid and one invalid username shows mixed success/failure state.
52. Both invalid usernames show no contest state.
53. Confirm layout readability on desktop and mobile widths.
54. Confirm button disable/enable transitions and status announcements.

**Relevant files**
- c:/Users/eugen/source/repos/mona-mayhem/src/pages/index.astro — implement the page markup, minimal styles, and interaction script.
- c:/Users/eugen/source/repos/mona-mayhem/src/pages/api/contributions/[username].ts — existing API contract consumed by the page (no changes required for this step).
- c:/Users/eugen/source/repos/mona-mayhem/.github/copilot-instructions.md — project conventions to preserve while editing the page.

**Verification**
1. Start dev server with npm run dev and open the home route.
2. Submit two known usernames and verify totals and winner calculation.
3. Submit one malformed username and verify player-level error rendering.
4. Submit two malformed usernames and verify no contest state.
5. Inspect mobile viewport behavior for stacked layout and readable controls.
6. Confirm no TypeScript or Astro diagnostics in index page.

**Decisions**
- Keep scope to one-file implementation in index page for speed and clarity.
- Use data.total_contributions as the battle metric for V1.
- Keep styling intentionally basic; no advanced theming, animation, or component architecture yet.
- Included scope: semantic HTML structure, minimal CSS, client interaction logic, result rendering, basic validation.
- Excluded scope: advanced UI polish, persistent battle history, chart visualizations, and component extraction.

**Further Considerations**
1. If desired, next iteration can add side-by-side mini heatmaps from contribution weeks data.
2. If stale data visibility matters, add a small badge per player when meta.stale is true.
3. After V1 stabilizes, extract result card rendering into a reusable Astro or client component.