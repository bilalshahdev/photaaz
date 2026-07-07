"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { MessageCircle, Plus, Send } from "lucide-react";
import { replyAsClient, startClientConversation } from "@/actions/communication-actions";
import {
  CustomerAddButton,
  CustomerEmptyState,
  CustomerIconButton,
  CustomerPanel
} from "@/components/customer/customer-dashboard-ui";
import { TextareaField, TextField } from "@/components/forms/form-controls";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

type CustomerThread = {
  id: string;
  subject: string;
  status: string;
  updatedAt: Date;
  messages: Array<{
    id: string;
    senderRole: string;
    body: string;
    createdAt: Date;
  }>;
};

type CustomerMessageManagerProps = {
  tenantSlug: string;
  threads: CustomerThread[];
};

export function CustomerMessageManager({ tenantSlug, threads }: CustomerMessageManagerProps) {
  const [threadItems, setThreadItems] = useState(threads);
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const activeThread = useMemo(
    () => threadItems.find((thread) => thread.id === activeThreadId) ?? null,
    [activeThreadId, threadItems]
  );

  useEffect(() => {
    setThreadItems(threads);
  }, [threads]);

  useEffect(() => {
    const source = new EventSource(`/api/conversations/events?tenantSlug=${encodeURIComponent(tenantSlug)}`);

    source.addEventListener("conversation:message", (rawEvent) => {
      const event = JSON.parse((rawEvent as MessageEvent).data) as {
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

      setThreadItems((currentThreads) => {
        const message = {
          ...event.message,
          createdAt: new Date(event.message.createdAt)
        };
        const existingThread = currentThreads.find((thread) => thread.id === event.threadId);

        if (!existingThread) {
          return [
            {
              id: event.thread.id,
              subject: event.thread.subject,
              status: event.thread.status,
              updatedAt: new Date(event.thread.updatedAt),
              messages: [message]
            },
            ...currentThreads
          ];
        }

        return currentThreads
          .map((thread) => {
            if (thread.id !== event.threadId || thread.messages.some((item) => item.id === event.message.id)) {
              return thread;
            }

            return {
              ...thread,
              status: event.thread.status,
              updatedAt: new Date(event.thread.updatedAt),
              messages: [...thread.messages, message]
            };
          })
          .sort((first, second) => second.updatedAt.getTime() - first.updatedAt.getTime());
      });
    });

    return () => {
      source.close();
    };
  }, [tenantSlug]);

  return (
    <>
      <CustomerPanel
        title={`${threadItems.length} conversation${threadItems.length === 1 ? "" : "s"}`}
        icon={MessageCircle}
        actions={
          <CustomerAddButton onClick={() => setIsStartOpen(true)}>
            Start new chat
          </CustomerAddButton>
        }
      >
        {threadItems.length ? (
          <div className="grid gap-3">
            {threadItems.map((thread) => {
              const latestMessage = thread.messages.at(-1);

              return (
                <article key={thread.id} className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="truncate font-semibold text-slate-950">{thread.subject}</h2>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-slate-600">{thread.status}</span>
                    </div>
                    <p className="mt-2 line-clamp-1 text-sm text-slate-500">
                      {latestMessage ? `${latestMessage.senderRole === "CLIENT" ? "You" : "Photaaz"}: ${latestMessage.body}` : "No messages yet."}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">{thread.updatedAt.toLocaleDateString("en-US")}</p>
                  </div>
                  <CustomerIconButton icon={MessageCircle} label={`Open ${thread.subject}`} tooltip="Open chat" onClick={() => setActiveThreadId(thread.id)} />
                </article>
              );
            })}
          </div>
        ) : (
          <CustomerEmptyState title="No chats yet." body="Start a chat when you need help from Photaaz admin." />
        )}
      </CustomerPanel>

      <StartChatDialog tenantSlug={tenantSlug} open={isStartOpen} onOpenChange={setIsStartOpen} />
      <ThreadDialog thread={activeThread} onOpenChange={(open) => !open && setActiveThreadId(null)} />
    </>
  );
}

function StartChatDialog({
  tenantSlug,
  open,
  onOpenChange
}: {
  tenantSlug: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  function submit(formData: FormData) {
    startTransition(async () => {
      await startClientConversation(formData);
      formRef.current?.reset();
      onOpenChange(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start new chat</DialogTitle>
        </DialogHeader>
        <form ref={formRef} action={submit} className="grid gap-4">
          <input type="hidden" name="tenantSlug" value={tenantSlug} />
          <TextField name="subject" required minLength={2} label="Subject" placeholder="What do you need help with?" />
          <TextareaField name="body" required minLength={5} label="Message" placeholder="Write your message..." className="min-h-32" />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              <Send className="size-4" aria-hidden="true" />
              {isPending ? "Sending" : "Send message"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ThreadDialog({
  thread,
  onOpenChange
}: {
  thread: CustomerThread | null;
  onOpenChange: (open: boolean) => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  function submit(formData: FormData) {
    startTransition(async () => {
      await replyAsClient(formData);
      formRef.current?.reset();
    });
  }

  return (
    <Dialog open={Boolean(thread)} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-2xl">
        {thread ? (
          <>
            <DialogHeader>
              <p className="font-nav text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">{thread.status}</p>
              <DialogTitle>{thread.subject}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-3">
              {thread.messages.map((message) => (
                <div
                  key={message.id}
                  className={message.senderRole === "CLIENT" ? "ml-auto max-w-xl rounded-lg bg-slate-950 p-3 text-sm leading-6 text-white" : "mr-auto max-w-xl rounded-lg border border-slate-200 bg-white p-3 text-sm leading-6 text-slate-700"}
                >
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] opacity-60">{message.senderRole === "CLIENT" ? "You" : "Photaaz"}</p>
                  <p className="mt-1">{message.body}</p>
                </div>
              ))}
            </div>
            <form ref={formRef} action={submit} className="grid gap-3 border-t border-slate-200 pt-4">
              <input type="hidden" name="threadId" value={thread.id} />
              <TextareaField name="body" required minLength={2} label="Reply" placeholder="Write a reply..." className="min-h-24" />
              <DialogFooter>
                <Button type="submit" disabled={isPending}>
                  <Plus className="size-4" aria-hidden="true" />
                  {isPending ? "Sending" : "Send reply"}
                </Button>
              </DialogFooter>
            </form>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
