"use client";

import type { Route } from "next";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { MessageCircle } from "lucide-react";
import { replyAsAdmin } from "@/actions/communication-actions";
import { AdminPanel } from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type AdminMessageThread = {
  id: string;
  subject: string;
  status: string;
  updatedAt: Date;
  tenant: {
    id: string;
    name: string;
    slug: string;
  };
  messages: Array<{
    id: string;
    senderRole: string;
    body: string;
    createdAt: Date;
  }>;
};

type AdminMessageManagerProps = {
  threads: AdminMessageThread[];
};

export function AdminMessageManager({ threads }: AdminMessageManagerProps) {
  const [threadItems, setThreadItems] = useState(threads);

  useEffect(() => {
    setThreadItems(threads);
  }, [threads]);

  useEffect(() => {
    const source = new EventSource("/api/conversations/events");

    source.addEventListener("conversation:message", (rawEvent) => {
      const event = JSON.parse((rawEvent as MessageEvent).data) as {
        tenantSlug: string;
        threadId: string;
        thread: {
          id: string;
          subject: string;
          status: string;
          updatedAt: string;
        };
        message: {
          id: string;
          senderRole: string;
          body: string;
          createdAt: string;
        };
      };

      setThreadItems((currentThreads) =>
        currentThreads
          .map((thread) => {
            if (thread.id !== event.threadId || thread.messages.some((message) => message.id === event.message.id)) {
              return thread;
            }

            return {
              ...thread,
              status: event.thread.status,
              updatedAt: new Date(event.thread.updatedAt),
              messages: [
                ...thread.messages,
                {
                  ...event.message,
                  createdAt: new Date(event.message.createdAt)
                }
              ]
            };
          })
          .sort((first, second) => second.updatedAt.getTime() - first.updatedAt.getTime())
      );
    });

    return () => {
      source.close();
    };
  }, []);

  return (
    <AdminPanel title={`${threadItems.length} conversations`} icon={MessageCircle}>
      {threadItems.length ? (
        <div className="grid gap-4">
          {threadItems.map((thread) => (
            <article key={thread.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-slate-950">{thread.subject}</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    <Link href={`/admin/customers/${thread.tenant.id}` as Route} className="font-semibold text-teal-700 hover:text-teal-800">
                      {thread.tenant.name}
                    </Link>{" "}
                    /{thread.tenant.slug}
                  </p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{thread.status}</span>
              </div>

              <div className="mt-4 grid gap-3">
                {thread.messages.map((message) => (
                  <div key={message.id} className={message.senderRole === "ADMIN" ? "ml-auto max-w-3xl rounded-lg bg-slate-950 p-3 text-sm leading-6 text-white" : "mr-auto max-w-3xl rounded-lg border border-slate-200 bg-white p-3 text-sm leading-6 text-slate-700"}>
                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] opacity-60">{message.senderRole === "ADMIN" ? "Admin" : "Client"}</p>
                    <p className="mt-1">{message.body}</p>
                    <p className="mt-2 text-[0.65rem] opacity-50">{message.createdAt.toLocaleString("en-US")}</p>
                  </div>
                ))}
              </div>

              <AdminReplyForm threadId={thread.id} />
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <MessageCircle className="mx-auto size-8 text-slate-400" aria-hidden="true" />
          <p className="mt-3 font-semibold text-slate-950">No client conversations yet.</p>
          <p className="mt-1 text-sm text-slate-500">Client messages from their dashboard will appear here.</p>
        </div>
      )}
    </AdminPanel>
  );
}

function AdminReplyForm({ threadId }: { threadId: string }) {
  const [isPending, startTransition] = useTransition();

  function submit(formData: FormData) {
    startTransition(async () => {
      await replyAsAdmin(formData);
    });
  }

  return (
    <form action={submit} className="mt-4 flex flex-col gap-2 sm:flex-row">
      <input type="hidden" name="threadId" value={threadId} />
      <Input name="body" required minLength={2} placeholder="Reply to client..." className="min-w-0 flex-1" />
      <Button type="submit" disabled={isPending} className="h-10 bg-teal-700 hover:bg-teal-800">
        {isPending ? "Sending" : "Reply"}
      </Button>
    </form>
  );
}
