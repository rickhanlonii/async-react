"use client";

import { useTransition } from "react";
import { Button as ShaButton } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export default function Button({
  children,
  action,
}: {
  children: React.ReactNode;
  action: (formData: any) => Promise<void>;
}) {
  const [isPending, transition] = useTransition();

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    transition(async () => {
      // @ts-ignore
      await action();
    });
  }
  return (
    <ShaButton onClick={handleClick}>
      {isPending ? <Spinner /> : children}
    </ShaButton>
  );
}
