import HomeContent from "@/components/HomeContent";
import Layout from "@/components/Layout";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; q?: string }>;
}) {
  const { q = "" } = await searchParams;

  return (
    <Layout>
      <HomeContent search={q} />
    </Layout>
  );
}
