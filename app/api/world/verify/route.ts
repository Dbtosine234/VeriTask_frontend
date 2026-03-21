import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({}));
  return NextResponse.json({
    ok: true,
    received: payload,
    verified: false,
    note: "Forward proof payload to backend or verify server-side using World verification flow.",
  });
}
