import { NextRequest, NextResponse } from "next/server";
import { postLessonToggle } from "@/lib/data";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const delay = parseInt(request.nextUrl.searchParams.get("delay") || "0", 10);

  await postLessonToggle(id, delay);
  return NextResponse.json({ status: "ok" });
}
