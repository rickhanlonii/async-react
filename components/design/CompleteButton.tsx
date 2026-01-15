"use client";

import { CircleCheckBig } from "lucide-react";
import { startTransition, useOptimistic } from "react";
import PendingButton from "./PendingButton";
import { cn } from "@/lib/utils";

export default function CompleteButton({
  complete,
  action,
}: {
  complete: boolean;
  action: () => Promise<void>;
}) {
  const [optimisticComplete, setOptimisticComplete] = useOptimistic(complete);

  function clickAction() {
    startTransition(async () => {
      setOptimisticComplete(!optimisticComplete);
      await action();
    });
  }

  return (
    <PendingButton action={clickAction}>
      {optimisticComplete ? (
        <CircleCheckBig
          className={cn({ "text-chart-2": optimisticComplete })}
          size={48}
        />
      ) : (
        <div></div>
      )}
    </PendingButton>
  );
}
