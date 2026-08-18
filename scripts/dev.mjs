#!/usr/bin/env node
// Start every app's Astro dev server and keep a URL list on screen.
// Ports come from each app's astro.config.mjs (`server.port`).

import { spawn } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const appsDir = join(root, "apps");

const dim = (value) => `\x1b[2m${value}\x1b[0m`;
const cyan = (value) => `\x1b[36m${value}\x1b[0m`;
const green = (value) => `\x1b[32m${value}\x1b[0m`;
const red = (value) => `\x1b[31m${value}\x1b[0m`;

function discoverSites() {
  const sites = [];

  for (const entry of readdirSync(appsDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;

    const configPath = join(appsDir, entry.name, "astro.config.mjs");
    let source;

    try {
      source = readFileSync(configPath, "utf8");
    } catch {
      continue;
    }

    const match = source.match(/server:\s*\{\s*port:\s*(\d+)/);
    if (!match) continue;

    sites.push({
      name: entry.name,
      port: Number(match[1]),
      dir: join(appsDir, entry.name),
      status: "starting",
    });
  }

  return sites.sort((a, b) => a.port - b.port);
}

function urlFor(site) {
  return `http://localhost:${site.port}`;
}

function statusMark(status) {
  const label = (status === "ready" || status === "failed" ? status : "starting").padEnd(8);

  if (status === "ready") return green(label);
  if (status === "failed") return red(label);
  return dim(label);
}

function printRoster(sites, { heading } = {}) {
  const nameWidth = Math.max(...sites.map((site) => site.name.length));

  process.stdout.write("\n");
  if (heading) {
    process.stdout.write(`${heading}\n`);
  }

  for (const site of sites) {
    const name = site.name.padEnd(nameWidth);
    process.stdout.write(
      `  ${statusMark(site.status)}  ${name}  ${cyan(urlFor(site))}\n`,
    );
  }

  process.stdout.write(`\n  ${dim("ctrl+c  stop all")}\n\n`);
}

function stopLeftovers() {
  return new Promise((resolve) => {
    const child = spawn(
      "pnpm",
      ["--filter", "./apps/**", "--parallel", "exec", "astro", "dev", "stop"],
      { cwd: root, stdio: "ignore" },
    );
    child.on("exit", () => resolve());
    child.on("error", () => resolve());
  });
}

function prefixName(name, width) {
  return dim(name.padEnd(width));
}

const sites = discoverSites();

if (sites.length === 0) {
  process.stderr.write("No apps with a server.port found under apps/.\n");
  process.exit(1);
}

const nameWidth = Math.max(...sites.map((site) => site.name.length));
const children = [];
let shuttingDown = false;

function shutdown(code = 0) {
  if (shuttingDown) return;
  shuttingDown = true;

  for (const child of children) {
    if (!child.killed) {
      child.kill("SIGTERM");
    }
  }

  setTimeout(() => process.exit(code), 200);
}

function maybeAnnounce() {
  const settled = sites.every(
    (site) => site.status === "ready" || site.status === "failed",
  );
  if (!settled) return;

  printRoster(sites, {
    heading: sites.every((site) => site.status === "ready")
      ? green("sites")
      : dim("sites"),
  });
}

await stopLeftovers();
printRoster(sites);

for (const site of sites) {
  const astro = join(site.dir, "node_modules/.bin/astro");
  const child = spawn(astro, ["dev"], {
    cwd: site.dir,
    env: { ...process.env, ASTRO_DEV_BACKGROUND: "1" },
    stdio: ["ignore", "pipe", "pipe"],
  });

  children.push(child);

  let buffer = "";

  const handleChunk = (chunk) => {
    buffer += chunk.toString();
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (line.includes(urlFor(site)) || line.includes("ready in")) {
        if (site.status !== "ready") {
          site.status = "ready";
          maybeAnnounce();
        }
      }

      process.stdout.write(`${prefixName(site.name, nameWidth)}  ${line}\n`);
    }
  };

  child.stdout.on("data", handleChunk);
  child.stderr.on("data", handleChunk);

  child.on("exit", (code) => {
    if (shuttingDown) return;

    if (site.status !== "ready") {
      site.status = "failed";
      maybeAnnounce();
    }

    if (code && code !== 0) {
      process.stderr.write(
        `${prefixName(site.name, nameWidth)}  exited ${code}\n`,
      );
    }
  });
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));
