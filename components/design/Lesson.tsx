import { ItemGroup } from "@/components/ui/item";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

import {
  Lightbulb,
  Shuffle,
  Zap,
  Hourglass,
  FastForward,
  Puzzle,
  LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  lightbulb: Lightbulb,
  shuffle: Shuffle,
  zap: Zap,
  hourglass: Hourglass,
  fastforward: FastForward,
  puzzle: Puzzle,
};

export interface LessonItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  complete: boolean;
}

export function LessonCard({
  item,
  children,
}: {
  item: LessonItem;
  children: React.ReactNode;
}) {
  const Icon = ICONS[item.icon] || Lightbulb;
  return (
    <Item className="pl-4">
      <ItemMedia className="h-12 w-12" variant="ghost">
        <Icon className="size-6" size="34px" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{item.title}</ItemTitle>
        <ItemDescription>{item.description}</ItemDescription>
      </ItemContent>
      <ItemActions>{children}</ItemActions>
    </Item>
  );
}

export function List({ children }: { children: React.ReactNode }) {
  return <ItemGroup className="px-4">{children}</ItemGroup>;
}
