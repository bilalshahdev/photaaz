import { NextResponse } from "next/server";
import { verifyPaddleWebhookSignature } from "@/lib/paddle/client";
import {
  activateSubscriptionFromPaddleTransaction,
  updateSubscriptionFromPaddleSubscription
} from "@/services/subscription/paddle-provisioning";

export const runtime = "nodejs";

type PaddleWebhookEvent = {
  event_type?: string;
  data?: Record<string, unknown>;
};

export async function POST(request: Request) {
  const rawBody = await request.text();

  if (!verifyPaddleWebhookSignature(rawBody, request.headers.get("Paddle-Signature"))) {
    return NextResponse.json({ ok: false, message: "Invalid Paddle signature." }, { status: 401 });
  }

  const event = JSON.parse(rawBody) as PaddleWebhookEvent;
  await handlePaddleEvent(event);

  return NextResponse.json({ ok: true });
}

async function handlePaddleEvent(event: PaddleWebhookEvent) {
  if (!event.data || !event.event_type) return;

  if (event.event_type === "transaction.completed") {
    await activateSubscriptionFromPaddleTransaction(event.data);
    return;
  }

  if (event.event_type.startsWith("subscription.")) {
    await updateSubscriptionFromPaddleSubscription(event.event_type, event.data);
  }
}
