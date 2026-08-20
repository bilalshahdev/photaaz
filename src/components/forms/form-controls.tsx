"use client";

import { ImageIcon, UploadCloud, X } from "lucide-react";
import { useEffect, useId, useRef, useState, type DragEvent } from "react";
import type * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input, type InputProps } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea, type TextareaProps } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type FieldShellProps = {
  label?: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
};

export function FieldShell({ label, description, className, children }: FieldShellProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      {label ? <Label className="text-sm font-semibold text-foreground">{label}</Label> : null}
      {children}
      {description ? <p className="text-xs leading-5 text-muted-foreground">{description}</p> : null}
    </div>
  );
}

type TextFieldProps = InputProps & {
  label?: string;
  description?: string;
  shellClassName?: string;
};

export function TextField({ label, description, shellClassName, ...props }: TextFieldProps) {
  return (
    <FieldShell label={label} description={description} className={shellClassName}>
      <Input {...props} />
    </FieldShell>
  );
}

type TextareaFieldProps = TextareaProps & {
  label?: string;
  description?: string;
  shellClassName?: string;
};

export function TextareaField({ label, description, shellClassName, ...props }: TextareaFieldProps) {
  return (
    <FieldShell label={label} description={description} className={shellClassName}>
      <Textarea {...props} />
    </FieldShell>
  );
}

type SelectFieldProps = {
  name?: string;
  label?: string;
  description?: string;
  placeholder?: string;
  defaultValue?: string;
  value?: string;
  disabled?: boolean;
  shellClassName?: string;
  triggerClassName?: string;
  options: Array<{ label: string; value: string; disabled?: boolean }>;
  onValueChange?: (value: string) => void;
};

export function SelectField({
  name,
  label,
  description,
  placeholder = "Select option",
  defaultValue,
  value,
  disabled,
  shellClassName,
  triggerClassName,
  options,
  onValueChange
}: SelectFieldProps) {
  return (
    <FieldShell label={label} description={description} className={shellClassName}>
      <Select name={name} defaultValue={defaultValue} value={value} disabled={disabled} onValueChange={onValueChange}>
        <SelectTrigger className={triggerClassName}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FieldShell>
  );
}

type CheckboxFieldProps = React.ComponentPropsWithoutRef<typeof Checkbox> & {
  label: string;
  description?: string;
  wrapperClassName?: string;
  controlPosition?: "left" | "right";
};

export function CheckboxField({ label, description, wrapperClassName, controlPosition = "left", ...props }: CheckboxFieldProps) {
  const control = <Checkbox className={cn(controlPosition === "left" && "mt-1")} {...props} />;
  const text = (
    <span className={cn("min-w-0", controlPosition === "right" && "text-start")}>
      <span className="font-semibold text-foreground">{label}</span>
      {description ? <span className="mt-1 block text-muted-foreground">{description}</span> : null}
    </span>
  );

  return (
    <Label className={cn("flex items-start gap-3 rounded-md border border-border bg-background p-3 text-sm leading-6", controlPosition === "right" && "items-center justify-between", wrapperClassName)}>
      {controlPosition === "left" ? control : text}
      {controlPosition === "left" ? text : control}
    </Label>
  );
}

type ImageDropFieldProps = {
  name: string;
  label: string;
  currentImage?: string;
  currentImages?: string[];
  currentValueName?: string;
  currentImagesValueName?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  multiple?: boolean;
  shellClassName?: string;
  uploadArea?: "photos" | "categories" | "blogs" | "others";
  uploadFolder?: string;
  uploadLabel?: string;
};

