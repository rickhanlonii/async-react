import * as fuzzy from "fast-fuzzy";
import { cache } from "react";
import { getDelay } from "./debug-store";

export interface Lesson {
  id: string;
  title: string;
  description: string;
  icon: string;
  complete: boolean;
}

const lessons: Lesson[] = [
  {
    id: "1",
    title: "Intro",
    description: "Introduction to Async React",
    icon: "lightbulb",
    complete: false,
  },
  {
    id: "2",
    title: "Transitions",
    description: "Coordinating Async",
    icon: "shuffle",
    complete: false,
  },
  {
    id: "3",
    title: "Actions",
    description: "Coordinating changes",
    icon: "zap",
    complete: false,
  },
  {
    id: "4",
    title: "Suspense",
    description: "Deferred loading",
    icon: "hourglass",
    complete: false,
  },
  {
    id: "5",
    title: "Optimistic updates",
    description: "Pretending async is sync",
    icon: "fastforward",
    complete: false,
  },
  {
    id: "6",
    title: "Putting it together",
    description: "The vision for Async React",
    icon: "puzzle",
    complete: false,
  },
];

export const getLessons = cache(async function getLessons(
  tab: string,
  search: string,
): Promise<Lesson[]> {
  const delay = getDelay("/lessons");
  let filteredLessons = [...lessons];
  if (tab === "wip") {
    filteredLessons = lessons.filter((lesson) => !lesson.complete);
  } else if (tab === "done") {
    filteredLessons = lessons.filter((lesson) => lesson.complete);
  }
  if (search != null && search !== "" && search !== "undefined") {
    filteredLessons = fuzzy.search(search, filteredLessons, {
      keySelector: (obj: Lesson) => obj.title + " " + obj.description,
      threshold: 0.9,
    });
  }

  filteredLessons = filteredLessons.sort(
    (a, b) => parseInt(a.id) - parseInt(b.id),
  );

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(filteredLessons);
    }, delay);
  });
});

export async function postLessonToggle(id: string): Promise<void> {
  const delay = getDelay("/lesson/:id/toggle");
  return new Promise((resolve) => {
    setTimeout(() => {
      const lesson = lessons.find((lesson) => lesson.id === id);
      if (lesson) {
        lesson.complete = !lesson.complete;
      }
      resolve();
    }, delay);
  });
}

export async function postLogin(): Promise<void> {
  const delay = getDelay("/login");
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, delay);
  });
}
