#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "..");
const trackedFiles = execFileSync("git", ["ls-files", "-z"], {
  cwd: repositoryRoot,
  encoding: "utf8",
})
  .split("\0")
  .filter(Boolean);

const failures = [];
const skillNames = new Map();
const skillFiles = trackedFiles.filter(
  (file) => file.startsWith(".agents/skills/") && file.endsWith("/SKILL.md"),
);

function fail(message) {
  failures.push(message);
}

function unquote(value) {
  const trimmed = value.trim();
  const match = trimmed.match(/^(["'])(.*)\1$/s);
  return match ? match[2] : trimmed;
}

for (const relativePath of skillFiles) {
  const fullPath = path.join(repositoryRoot, relativePath);
  const text = readFileSync(fullPath, "utf8");
  const frontmatter = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);

  if (!frontmatter) {
    fail(`${relativePath}: missing YAML frontmatter`);
    continue;
  }

  const metadata = new Map();
  for (const line of frontmatter[1].split(/\r?\n/)) {
    if (!line.trim()) continue;
    const field = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
    if (!field) {
      fail(`${relativePath}: unsupported frontmatter line: ${line}`);
      continue;
    }
    metadata.set(field[1], unquote(field[2]));
  }

  const keys = [...metadata.keys()].sort();
  if (keys.join(",") !== "description,name") {
    fail(`${relativePath}: frontmatter keys must be description and name`);
  }

  const name = metadata.get("name") ?? "";
  const description = metadata.get("description") ?? "";
  const folderName = path.basename(path.dirname(relativePath));

  if (!name) fail(`${relativePath}: missing name`);
  if (!description) fail(`${relativePath}: missing description`);
  if (name && name !== folderName) {
    fail(`${relativePath}: name ${name} does not match folder ${folderName}`);
  }

  if (skillNames.has(name)) {
    fail(`${relativePath}: duplicate skill name ${name} also used by ${skillNames.get(name)}`);
  } else if (name) {
    skillNames.set(name, relativePath);
  }
}

const prohibitedPaths = [
  /(^|\/)\.codex(\/|$)/,
  /(^|\/)\.cursor(\/|$)/,
  /(^|\/)agent-transcripts(\/|$)/,
  /(^|\/)customers(\/|$)/,
  /(^|\/)personal(\/|$)/,
  /(^|\/)performance-reviews(\/|$)/,
  /(^|\/)\.env(?:\.|$)/,
  /(^|\/)(?:memory\.md|voice-profile-olli\.md|anti-ai-writing\.md)$/,
];

const secretPatterns = [
  /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/,
  /AKIA[0-9A-Z]{16}/,
  /gh[pousr]_[A-Za-z0-9_]{20,}/,
  /xox[baprs]-[A-Za-z0-9-]{10,}/,
];

const prohibitedPublicReferences = [
  {
    label: "private repository hostname",
    pattern: /https?:\/\/[^/\s)]*-github\.[^/\s)]+/i,
  },
  {
    label: "private repository name",
    pattern: /\b[A-Z][A-Za-z-]+\s+GitHub\b/,
  },
];

const personalPathPattern = /\/(?:Users|home)\/[A-Za-z0-9._-]+\//;
const markdownLinkPattern = /\[[^\]]*\]\(([^)\s]+)(?:\s+[^)]*)?\)/g;
const maximumTrackedBytes = 5 * 1024 * 1024;

for (const relativePath of trackedFiles) {
  const fullPath = path.join(repositoryRoot, relativePath);

  if (prohibitedPaths.some((pattern) => pattern.test(relativePath))) {
    fail(`${relativePath}: prohibited public-Core path`);
  }

  if (relativePath.startsWith("Cisco/") && relativePath !== "Cisco/AGENTS.md") {
    fail(`${relativePath}: Cisco project content is not allowed in public Core`);
  }

  if (statSync(fullPath).size > maximumTrackedBytes) {
    fail(`${relativePath}: tracked file exceeds 5 MiB`);
  }

  let text;
  try {
    text = readFileSync(fullPath, "utf8");
  } catch {
    continue;
  }

  for (const pattern of secretPatterns) {
    if (pattern.test(text)) fail(`${relativePath}: high-confidence secret signature`);
  }
  for (const { label, pattern } of prohibitedPublicReferences) {
    if (pattern.test(text)) fail(`${relativePath}: prohibited ${label}`);
  }
  if (personalPathPattern.test(text)) {
    fail(`${relativePath}: absolute personal path`);
  }

  if (relativePath.endsWith(".md")) {
    for (const match of text.matchAll(markdownLinkPattern)) {
      const target = match[1];
      if (/^(?:https?:\/\/|mailto:|#)/.test(target)) continue;
      let fileTarget = target.split("#", 1)[0];
      if (!fileTarget) continue;
      try {
        fileTarget = decodeURIComponent(fileTarget);
      } catch {
        fail(`${relativePath}: invalid encoded link ${target}`);
        continue;
      }
      const resolved = path.resolve(path.dirname(fullPath), fileTarget);
      if (!existsSync(resolved)) {
        fail(`${relativePath}: broken local link ${target}`);
      }
    }
  }
}

if (failures.length > 0) {
  console.error(`Public Core validation failed with ${failures.length} issue(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  `Public Core validation passed: ${trackedFiles.length} tracked files, ${skillFiles.length} skills, no boundary violations.`,
);
