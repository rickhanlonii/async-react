"use client";

import { ViewTransition } from "react";
import * as Design from "@/components/design";
import type { Lesson } from "@/lib/data";

interface LessonItemProps {
  item: Lesson;
  completeAction: (id: string) => Promise<void>;
}

function LessonItem({ item, completeAction }: LessonItemProps) {
  async function action() {
    await completeAction(item.id);
  }

  return (
    <Design.LessonCard item={item}>
      <Design.CompleteButton complete={item.complete} action={action} />
    </Design.LessonCard>
  );
}

interface LessonListProps {
  lessons: Lesson[];
  completeAction: (id: string) => Promise<void>;
}

export default function LessonList({
  lessons,
  completeAction,
}: LessonListProps) {
  if (lessons.length === 0) {
    return (
      <ViewTransition key="empty" default="none" enter="auto" exit="auto">
        <Design.EmptyList />
      </ViewTransition>
    );
  }

  return (
    <ViewTransition key="results" default="none" enter="auto" exit="auto">
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
