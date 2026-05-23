import { NextRequest, NextResponse } from "next/server";

/**
 * ComGate payment notification endpoint.
 * ComGate POSTs here whenever a payment status changes (PAID, CANCELLED, etc.)
 * Must return HTTP 200 — otherwise ComGate will retry.
 */
export async function POST(req: NextRequest) {
  let data: Record<string, string> = {};

  const contentType = req.headers.get("content-type") || "";

  if (contentType.includes("application/x-www-form-urlencoded")) {
    const text = await req.text();
    data = Object.fromEntries(new URLSearchParams(text));
  } else {
    // Fallback: try JSON
    try { data = await req.json(); } catch { /* ignore */ }
  }

  const { merchant, transId, secret, status, price, curr, label, refId, email } = data;

  // Verify secret matches our env variable
  if (secret !== process.env.COMGATE_SECRET) {
    console.warn("ComGate notify: invalid secret from", merchant);
    // Still return 200 to avoid ComGate retries flooding the log
    return new NextResponse("UNAUTHORIZED", { status: 200 });
  }

  console.log("ComGate notify:", { merchant, transId, status, price, curr, label, refId, email });

  if (status === "PAID") {
    // TODO: persist payment record to database (e.g. Supabase)
    // TODO: send confirmation email with invoice via Resend
    // TODO: unlock any gated content for the customer
    console.log(`✅ Payment PAID — refId=${refId}, transId=${transId}, email=${email}, ${price} ${curr}`);
  }

  if (status === "CANCELLED") {
    console.log(`❌ Payment CANCELLED — refId=${refId}, transId=${transId}`);
  }

  return new NextResponse("OK", { status: 200 });
}
