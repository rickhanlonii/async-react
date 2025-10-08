import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/components//ui/item";
import { ViewTransition } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function FallbackListItem() {
  return (
    <Item variant="ghost">
      <ItemMedia className="h-12 w-12" variant="ghost">
        <Skeleton className="h-[40px] w-[40px]" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>
          <Skeleton className="h-[19px] w-24" />
        </ItemTitle>
        <Skeleton className="h-[21px] w-32" />
      </ItemContent>
      <ItemActions>
        <div className="h-[40px] w-[40px] flex items-center justify-center">
          <Skeleton className="h-[40px] w-[40px]" />
        </div>
      </ItemActions>
    </Item>
  );
}

export default function FallbackList() {
  return (
    <ViewTransition>
      <div className="flex flex-col pl-4 pr-4">
        <div>
          <FallbackListItem />
        </div>
        <FallbackListItem />
        <div>
          <FallbackListItem />
        </div>
        <div>
          <FallbackListItem />
        </div>
        <div>
          <FallbackListItem />
        </div>
        <div>
          <FallbackListItem />
        </div>
      </div>
    </ViewTransition>
  );
}
