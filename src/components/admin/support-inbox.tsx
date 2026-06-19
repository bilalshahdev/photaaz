"use client";

import { useState, useTransition } from "react";
import { LifeBuoy } from "lucide-react";
import { AdminPanel } from "@/components/admin/admin-ui";
import { updateSupportRequestStatus } from "@/app/admin/actions";
import type { PlatformSupportRequestView } from "@/services/platform/platform-data";

export function SupportInbox({ initialRequests }: { initialRequests: PlatformSupportRequestView[] }) {
  const [requests, setRequests] = useState(initialRequests);
  const [message, setMessage] = useState("");
  const [, startTransition] = useTransition();

  function updateStatus(id: string, status: string) {
    setRequests((current) => current.map((item) => (item.id === id ? { ...item, status } : item)));
    startTransition(async () => {
      setMessage("");

      try {
        await updateSupportRequestStatus({ id, status });
        setMessage("Support status saved.");
      } catch {
        setMessage("Status changed in UI only. Check your local database connection.");
      }
    });
  }

  return (
    <AdminPanel title="Inbox" icon={LifeBuoy}>
      {message ? <div className="mb-4 border border-teal-200 bg-teal-50 p-3 text-sm font-medium text-teal-900">{message}</div> : null}
      <div className="space-y-3">
        {requests.map((request) => (
          <article key={request.id} className="border border-slate-200 p-4">
            <div className="flex flex-col justify-between gap-2 sm:flex-row">
              <div>
                <p className="font-semibold">{request.topic}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {request.id} - {request.name} - {request.email}
                </p>
              </div>
              <select value={request.status} onChange={(event) => updateStatus(request.id, event.target.value)} className="h-9 border border-slate-200 px-2 text-sm outline-none focus:border-teal-700">
                <option>Open</option>
                <option>Pending</option>
                <option>Resolved</option>
              </select>
            </div>
            <p className="mt-3 border border-slate-200 px-3 py-2 text-sm leading-6 text-slate-600">{request.message}</p>
          </article>
        ))}
      </div>
    </AdminPanel>
  );
}
