import { NextRequest, NextResponse } from "next/server";
import { getLessons } from "@/lib/data";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const tab = searchParams.get("tab") || "all";
  const search = searchParams.get("q") || "";
  const delay = parseInt(searchParams.get("delay") || "0", 10);

  const lessons = await getLessons(tab, search, delay);
  return NextResponse.json(lessons);
}
