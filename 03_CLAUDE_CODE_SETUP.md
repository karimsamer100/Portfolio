# Claude Code — Lean Tooling & Launch Plan

**For Karim's portfolio website. Updated: October 2026.**  
This file is for **environment setup**, not public website copy. Tools may evolve; confirm their current names and availability in your installed Claude Code version.

## Why lean is better

Do **not** install fifteen agents and MCP servers "for quality." Good source material, a strong concept and browser-based verification matter much more. Every enabled plugin contributes at least some tool/skill description context, and browser tools often overlap. Claude Code supports on-demand tool discovery for MCP, but that does not make unnecessary integrations completely free.

## Minimal starting kit

### 1. Claude Code's native capabilities — no plugin required

- `CLAUDE.md` is the persistent, short project contract.
- **Plan mode** for concept/architecture before implementation (toggle `Shift+Tab` to Plan or launch `claude --permission-mode plan`).
- `/context` to inspect loaded context; `/clear` between unrelated long sessions.
- `/doctor` for installation, plugins and MCP overhead review.
- Built-in `/run` and `/verify` when available to launch/confirm the actual app.
- Shell tools, Git and normal test/build commands for code-level work.

### 2. Frontend Design — first plugin to install

Official Anthropic skill focused on intentional, distinct frontend work rather than routine AI aesthetics.

**Inside a Claude Code session:**

```text
/plugin marketplace add anthropics/claude-plugins-official
/plugin install frontend-design@claude-plugins-official
```

Check `/plugin` to verify installation. Its presence is **not a substitute for** the actual brief or creative review.

### 3. Browser testing — choose ONE primary browser automation solution

**Microsoft Playwright MCP** is a strong choice for inspection, real interactions, screenshots, and regression-style testing once there is a running site. Install when browser-based QA becomes necessary; don't spend early discovery tokens debugging a browser server.

**Terminal (in the project directory, requires suitable Node.js):**

```bash
claude mcp add --scope local playwright -- npx -y @playwright/mcp@latest
claude mcp list
```

Alternatively use the Playwright plugin from Claude's plugin catalog if available on your installation. **Do not install the plugin and standalone Playwright server together** unless there is a specific reason. Avoid adding Chrome DevTools MCP at the same time just because it exists; add it later only for a specific profiling/debugging gap.

## Optional later additions — install on demand

### Context7 — up-to-date framework/library documentation

Useful when Claude needs accurate, current library APIs and configuration, especially for animation frameworks or unfamiliar packages. Not essential for initial concept work.

**Inside Claude Code:**

```text
/plugin marketplace add upstash/context7
/plugin install context7@context7-marketplace
```

Then follow the plugin's `/mcp` authentication instructions. Context7 can also be configured separately as an MCP server; **pick one approach, not both**.

### Figma — if we actually choose a Figma-first design workflow

Connect Figma's official MCP integration **only if an actual Figma design file is part of the workflow**. The portfolio brief does not mandate Figma. If the creative approach is better explored in browser prototypes, don't introduce a tool just to say it was used.

### GitHub — use `gh` CLI first when possible

For repository inspection, branches, issues and PRs, the GitHub CLI is often more context-efficient than adding a large GitHub MCP schema:

```bash
gh --version
gh auth status
```

Authenticate with `gh auth login` only if needed. Confirm that the session is authorized for **Karim's actual account or selected portfolio repository**; do not assume a different connected account is his.

### Chrome DevTools MCP — only for profiling needs

Optional if Playwright and local DevTools are insufficient for diagnosing performance, layout, or runtime issues. Evaluate the need before adding another browser integration.

## Project workflow to avoid wasted tokens

1. **One-time discovery:** Read the two primary docs; review only relevant GitHub repos and usable assets. Write a *concise* findings memo. Do not repeat the full CV back.
2. **Concept decision:** Present 2–3 genuinely distinct concepts and one recommendation, with trade-offs and representative visual explorations. Get approval before full implementation.
3. **Plan the smallest impressive vertical slice:** A remarkable first-screen experience + one authentic project/content treatment + mobile adaptation.
4. **Implement in milestones:** Build, browser-test, screenshot, compare, iterate. Report only findings and diffs; avoid huge terminal logs.
5. **After concept approval:** Add technologies only when justified by the experience. Avoid installing animations, CMS, 3D and hosting stacks all at once.
6. **Context hygiene:** Keep `CLAUDE.md` short, archive decisions in repository files, use subagents only for bounded work where separate research context helps, and use `/clear` when moving to unrelated major tasks.
7. **Before release:** End-to-end flows, real-device responsive QA, accessibility, reduced-motion, performance, factual accuracy, SEO and actual deployment verification.

## Copy-paste kickoff prompt

```text
Read CLAUDE.md, 01_PERSONAL_PROFILE.md, and 02_PORTFOLIO_CREATIVE_BRIEF.md.
This is a world-class personal brand + engineering portfolio commission for Karim Samer.
The creative direction is intentionally NOT selected. Do not start by generating a generic
Next.js template or copying Lando Norris or any other portfolio.

First:
1) Extract the distinctive, verified raw material about Karim in a concise source audit.
2) Research a small number of world-class interactive/editorial sites for transferable
   design principles, NOT layouts to clone.
3) Propose 2-3 boldly different, ORIGINAL creative concepts with compelling central ideas,
   first 10-second visitor journeys, signature interactions, content treatment, mobile
   experience, accessibility/performance trade-offs and execution difficulty.
4) Recommend one with clear reasoning, while keeping the owner as final decision-maker.
5) Identify at most 3 truly blocking questions and stop for review.

I want staggering creativity and extraordinary craft, not a safe default.
Do not lock aesthetic choices, choose the final tech stack, or build the full site yet.
Use concise outputs and avoid repetitive token-heavy explanations.
```

## Authoritative documentation

- Claude Code best practices: https://code.claude.com/docs/en/best-practices
- Claude Code memory (`CLAUDE.md`): https://code.claude.com/docs/en/memory
- Claude Code plugins: https://code.claude.com/docs/en/plugins
- Claude Code skills: https://code.claude.com/docs/en/skills
- Claude Code MCP: https://code.claude.com/docs/en/mcp
- Official frontend-design plugin: https://github.com/anthropics/claude-plugins-official/tree/main/plugins/frontend-design
- Microsoft Playwright MCP: https://github.com/microsoft/playwright-mcp
- Context7 Claude Code setup: https://github.com/upstash/context7/blob/master/docs/clients/claude-code.mdx
