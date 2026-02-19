export interface AgentData {
  // Agent Info
  name: string;
  description?: string;
  picture?: string;
  version?: string;
  author?: string;

  // Soul
  voice?: string;
  temperament?: string;
  values?: string[];
  ethicalConstraints?: string[];

  // Identity
  emoji?: string;
  theme?: "light" | "dark";
  persona?: string;

  // Instructions
  priorities?: string[];
  boundaries?: string[];
  workflow?: string[];
  qualityBar?: string[];

  // User Preferences
  tone?: string;
  outputFormat?: string;
  language?: string;
  constraints?: string[];

  // Memory
  memory?: string[];

  // Heartbeat
  heartbeatCadence?: string;
  heartbeatTasks?: string[];

  // Skills
  skills?: {
    name: string;
    id: string;
    description: string;
    tags: string;
    examples: string[];
  }[];

  // Tasks
  tasks?: {
    name: string;
    frequency: string;
    prompt: string;
  }[];

  // Tools
  tools?: Record<string, boolean>;

  // MCP Servers
  mcpServers?: {
    name: string;
    url: string;
    transport: string;
  }[];

  // Secrets
  secretsFile?: string;

  // Knowledge & RAG
  knowledgeSources?: string[];

  // Guardrails
  inputFilters?: string[];
  outputFilters?: string[];
  contentPolicies?: string[];
  blockedTopics?: string[];
  promptSafetyLayers?: string[];

  // Visibility
  view?: "anyone" | "restricted";
  edit?: "anyone" | "restricted";
  editors?: string[];
  viewers?: string[];
}

function section(title: string, content: string): string {
  return `# ${title}\n\n${content}\n\n---\n`;
}

function field(key: string, value: string): string {
  return `- **${key}:** ${value}`;
}

function bulletList(items: string[], ordered = false): string {
  return items
    .map((item, i) => (ordered ? `${i + 1}. ${item}` : `- ${item}`))
    .join("\n");
}

