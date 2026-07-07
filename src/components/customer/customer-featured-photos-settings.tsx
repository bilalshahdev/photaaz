"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Check, ImageIcon, Search, X } from "lucide-react";
import { SelectField, TextField } from "@/components/forms/form-controls";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type FeaturedPhotoOption = {
  id: string;
  title: string;
  image: string;
  category: string;
};

type FeaturedPhotoSource = "selected" | "all" | "category" | "subcategory" | "gallery";

type CustomerFeaturedPhotosSettingsProps = {
  settings: {
    source: FeaturedPhotoSource;
    sourceId: string;
    selectedPhotoIds: string[];
    limit: number;
    columns: "1" | "2" | "3" | "4" | "masonry";
    gridStyle: "square" | "portrait" | "landscape" | "tiles" | "mixed";
  };
  photos: FeaturedPhotoOption[];
};

const sourceOptions = [
  { value: "selected", label: "Selected photos" },
  { value: "all", label: "All approved photos" },
  { value: "category", label: "Specific category" },
  { value: "subcategory", label: "Specific subcategory" },
  { value: "gallery", label: "Specific gallery" }
];

export function CustomerFeaturedPhotosSettings({ settings, photos }: CustomerFeaturedPhotosSettingsProps) {
  const [source, setSource] = useState<FeaturedPhotoSource>(settings.source);
  const [selectedIds, setSelectedIds] = useState<string[]>(settings.selectedPhotoIds);
  const [query, setQuery] = useState("");
  const selectedPhotos = selectedIds
    .map((id) => photos.find((photo) => photo.id === id))
    .filter((photo): photo is FeaturedPhotoOption => Boolean(photo));
  const filteredPhotos = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return photos;
    }

    return photos.filter((photo) => `${photo.title} ${photo.category}`.toLowerCase().includes(normalizedQuery));
  }, [photos, query]);

  function togglePhoto(id: string) {
    setSelectedIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  function removePhoto(id: string) {
    setSelectedIds((current) => current.filter((item) => item !== id));
  }

  return (
    <div className="grid gap-5">
      <input type="hidden" name="featuredPhotoIds" value={selectedIds.join(",")} />
      <div className="grid gap-4 lg:grid-cols-3">
        <SelectField
          label="Photo source"
          name="featuredSource"
          value={source}
          onValueChange={(value) => setSource(value as FeaturedPhotoSource)}
          options={sourceOptions}
        />
        {source === "selected" ? (
          <FeaturedPhotoPicker
            photos={filteredPhotos}
            selectedIds={selectedIds}
            query={query}
            onQueryChange={setQuery}
            onToggle={togglePhoto}
          />
        ) : source === "all" ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600 lg:col-span-1">
            The newest approved photos will be shown automatically.
          </div>
        ) : (
          <TextField
            label="Source ID / slug"
            name="featuredSourceId"
            defaultValue={settings.sourceId}
            placeholder="weddings, portraits, or gallery slug"
          />
        )}
        {source === "selected" ? <input type="hidden" name="featuredSourceId" value="" /> : null}
        <TextField label="Initial photo count" name="featuredLimit" defaultValue={String(settings.limit)} placeholder="12" />
        <SelectField
          label="Grid columns"
          name="featuredColumns"
          defaultValue={settings.columns}
          options={[
            { value: "1", label: "1 column" },
            { value: "2", label: "2 columns" },
            { value: "3", label: "3 columns" },
            { value: "4", label: "4 columns" },
            { value: "masonry", label: "Masonry" }
          ]}
        />
        <SelectField
          label="Grid style"
          name="featuredGridStyle"
          defaultValue={settings.gridStyle}
          options={[
            { value: "square", label: "Square" },
            { value: "portrait", label: "Portrait" },
            { value: "landscape", label: "Landscape" },
            { value: "tiles", label: "Tiles" },
            { value: "mixed", label: "Mixed editorial" }
          ]}
        />
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
          Infinite scroll will be used when the selected source has more photos than the initial count.
        </div>
      </div>

      {source === "selected" ? (
        <div className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-950">Selected photos</p>
              <p className="text-xs text-slate-500">These photos will appear in this exact order.</p>
            </div>
            <span className="font-nav text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              {selectedPhotos.length} selected
            </span>
          </div>
          {selectedPhotos.length ? (
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {selectedPhotos.map((photo) => (
                <figure key={photo.id} className="group relative overflow-hidden rounded-md border border-slate-200 bg-white">
                  <Image src={photo.image} alt={photo.title} width={260} height={180} className="aspect-[4/3] w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(photo.id)}
                    className="absolute right-2 top-2 inline-flex size-8 items-center justify-center rounded-md border border-white/30 bg-black/65 text-white shadow-sm backdrop-blur transition hover:bg-red-600"
                    aria-label={`Remove ${photo.title}`}
                  >
                    <X className="size-4" aria-hidden="true" />
                  </button>
                  <figcaption className="p-2">
                    <p className="truncate text-sm font-semibold text-slate-950">{photo.title}</p>
                    <p className="truncate text-xs text-slate-500">{photo.category}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          ) : (
            <div className="rounded-md border border-dashed border-slate-300 bg-white p-5 text-sm text-slate-500">
              No photos selected yet.
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

function FeaturedPhotoPicker({
  photos,
  selectedIds,
  query,
  onQueryChange,
  onToggle
}: {
  photos: FeaturedPhotoOption[];
  selectedIds: string[];
  query: string;
  onQueryChange: (value: string) => void;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="grid gap-2">
      <Label className="text-sm font-semibold text-foreground">Choose photos</Label>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant="outline" className="h-11 justify-between px-3 text-left font-normal">
            <span className="truncate">{selectedIds.length ? `${selectedIds.length} photo${selectedIds.length === 1 ? "" : "s"} selected` : "Search and select photos"}</span>
            <ImageIcon className="size-4 text-muted-foreground" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[min(92vw,560px)] p-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search photos..." className="pl-9" />
          </div>
          <div className="mt-3 max-h-72 overflow-y-auto pr-1">
            {photos.length ? (
              <div className="grid gap-2">
                {photos.map((photo) => {
                  const selected = selectedIds.includes(photo.id);

                  return (
                    <button
                      key={photo.id}
                      type="button"
                      onClick={() => onToggle(photo.id)}
                      className={cn(
                        "grid grid-cols-[56px_1fr_auto] items-center gap-3 rounded-md border border-transparent p-2 text-left transition hover:border-teal-200 hover:bg-teal-50",
                        selected && "border-teal-200 bg-teal-50"
                      )}
                    >
                      <Image src={photo.image} alt={photo.title} width={56} height={42} className="aspect-[4/3] rounded object-cover" />
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-slate-950">{photo.title}</span>
                        <span className="block truncate text-xs text-slate-500">{photo.category}</span>
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <span
                          className={cn(
                            "inline-flex size-5 items-center justify-center rounded border border-slate-300 bg-white",
                            selected && "border-teal-700 bg-teal-700 text-white"
                          )}
                          aria-hidden="true"
                        >
                          {selected ? <Check className="size-3" aria-hidden="true" /> : null}
                        </span>
                        {selected ? <Check className="size-4 text-teal-700" aria-hidden="true" /> : null}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="rounded-md border border-dashed border-slate-300 p-4 text-sm text-slate-500">No approved photos found.</p>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
