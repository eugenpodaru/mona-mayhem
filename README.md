🌐 [Português (Brasil)](README.pt_BR.md) | [Español](README.es.md)

<div align="center">

# 🎮 Mona Mayhem

### Build a retro arcade-style GitHub contribution battle with Astro and GitHub Copilot

**A hands-on workshop template for learning modern Copilot workflows in VS Code or the terminal.**

![Mona Mayhem Screenshot](https://github.com/user-attachments/assets/5eca79e2-cb9f-4e93-aa0d-23666ebde3b7)

*The final experience: a playful GitHub contribution showdown between two developers*

</div>

## Why this repo exists

Most workshops teach features in isolation. **Mona Mayhem** teaches them by having you build something visual, weird, and fun: a pixel-art inspired web app that compares two GitHub contribution graphs like an arcade face-off.

By the end, you will have practiced how to:

- shape good prompts and project instructions
- plan before coding
- use Copilot for multi-file implementation
- iterate on design and UX with fast feedback
- work in parallel with agents and review loops

## What you build

- **A retro arcade landing page** with strong visual personality
- **A contribution battle arena** that compares two GitHub usernames
- **An Astro app** with a server-rendered page and API route
- **A project you can keep extending** after the workshop ends

## Choose your workflow

This workshop supports two tracks so you can learn in the environment you actually use:

| Track | Best for | You'll practice |
|------|----------|-----------------|
| **VS Code** | Editor-first workflows | Chat, Plan Mode, Agent Mode, background agents, review loops |
| **GitHub Copilot CLI** | Terminal-first workflows | `copilot`, `@file` context, `/plan`, autonomous edits, `/fleet`, `/delegate`, `/review` |

Start with the [workshop overview](workshop/00-overview.md) and follow the path that fits your setup.

## Workshop journey

| Part | Title | Outcome |
|------|-------|---------|
| [00](workshop/00-overview.md) | Overview | Pick your track and understand the end goal |
| [01](workshop/01-setup.md) | Setup & Context Engineering | Prepare your tools and teach Copilot about the repo |
| [02](workshop/02-plan-and-scaffold.md) | Plan & Scaffold | Design the page and API before implementation |
| [03](workshop/03-agent-mode.md) | Build the Game | Create the battle experience with agentic help |
| [04](workshop/04-design-vibes.md) | Design-First Theming | Push the retro arcade aesthetic |
| [05](workshop/05-polish.md) | Polish & Parallel Work | Improve quality, resilience, and UX |
| [06](workshop/06-bonus.md) | Bonus & Extensions | Add your own twists and experiments |

## Quick start

1. **Create your own copy** of this repository using **Use this template** or by forking it.
2. **Clone it locally** and open it in your preferred workflow:
   - **VS Code track:** open the repo in VS Code.
   - **CLI track:** open the repo in your terminal with GitHub Copilot CLI installed.
3. **Install dependencies**:

   ```bash
   npm install
   ```

4. **Start the app**:

   ```bash
   npm run dev
   ```

5. **Begin the workshop** at [workshop/00-overview.md](workshop/00-overview.md).

## Prerequisites

### Shared

- GitHub Copilot (Pro, Business, or Enterprise)
- Git
- Node.js

### VS Code track

- VS Code v1.107+
- GitHub Copilot extension signed in

### CLI track

- GitHub Copilot CLI (`copilot`)
- Node.js 22+ if installing via `npm install -g @github/copilot`
- Or Homebrew / WinGet if you prefer native package manager install

## Tech stack

- **Framework:** [Astro](https://astro.build/) v5
- **Runtime:** Node.js with [@astrojs/node](https://docs.astro.build/en/guides/integrations-guide/node/) adapter
- **Language:** TypeScript
- **API source:** GitHub contribution graph endpoint
- **Style direction:** retro arcade / pixel-inspired UI

## Why it works well as a workshop

- **Fast feedback loop** — you can see progress in the browser immediately
- **Small but real architecture** — UI, API route, styling, and data fetching
- **High creativity ceiling** — every participant can take the design in a different direction
- **Great for Copilot practice** — planning, coding, polishing, and reviewing all matter here

## License

MIT
