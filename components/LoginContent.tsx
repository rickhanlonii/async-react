"use client";

import { useState } from "react";
import { redirect, useRouter } from "next/navigation";
import * as Design from "@/components/design";

const initialFieldData = {
  username: "hi@react.dev",
  password: "reactisgoodactually",
};

export default function LoginContent({
  action,
}: {
  action: (formData: any) => Promise<void>;
}) {
  const router = useRouter();
  const [fields, setFields] = useState(initialFieldData);

  return (
    <Design.LoginForm fields={fields} setFields={setFields}>
      <Design.Button action={action}>Login</Design.Button>
    </Design.LoginForm>
  );
}
