"use client";

import { useMemo, useState } from "react";
import { Check, ChevronDown, ChevronRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export type PhotoCategoryOption = {
  id: string;
  name: string;
  children: {
    id: string;
    name: string;
  }[];
};

type CustomerPhotoCategorySelectProps = {
  categories: PhotoCategoryOption[];
  defaultValue?: string | null;
};

export function CustomerPhotoCategorySelect({ categories, defaultValue }: CustomerPhotoCategorySelectProps) {
  const [selectedId, setSelectedId] = useState(defaultValue ?? "");
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(null);
  const selectedLabel = useMemo(() => getSelectedCategoryLabel(categories, selectedId), [categories, selectedId]);

  return (
    <div className="grid gap-2">
      <Label>Category</Label>
      <input type="hidden" name="categoryId" value={selectedId} />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant="outline" className="h-10 justify-between gap-2 bg-background px-3 font-normal">
            <span className={selectedLabel ? "truncate text-foreground" : "truncate text-muted-foreground"}>
              {selectedLabel || "Choose category or subcategory"}
            </span>
            <ChevronDown className="size-4 shrink-0 opacity-50" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          collisionPadding={12}
          className="max-h-[min(22rem,var(--radix-dropdown-menu-content-available-height))] min-w-[var(--radix-dropdown-menu-trigger-width)] overflow-y-auto"
        >
          {categories.map((category) =>
            category.children.length ? (
              <div key={category.id}>
                <div className="hidden sm:block">
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>{category.name}</DropdownMenuSubTrigger>
                    <DropdownMenuSubContent collisionPadding={12}>
                      {category.children.map((subcategory) => (
                        <DropdownMenuItem key={subcategory.id} onSelect={() => setSelectedId(subcategory.id)}>
                          <span className="flex-1">{subcategory.name}</span>
                          {selectedId === subcategory.id ? <Check className="size-4" aria-hidden="true" /> : null}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                </div>

                <div className="sm:hidden">
                  <DropdownMenuItem
                    className="gap-2"
                    onSelect={(event) => {
                      event.preventDefault();
                      setOpenCategoryId(openCategoryId === category.id ? null : category.id);
                    }}
                  >
                    <span className="flex-1 truncate">{category.name}</span>
                    <ChevronRight
                      className={`size-4 shrink-0 transition-transform ${
                        openCategoryId === category.id ? "rotate-90" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </DropdownMenuItem>
                  {openCategoryId === category.id ? (
                    <div className="ml-2 border-l border-border pl-2">
                      {category.children.map((subcategory) => (
                        <DropdownMenuItem key={subcategory.id} onSelect={() => setSelectedId(subcategory.id)}>
                          <span className="flex-1 truncate">{subcategory.name}</span>
                          {selectedId === subcategory.id ? <Check className="size-4" aria-hidden="true" /> : null}
                        </DropdownMenuItem>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            ) : (
              <DropdownMenuItem key={category.id} onSelect={() => setSelectedId(category.id)}>
                <span className="flex-1 truncate">{category.name}</span>
                {selectedId === category.id ? <Check className="size-4" aria-hidden="true" /> : null}
              </DropdownMenuItem>
            )
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function getSelectedCategoryLabel(categories: PhotoCategoryOption[], selectedId: string) {
  for (const category of categories) {
    if (category.id === selectedId) {
      return category.name;
    }

    const subcategory = category.children.find((child) => child.id === selectedId);

    if (subcategory) {
      return `${category.name} / ${subcategory.name}`;
    }
  }

  return "";
}