export function ImageDropField({
  name,
  label,
  currentImage,
  currentImages,
  currentValueName,
  currentImagesValueName,
  description = "Drop an image here or click to choose one. JPG, PNG, WebP, or GIF within the configured upload limit.",
  required = false,
  disabled = false,
  multiple = false,
  shellClassName,
  uploadArea = "others",
  uploadFolder,
  uploadLabel
}: ImageDropFieldProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [existingImages, setExistingImages] = useState<string[]>(() => getInitialPreviews(currentImage, currentImages));
  const [, setSelectedFilesState] = useState<File[]>([]);
  const [selectedPreviews, setSelectedPreviews] = useState<string[]>([]);
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    setExistingImages(getInitialPreviews(currentImage, currentImages));
    clearSelectedFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentImage, currentImages]);

  useEffect(() => {
    return () => {
      selectedPreviews.forEach((preview) => {
        if (preview.startsWith("blob:")) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, [selectedPreviews]);

  function syncInputFiles(files: File[]) {
    if (!inputRef.current) return;

    const transfer = new DataTransfer();
    files.forEach((file) => transfer.items.add(file));
    inputRef.current.files = transfer.files;
  }

  function clearSelectedFiles() {
    selectedPreviews.forEach((preview) => {
      if (preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    });
    setSelectedFilesState([]);
    setSelectedPreviews([]);
    setFileName("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function setSelectedFiles(fileList: FileList | File[]) {
    const files = Array.from(fileList).filter((file) => file.type.startsWith("image/"));

    if (!files.length) {
      return;
    }

    if (disabled) {
      return;
    }

    selectedPreviews.forEach((preview) => {
      if (preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    });

    const nextFiles = multiple ? files : files.slice(0, 1);

    setExistingImages([]);
    setSelectedFilesState(nextFiles);
    setSelectedPreviews(nextFiles.map((file) => URL.createObjectURL(file)));
    setFileName(nextFiles.length === 1 ? nextFiles[0].name : `${nextFiles.length} images selected`);
    syncInputFiles(nextFiles);
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(false);

    if (disabled) {
      return;
    }

    if (!event.dataTransfer.files.length || !inputRef.current) {
      return;
    }

    const transfer = new DataTransfer();
    Array.from(event.dataTransfer.files)
      .slice(0, multiple ? undefined : 1)
      .forEach((item) => transfer.items.add(item));
    inputRef.current.files = transfer.files;
    setSelectedFiles(transfer.files);
  }

  function removeExistingImage(index: number) {
    setExistingImages((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  function removeSelectedImage(index: number) {
    setSelectedFilesState((currentFiles) => {
      const nextFiles = currentFiles.filter((_, itemIndex) => itemIndex !== index);
      syncInputFiles(nextFiles);
      setFileName(nextFiles.length === 0 ? "" : nextFiles.length === 1 ? nextFiles[0].name : `${nextFiles.length} images selected`);
      return nextFiles;
    });
    setSelectedPreviews((currentPreviews) => {
      const removedPreview = currentPreviews[index];
      if (removedPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(removedPreview);
      }
      return currentPreviews.filter((_, itemIndex) => itemIndex !== index);
    });
  }

  const previews = [
    ...existingImages.map((src) => ({ src, kind: "existing" as const })),
    ...selectedPreviews.map((src) => ({ src, kind: "selected" as const }))
  ];
  const hasPreview = previews.length > 0;

  return (
    <FieldShell label={label} description={description} className={shellClassName}>
      {currentValueName ? <input type="hidden" name={currentValueName} value={existingImages[0] ?? ""} /> : null}
      {currentImagesValueName ? <input type="hidden" name={currentImagesValueName} value={JSON.stringify(existingImages)} /> : null}
      <Label
        htmlFor={inputId}
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "group relative flex min-h-56 cursor-pointer overflow-hidden rounded-lg border border-dashed border-border bg-muted/40 transition",
          "hover:border-teal-700 hover:bg-teal-50/40",
          isDragging && "border-teal-700 bg-teal-50 ring-2 ring-teal-700/15",
          disabled && "pointer-events-none cursor-not-allowed opacity-60"
        )}
      >
        {previews[0] ? (
          <>
            {/* Blob previews from the local file picker cannot be optimized by next/image. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previews[0].src} alt="" className="absolute inset-0 size-full object-cover" />
          </>
        ) : null}
        <span className={cn("absolute inset-0 bg-gradient-to-t from-background/95 via-background/60 to-background/20", hasPreview ? "opacity-100" : "opacity-0")} />
        <span className="relative z-10 m-auto grid max-w-sm justify-items-center gap-3 p-6 text-center">
          <span className="flex size-12 items-center justify-center rounded-full border border-border bg-background shadow-sm">
            {hasPreview ? <ImageIcon className="size-5 text-teal-700" aria-hidden="true" /> : <UploadCloud className="size-5 text-teal-700" aria-hidden="true" />}
          </span>
          <span className="text-sm font-semibold text-foreground">{fileName || (hasPreview ? (multiple ? "Add or replace images" : "Replace image") : multiple ? "Upload images" : "Upload image")}</span>
          <span className="text-xs leading-5 text-muted-foreground">Drag and drop, or click to browse</span>
        </span>
        <input
          ref={inputRef}
          id={inputId}
          name={name}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          required={required}
          disabled={disabled}
          multiple={multiple}
          data-upload-area={uploadArea}
          data-upload-folder={uploadFolder}
          data-upload-label={uploadLabel}
          className="sr-only"
          onChange={(event) => {
            const files = event.target.files;
            if (!files?.length) {
              return;
            }

            setSelectedFiles(multiple ? files : [files[0]]);
          }}
        />
      </Label>
      {hasPreview ? (
        <div className="grid gap-3 rounded-lg border border-border bg-background p-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {previews.length} image{previews.length === 1 ? "" : "s"}
            </p>
            {selectedPreviews.length ? (
              <button
                type="button"
                className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground transition hover:text-foreground"
                onClick={() => {
                  clearSelectedFiles();
                  setExistingImages(getInitialPreviews(currentImage, currentImages));
                }}
              >
                <X className="size-3.5" aria-hidden="true" />
                Clear selected
              </button>
            ) : null}
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {previews.map((preview, index) => (
              <figure key={`${preview.src}-${index}`} className="group relative overflow-hidden rounded-md border border-border bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview.src} alt="" className="aspect-[4/3] w-full object-cover" />
                <button
                  type="button"
                  onClick={() => (preview.kind === "existing" ? removeExistingImage(index) : removeSelectedImage(index - existingImages.length))}
                  className="absolute right-2 top-2 inline-flex size-8 items-center justify-center rounded-md border border-white/30 bg-black/65 text-white shadow-sm backdrop-blur transition hover:bg-red-600"
                  aria-label="Remove image"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              </figure>
            ))}
          </div>
        </div>
      ) : null}
    </FieldShell>
  );
}

function getInitialPreviews(currentImage?: string, currentImages?: string[]) {
  const images = currentImages?.filter(Boolean) ?? [];

  if (images.length) {
    return images;
  }

  return currentImage ? [currentImage] : [];
}
