"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { Edit3, ListChecks, Loader2, Save, Trash2 } from "lucide-react";
import { saveLandingSettings } from "@/app/admin/actions";
import { AdminDragHandle } from "@/components/admin/admin-crud-ui";
import { AdminAddButton, AdminIconButton, AdminPanel } from "@/components/admin/admin-ui";
import { LocalizedInput, LocalizedTextarea, type AdminLocaleOption } from "@/components/admin/localized-fields";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import type { LocalizedString, PlatformLandingSettings } from "@/services/platform/platform-data";

type FaqItem = PlatformLandingSettings["faqs"][number];

function createLocalizedValue(locales: AdminLocaleOption[], fallback: string) {
  return locales.reduce<Record<string, string>>((value, locale) => {
    value[locale.code] = fallback;
    return value;
  }, {});
}

function resolveText(value: LocalizedString, localeCode: string) {
  if (typeof value === "string") {
    return value;
  }

  return value[localeCode] ?? value.en ?? Object.values(value)[0] ?? "";
}

function createEmptyFaq(locales: AdminLocaleOption[], displayOrder: number): FaqItem {
  return {
    question: createLocalizedValue(locales, "New question"),
    answer: createLocalizedValue(locales, "Add the answer here."),
    enabled: true,
    displayOrder
  };
}

