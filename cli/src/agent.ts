import * as p from "@clack/prompts";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { logoAnimated } from "./logo.js";
import {
  success,
  colors,
  animatedTransition,
  typewriter,
  sleep,
} from "./theme.js";
import { runWizard } from "./wizard.js";
import { generate } from "./generator.js";
import type { AgentData } from "./generator.js";

export async function runAgent(): Promise<void> {
  await logoAnimated();

  await typewriter(colors.primary.bold("  .iblai Agent Builder"), 25);
  await sleep(200);
  await typewriter(
    colors.dim("  Build a portable agent definition — one step at a time."),
    12
  );
  await typewriter(
    colors.dim("  Your file is saved after each section. Press Enter to skip optional fields."),
    12
  );
  console.log("");

  p.intro(colors.primaryBright("Let's create your agent  🚀"));

  // Ask for output path up front
  const filename = await p.text({
    message: `Output file path ${colors.dim("(.iblai)")}`,
    placeholder: "my-agent.iblai",
    defaultValue: "my-agent.iblai",
  });

  if (p.isCancel(filename)) {
    p.cancel("Cancelled.");
    process.exit(0);
  }

  const filepath = resolve(process.cwd(), filename as string);
  const data: AgentData = { name: "" };

  // Save callback — writes current state to disk after each section
  function save() {
    const markdown = generate(data);
    writeFileSync(filepath, markdown, "utf-8");
    p.log.info(colors.dim(`  💾 Saved to ${filepath}`));
  }

  await runWizard(data, save);

  // Final save
  save();

  console.log("");
  p.outro(
    success(`✨ Agent file written to ${colors.white.bold(filepath)}`)
  );
}
