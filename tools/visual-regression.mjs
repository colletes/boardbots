#!/usr/bin/env node
// Phase 0 safety net: screenshots every bot at desktop + mobile widths and diffs
// against committed baselines, so a CSS/layout regression is caught before staging deploy.
//
// Usage:
//   node tools/visual-regression.mjs                 -> compare against baselines, report diffs
//   node tools/visual-regression.mjs --update         -> (re)write baselines for ALL bots
//   node tools/visual-regression.mjs --update foo.html bar.html  -> update baselines for specific files only
//   node tools/visual-regression.mjs foo.html bar.html           -> compare specific files only
//
// Baseline images live in tools/visual-baselines/, diff images (only written when a
// diff is found) go to tools/visual-diffs/ (gitignored, inspect locally then delete).

import { chromium } from 'playwright';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import { spawn } from 'node:child_process';
import { readdirSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BOTS_DIR = path.join(ROOT, 'bots');
const BASELINE_DIR = path.join(ROOT, 'tools', 'visual-baselines');
const DIFF_DIR = path.join(ROOT, 'tools', 'visual-diffs');
const PORT = 8934;

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];

// Diff-tolerance: real-world runs have tiny anti-aliasing/font-hinting noise between
// runs even with zero code changes; only flag a bot when the mismatch is non-trivial.
const DIFF_THRESHOLD_RATIO = 0.002; // 0.2% of pixels

function parseArgs() {
  const args = process.argv.slice(2);
  const update = args.includes('--update');
  const files = args.filter((a) => a !== '--update');
  return { update, files };
}

function listBots(filter) {
  const all = readdirSync(BOTS_DIR).filter((f) => f.endsWith('.html'));
  if (filter.length === 0) return all.sort();
  return all.filter((f) => filter.includes(f)).sort();
}

async function waitForServer(retries = 40) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/index.html`);
      if (res.ok || res.status === 404) return true;
    } catch {
      // not up yet
    }
    await new Promise((r) => setTimeout(r, 150));
  }
  return false;
}

async function startServer() {
  const server = spawn('python3', ['-m', 'http.server', String(PORT)], {
    cwd: ROOT,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  server.on('exit', (code) => {
    if (code !== null && code !== 0) console.error(`[server] exited with code ${code}`);
  });
  const ready = await waitForServer();
  if (!ready) {
    server.kill();
    throw new Error(`Local server on :${PORT} did not become ready in time`);
  }
  return server;
}

async function capture(browser, botFile, viewport) {
  const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
  const url = `http://127.0.0.1:${PORT}/bots/${encodeURIComponent(botFile)}`;
  try {
    await page.goto(url, { waitUntil: 'load', timeout: 20000 });
    // Let font loading + hero fade-in animations settle before the shot.
    await page.waitForTimeout(700);
    const buffer = await page.screenshot({ fullPage: true });
    return { ok: true, buffer };
  } catch (err) {
    return { ok: false, error: String(err && err.message ? err.message : err) };
  } finally {
    await page.close();
  }
}

function comparePngs(baselineBuf, currentBuf) {
  const baseline = PNG.sync.read(baselineBuf);
  const current = PNG.sync.read(currentBuf);
  const width = Math.max(baseline.width, current.width);
  const height = Math.max(baseline.height, current.height);
  // Different page heights already count as a real diff — pad both canvases to the
  // same size (transparent) before pixel-diffing so pixelmatch doesn't just throw.
  const pad = (img) => {
    if (img.width === width && img.height === height) return img;
    const padded = new PNG({ width, height });
    PNG.bitblt(img, padded, 0, 0, img.width, img.height, 0, 0);
    return padded;
  };
  const a = pad(baseline);
  const b = pad(current);
  const diff = new PNG({ width, height });
  const diffPixels = pixelmatch(a.data, b.data, diff.data, width, height, { threshold: 0.1 });
  const ratio = diffPixels / (width * height);
  return { diffPixels, ratio, diffPng: diff, sizeChanged: baseline.width !== current.width || baseline.height !== current.height };
}

async function main() {
  const { update, files } = parseArgs();
  const bots = listBots(files);
  if (bots.length === 0) {
    console.error('No matching bot files found in bots/.');
    process.exit(1);
  }

  mkdirSync(BASELINE_DIR, { recursive: true });
  if (!update) mkdirSync(DIFF_DIR, { recursive: true });

  console.log(`Starting local server on :${PORT} ...`);
  const server = await startServer();

  const browser = await chromium.launch();
  let anyDiff = false;
  let anyError = false;
  const rows = [];

  try {
    for (const botFile of bots) {
      for (const viewport of VIEWPORTS) {
        const label = `${botFile} [${viewport.name}]`;
        const shot = await capture(browser, botFile, viewport);
        if (!shot.ok) {
          rows.push({ label, status: 'ERROR', detail: shot.error });
          anyError = true;
          continue;
        }
        const baselinePath = path.join(BASELINE_DIR, `${botFile}__${viewport.name}.png`);
        if (update || !existsSync(baselinePath)) {
          writeFileSync(baselinePath, shot.buffer);
          rows.push({ label, status: update ? 'UPDATED' : 'NEW BASELINE', detail: '' });
          continue;
        }
        const baselineBuf = readFileSync(baselinePath);
        const { diffPixels, ratio, diffPng, sizeChanged } = comparePngs(baselineBuf, shot.buffer);
        if (sizeChanged || ratio > DIFF_THRESHOLD_RATIO) {
          anyDiff = true;
          const diffPath = path.join(DIFF_DIR, `${botFile}__${viewport.name}.diff.png`);
          writeFileSync(diffPath, PNG.sync.write(diffPng));
          const currentPath = path.join(DIFF_DIR, `${botFile}__${viewport.name}.current.png`);
          writeFileSync(currentPath, shot.buffer);
          rows.push({
            label,
            status: 'CHANGED',
            detail: `${(ratio * 100).toFixed(2)}% pixels differ${sizeChanged ? ' (page size changed)' : ''} -> ${path.relative(ROOT, diffPath)}`,
          });
        } else {
          rows.push({ label, status: 'OK', detail: `${(ratio * 100).toFixed(3)}% diff (below threshold)` });
        }
      }
    }
  } finally {
    await browser.close();
    server.kill();
  }

  console.log('');
  for (const row of rows) {
    console.log(`${row.status.padEnd(14)} ${row.label}${row.detail ? '  ' + row.detail : ''}`);
  }
  console.log('');
  console.log(`${bots.length} bot(s) x ${VIEWPORTS.length} viewport(s) checked.`);

  if (anyError || anyDiff) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