export function FaqEditor({ initialSettings, locales }: { initialSettings: PlatformLandingSettings; locales: AdminLocaleOption[] }) {
  const [settings, setSettings] = useState(initialSettings);
  const [dialogIndex, setDialogIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState<FaqItem | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const previewLocale = locales[0]?.code ?? "en";
  const sortedFaqs = useMemo(
    () =>
      settings.faqs
        .map((faq, index) => ({ faq, index }))
        .sort((first, second) => first.faq.displayOrder - second.faq.displayOrder),
    [settings.faqs]
  );

  function openAddDialog() {
    setDialogIndex(null);
    setDraft(createEmptyFaq(locales, settings.faqs.length + 1));
  }

  function openEditDialog(index: number) {
    setDialogIndex(index);
    setDraft({ ...settings.faqs[index] });
  }

  function closeDialog() {
    setDialogIndex(null);
    setDraft(null);
  }

  function normalizeFaqOrder(faqs: FaqItem[]) {
    return faqs.map((faq, index) => ({ ...faq, displayOrder: index + 1 }));
  }

  function reorderFaqs(activeIndex: number, targetIndex: number) {
    if (activeIndex === targetIndex) {
      return;
    }

    const currentOrder = sortedFaqs.map((item) => item.index);
    const activePosition = currentOrder.indexOf(activeIndex);
    const targetPosition = currentOrder.indexOf(targetIndex);

    if (activePosition < 0 || targetPosition < 0) {
      return;
    }

    currentOrder.splice(activePosition, 1);
    currentOrder.splice(targetPosition, 0, activeIndex);

    setSettings((current) => ({
      ...current,
      faqs: current.faqs.map((faq, index) => ({
        ...faq,
        displayOrder: currentOrder.indexOf(index) + 1
      }))
    }));
  }

  function applyDraft() {
    if (!draft) {
      return;
    }

    setSettings((current) => ({
      ...current,
      faqs: normalizeFaqOrder(
        dialogIndex === null
          ? [...current.faqs, draft]
          : current.faqs.map((faq, index) => (index === dialogIndex ? { ...draft, displayOrder: faq.displayOrder } : faq)).sort((first, second) => first.displayOrder - second.displayOrder)
      )
    }));
    closeDialog();
  }

  function save() {
    startTransition(async () => {
      try {
        await saveLandingSettings(settings);
        toast.success("FAQ settings saved.");
      } catch {
        toast.error("Could not save FAQ settings. Check your local database connection.");
      }
    });
  }

  return (
    <div className="grid gap-6">
      <AdminPanel
        title="FAQ Entries"
        icon={ListChecks}
        actions={
          <AdminAddButton onClick={openAddDialog}>
            Add FAQ
          </AdminAddButton>
        }
      >
        <div className="mb-5 flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-950">
              {settings.faqs.filter((faq) => faq.enabled).length} shown on landing page / {settings.faqs.length} total questions
            </p>
            <p className="mt-1 text-sm text-slate-500">Drag to reorder. Toggle Show to control what appears on the landing page.</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-slate-300">
          {sortedFaqs.map(({ faq, index }) => (
            <article
              key={`${resolveText(faq.question, previewLocale)}-${index}`}
              draggable
              onDragStart={() => setDraggedIndex(index)}
              onDragEnd={() => setDraggedIndex(null)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                if (draggedIndex !== null) {
                  reorderFaqs(draggedIndex, index);
                }
                setDraggedIndex(null);
              }}
              className={`grid cursor-grab gap-3 border-b border-slate-200 bg-white p-3 transition last:border-b-0 active:cursor-grabbing xl:grid-cols-[minmax(0,1fr)_120px_96px] xl:items-center ${
                draggedIndex === index ? "bg-primary/5 opacity-70" : "hover:bg-slate-50"
              }`}
            >
              <div className="flex min-w-0 items-start gap-3 px-1">
                <AdminDragHandle className="mt-0.5 shrink-0" />
                <div className="min-w-0">
                <h3 className="truncate text-base font-semibold text-slate-950">{resolveText(faq.question, previewLocale)}</h3>
                <p className="mt-1 truncate text-sm text-slate-500">{resolveText(faq.answer, previewLocale)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 xl:justify-end">
                <Label className="flex items-center gap-2 text-sm font-medium text-slate-600">
                  <Checkbox
                    checked={faq.enabled}
                    onCheckedChange={(checked) =>
                      setSettings((current) => ({
                        ...current,
                        faqs: current.faqs.map((item, itemIndex) => (itemIndex === index ? { ...item, enabled: checked === true } : item))
                      }))
                    }
                  />
                  Show
                </Label>
              </div>

              <div className="flex items-center gap-2 xl:justify-end">
                <AdminIconButton icon={Edit3} label="Edit FAQ" tooltip="Edit FAQ" onClick={() => openEditDialog(index)} />
                <AdminIconButton
                  icon={Trash2}
                  label="Delete FAQ"
                  tooltip="Delete FAQ"
                  tone="danger"
                  onClick={() =>
                    setSettings((current) => ({
                      ...current,
                      faqs: normalizeFaqOrder(current.faqs.filter((_, itemIndex) => itemIndex !== index).sort((first, second) => first.displayOrder - second.displayOrder))
                    }))
                  }
                />
              </div>
            </article>
          ))}
        </div>
        <div className="sticky bottom-4 z-20 flex justify-end">
          <Button type="button" onClick={save} disabled={isPending} className="h-11 gap-2 bg-slate-950 px-6 shadow-[0_4px_20px_rgba(0,0,0,0.25)] hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70">
            {isPending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Save className="size-4" aria-hidden="true" />}
            {isPending ? "Saving\u2026" : "Save FAQs"}
          </Button>
        </div>
      </AdminPanel>

      <Dialog open={Boolean(draft)} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          {draft ? (
            <>
              <DialogHeader>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">FAQ</p>
                <DialogTitle>{dialogIndex === null ? "Add FAQ" : "Edit FAQ"}</DialogTitle>
              </DialogHeader>

              <div className="grid gap-5">
              <div className="grid gap-4">
                <Label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Checkbox checked={draft.enabled} onCheckedChange={(checked) => setDraft((current) => (current ? { ...current, enabled: checked === true } : current))} />
                  Show on landing page
                </Label>
              </div>
              <LocalizedInput locales={locales} label="Question" placeholder="FAQ question" value={draft.question} onChange={(question) => setDraft((current) => (current ? { ...current, question } : current))} />
              <LocalizedTextarea locales={locales} label="Answer" placeholder="Detailed answer" value={draft.answer} onChange={(answer) => setDraft((current) => (current ? { ...current, answer } : current))} />
              </div>

              <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog}>
                Cancel
              </Button>
              <Button type="button" onClick={applyDraft} className="bg-slate-950 text-white hover:bg-primary/90">
                {dialogIndex === null ? "Add FAQ" : "Update FAQ"}
              </Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
