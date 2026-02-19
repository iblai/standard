# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Repo Is

This repository defines the `.iblai` agent file format — a Markdown-based portable standard for defining AI agents. A single `.iblai` file captures an agent's identity, behavior, tools, scheduled tasks, knowledge sources, safety rules, and permissions in human-readable Markdown.

## File Format

`.iblai` files are plain Markdown. Sections use `#` headings, subsections use `##`/`###`. Metadata uses bold-key list items: `- **key:** value`. All sections are optional.

**Section order:** Agent Info → Soul → Identity → Instructions → User Preferences → Memory → Heartbeat → Skills → Tasks → Tools → MCP Servers → Secrets → Knowledge & RAG → Guardrails & Safety → Visibility & Permissions

**Key rules:**
- Secrets never appear in `.iblai` files — they go in a separate `.secrets` file referenced by path
- Skills, Tasks, and MCP Servers each define entries as `##` subheadings under their parent `#` section
- Tools are boolean toggles (`true`/`false`)
- Task `frequency` accepts cron notation or natural language
- Task `prompt` is the literal user message sent to the agent when the job fires

## Repo Structure

- `library/` — Example `.iblai` files (university-advisor, customer-service, it-helpdesk) and a `.secrets` template
- `assets/` — Logo for the README
- `.editorconfig`, `.gitattributes`, `.vscode/settings.json` — Ensure `.iblai` files are treated as Markdown in editors and on GitHub

## CLI

`cli/` contains an interactive TUI wizard (TypeScript, `@clack/prompts`, `chalk`) that generates `.iblai` files. Build with `cd cli && npm install && npm run build && npm link`. Run `iblai agent` to launch the builder wizard, or `iblai help` to see available commands. Entry point is `src/index.ts` (command router), wizard logic lives in `src/agent.ts` + `src/wizard.ts`, output generation in `src/generator.ts`.

## Conventions

- When editing or creating `.iblai` files, use realistic values — no `example.com` placeholders (use `acme.com` at most)
- No inline comments referencing inspiration sources (OpenClaw, A2A, etc.) — that context belongs in the README only
- MCP Servers should reference well-known services (Slack, Google Calendar, Jira, Stripe, etc.), not fictional internal endpoints
- Indent with 2 spaces, LF line endings, UTF-8
