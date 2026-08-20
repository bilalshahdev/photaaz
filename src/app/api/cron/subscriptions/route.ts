import { NextRequest, NextResponse } from "next/server";
import { syncSubscriptionLifecycle } from "@/services/subscription/lifecycle";

export const runtime = "nodejs";

function isAuthorized(request: NextRequest) {
  if (process.env.NODE_ENV !== "production" && !process.env.CRON_SECRET) {
    return true;
  }

  const secret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization");
  return Boolean(secret && authorization === `Bearer ${secret}`);
}

async function runSubscriptionCron(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const result = await syncSubscriptionLifecycle();

  return NextResponse.json({ ok: true, ...result });
}

export async function GET(request: NextRequest) {
  return runSubscriptionCron(request);
}

export async function POST(request: NextRequest) {
  return runSubscriptionCron(request);
}
