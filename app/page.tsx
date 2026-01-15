import HomeContent from "@/components/HomeContent";
import Layout from "@/components/Layout";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; q?: string }>;
}) {
  const { tab = "all", q = "" } = await searchParams;

  return (
    <Layout>
      <HomeContent tab={tab} search={q} />
    </Layout>
  );
}
