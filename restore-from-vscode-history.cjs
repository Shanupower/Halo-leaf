#!/usr/bin/env node
import fs from "fs";
import path from "path";
import os from "os";
import { fileURLToPath } from "url";

function parseArgs() {
  const args = process.argv.slice(2);
  let when = null, apply = false, all = false, includeOutside = false;
  let workspace = process.cwd();
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if ((a === "--when" || a === "--before" || a === "-w") && args[i + 1]) when = new Date(args[++i]);
    else if (a === "--apply") apply = true;
    else if (a === "--all") all = true;
    else if (a === "--include-outside") includeOutside = true;
    else if ((a === "--workspace" || a === "-p") && args[i + 1]) workspace = path.resolve(args[++i]);
  }
  if (!all && (!when || isNaN(when.getTime()))) {
    console.error('ERROR: Provide --when "YYYY-MM-DD HH:MM" (local time) or use --all');
    process.exit(1);
  }
  return { when, apply, all, includeOutside, workspace };
}

function candidateHistoryDirs() {
  const home = os.homedir();
  const dirs = [];
  if (process.platform === "win32") {
    const appData = process.env.APPDATA || path.join(home, "AppData", "Roaming");
    // Cursor first
    dirs.push(path.join(appData, "Cursor", "User", "History"));
    // Also allow Code variants (just in case)
    dirs.push(path.join(appData, "Code", "User", "History"));
    dirs.push(path.join(appData, "Code - Insiders", "User", "History"));
  } else if (process.platform === "darwin") {
    dirs.push(path.join(home, "Library", "Application Support", "Cursor", "User", "History"));
    dirs.push(path.join(home, "Library", "Application Support", "Code", "User", "History"));
    dirs.push(path.join(home, "Library", "Application Support", "Code - Insiders", "User", "History"));
  } else {
    dirs.push(path.join(home, ".config", "Cursor", "User", "History"));
    dirs.push(path.join(home, ".config", "Code", "User", "History"));
    dirs.push(path.join(home, ".config", "Code - Insiders", "User", "History"));
  }
  return dirs.filter(d => fs.existsSync(d));
}

function toFsPath(uriOrPath) {
  if (!uriOrPath) return null;
  if (uriOrPath.startsWith("file://")) {
    try { return fileURLToPath(uriOrPath); } catch { return null; }
  }
  return path.resolve(uriOrPath);
}

function isInside(parent, child) {
  const p = path.resolve(parent);
  const c = path.resolve(child);
  if (process.platform === "win32") {
    return !path.relative(p.toLowerCase(), c.toLowerCase()).startsWith("..");
  }
  return !path.relative(p, c).startsWith("..");
}

function readJSON(p) {
  try { return JSON.parse(fs.readFileSync(p, "utf8")); } catch { return null; }
}

(function main() {
  const { when, apply, all, includeOutside, workspace } = parseArgs();
  const roots = candidateHistoryDirs();
  if (!roots.length) {
    console.error("No Cursor/VSCode history folders found.");
    process.exit(1);
  }

  const groups = [];
  for (const root of roots) {
    for (const d of fs.readdirSync(root, { withFileTypes: true })) {
      if (d.isDirectory()) groups.push(path.join(root, d.name));
    }
  }

  const raw = [];
  for (const g of groups) {
    const entriesPath = path.join(g, "entries.json");
    if (!fs.existsSync(entriesPath)) continue;
    const json = readJSON(entriesPath);
    if (!json) continue;
    const entries = Array.isArray(json.entries) ? json.entries : [];
    for (const e of entries) {
      const ts = typeof e.timestamp === "number" ? e.timestamp : null;
      const id = e.id ?? e.contentId ?? null;
      const src = e.source ?? e.original ?? e.resource ?? e.uri ?? null;
      const originalPath = toFsPath(src);
      if (!id || !ts || !originalPath) continue;
      if (!all && ts > when.getTime()) continue;
      const contentPath = path.join(g, String(id));
      if (!fs.existsSync(contentPath)) continue;
      raw.push({ originalPath, contentPath, timestamp: ts });
    }
  }

  if (!raw.length) {
    console.log("No history entries matched the criteria.");
    process.exit(0);
  }

  // Keep latest snapshot per file
  const latest = new Map();
  for (const c of raw) {
    const key = path.resolve(c.originalPath);
    const cur = latest.get(key);
    if (!cur || c.timestamp > cur.timestamp) latest.set(key, c);
  }

  const inside = [], outside = [];
  for (const c of latest.values()) {
    (isInside(workspace, c.originalPath) ? inside : outside).push(c);
  }
  const targets = includeOutside ? inside.concat(outside) : inside;

  // Output preview
  console.log("History roots:");
  roots.forEach(r => console.log("  -", r));
  console.log(`\nWorkspace: ${workspace}`);
  console.log(`Matched files ${all ? "(any time)" : `≤ ${new Date(when).toString()}`}: ${targets.length}`);
  if (!includeOutside && outside.length) {
    console.log(`(Hidden ${outside.length} outside workspace — add --include-outside to export them under ./restore_outside)`);
  }

  const previewLimit = 60;
  targets.slice(0, previewLimit).forEach(t => {
    console.log(` • ${path.relative(workspace, t.originalPath)}  @ ${new Date(t.timestamp).toISOString()}`);
  });
  if (targets.length > previewLimit) console.log(` ...and ${targets.length - previewLimit} more`);

  if (!apply) {
    console.log("\nDry run. Re-run with --apply to write files.");
    return;
  }

  // Apply restore
  const outsideRoot = path.join(workspace, "restore_outside");
  if (includeOutside && outside.length) fs.mkdirSync(outsideRoot, { recursive: true });

  let restored = 0;
  for (const t of targets) {
    let destPath = t.originalPath;
    if (!isInside(workspace, destPath)) {
      // write outside files into ./restore_outside/<absolute_path>
      const safe = destPath
        .replace(/^[A-Za-z]:/, "")       // strip drive letter on Win
        .replace(/^\/+/, "")             // strip leading slashes
        .replace(/[:*?"<>|]/g, "_");     // sanitize
      destPath = path.join(outsideRoot, safe);
    }

    const dir = path.dirname(destPath);
    fs.mkdirSync(dir, { recursive: true });

    if (fs.existsSync(destPath)) {
      const stamp = new Date().toISOString().replace(/[:.]/g, "-");
      fs.copyFileSync(destPath, `${destPath}.bak.${stamp}`);
    }
    fs.copyFileSync(t.contentPath, destPath);
    restored++;
  }

  console.log(`\nRestore complete. Restored ${restored} file(s). Backups saved as *.bak.<timestamp>`);
})();
