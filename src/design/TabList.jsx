import { startTransition } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components//ui/tabs";
import ButtonShimmer from "./ButtonShimmer.jsx";
import { useOptimistic } from "react";

export default function TabList({ activeTab, changeAction, children }) {
  const [optimisticTab, setActiveTab] = useOptimistic(activeTab);

  function onTabClick(newValue) {
    startTransition(async () => {
      setActiveTab(newValue);
      await changeAction(newValue);
    });
  }
  const isPending = optimisticTab !== activeTab;
  return (
    <Tabs
      activationMode="manual"
      value={optimisticTab}
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
      {children}
    </Tabs>
  );
}
