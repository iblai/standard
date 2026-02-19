<p align="center">
  <a href="https://ibl.ai"><img src="assets/iblai-logo.png" alt="ibl.ai" width="200"></a>
</p>

<p align="center">&nbsp;</p>

<h1 align="center">.iblai Agent File Format</h1>

<p align="center">A Markdown-based portable agent definition format. One file captures everything needed to define, share, and load an AI agent — across tools, teams, and platforms.</p>

<p align="center">
  <a href="https://github.com/iblai/standard/releases/tag/v1.0.0"><img src="https://img.shields.io/badge/standard-v1.0.0-critical.svg?style=flat-square" alt="standard v1.0.0"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square" alt="MIT License"></a>
  <a href="https://github.com/iblai/standard"><img src="https://img.shields.io/badge/format-.iblai-brightgreen.svg?style=flat-square" alt=".iblai format"></a>
</p>

<p align="center">&nbsp;</p>

---

## File Structure

```
standard/
├── README.md
├── LICENSE
├── .gitignore
└── library/
    ├── university-advisor.iblai
    ├── customer-service.iblai
    ├── it-helpdesk.iblai
    └── .secrets              # Placeholder secrets template
```

## Quick Start

1. Pick an example from `library/` or start from scratch.
2. Copy `.secrets` alongside it and fill in real values.
3. Edit each section to match your agent.
4. Load the file into your platform of choice.

## Sections

An `.iblai` file is standard Markdown organized by headings. Every section is optional — include only what your agent needs.

### Agent Info

Core metadata for the agent. Fields: `name`, `description`, `picture` (URL or file path to an avatar), `version`, and `author`.

### Soul

Defines who the agent is at its core. Contains subsections for **Voice** (tone, register, language style), **Temperament** (how the agent handles ambiguity, pressure, and unknowns), **Values** (ranked principles that guide decision-making), and **Ethical Constraints** (hard boundaries the agent will never cross).

### Identity

Controls how the agent presents itself visually and socially. Fields: `emoji` (a single emoji used as the agent's icon), `theme` (light or dark), and `persona` (a one-line description of the agent's character).

### Instructions

The operating contract that governs how the agent works. Contains subsections for **Priorities** (an ordered list of what matters most), **Boundaries** (what the agent must not do), **Workflow** (step-by-step process the agent follows for each request), and **Quality Bar** (minimum standards every response must meet).

### User Preferences

Captures what the user expects from every interaction. Fields: `tone` (e.g. professional, casual, academic), `output_format` (e.g. markdown, plain text, JSON), `language` (ISO language code), and `constraints` (recurring rules like word limits or jargon restrictions).

### Memory

Long-lived persistent facts the agent retains across sessions. Use this section to store durable context like project stack details, deployment targets, team conventions, and past decisions. The agent should treat these as ground truth until explicitly updated.

### Heartbeat

Periodic maintenance routines the agent runs on a schedule. Fields: `cadence` (e.g. daily, weekly, hourly) and `tasks` (a list of recurring actions like reviewing open issues, checking for dependency updates, or running health checks).

### Skills

Discrete, reusable capabilities the agent can perform. Each skill is defined under its own subheading with fields: `id` (unique identifier), `description` (what the skill does), `tags` (categories for discovery), and `examples` (sample user prompts that trigger the skill).

### Tasks

Scheduled jobs the agent runs automatically. Each task is defined under its own subheading with fields: `frequency` (either cron notation like `0 9 * * 1` or a natural-language schedule like "every Monday at 9am") and `prompt` (the exact instruction sent to the agent when the task fires, written as a user message).

### Tools

Toggle-able built-in tools. Set each to `true` or `false`. Available tools: `web_search`, `code_interpreter`, `file_search`, `computer_use`, `shell`, `image_generation`, `url_context`, `maps`, `deep_research`, `function_calling`.

### MCP Servers

Model Context Protocol server connections. Each server is defined under its own subheading with fields: `name`, `url`, and `transport` (e.g. streamable-http, stdio). No secrets should appear in this section.

### Secrets

A reference to the companion secrets file. Contains a single field: `secrets_file` (path to a `.env` file). No actual secrets should ever appear in the `.iblai` file itself.

### Knowledge & RAG

References to datasets the agent uses for retrieval-augmented generation. List URLs, local file paths, or folder paths under **Sources**. The platform will index these and make them available to the agent at query time.

### Guardrails & Safety

Safety controls applied to every interaction. Contains subsections for **Input Filters** (preprocessing rules like PII stripping or length limits), **Output Filters** (postprocessing rules like redaction or disclaimer injection), **Content Policies** (categories of content the agent must never produce), **Blocked Topics** (specific subjects the agent must refuse), and **Prompt Safety Layers** (system-level instructions reinforcing safety behavior).

### Visibility & Permissions

Access control for the agent definition. Fields: `view` (`anyone` or `restricted`), `edit` (`anyone` or `restricted`), `editors` (list of emails or groups allowed to edit), `viewers` (list of emails or groups allowed to view).

## Design Principles

- **Human-readable** — Plain Markdown; no custom parser required to understand the file.
- **Portable** — One file captures the full agent definition.
- **Secure** — Secrets live in a separate `.env` file that is gitignored by default.
- **Extensible** — Add custom sections as needed; unknown headings are ignored by conforming parsers.

## Inspiration

The `.iblai` format draws from:

- [OpenClaw](https://github.com/anthropics/openclaw) — Agent identity, soul, memory, skills, and heartbeat concepts.
- [Model Context Protocol (MCP)](https://modelcontextprotocol.io) — Server connectivity for tools and context.
- Gemini + OpenAI SDKs — Union of built-in tool capabilities.

## License

MIT — see [LICENSE](LICENSE) for details.
