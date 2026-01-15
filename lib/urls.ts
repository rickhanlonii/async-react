import { redirect, RedirectType } from "next/navigation";

export function revalidateHome(search: string) {
  const params = new URLSearchParams();
  if (search) params.set("q", search);
  // @ts-ignore
  redirect(`/?${params.toString()}`, RedirectType.replace);
}
