import * as p from "@clack/prompts";
import {
  heading,
  dim,
  colors,
  sectionBanner,
  animatedTransition,
  progressBar,
  sparkle,
  bullet,
} from "./theme.js";
import type { AgentData } from "./generator.js";

// ── Section metadata ────────────────────────────────────

interface Section {
  emoji: string;
  title: string;
  subtitle: string;
  transition: string;
}

const SECTIONS: Section[] = [
  { emoji: "🤖", title: "Agent Info",              subtitle: "Name, description, and metadata",         transition: "Setting up identity..." },
  { emoji: "🧠", title: "Soul",                    subtitle: "Voice, temperament, values, ethics",      transition: "Shaping personality..." },
  { emoji: "🎨", title: "Identity",                subtitle: "Visual presence and persona",             transition: "Designing the look..." },
  { emoji: "📋", title: "Instructions",            subtitle: "Priorities, boundaries, and workflow",    transition: "Writing the playbook..." },
  { emoji: "💬", title: "User Preferences",        subtitle: "Tone, format, language, constraints",     transition: "Tuning preferences..." },
  { emoji: "💾", title: "Memory",                  subtitle: "Persistent facts across sessions",        transition: "Loading memory banks..." },
  { emoji: "💓", title: "Heartbeat",               subtitle: "Scheduled maintenance routines",          transition: "Setting the pulse..." },
  { emoji: "⚡", title: "Skills",                  subtitle: "Discrete capabilities your agent has",    transition: "Wiring up skills..." },
  { emoji: "📅", title: "Tasks",                   subtitle: "Scheduled jobs that run automatically",   transition: "Scheduling tasks..." },
  { emoji: "🔧", title: "Tools",                   subtitle: "Built-in tool toggles",                   transition: "Configuring toolbox..." },
  { emoji: "🔌", title: "MCP Servers",             subtitle: "External server connections",              transition: "Plugging in servers..." },
  { emoji: "🔐", title: "Secrets",                 subtitle: "Reference your secrets file",             transition: "Securing credentials..." },
  { emoji: "📚", title: "Knowledge & RAG",         subtitle: "Data sources for retrieval",              transition: "Indexing knowledge..." },
  { emoji: "🛡️", title: "Guardrails & Safety",     subtitle: "Filters, policies, and blocked topics",   transition: "Activating safety nets..." },
  { emoji: "👁️", title: "Visibility & Permissions", subtitle: "Access control for your agent",           transition: "Setting permissions..." },
];

const TOTAL_SECTIONS = SECTIONS.length;
const SKIP_HINT = colors.dim("  Enter to skip");

// ── Helpers ─────────────────────────────────────────────

function isCancelled(value: unknown): value is symbol {
  return p.isCancel(value);
}

function bail(): never {
  p.cancel(colors.error("Agent creation cancelled."));
  process.exit(0);
}

async function enterSection(index: number): Promise<void> {
  const s = SECTIONS[index];
  console.log("");
  console.log(progressBar(index + 1, TOTAL_SECTIONS));
  console.log("");
  console.log(sectionBanner(s.emoji, s.title, s.subtitle));
  console.log("");
}

async function leaveSection(index: number, save: () => void): Promise<void> {
  const s = SECTIONS[index];
  save();
  await animatedTransition(s.transition, 450);
}

async function askText(opts: {
  message: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: string;
}): Promise<string | undefined> {
  const msg = opts.required
    ? opts.message
    : `${opts.message} ${SKIP_HINT}`;
  const value = await p.text({
    message: msg,
    placeholder: opts.placeholder,
    defaultValue: opts.defaultValue,
    validate: opts.required
      ? (v) => {
          if (!v.trim()) return "This field is required.";
        }
      : undefined,
  });
  if (isCancelled(value)) bail();
  return (value as string).trim() || undefined;
}

async function askConfirm(message: string, initial = true): Promise<boolean> {
  const value = await p.confirm({ message, initialValue: initial });
  if (isCancelled(value)) bail();
  return value as boolean;
}

async function askSelect(
  message: string,
  options: { value: string; label: string }[]
): Promise<string> {
  const value = await p.select({
    message,
    options: options as { value: string; label?: string }[],
  });
  if (isCancelled(value)) bail();
  return value as string;
}

