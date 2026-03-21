import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  return NextResponse.json({
    ok: true,
    action: body.action ?? "claim-task",
    note: "Replace with backend RP signature generation using your World RP signing key.",
  });
}
