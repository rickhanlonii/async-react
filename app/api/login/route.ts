import { NextRequest, NextResponse } from "next/server";
import { postLogin } from "@/lib/data";

export async function POST(request: NextRequest) {
  const delay = parseInt(request.nextUrl.searchParams.get("delay") || "0", 10);

  await postLogin(delay);
  return NextResponse.json({ status: "ok" });
}
