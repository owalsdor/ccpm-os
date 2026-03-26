const fs = require("fs");
const path = require("path");

function walkMarkdownFiles(rootDir) {
  const items = fs.readdirSync(rootDir, { withFileTypes: true });
  const files = [];
  for (const item of items) {
    const fullPath = path.join(rootDir, item.name);
    if (item.isDirectory()) {
      files.push(...walkMarkdownFiles(fullPath));
    } else if (item.isFile() && item.name.endsWith(".md")) {
      files.push(fullPath);
    }
  }
  return files;
}

function parseFrontmatter(content) {
  const lines = content.split(/\r?\n/);
  if (lines[0] !== "---") return {};
  const out = {};
  for (let i = 1; i < lines.length; i += 1) {
    const line = lines[i];
    if (line === "---") break;
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    out[key] = value.replace(/^"(.*)"$/, "$1");
  }
  return out;
}

function parseCommandName(content, filePath) {
  const match = content.match(/^#\s+(\/[^\s]+)\s+/m);
  if (match) return match[1];
  return `/${path.basename(filePath, ".md")}`;
}

function parseTitle(content, filePath) {
  const match = content.match(/^#\s+(.+)$/m);
  if (match) return match[1].trim();
  return path.basename(filePath, ".md");
}

function loadCommandCatalog(commandsRoot) {
  if (!fs.existsSync(commandsRoot)) return [];
  const files = walkMarkdownFiles(commandsRoot);
  const commands = files.map((filePath) => {
    const raw = fs.readFileSync(filePath, "utf8");
    const frontmatter = parseFrontmatter(raw);
    const relativePath = path.relative(commandsRoot, filePath);
    const dirName = path.dirname(relativePath);
    const folderGroup =
      dirName === "." || dirName === ""
        ? "General"
        : dirName.split(path.sep).join(" / ");
    return {
      id: relativePath.replace(/[\\/]/g, "::"),
      commandName: parseCommandName(raw, filePath),
      title: parseTitle(raw, filePath),
      description: frontmatter.description || "",
      argumentHint: frontmatter["argument-hint"] || "",
      category: relativePath.split(path.sep)[0] || "uncategorized",
      folderGroup,
      filePath,
      template: raw,
    };
  });
  return commands.sort(
    (a, b) => a.folderGroup.localeCompare(b.folderGroup) || a.commandName.localeCompare(b.commandName),
  );
}

module.exports = {
  loadCommandCatalog,
};
