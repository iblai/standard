import chalk from "chalk";
import { sleep } from "./theme.js";

// Gradient shades from dark to bright blue
const g = [
  chalk.hex("#0D3F6E"),
  chalk.hex("#155089"),
  chalk.hex("#1B5FA0"),
  chalk.hex("#2175C5"),
  chalk.hex("#3A8AD4"),
  chalk.hex("#4A9AE6"),
];

const LOGO_LINES = [
  "  ██╗██████╗ ██╗         █████╗ ██╗",
  "  ██║██╔══██╗██║        ██╔══██╗██║",
  "  ██║██████╔╝██║        ███████║██║",
  "  ██║██╔══██╗██║        ██╔══██║██║",
  "  ██║██████╔╝███████╗██╗██║  ██║██║",
  "  ╚═╝╚═════╝ ╚══════╝╚═╝╚═╝  ╚═╝╚═╝",
];

export function logoStatic(): string {
  return LOGO_LINES.map((line, i) => g[i](line)).join("\n");
}

export async function logoAnimated(): Promise<void> {
  console.log("");
  for (let i = 0; i < LOGO_LINES.length; i++) {
    console.log(g[i](LOGO_LINES[i]));
    await sleep(70);
  }
  console.log("");
}