async function askMultiSelect(
  message: string,
  options: { value: string; label: string }[],
  required = false
): Promise<string[]> {
  const value = await p.multiselect({
    message,
    options: options as { value: string; label?: string }[],
    required,
  });
  if (isCancelled(value)) bail();
  return value as string[];
}

async function collectList(
  itemLabel: string,
  promptMsg: string
): Promise<string[]> {
  const items: string[] = [];
  const add = await askConfirm(
    sparkle(`Add ${itemLabel}s?`),
    false
  );
  if (!add) return items;

  let more = true;
  while (more) {
    const val = await askText({ message: promptMsg, required: true });
    if (val) {
      items.push(val);
      p.log.success(colors.success(`  ${bullet(val)}`));
    }
    more = await askConfirm(
      `Add another ${itemLabel}? ${colors.dim(`(${items.length} so far)`)}`,
      false
    );
  }
  return items;
}

async function collectTextarea(message: string): Promise<string | undefined> {
  const value = await p.text({ message: `${message} ${SKIP_HINT}`, placeholder: "" });
  if (isCancelled(value)) bail();
  return (value as string).trim() || undefined;
}

const ALL_TOOLS = [
  "web_search",
  "code_interpreter",
  "file_search",
  "computer_use",
  "shell",
  "image_generation",
  "url_context",
  "maps",
  "deep_research",
  "function_calling",
] as const;

function sectionSkipHint(title: string): string {
  return sparkle(`Configure ${title}?`) + "  " + colors.dim("No to skip");
}

// ── Main wizard ─────────────────────────────────────────

