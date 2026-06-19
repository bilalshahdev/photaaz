"use client";

import { useState, useTransition } from "react";
import { Plus, Save, Tags } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminPanel } from "@/components/admin/admin-ui";
import { savePhotographyTypes } from "@/app/admin/actions";
import type { PlatformPhotographyTypeView } from "@/services/platform/platform-data";

export function FocusTypesEditor({ initialTypes }: { initialTypes: PlatformPhotographyTypeView[] }) {
  const [types, setTypes] = useState(initialTypes);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function save() {
    startTransition(async () => {
      setMessage("");

      try {
        await savePhotographyTypes(types);
        setMessage("Focus types saved.");
      } catch {
        setMessage("Could not save focus types. Check your local database connection.");
      }
    });
  }

  function addCategory() {
    const name = "New Category";
    const slug = uniqueSlug(slugify(name), types);

    setTypes((current) => [
      ...current,
      {
        name,
        slug,
        parentSlug: null,
        enabled: true,
        categorySeed: true,
        displayOrder: current.length + 1,
        children: []
      }
    ]);
  }

  function addSubcategory(parentSlug: string) {
    const name = "New Subcategory";
    const slug = uniqueSlug(`${parentSlug}-${slugify(name)}`, types);

    setTypes((current) => [
      ...current,
      {
        name,
        slug,
        parentSlug,
        enabled: true,
        categorySeed: true,
        displayOrder: current.filter((item) => item.parentSlug === parentSlug).length + 1,
        children: []
      }
    ]);
  }

  const parentTypes = types.filter((type) => !type.parentSlug).sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <AdminPanel title="Photography Categories" icon={Tags}>
      {message ? <div className="mb-4 border border-teal-200 bg-teal-50 p-3 text-sm font-medium text-teal-900">{message}</div> : null}
      <div className="mb-5 flex flex-wrap justify-end gap-3">
        <Button type="button" variant="outline" onClick={addCategory} className="rounded-none border-slate-950 bg-white font-nav text-xs font-semibold uppercase tracking-[0.18em]">
          <Plus className="size-4" aria-hidden="true" />
          Add category
        </Button>
        <Button type="button" onClick={save} disabled={isPending} className="rounded-none bg-slate-950 font-nav text-xs font-semibold uppercase tracking-[0.18em] text-white hover:bg-teal-800">
          <Save className="size-4" aria-hidden="true" />
          {isPending ? "Saving" : "Save categories"}
        </Button>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {parentTypes.map((type) => {
          const children = types.filter((item) => item.parentSlug === type.slug).sort((a, b) => a.displayOrder - b.displayOrder);

          return (
          <article key={type.slug} className="border border-slate-200 bg-white p-5">
            <input
              value={type.name}
              onChange={(event) => setTypes((current) => current.map((item) => (item.slug === type.slug ? { ...item, name: event.target.value } : item)))}
              className="h-10 w-full border border-slate-200 px-3 font-semibold outline-none focus:border-teal-700"
            />
            <p className="mt-2 text-sm text-slate-500">
              Slug: {type.slug}
              {children.length ? " · Parent category, photos must use a subcategory" : " · Leaf category, photos can use this"}
            </p>
            <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
              <label className="border border-slate-200 p-3">
                <span className="block text-xs text-slate-500">Enabled</span>
                <input className="mt-2" type="checkbox" checked={type.enabled} onChange={(event) => setTypes((current) => current.map((item) => (item.slug === type.slug ? { ...item, enabled: event.target.checked } : item)))} />
              </label>
              <label className="border border-slate-200 p-3">
                <span className="block text-xs text-slate-500">Seed</span>
                <input className="mt-2" type="checkbox" checked={type.categorySeed} onChange={(event) => setTypes((current) => current.map((item) => (item.slug === type.slug ? { ...item, categorySeed: event.target.checked } : item)))} />
              </label>
              <label className="border border-slate-200 p-3">
                <span className="block text-xs text-slate-500">Order</span>
                <input className="mt-2 w-full outline-none" type="number" min={1} value={type.displayOrder} onChange={(event) => setTypes((current) => current.map((item) => (item.slug === type.slug ? { ...item, displayOrder: Number(event.target.value) } : item)))} />
              </label>
            </div>
            <div className="mt-5 border-t border-slate-200 pt-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-900">Subcategories</p>
                <Button type="button" variant="outline" onClick={() => addSubcategory(type.slug)} className="h-9 rounded-none border-slate-200 bg-white text-xs font-semibold">
                  <Plus className="size-3.5" aria-hidden="true" />
                  Add
                </Button>
              </div>
              <div className="mt-3 grid gap-3">
                {children.map((child) => (
                  <div key={child.slug} className="border border-slate-200 bg-slate-50 p-3">
                    <input
                      value={child.name}
                      onChange={(event) => setTypes((current) => current.map((item) => (item.slug === child.slug ? { ...item, name: event.target.value } : item)))}
                      className="h-9 w-full border border-slate-200 bg-white px-3 text-sm font-semibold outline-none focus:border-teal-700"
                    />
                    <p className="mt-2 text-xs text-slate-500">Slug: {child.slug} · Leaf subcategory</p>
                    <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                      <label className="border border-slate-200 bg-white p-2">
                        <span className="block text-slate-500">Enabled</span>
                        <input className="mt-2" type="checkbox" checked={child.enabled} onChange={(event) => setTypes((current) => current.map((item) => (item.slug === child.slug ? { ...item, enabled: event.target.checked } : item)))} />
                      </label>
                      <label className="border border-slate-200 bg-white p-2">
                        <span className="block text-slate-500">Seed</span>
                        <input className="mt-2" type="checkbox" checked={child.categorySeed} onChange={(event) => setTypes((current) => current.map((item) => (item.slug === child.slug ? { ...item, categorySeed: event.target.checked } : item)))} />
                      </label>
                      <label className="border border-slate-200 bg-white p-2">
                        <span className="block text-slate-500">Order</span>
                        <input className="mt-2 w-full bg-transparent outline-none" type="number" min={1} value={child.displayOrder} onChange={(event) => setTypes((current) => current.map((item) => (item.slug === child.slug ? { ...item, displayOrder: Number(event.target.value) } : item)))} />
                      </label>
                    </div>
                  </div>
                ))}
                {children.length === 0 ? <p className="text-sm text-slate-500">No subcategories. Photos can be assigned directly to this category.</p> : null}
              </div>
            </div>
          </article>
          );
        })}
      </div>
    </AdminPanel>
  );
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "category";
}

function uniqueSlug(baseSlug: string, types: PlatformPhotographyTypeView[]) {
  const existingSlugs = new Set(types.map((type) => type.slug));
  let slug = baseSlug;
  let index = 2;

  while (existingSlugs.has(slug)) {
    slug = `${baseSlug}-${index}`;
    index += 1;
  }

  return slug;
}
