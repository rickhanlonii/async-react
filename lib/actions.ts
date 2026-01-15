"use server";

import { revalidatePath } from "next/cache";
import { postLessonToggle, postLogin } from "@/lib/data";

export async function toggleLessonAction(id: string) {
  await postLessonToggle(id, 0);
  revalidatePath("/");
}

export async function loginAction() {
  await postLogin(0);
}
