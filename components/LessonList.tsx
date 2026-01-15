import { ViewTransition } from "react";
import * as Design from "@/components/design";
import { getLessons, type Lesson } from "@/lib/data";

interface LessonItemProps {
  item: Lesson;
  completeAction: (id: string) => Promise<void>;
}

function LessonItem({ item, completeAction }: LessonItemProps) {
  return (
    <Design.LessonCard item={item}>
      <Design.CompleteButton
        id={item.id}
        complete={item.complete}
        action={completeAction}
      />
    </Design.LessonCard>
  );
}

interface LessonListProps {
  tab: "wip" | "done" | "all";
  search: string;
  completeAction: (id: string) => Promise<void>;
}

export default async function LessonList({
  tab,
  search,
  completeAction,
}: LessonListProps) {
  const lessons = await getLessons(tab, search);

  if (lessons.length === 0) {
    return (
      <ViewTransition key="empty" default="none" enter="auto" exit="auto">
        <Design.EmptyList />
      </ViewTransition>
    );
  }

  return (
    <ViewTransition
      key="results"
      default="none"
      update="none"
      enter="auto"
      exit="auto"
    >
      <Design.List>
        {lessons.map((item) => (
          <ViewTransition key={item.id}>
            <div>
              <ViewTransition default="none">
                <LessonItem item={item} completeAction={completeAction} />
              </ViewTransition>
            </div>
          </ViewTransition>
        ))}
      </Design.List>
    </ViewTransition>
  );
}
