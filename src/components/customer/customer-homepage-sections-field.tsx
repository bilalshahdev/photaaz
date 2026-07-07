"use client";

import { useEffect, useMemo, useState } from "react";
import { GripVertical } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type CustomerHomeSectionKey = "hero" | "featuredPhotos" | "categories" | "galleries" | "contact" | "footer";

type CustomerHomeSection = {
  key: CustomerHomeSectionKey;
  label: string;
  enabled: boolean;
  locked?: boolean;
  lockedReason?: string;
};

type CustomerHomepageSectionsFieldProps = {
  sections: CustomerHomeSection[];
};

export function CustomerHomepageSectionsField({ sections }: CustomerHomepageSectionsFieldProps) {
  const [items, setItems] = useState(() => sections);
  const [draggedKey, setDraggedKey] = useState<CustomerHomeSectionKey | null>(null);

  const orderedItems = useMemo(() => items, [items]);
  const sectionsSignature = useMemo(
    () => sections.map((section) => `${section.key}:${section.enabled ? "1" : "0"}:${section.locked ? "1" : "0"}`).join("|"),
    [sections]
  );

  useEffect(() => {
    setItems(sections);
    // Sync only when the saved server values change. Including the array
    // reference here makes local checkbox changes snap back during re-renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionsSignature]);

  function reorder(activeKey: CustomerHomeSectionKey, targetKey: CustomerHomeSectionKey) {
    if (activeKey === targetKey) {
      return;
    }

    setItems((current) => {
      const next = [...current];
      const activeIndex = next.findIndex((item) => item.key === activeKey);
      const targetIndex = next.findIndex((item) => item.key === targetKey);

      if (activeIndex < 0 || targetIndex < 0) {
        return current;
      }

      const [activeItem] = next.splice(activeIndex, 1);
      next.splice(targetIndex, 0, activeItem);
      return next;
    });
  }

  function toggleSection(key: CustomerHomeSectionKey, enabled: boolean) {
    setItems((current) => current.map((item) => (item.key === key && !item.locked ? { ...item, enabled } : item)));
  }

  return (
    <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {orderedItems.map((item, index) => {
        const checkboxId = `home-section-${item.key}`;

        return (
        <div
          key={item.key}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            if (draggedKey) {
              reorder(draggedKey, item.key);
            }
            setDraggedKey(null);
          }}
          className={cn(
            "group flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 shadow-sm transition",
            draggedKey === item.key ? "border-teal-600 bg-teal-50 opacity-70" : "hover:border-slate-300 hover:bg-white"
          )}
        >
          <input type="hidden" name={`${item.key}Enabled`} value={item.enabled ? "true" : "false"} />
          <input type="hidden" name={`${item.key}Order`} value={String(index + 1)} />
          <span
            draggable
            onDragStart={() => setDraggedKey(item.key)}
            onDragEnd={() => setDraggedKey(null)}
            className="flex size-8 shrink-0 cursor-grab items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 active:cursor-grabbing"
            aria-label={`Move ${item.label}`}
          >
            <GripVertical className="size-4" aria-hidden="true" />
          </span>
          <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
            <div className="min-w-0">
              <Label htmlFor={checkboxId} className="cursor-pointer text-sm font-semibold text-slate-950">
                {item.label}
              </Label>
              {item.lockedReason ? <p className="mt-1 text-xs leading-5 text-slate-500">{item.lockedReason}</p> : null}
            </div>
            <Checkbox
              id={checkboxId}
              checked={item.enabled}
              disabled={item.locked}
              onCheckedChange={(checked) => toggleSection(item.key, checked === true)}
            />
          </div>
        </div>
        );
      })}
    </div>
  );
}
