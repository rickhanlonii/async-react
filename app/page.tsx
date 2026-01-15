import { getLessons } from "@/lib/data";
import HomeContent from "@/components/HomeContent";
import Layout from "@/components/Layout";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; q?: string }>;
}) {
  const { tab = "all", q = "" } = await searchParams;
  const lessons = await getLessons(tab, q, 0);

  return (
    <Layout>
      <HomeContent lessons={lessons} tab={tab} search={q} />
    </Layout>
  );
}
