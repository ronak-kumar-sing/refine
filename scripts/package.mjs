#!/usr/bin/env node
/**
 * Builds a Chrome Web Store–ready zip in dist/ containing only runtime files.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const { version } = JSON.parse(readFileSync(join(root, 'manifest.json'), 'utf8'));

const RUNTIME_FILES = ['manifest.json', 'background', 'content', 'popup', 'utils', 'icons', 'LICENSE'];

const distDir = join(root, 'dist');
const zipPath = join(distDir, `ai-text-refiner-v${version}.zip`);

mkdirSync(distDir, { recursive: true });
rmSync(zipPath, { force: true });

execFileSync('zip', ['-r', '-q', '-X', zipPath, ...RUNTIME_FILES, '-x', '*.DS_Store', '-x', 'icons/*.svg'], {
  cwd: root,
  stdio: 'inherit',
});

console.log(`✓ Packaged ${zipPath.replace(root, '')}`);
