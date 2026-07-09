"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Loader2, Megaphone, Save } from "lucide-react";
import { savePlatformAnnouncements } from "@/app/admin/actions";
import { AdminDragHandle, AdminRecordCard } from "@/components/admin/admin-crud-ui";
import { AdminAddButton, AdminPanel } from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LocalizedInput, LocalizedTextarea, type AdminLocaleOption } from "@/components/admin/localized-fields";
import type { PlatformAnnouncementView } from "@/services/platform/platform-data";

export function AnnouncementsEditor({ initialAnnouncements, locales }: { initialAnnouncements: PlatformAnnouncementView[]; locales: AdminLocaleOption[] }) {
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [draggedAnnouncementId, setDraggedAnnouncementId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const orderedAnnouncements = [...announcements].sort((first, second) => first.displayOrder - second.displayOrder);

  function updateAnnouncement(id: string, patch: Partial<PlatformAnnouncementView>) {
    setAnnouncements((current) => current.map((announcement) => (announcement.id === id ? { ...announcement, ...patch } : announcement)));
  }

  function addAnnouncement() {
    const nextOrder = announcements.length + 1;

    setAnnouncements((current) => [
      ...current,
      {
        id: `announcement-${Date.now()}`,
        title: { en: "Announcement title" },
        body: { en: "Short announcement message." },
        linkLabel: { en: "" },
        linkHref: "",
        enabled: false,
        marquee: false,
        displayOrder: nextOrder
      }
    ]);
  }

  function reorderAnnouncements(activeId: string, targetId: string) {
    if (activeId === targetId) {
      return;
    }

    const currentOrder = orderedAnnouncements.map((announcement) => announcement.id);
    const activeIndex = currentOrder.indexOf(activeId);
    const targetIndex = currentOrder.indexOf(targetId);

    if (activeIndex < 0 || targetIndex < 0) {
      return;
    }

    currentOrder.splice(activeIndex, 1);
    currentOrder.splice(targetIndex, 0, activeId);

    setAnnouncements((current) =>
      current.map((announcement) => ({
        ...announcement,
        displayOrder: currentOrder.indexOf(announcement.id) + 1
      }))
    );
  }

  function save() {
    startTransition(async () => {
      try {
        await savePlatformAnnouncements(announcements);
        toast.success("Announcements saved.");
      } catch {
        toast.error("Could not save announcements. Check your local database connection.");
      }
    });
  }

  return (
    <AdminPanel
      title="Announcement Bar"
      icon={Megaphone}
      actions={
        <AdminAddButton onClick={addAnnouncement}>
          Add
        </AdminAddButton>
      }
    >
      <div className="grid gap-4">
        {orderedAnnouncements.map((announcement) => (
          <AdminRecordCard
            key={announcement.id}
            draggable
            onDragStart={() => setDraggedAnnouncementId(announcement.id)}
            onDragEnd={() => setDraggedAnnouncementId(null)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              if (draggedAnnouncementId) {
                reorderAnnouncements(draggedAnnouncementId, announcement.id);
              }
              setDraggedAnnouncementId(null);
            }}
            className={`grid cursor-grab gap-4 border border-slate-200 p-4 transition active:cursor-grabbing xl:grid-cols-[1fr_0.7fr] ${
              draggedAnnouncementId === announcement.id ? "border-primary bg-primary/5 opacity-70" : "bg-white hover:border-slate-300"
            }`}
          >
            <div className="grid gap-3">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                <AdminDragHandle className="size-7 border-transparent" />
                Drag to reorder
              </div>
              <LocalizedInput locales={locales} label="Title" placeholder="Announcement title" value={announcement.title} onChange={(title) => updateAnnouncement(announcement.id, { title })} />
              <LocalizedTextarea locales={locales} label="Body" placeholder="Announcement message" value={announcement.body} onChange={(body) => updateAnnouncement(announcement.id, { body })} />
              <div className="grid gap-3 sm:grid-cols-2">
                <LocalizedInput locales={locales} label="Link label" placeholder="Link text" value={announcement.linkLabel ?? ""} onChange={(linkLabel) => updateAnnouncement(announcement.id, { linkLabel })} />
                <AdminInput label="Link href" value={announcement.linkHref ?? ""} onChange={(linkHref) => updateAnnouncement(announcement.id, { linkHref })} />
              </div>
            </div>

            <div className="grid content-start gap-4">
              <Label className="flex items-center gap-2 text-sm text-slate-700">
                <Checkbox checked={announcement.enabled} onCheckedChange={(checked) => updateAnnouncement(announcement.id, { enabled: checked === true })} />
                Show on marketing pages
              </Label>
              <Label className="flex items-center gap-2 text-sm text-slate-700">
                <Checkbox checked={announcement.marquee} onCheckedChange={(checked) => updateAnnouncement(announcement.id, { marquee: checked === true })} />
                Animate as marquee
              </Label>
            </div>
          </AdminRecordCard>
        ))}
      </div>
      <div className="sticky bottom-4 z-20 flex justify-end">
        <Button type="button" onClick={save} disabled={isPending} className="h-11 gap-2 bg-slate-950 px-6 shadow-[0_4px_20px_rgba(0,0,0,0.25)] hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70">
          {isPending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Save className="size-4" aria-hidden="true" />}
          {isPending ? "Saving\u2026" : "Save announcements"}
        </Button>
      </div>
    </AdminPanel>
  );
}

function AdminInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <Label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <Input value={value} onChange={(event) => onChange(event.target.value)} placeholder="https://..." className="mt-2 h-11" />
    </Label>
  );
}