export async function runWizard(data: AgentData, save: () => void): Promise<void> {

  // 0 ── Agent Info ──────────────────────────────────────
  await enterSection(0);

  data.name = (await askText({
    message: "Agent name",
    placeholder: "My Agent",
    required: true,
  }))!;

  data.description = await askText({
    message: "Description",
    placeholder: "What does this agent do?",
  });

  data.picture = await askText({
    message: "Picture URL",
    placeholder: "https://acme.com/avatar.png",
  });

  data.version = await askText({
    message: "Version",
    placeholder: "1.0.0",
    defaultValue: "1.0.0",
  });

  data.author = await askText({
    message: "Author",
    placeholder: "Your name or team",
  });

  await leaveSection(0, save);

  // 1 ── Soul ────────────────────────────────────────────
  const addSoul = await askConfirm(
    sectionSkipHint("Soul"),
    false
  );
  if (addSoul) {
    await enterSection(1);

    data.voice = await collectTextarea(
      "Voice — describe tone, register, language style"
    );
    data.temperament = await collectTextarea(
      "Temperament — how the agent handles ambiguity and pressure"
    );
    data.values = await collectList("value", "Enter a core value");
    data.ethicalConstraints = await collectList(
      "ethical constraint",
      "Enter an ethical constraint"
    );

    await leaveSection(1, save);
  }

  // 2 ── Identity ────────────────────────────────────────
  const addIdentity = await askConfirm(
    sectionSkipHint("Identity"),
    false
  );
  if (addIdentity) {
    await enterSection(2);

    data.emoji = await askText({
      message: "Emoji icon",
      placeholder: "🤖",
    });

    data.theme = (await askSelect("Theme", [
      { value: "light", label: "☀️  Light" },
      { value: "dark", label: "🌙  Dark" },
    ])) as "light" | "dark";

    data.persona = await askText({
      message: "Persona — one-line character description",
      placeholder: "A helpful assistant that...",
    });

    await leaveSection(2, save);
  }

  // 3 ── Instructions ────────────────────────────────────
  const addInstructions = await askConfirm(
    sectionSkipHint("Instructions"),
    false
  );
  if (addInstructions) {
    await enterSection(3);

    data.priorities = await collectList("priority", "Enter a priority");
    data.boundaries = await collectList(
      "boundary",
      "Enter a boundary (what the agent must not do)"
    );
    data.workflow = await collectList("workflow step", "Enter a workflow step");
    data.qualityBar = await collectList(
      "quality standard",
      "Enter a quality standard"
    );

    await leaveSection(3, save);
  }

  // 4 ── User Preferences ───────────────────────────────
  const addPrefs = await askConfirm(
    sectionSkipHint("User Preferences"),
    false
  );
  if (addPrefs) {
    await enterSection(4);

    data.tone = await askSelect("Tone", [
      { value: "professional", label: "👔  Professional" },
      { value: "friendly", label: "😊  Friendly" },
      { value: "casual", label: "🤙  Casual" },
      { value: "academic", label: "🎓  Academic" },
    ]);

    data.outputFormat = await askSelect("Output format", [
      { value: "markdown", label: "📝  Markdown" },
      { value: "plain text", label: "📄  Plain text" },
      { value: "json", label: "🔣  JSON" },
    ]);

    data.language = await askText({
      message: "Language (ISO code)",
      placeholder: "en",
      defaultValue: "en",
    });

    data.constraints = await collectList(
      "constraint",
      "Enter a constraint (e.g., word limits, formatting rules)"
    );

    await leaveSection(4, save);
  }

  // 5 ── Memory ──────────────────────────────────────────
  const addMemory = await askConfirm(
    sectionSkipHint("Memory"),
    false
  );
  if (addMemory) {
    await enterSection(5);
    data.memory = await collectList(
      "persistent fact",
      "Enter a persistent fact the agent should remember"
    );
    await leaveSection(5, save);
  }

  // 6 ── Heartbeat ───────────────────────────────────────
  const addHeartbeat = await askConfirm(
    sectionSkipHint("Heartbeat"),
    false
  );
  if (addHeartbeat) {
    await enterSection(6);

    data.heartbeatCadence = await askSelect("Cadence", [
      { value: "every 15 minutes", label: "⚡  Every 15 minutes" },
      { value: "hourly", label: "🕐  Hourly" },
      { value: "daily", label: "📆  Daily" },
      { value: "weekly", label: "🗓️  Weekly" },
    ]);

    data.heartbeatTasks = await collectList(
      "recurring task",
      "Describe a recurring maintenance task"
    );

    await leaveSection(6, save);
  }

  // 7 ── Skills ──────────────────────────────────────────
  const addSkills = await askConfirm(
    sectionSkipHint("Skills"),
    false
  );
  if (addSkills) {
    await enterSection(7);

    let moreSkills = true;
    data.skills = [];
    let skillCount = 0;
    while (moreSkills) {
      skillCount++;
      p.log.info(
        colors.primaryBright(`  ⚡ Skill #${skillCount}`)
      );

      const skillName = (await askText({
        message: "Skill name",
        required: true,
      }))!;
      const skillId = (await askText({
        message: "Skill ID",
        placeholder: skillName.toLowerCase().replace(/\s+/g, "_"),
        defaultValue: skillName.toLowerCase().replace(/\s+/g, "_"),
      }))!;
      const skillDesc = (await askText({
        message: "Skill description",
        required: true,
      }))!;
      const skillTags =
        (await askText({
          message: "Tags (comma-separated)",
          placeholder: "tag1, tag2, tag3",
        })) || "";
      const examples = await collectList(
        "example prompt",
        "Enter an example user prompt that triggers this skill"
      );

      data.skills.push({
        name: skillName,
        id: skillId,
        description: skillDesc,
        tags: skillTags,
        examples,
      });

      p.log.success(colors.success(`  ✔ Skill "${skillName}" added`));
      moreSkills = await askConfirm("Add another skill?", false);
    }

    await leaveSection(7, save);
  }

  // 8 ── Tasks ───────────────────────────────────────────
  const addTasks = await askConfirm(
    sectionSkipHint("Tasks"),
    false
  );
  if (addTasks) {
    await enterSection(8);

    let moreTasks = true;
    data.tasks = [];
    let taskCount = 0;
    while (moreTasks) {
      taskCount++;
      p.log.info(
        colors.primaryBright(`  📅 Task #${taskCount}`)
      );

      const taskName = (await askText({
        message: "Task name",
        required: true,
      }))!;
      const frequency = (await askText({
        message: "Frequency (cron or natural language)",
        placeholder: "every Monday at 9am",
        required: true,
      }))!;
      const prompt = (await askText({
        message: "Prompt — the message sent when this task fires",
        required: true,
      }))!;

      data.tasks.push({ name: taskName, frequency, prompt });
      p.log.success(colors.success(`  ✔ Task "${taskName}" scheduled`));
      moreTasks = await askConfirm("Add another task?", false);
    }

    await leaveSection(8, save);
  }

  // 9 ── Tools ───────────────────────────────────────────
  const addTools = await askConfirm(
    sectionSkipHint("Tools"),
    false
  );
  if (addTools) {
    await enterSection(9);

    const enabled = await askMultiSelect(
      "Select tools to enable",
      ALL_TOOLS.map((t) => ({ value: t, label: `🔧 ${t}` }))
    );

    data.tools = {};
    for (const tool of ALL_TOOLS) {
      data.tools[tool] = enabled.includes(tool);
    }

    const onCount = enabled.length;
    p.log.success(
      colors.success(`  ✔ ${onCount} tool${onCount === 1 ? "" : "s"} enabled`)
    );

    await leaveSection(9, save);
  }

  // 10 ── MCP Servers ────────────────────────────────────
  const addMcp = await askConfirm(
    sectionSkipHint("MCP Servers"),
    false
  );
  if (addMcp) {
    await enterSection(10);

    let moreMcp = true;
    data.mcpServers = [];
    let mcpCount = 0;
    while (moreMcp) {
      mcpCount++;
      p.log.info(
        colors.primaryBright(`  🔌 Server #${mcpCount}`)
      );

      const name = (await askText({
        message: "Server name",
        placeholder: "Slack",
        required: true,
      }))!;
      const url = (await askText({
        message: "Server URL",
        placeholder: "https://mcp.slack.com",
        required: true,
      }))!;
      const transport = await askSelect("Transport", [
        { value: "streamable-http", label: "🌐  streamable-http" },
        { value: "stdio", label: "🖥️  stdio" },
      ]);

      data.mcpServers.push({ name, url, transport });
      p.log.success(colors.success(`  ✔ Server "${name}" connected`));
      moreMcp = await askConfirm("Add another MCP server?", false);
    }

    await leaveSection(10, save);
  }

  // 11 ── Secrets ────────────────────────────────────────
  const addSecrets = await askConfirm(
    sectionSkipHint("Secrets"),
    false
  );
  if (addSecrets) {
    await enterSection(11);

    data.secretsFile =
      (await askText({
        message: "Secrets file path",
        placeholder: ".secrets",
        defaultValue: ".secrets",
      })) || ".secrets";

    await leaveSection(11, save);
  }

  // 12 ── Knowledge & RAG ───────────────────────────────
  const addKnowledge = await askConfirm(
    sectionSkipHint("Knowledge & RAG"),
    false
  );
  if (addKnowledge) {
    await enterSection(12);
    data.knowledgeSources = await collectList(
      "source",
      "Enter a URL or file path for a knowledge source"
    );
    await leaveSection(12, save);
  }

  // 13 ── Guardrails & Safety ───────────────────────────
  const addGuardrails = await askConfirm(
    sectionSkipHint("Guardrails & Safety"),
    false
  );
  if (addGuardrails) {
    await enterSection(13);

    data.inputFilters = await collectList(
      "input filter",
      "Enter an input filter rule"
    );
    data.outputFilters = await collectList(
      "output filter",
      "Enter an output filter rule"
    );
    data.contentPolicies = await collectList(
      "content policy",
      "Enter a content policy"
    );
    data.blockedTopics = await collectList(
      "blocked topic",
      "Enter a blocked topic"
    );
    data.promptSafetyLayers = await collectList(
      "safety layer",
      "Enter a prompt safety layer"
    );

    await leaveSection(13, save);
  }

  // 14 ── Visibility & Permissions ──────────────────────
  const addVisibility = await askConfirm(
    sectionSkipHint("Visibility & Permissions"),
    false
  );
  if (addVisibility) {
    await enterSection(14);

    data.view = (await askSelect("Who can view this agent?", [
      { value: "anyone", label: "🌍  Anyone" },
      { value: "restricted", label: "🔒  Restricted" },
    ])) as "anyone" | "restricted";

    data.edit = (await askSelect("Who can edit this agent?", [
      { value: "anyone", label: "🌍  Anyone" },
      { value: "restricted", label: "🔒  Restricted" },
    ])) as "anyone" | "restricted";

    if (data.edit === "restricted") {
      data.editors = await collectList(
        "editor",
        "Enter an editor email or group"
      );
    }

    if (data.view === "restricted") {
      data.viewers = await collectList(
        "viewer",
        "Enter a viewer email or group"
      );
    }

    await leaveSection(14, save);
  }

  // ── Done ──────────────────────────────────────────────
  console.log("");
  p.log.success(
    colors.success.bold("  🎉 All sections complete!")
  );
  console.log("");
}
