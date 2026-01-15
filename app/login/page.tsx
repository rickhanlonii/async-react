import Layout from "@/components/Layout";
import LoginContent from "@/components/LoginContent";
import { Card } from "@/components/ui/card";
import { ViewTransition } from "react";

export default function LoginPage() {
  return (
    <ViewTransition>
      <Layout>
        <div className="flex flex-col gap-6 p-12">
          <Card className="border-none">
            <LoginContent />
          </Card>
        </div>
      </Layout>
    </ViewTransition>
  );
}
