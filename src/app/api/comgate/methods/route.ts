import { NextResponse } from "next/server";

export async function GET() {
  const merchant = process.env.COMGATE_MERCHANT;
  const secret   = process.env.COMGATE_SECRET;

  if (!merchant || !secret) {
    return NextResponse.json({ error: "Missing credentials" }, { status: 500 });
  }

  const res = await fetch("https://payments.comgate.cz/v1.0/methods", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ merchant, secret, lang: "cs" }).toString(),
  });

  const text = await res.text();
  return new NextResponse(text, { headers: { "Content-Type": "text/xml" } });
}
