import { ViewTransition } from "react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { BookX } from "lucide-react";
import { ItemGroup } from "@/components//ui/item";

export default function EmptyList() {
  return (
    <ItemGroup className="px-4">
      <Empty className="gap-2">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <BookX />
          </EmptyMedia>
        </EmptyHeader>
        <EmptyTitle>Woah!</EmptyTitle>
        <EmptyDescription>No lessons found</EmptyDescription>
      </Empty>
    </ItemGroup>
  );
}
