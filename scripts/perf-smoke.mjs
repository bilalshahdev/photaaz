import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { performance } from "node:perf_hooks";

const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, value = "true"] = arg.split("=");
    return [key.replace(/^--/, ""), value];
  })
);

const baseUrl = (args.get("base") ?? process.env.PERF_BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const runs = Number(args.get("runs") ?? process.env.PERF_RUNS ?? 5);
const warmups = Number(args.get("warmups") ?? process.env.PERF_WARMUPS ?? 2);
const timeoutMs = Number(args.get("timeout") ?? process.env.PERF_TIMEOUT_MS ?? 15000);
const outputPath = args.get("out");
const allowFailures = args.get("allow-failures") === "true" || process.env.PERF_ALLOW_FAILURES === "true";

const routes = [
  "/",
  "/themes",
  "/themes/minimal/demo",
  "/themes/editorial/demo",
  "/themes/cinematic/demo",
  "/themes/masonry/demo",
  "/themes/luxury/demo",
  "/themes/monochrome/demo",
  "/themes/panorama/demo",
  "/site/demo",
  "/site/demo/gallery",
  "/site/demo/categories",
  "/site/demo/blog",
  "/site/demo/about",
  "/site/demo/dashboard",
  "/admin"
];

async function timedFetch(route) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const start = performance.now();

  try {
    const response = await fetch(`${baseUrl}${route}`, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent": "photaaz-perf-smoke/1.0"
      }
    });
    const text = await response.text();

    return {
      ok: response.ok,
      status: response.status,
      durationMs: performance.now() - start,
      bytes: Buffer.byteLength(text)
    };
  } finally {
    clearTimeout(timer);
  }
}

function summarize(route, samples) {
  const sorted = samples.map((sample) => sample.durationMs).sort((a, b) => a - b);
  const p95Index = Math.min(sorted.length - 1, Math.ceil(sorted.length * 0.95) - 1);
  const avg = sorted.reduce((sum, value) => sum + value, 0) / sorted.length;
  const last = samples.at(-1);

  return {
    route,
    status: last.status,
    ok: samples.every((sample) => sample.ok),
    avgMs: Number(avg.toFixed(1)),
    p95Ms: Number(sorted[p95Index].toFixed(1)),
    minMs: Number(sorted[0].toFixed(1)),
    maxMs: Number(sorted.at(-1).toFixed(1)),
    bytes: last.bytes
  };
}

async function runRoute(route) {
  for (let index = 0; index < warmups; index += 1) {
    await timedFetch(route);
  }

  const samples = [];
  for (let index = 0; index < runs; index += 1) {
    samples.push(await timedFetch(route));
  }

  return summarize(route, samples);
}

const startedAt = new Date().toISOString();
const results = [];

for (const route of routes) {
  try {
    results.push(await runRoute(route));
  } catch (error) {
    results.push({
      route,
      status: "ERR",
      ok: false,
      avgMs: null,
      p95Ms: null,
      minMs: null,
      maxMs: null,
      bytes: 0,
      error: error instanceof Error ? error.message : String(error)
    });
  }
}

const report = {
  startedAt,
  baseUrl,
  runs,
  warmups,
  routes: results
};

console.table(results);

if (outputPath) {
  const target = resolve(outputPath);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, `${JSON.stringify(report, null, 2)}\n`);
  console.log(`Saved performance report to ${target}`);
}

if (!allowFailures && results.some((result) => !result.ok)) {
  process.exitCode = 1;
}
