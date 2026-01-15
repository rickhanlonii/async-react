import { revalidatePath } from "next/cache";
import * as Design from "@/components/design";
import LessonList from "@/components/LessonList";
import { revalidateHome } from "@/lib/urls";
import { postLessonToggle } from "@/lib/data";
import { Suspense } from "react";
import FallbackList from "./design/Fallback";

interface HomeContentProps {
  search: string;
}

export default async function HomeContent({ search }: HomeContentProps) {
  async function searchAction(search: string) {
    "use server";
    revalidateHome(search);
  }

  async function tabAction() {
    "use server";
    revalidatePath("/");
  }

  async function completeAction(id: string) {
    "use server";
    await postLessonToggle(id);
    revalidatePath("/");
  }

  return (
    <>
      <Design.SearchInput value={search} changeAction={searchAction} />
      <Design.TabList changeAction={tabAction}>
        <Suspense fallback={<FallbackList />}>
          <LessonList
            tab="all"
            search={search}
            completeAction={completeAction}
          />
        </Suspense>
        <Suspense fallback={<FallbackList />}>
          <LessonList
            tab="wip"
            search={search}
            completeAction={completeAction}
          />
        </Suspense>
        <Suspense fallback={<FallbackList />}>
          <LessonList
            tab="done"
            search={search}
            completeAction={completeAction}
          />
        </Suspense>
      </Design.TabList>
    </>
  );
}
