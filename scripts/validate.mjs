#!/usr/bin/env node
/**
 * Validates the extension before packaging:
 *  - manifest.json is valid JSON with required MV3 fields
 *  - every file referenced by the manifest exists
 *  - manifest and package.json versions match
 *  - no obvious API keys are committed in source files
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const errors = [];

const readJson = (file) => JSON.parse(readFileSync(join(root, file), 'utf8'));

let manifest;
try {
  manifest = readJson('manifest.json');
} catch (error) {
  console.error(`✗ manifest.json is not valid JSON: ${error.message}`);
  process.exit(1);
}

for (const key of ['manifest_version', 'name', 'version', 'description']) {
  if (!manifest[key]) errors.push(`manifest.json is missing "${key}"`);
}
if (manifest.manifest_version !== 3) errors.push('manifest_version must be 3');

const referenced = [
  manifest.background?.service_worker,
  manifest.action?.default_popup,
  ...Object.values(manifest.icons ?? {}),
  ...Object.values(manifest.action?.default_icon ?? {}),
  ...(manifest.content_scripts ?? []).flatMap((cs) => [...(cs.js ?? []), ...(cs.css ?? [])]),
].filter(Boolean);

for (const file of new Set(referenced)) {
  if (!existsSync(join(root, file))) errors.push(`manifest.json references missing file: ${file}`);
}

const pkg = readJson('package.json');
if (pkg.version !== manifest.version) {
  errors.push(`Version mismatch: package.json ${pkg.version} vs manifest.json ${manifest.version}`);
}

// Secret scan: provider key formats that should never be committed.
const SECRET_PATTERNS = [
  [/\bsk-(?:proj-)?[A-Za-z0-9_-]{20,}/, 'OpenAI key'],
  [/\bsk-ant-[A-Za-z0-9_-]{20,}/, 'Anthropic key'],
  [/\bAIza[0-9A-Za-z_-]{35}\b/, 'Google API key'],
  [/\bxpl_[0-9a-f]{20,}/, 'ExperientialLabs key'],
];
const SCAN_EXTENSIONS = new Set(['.js', '.mjs', '.json', '.html', '.css', '.md', '.py']);
const SKIP_DIRS = new Set(['.git', 'node_modules', 'dist']);

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) yield* walk(path);
    else if (SCAN_EXTENSIONS.has(extname(entry))) yield path;
  }
}

for (const file of walk(root)) {
  const content = readFileSync(file, 'utf8');
  for (const [pattern, label] of SECRET_PATTERNS) {
    if (pattern.test(content)) errors.push(`Possible ${label} committed in ${file.replace(root, '')}`);
  }
}

if (errors.length) {
  console.error(errors.map((e) => `✗ ${e}`).join('\n'));
  process.exit(1);
}
console.log(
  `✓ ${manifest.name} v${manifest.version} is valid (${referenced.length} manifest references checked, no secrets found)`,
);
