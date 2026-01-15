import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import * as Design from "@/components/design";
import LessonList from "@/components/LessonList";
import { getLessons, postLessonToggle } from "@/lib/data";
import { homeUrl } from "@/lib/urls";

interface HomeContentProps {
  tab: string;
  search: string;
}

export default async function HomeContent({
  tab,
  search,
}: HomeContentProps) {
  console.log("HomeContent", tab);
  const lessons = await getLessons(tab, search);

  async function searchAction(value: string) {
    "use server";
    redirect(homeUrl(tab, value));
  }

  async function tabAction(value: string) {
    "use server";
    redirect(homeUrl(value, search));
  }

  async function completeAction(id: string) {
    "use server";
    await postLessonToggle(id);
    revalidatePath("/");
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
