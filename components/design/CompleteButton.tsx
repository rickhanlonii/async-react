"use client";

import { CircleCheckBig } from "lucide-react";
import { startTransition, useOptimistic } from "react";
import PendingButton from "./PendingButton";
import { cn } from "@/lib/utils";

export default function CompleteButton({
  complete,
  id,
  action,
}: {
  complete: boolean;
  id: string;
  action: (id: string) => Promise<void>;
}) {
  const [optimisticComplete, setOptimisticComplete] = useOptimistic(complete);

  function clickAction() {
    startTransition(async () => {
      setOptimisticComplete(!optimisticComplete);
      await action(id);
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
