#!/usr/bin/env node

import { logoStatic } from "./logo.js";
import { colors, typewriter, sleep } from "./theme.js";

const VERSION = "1.0.0";

const COMMANDS: { cmd: string; emoji: string; desc: string }[] = [
  { cmd: "agent", emoji: "🤖", desc: "Build a new .iblai agent file" },
  { cmd: "help",  emoji: "💡", desc: "Show this help screen" },
];

function printHelp() {
  console.log("");
  console.log(logoStatic());
  console.log("");
  console.log(
    `  ${colors.primary.bold(".iblai CLI")}  ${colors.dim(`v${VERSION}`)}`
  );
  console.log(
    `  ${colors.dim("The portable agent definition toolkit.")}`
  );
  console.log("");
  console.log(`  ${colors.primaryBright.bold("USAGE")}`);
  console.log("");
  console.log(`    ${colors.white("$")} ${colors.primary("iblai")} ${colors.primaryBright("<command>")}`);
  console.log("");
  console.log(`  ${colors.primaryBright.bold("COMMANDS")}`);
  console.log("");
  for (const { cmd, emoji, desc } of COMMANDS) {
    console.log(
      `    ${emoji}  ${colors.primary.bold(cmd.padEnd(12))} ${colors.dim(desc)}`
    );
  }
  console.log("");
  console.log(
    `  ${colors.dim("Run")} ${colors.primary("iblai agent")} ${colors.dim("to get started.")}`
  );
  console.log("");
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0]?.toLowerCase();

  if (!command || command === "help" || command === "--help" || command === "-h") {
    printHelp();
    return;
  }

  if (command === "--version" || command === "-v") {
    console.log(`${colors.primary("iblai")} ${colors.dim(`v${VERSION}`)}`);
    return;
  }

  if (command === "agent") {
    const { runAgent } = await import("./agent.js");
    await runAgent();
    return;
  }

  // Unknown command
  console.log("");
  console.log(
    `  ${colors.error("✘")} Unknown command: ${colors.white.bold(command)}`
  );
  console.log("");
  console.log(
    `  ${colors.dim("Run")} ${colors.primary("iblai help")} ${colors.dim("to see available commands.")}`
  );
  console.log("");
  process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
