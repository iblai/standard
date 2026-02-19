import chalk from "chalk";

export const colors = {
  primary: chalk.hex("#2175C5"),
  primaryBright: chalk.hex("#4A9AE6"),
  accent: chalk.hex("#1B5FA0"),
  dim: chalk.hex("#7B7F87"),
  success: chalk.hex("#7DD3A5"),
  error: chalk.hex("#F97066"),
  warn: chalk.hex("#F5C542"),
  white: chalk.white,
};

export function heading(text: string): string {
  return colors.primary.bold(text);
}

export function dim(text: string): string {
  return colors.dim(text);
}

export function success(text: string): string {
  return colors.success(text);
}

export function error(text: string): string {
  return colors.error(text);
}

// ── Decorative helpers ──────────────────────────────────

const RULE_CHAR = "─";
const RULE_WIDTH = 48;

export function rule(): string {
  return colors.accent(RULE_CHAR.repeat(RULE_WIDTH));
}

export function sectionBanner(emoji: string, title: string, subtitle?: string): string {
  const top = colors.accent("┌" + RULE_CHAR.repeat(RULE_WIDTH - 2) + "┐");
  const pad = (s: string, raw: number) => {
    const gap = RULE_WIDTH - 4 - raw;
    return colors.accent("│") + "  " + s + " ".repeat(Math.max(gap, 0)) + colors.accent("│");
  };
  const bot = colors.accent("└" + RULE_CHAR.repeat(RULE_WIDTH - 2) + "┘");

  const titleLine = `${emoji}  ${colors.primary.bold(title)}`;
  const titleRaw = emoji.length + 2 + title.length; // rough visible length

  const lines = [top, pad(titleLine, titleRaw)];
  if (subtitle) {
    const subLine = colors.dim(subtitle);
    lines.push(pad("   " + subLine, 3 + subtitle.length));
  }
  lines.push(bot);
  return lines.join("\n");
}

export function sparkle(text: string): string {
  return `${colors.primaryBright("✦")} ${text}`;
}

export function bullet(text: string): string {
  return `${colors.primary("›")} ${text}`;
}

// ── Animated spinner / delay ────────────────────────────

const SPINNER_FRAMES = ["◐", "◓", "◑", "◒"];

export function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export async function animatedTransition(message: string, durationMs = 600): Promise<void> {
  const frames = SPINNER_FRAMES;
  const interval = 80;
  const iterations = Math.ceil(durationMs / interval);

  process.stdout.write("\n");
  for (let i = 0; i < iterations; i++) {
    const frame = frames[i % frames.length];
    process.stdout.write(`\r  ${colors.primaryBright(frame)} ${colors.dim(message)}`);
    await sleep(interval);
  }
  process.stdout.write(`\r  ${colors.success("✔")} ${colors.dim(message)}\n\n`);
}

export async function typewriter(text: string, charDelay = 15): Promise<void> {
  for (const char of text) {
    process.stdout.write(char);
    await sleep(charDelay);
  }
  process.stdout.write("\n");
}

// ── Progress bar ────────────────────────────────────────

export function progressBar(current: number, total: number): string {
  const width = 24;
  const filled = Math.round((current / total) * width);
  const empty = width - filled;
  const bar =
    colors.primary("█".repeat(filled)) + colors.accent("░".repeat(empty));
  const pct = colors.primaryBright(`${Math.round((current / total) * 100)}%`);
  return `  ${bar} ${pct} ${colors.dim(`(${current}/${total})`)}`;
}
