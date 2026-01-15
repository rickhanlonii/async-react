"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import * as Design from "@/components/design";
import { loginAction } from "@/lib/actions";

const initialFieldData = {
  username: "hi@react.dev",
  password: "reactisgoodactually",
};

export default function LoginContent() {
  const router = useRouter();
  const [fields, setFields] = useState(initialFieldData);

  async function submitAction() {
    await loginAction();
    router.push("/");
  }

  return (
    <Design.LoginForm fields={fields} setFields={setFields}>
      <Design.Button action={submitAction}>Login</Design.Button>
    </Design.LoginForm>
  );
}
