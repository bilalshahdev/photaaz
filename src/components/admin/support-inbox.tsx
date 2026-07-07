"use client";

import { useState, useTransition } from "react";
import { LifeBuoy, type LucideIcon } from "lucide-react";
import { AdminEmptyState, AdminRecordCard, AdminStatusMessage } from "@/components/admin/admin-crud-ui";
import { AdminPanel } from "@/components/admin/admin-ui";
import { updateSupportRequestStatus } from "@/app/admin/actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import type { PlatformSupportRequestView } from "@/services/platform/platform-data";

type SupportInboxProps = {
  initialRequests: PlatformSupportRequestView[];
  title?: string;
  icon?: LucideIcon;
};

export function SupportInbox({ initialRequests, title = "Inbox", icon: Icon = LifeBuoy }: SupportInboxProps) {
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
    <AdminPanel title={title} icon={Icon}>
      {message ? <AdminStatusMessage>{message}</AdminStatusMessage> : null}
      <div className="space-y-3">
        {requests.map((request) => (
          <AdminRecordCard key={request.id} className="min-h-0 p-4">
            <div className="flex flex-col justify-between gap-2 sm:flex-row">
              <div>
                <p className="font-semibold">{request.topic}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {request.id} - {request.name} - {request.email}
                </p>
              </div>
              <Select value={request.status} onValueChange={(status) => updateStatus(request.id, status)}>
                <SelectTrigger className="h-9 w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="mt-3 border border-slate-200 px-3 py-2 text-sm leading-6 text-slate-600">{request.message}</p>
          </AdminRecordCard>
        ))}
        {requests.length === 0 ? <AdminEmptyState title="No support requests yet." body="New contact form submissions will appear here." /> : null}
      </div>
    </AdminPanel>
  );
}
