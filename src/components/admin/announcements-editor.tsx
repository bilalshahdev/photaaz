"use client";

import { useState, useTransition } from "react";
import { Megaphone, Plus, Save } from "lucide-react";
import { savePlatformAnnouncements } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import type { PlatformAnnouncementView } from "@/services/platform/platform-data";

export function AnnouncementsEditor({ initialAnnouncements }: { initialAnnouncements: PlatformAnnouncementView[] }) {
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function updateAnnouncement(id: string, patch: Partial<PlatformAnnouncementView>) {
    setAnnouncements((current) => current.map((announcement) => (announcement.id === id ? { ...announcement, ...patch } : announcement)));
  }

  function addAnnouncement() {
    const nextOrder = announcements.length + 1;

    setAnnouncements((current) => [
      ...current,
      {
        id: `announcement-${Date.now()}`,
        title: "Announcement title",
        body: "Short announcement message.",
        linkLabel: "",
        linkHref: "",
        enabled: false,
        marquee: false,
        displayOrder: nextOrder
      }
    ]);
  }

  function save() {
    startTransition(async () => {
      setMessage("");

      try {
        await savePlatformAnnouncements(announcements);
        setMessage("Announcements saved.");
      } catch {
        setMessage("Could not save announcements. Check your local database connection.");
      }
    });
  }

  return (
    <section className="border border-slate-200 bg-white p-5 shadow-sm">
      {message ? <div className="mb-5 border border-teal-200 bg-teal-50 p-4 text-sm font-medium text-teal-900">{message}</div> : null}

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <Megaphone className="size-5 text-teal-700" aria-hidden="true" />
          <h2 className="font-semibold">Announcement Bar</h2>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={addAnnouncement} className="rounded-none border-slate-300 bg-transparent font-nav text-xs font-semibold uppercase tracking-[0.18em]">
            <Plus className="size-4" aria-hidden="true" />
            Add
          </Button>
          <Button type="button" onClick={save} disabled={isPending} className="rounded-none bg-slate-950 font-nav text-xs font-semibold uppercase tracking-[0.18em] text-white hover:bg-teal-800">
            <Save className="size-4" aria-hidden="true" />
            {isPending ? "Saving" : "Save"}
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {announcements.map((announcement) => (
          <article key={announcement.id} className="grid gap-4 border border-slate-200 p-4 xl:grid-cols-[1fr_0.7fr]">
            <div className="grid gap-3">
              <AdminInput label="Title" value={announcement.title} onChange={(title) => updateAnnouncement(announcement.id, { title })} />
              <AdminTextarea label="Body" value={announcement.body} onChange={(body) => updateAnnouncement(announcement.id, { body })} />
              <div className="grid gap-3 sm:grid-cols-2">
                <AdminInput label="Link label" value={announcement.linkLabel ?? ""} onChange={(linkLabel) => updateAnnouncement(announcement.id, { linkLabel })} />
                <AdminInput label="Link href" value={announcement.linkHref ?? ""} onChange={(linkHref) => updateAnnouncement(announcement.id, { linkHref })} />
              </div>
            </div>

            <div className="grid content-start gap-4">
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" checked={announcement.enabled} onChange={(event) => updateAnnouncement(announcement.id, { enabled: event.target.checked })} />
                Show on marketing pages
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" checked={announcement.marquee} onChange={(event) => updateAnnouncement(announcement.id, { marquee: event.target.checked })} />
                Animate as marquee
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Display order
                <input
                  type="number"
                  min={1}
                  value={announcement.displayOrder}
                  onChange={(event) => updateAnnouncement(announcement.id, { displayOrder: Number(event.target.value) })}
                  className="mt-2 h-11 w-full border border-slate-200 px-3 text-sm outline-none focus:border-teal-700"
                />
              </label>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function AdminInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 h-11 w-full border border-slate-200 px-3 text-sm outline-none focus:border-teal-700" />
    </label>
  );
}

function AdminTextarea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 min-h-28 w-full resize-y border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-700" />
    </label>
  );
}