export function generate(data: AgentData): string {
  const sections: string[] = [];

  // Agent Info
  {
    const lines: string[] = [field("name", data.name)];
    if (data.description) lines.push(field("description", data.description));
    if (data.picture) lines.push(field("picture", data.picture));
    if (data.version) lines.push(field("version", data.version));
    if (data.author) lines.push(field("author", data.author));
    sections.push(section("Agent Info", lines.join("\n")));
  }

  // Soul
  {
    const parts: string[] = [];
    if (data.voice) parts.push(`## Voice\n\n${data.voice}`);
    if (data.temperament) parts.push(`## Temperament\n\n${data.temperament}`);
    if (data.values?.length)
      parts.push(`## Values\n\n${bulletList(data.values)}`);
    if (data.ethicalConstraints?.length)
      parts.push(
        `## Ethical Constraints\n\n${bulletList(data.ethicalConstraints)}`
      );
    if (parts.length) sections.push(section("Soul", parts.join("\n\n")));
  }

  // Identity
  {
    const lines: string[] = [];
    if (data.emoji) lines.push(field("emoji", data.emoji));
    if (data.theme) lines.push(field("theme", data.theme));
    if (data.persona) lines.push(field("persona", data.persona));
    if (lines.length) sections.push(section("Identity", lines.join("\n")));
  }

  // Instructions
  {
    const parts: string[] = [];
    if (data.priorities?.length)
      parts.push(`## Priorities\n\n${bulletList(data.priorities, true)}`);
    if (data.boundaries?.length)
      parts.push(`## Boundaries\n\n${bulletList(data.boundaries)}`);
    if (data.workflow?.length)
      parts.push(`## Workflow\n\n${bulletList(data.workflow, true)}`);
    if (data.qualityBar?.length)
      parts.push(`## Quality Bar\n\n${bulletList(data.qualityBar)}`);
    if (parts.length)
      sections.push(section("Instructions", parts.join("\n\n")));
  }

  // User Preferences
  {
    const lines: string[] = [];
    if (data.tone) lines.push(field("tone", data.tone));
    if (data.outputFormat) lines.push(field("output_format", data.outputFormat));
    if (data.language) lines.push(field("language", data.language));
    if (data.constraints?.length) {
      lines.push("- **constraints:**");
      for (const c of data.constraints) {
        lines.push(`  - ${c}`);
      }
    }
    if (lines.length)
      sections.push(section("User Preferences", lines.join("\n")));
  }

  // Memory
  if (data.memory?.length) {
    sections.push(section("Memory", bulletList(data.memory)));
  }

  // Heartbeat
  {
    const lines: string[] = [];
    if (data.heartbeatCadence) lines.push(field("cadence", data.heartbeatCadence));
    if (data.heartbeatTasks?.length) {
      lines.push("- **tasks:**");
      for (const t of data.heartbeatTasks) {
        lines.push(`  - ${t}`);
      }
    }
    if (lines.length) sections.push(section("Heartbeat", lines.join("\n")));
  }

  // Skills
  if (data.skills?.length) {
    const parts = data.skills.map((s) => {
      const lines = [
        `## ${s.name}`,
        "",
        field("id", s.id),
        field("description", s.description),
        field("tags", s.tags),
        "- **examples:**",
        ...s.examples.map((e) => `  - "${e}"`),
      ];
      return lines.join("\n");
    });
    sections.push(section("Skills", parts.join("\n\n")));
  }

  // Tasks
  if (data.tasks?.length) {
    const parts = data.tasks.map((t) => {
      return [`## ${t.name}`, "", field("frequency", t.frequency), field("prompt", t.prompt)].join(
        "\n"
      );
    });
    sections.push(section("Tasks", parts.join("\n\n")));
  }

  // Tools
  if (data.tools && Object.keys(data.tools).length) {
    const lines = Object.entries(data.tools).map(
      ([k, v]) => field(k, String(v))
    );
    sections.push(section("Tools", lines.join("\n")));
  }

  // MCP Servers
  if (data.mcpServers?.length) {
    const parts = data.mcpServers.map((s) => {
      return [
        `### ${s.name}`,
        "",
        field("name", s.name),
        field("url", s.url),
        field("transport", s.transport),
      ].join("\n");
    });
    sections.push(section("MCP Servers", parts.join("\n\n")));
  }

  // Secrets
  if (data.secretsFile) {
    sections.push(section("Secrets", field("secrets_file", data.secretsFile)));
  }

  // Knowledge & RAG
  if (data.knowledgeSources?.length) {
    sections.push(
      section(
        "Knowledge & RAG",
        `## Sources\n\n${bulletList(data.knowledgeSources)}`
      )
    );
  }

  // Guardrails & Safety
  {
    const parts: string[] = [];
    if (data.inputFilters?.length)
      parts.push(`## Input Filters\n\n${bulletList(data.inputFilters)}`);
    if (data.outputFilters?.length)
      parts.push(`## Output Filters\n\n${bulletList(data.outputFilters)}`);
    if (data.contentPolicies?.length)
      parts.push(`## Content Policies\n\n${bulletList(data.contentPolicies)}`);
    if (data.blockedTopics?.length)
      parts.push(`## Blocked Topics\n\n${bulletList(data.blockedTopics)}`);
    if (data.promptSafetyLayers?.length)
      parts.push(
        `## Prompt Safety Layers\n\n${bulletList(data.promptSafetyLayers)}`
      );
    if (parts.length)
      sections.push(section("Guardrails & Safety", parts.join("\n\n")));
  }

  // Visibility & Permissions
  {
    const lines: string[] = [];
    if (data.view) lines.push(field("view", data.view));
    if (data.edit) lines.push(field("edit", data.edit));
    if (data.editors?.length) {
      lines.push("- **editors:**");
      for (const e of data.editors) {
        lines.push(`  - ${e}`);
      }
    }
    if (data.viewers?.length) {
      lines.push("- **viewers:**");
      for (const v of data.viewers) {
        lines.push(`  - ${v}`);
      }
    }
    if (lines.length)
      sections.push(section("Visibility & Permissions", lines.join("\n")));
  }

  // Join sections, remove trailing ---
  let output = sections.join("\n");
  output = output.replace(/\n---\n$/, "\n");
  return output;
}
