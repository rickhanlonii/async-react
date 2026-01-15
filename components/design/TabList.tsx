"use client";

import { startTransition, useOptimistic, useState, Activity } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ButtonShimmer from "./ButtonShimmer";

export default function TabList({
  changeAction,
  children,
}: {
  changeAction: () => void | Promise<void>;
  children: React.ReactNode;
}) {
  const [tab, setTab] = useState<"all" | "wip" | "done">("all");

  const [optimisticTab, setActiveTab] = useOptimistic(tab);

  function onTabClick(newValue: "all" | "wip" | "done") {
    startTransition(async () => {
      setActiveTab(newValue);

      await changeAction();
      startTransition(() => {
        setTab(newValue);
      });
    });
  }
  const isPending = optimisticTab !== tab;

  let content;
  if (tab === "all" && children != null) {
    // @ts-ignore
    content = children[0];
  } else if (tab === "wip") {
    // @ts-ignore
    content = children[1];
  } else if (tab === "done") {
    // @ts-ignore
    content = children[2];
  }

  return (
    <Tabs
      activationMode="manual"
      value={optimisticTab}
      // @ts-ignore
      onValueChange={onTabClick}
      className="relative w-full h-full"
    >
      <div className="px-8">
        <TabsList className="w-full">
          <TabsTrigger value="all" className="relative overflow-hidden">
            All
            <ButtonShimmer isPending={isPending && optimisticTab === "all"} />
          </TabsTrigger>
          <TabsTrigger value="wip" className="relative overflow-hidden">
            In Progress
            <ButtonShimmer isPending={isPending && optimisticTab === "wip"} />
          </TabsTrigger>
          <TabsTrigger value="done" className="relative overflow-hidden">
            Complete
            <ButtonShimmer isPending={isPending && optimisticTab === "done"} />
          </TabsTrigger>
        </TabsList>
      </div>
      {content}
    </Tabs>
  );
}
