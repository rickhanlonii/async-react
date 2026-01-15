import { NextRequest, NextResponse } from "next/server";
import { getAllDelays, setDelay } from "@/lib/debug-store";

export async function GET() {
  return NextResponse.json(getAllDelays());
}

export async function POST(request: NextRequest) {
  const { path, value } = await request.json();
  setDelay(path, value);
  return NextResponse.json({ ok: true });
}
