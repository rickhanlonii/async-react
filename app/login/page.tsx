import Layout from "@/components/Layout";
import LoginContent from "@/components/LoginContent";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <Layout>
      <div className="flex flex-col gap-6 p-12">
        <Card className="border-none">
          <LoginContent />
        </Card>
      </div>
    </Layout>
  );
}
