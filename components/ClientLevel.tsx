"use client";

import { use, useEffect, type ReactNode } from "react";
import { useSuspenseController } from "./SuspenseController";

const timerCache = new Map<string, Promise<number>>();

function getTimer(level: number, gen: number, ms: number): Promise<number> {
  const key = `${level}-${gen}`;
  if (!timerCache.has(key)) {
    timerCache.set(
      key,
      new Promise((resolve) => setTimeout(() => resolve(ms), ms))
    );
  }
  return timerCache.get(key)!;
}

// When these client levels resolve, they re-suspend another client level:
//   Level 6 → re-suspends Level 2
//   Level 8 → re-suspends Level 4
const RESUSPEND_MAP: Record<number, number> = {
  6: 2,
  8: 4,
};

export default function ClientLevel({
  level,
  ms,
  children,
}: {
  level: number;
  ms: number;
  children?: ReactNode;
}) {
  const { gens, resuspend } = useSuspenseController();
  const gen = gens[level - 1];
  const elapsed = use(getTimer(level, gen, ms));

  const target = RESUSPEND_MAP[level];

  useEffect(() => {
    if (target) {
      const id = setTimeout(() => resuspend(target), 500);
      return () => clearTimeout(id);
    }
  }, [target, resuspend, gen]);

  return (
    <div
      style={{
        padding: "12px 16px",
        borderLeft: `4px solid hsl(${level * 40}, 70%, 50%)`,
        background: `hsla(${level * 40}, 70%, 50%, 0.05)`,
      }}
    >
      <span style={{ color: "hsl(210, 80%, 50%)", fontWeight: "bold" }}>
        [Client]
      </span>{" "}
      Level {level} — {elapsed}ms (render #{gen + 1})
      {children}
    </div>
  );
}
