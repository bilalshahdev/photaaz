import { subscribeToConversationEvents } from "@/services/communication/live-events";
import { requireSuperAdmin } from "@/services/auth/admin-authorization";
import { requireTenantOwner } from "@/services/auth/tenant-authorization";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tenantSlug = searchParams.get("tenantSlug");
  let isAdmin = false;

  try {
    await requireSuperAdmin();
    isAdmin = true;
  } catch {
    // Tenant authorization is checked below.
  }

  if (!isAdmin) {
    if (!tenantSlug) {
      return Response.json(
        { error: "Authentication required." },
        { status: 401 },
      );
    }

    try {
      await requireTenantOwner(tenantSlug);
    } catch {
      return Response.json(
        { error: "Authentication required." },
        { status: 401 },
      );
    }
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode("event: ready\ndata: {}\n\n"));

      const unsubscribe = subscribeToConversationEvents((event) => {
        if (tenantSlug && event.tenantSlug !== tenantSlug) {
          return;
        }

        controller.enqueue(
          encoder.encode(
            `event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`,
          ),
        );
      });

      const heartbeat = setInterval(() => {
        controller.enqueue(encoder.encode("event: heartbeat\ndata: {}\n\n"));
      }, 25000);

      request.signal.addEventListener("abort", () => {
        clearInterval(heartbeat);
        unsubscribe();
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
