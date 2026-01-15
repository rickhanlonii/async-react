"use client";

import { Button } from "@/components/ui/button";
import { IconButtonShimmer } from "./ButtonShimmer";
import { useTransition } from "react";

export default function PendingButton({
  action,
  onClick,
  loading,
  children,
}: {
  action?: () => Promise<void> | void;
  onClick?: (e: React.MouseEvent) => void;
  loading?: boolean;
  children: React.ReactNode;
}) {
  const [_isPending, transition] = useTransition();
  const isPending = action != null ? _isPending : loading;

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    if (action) {
      transition(async () => {
        await action();
      });
    } else {
      onClick && onClick(e);
    }
  }

  return (
    <Button
      className="relative overflow-hidden cursor-pointer"
      variant="outline"
      size="icon-lg"
      onClick={handleClick}
    >
      <IconButtonShimmer isPending={isPending || false}>
        {children}
      </IconButtonShimmer>
    </Button>
  );
}
