"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

type SuspenseControllerValue = {
  gens: number[];
  resuspend: (level: number) => void;
};

const SuspenseControllerContext = createContext<SuspenseControllerValue>({
  gens: [0, 0, 0, 0, 0, 0, 0, 0],
  resuspend: () => {},
});

export function useSuspenseController() {
  return useContext(SuspenseControllerContext);
}

export default function SuspenseController({
  children,
}: {
  children: ReactNode;
}) {
  const [gens, setGens] = useState([0, 0, 0, 0, 0, 0, 0, 0]);

  const resuspend = useCallback((level: number) => {
    setGens((prev) => {
      if (prev[level - 1] >= 1) return prev; // only re-suspend once
      const next = [...prev];
      next[level - 1] = prev[level - 1] + 1;
      return next;
    });
  }, []);

  return (
    <SuspenseControllerContext.Provider value={{ gens, resuspend }}>
      {children}
    </SuspenseControllerContext.Provider>
  );
}
