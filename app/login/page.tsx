import Layout from "@/components/Layout";
import LoginContent from "@/components/LoginContent";
import { Card } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { ViewTransition } from "react";
import { loginAction } from "@/lib/actions";

export default function LoginPage() {
  async function action(formData: any) {
    "use server";
    await loginAction(formData);
    redirect("/");
  }

  return (
    <ViewTransition>
      <Layout>
        <div className="flex flex-col gap-6 p-12">
          <Card className="border-none">
            <LoginContent action={action} />
          </Card>
        </div>
      </Layout>
    </ViewTransition>
  );
}
