"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { startTransition } from "react";
import * as Design from "@/components/design";
import LessonList from "@/components/LessonList";
import { toggleLessonAction } from "@/lib/actions";
import type { Lesson } from "@/lib/data";

interface HomeContentProps {
  lessons: Lesson[];
  tab: string;
  search: string;
}

export default function HomeContent({
  lessons,
  tab,
  search,
}: HomeContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function searchAction(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("q", value);
    } else {
      params.delete("q");
    }
    startTransition(() => {
      router.replace(`/?${params.toString()}`);
    });
  }

  function tabAction(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set("tab", value);
    } else {
      params.delete("tab");
    }
    startTransition(() => {
      router.replace(`/?${params.toString()}`);
    });
  }

  async function completeAction(id: string) {
    await toggleLessonAction(id);
  }

  return (
    <>
      <Design.SearchInput value={search} changeAction={searchAction} />
      <Design.TabList activeTab={tab} changeAction={tabAction}>
        <LessonList lessons={lessons} completeAction={completeAction} />
      </Design.TabList>
    </>
  );
}
