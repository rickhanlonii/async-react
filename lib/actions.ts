"use server";

import { revalidatePath } from "next/cache";
import { postLessonToggle, postLogin } from "@/lib/data";

export async function toggleLessonAction(id: string) {
  await postLessonToggle(id);
  revalidatePath("/");
}

export async function loginAction(formData: any) {
  await postLogin();
}
