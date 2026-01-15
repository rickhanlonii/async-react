// Server-side store for debug delays
// Persisted to disk so it works across different processes

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const DELAYS_FILE = join(process.cwd(), ".debug-delays.json");

const defaultDelays: Record<string, number> = {
  "/lessons": 0,
  "/lesson/:id/toggle": 0,
  "/login": 0,
};

function readDelays(): Record<string, number> {
  try {
    if (existsSync(DELAYS_FILE)) {
      const data = readFileSync(DELAYS_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch {
    // Ignore errors, return defaults
  }
  return { ...defaultDelays };
}

function writeDelays(delays: Record<string, number>): void {
  try {
    writeFileSync(DELAYS_FILE, JSON.stringify(delays, null, 2));
  } catch {
    // Ignore write errors
  }
}

export function getDelay(path: string): number {
  const delays = readDelays();
  return delays[path] ?? 0;
}

export function setDelay(path: string, value: number): void {
  const delays = readDelays();
  delays[path] = value;
  writeDelays(delays);
}

export function getAllDelays(): Record<string, number> {
  return readDelays();
}
