"use client";

import { createTenantVisitorInquiry } from "@/actions/tenant-inquiry-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type VelvetInquiryFormProps = {
  slug: string;
  tone?: "dark" | "light";
  className?: string;
  fieldClassName?: string;
  buttonClassName?: string;
  compact?: boolean;
};

export function VelvetInquiryForm({
  slug,
  tone = "dark",
  className,
  fieldClassName,
  buttonClassName,
  compact = false,
}: VelvetInquiryFormProps) {
  const fieldClass = cn(
    compact
      ? "h-10 rounded-none bg-transparent px-3"
      : "h-12 rounded-none bg-transparent px-4",
    tone === "dark"
      ? "border-white/20 text-white placeholder:text-white/40"
      : "border-black/25 text-black placeholder:text-black/45",
    fieldClassName,
  );

  return (
    <form
      action={createTenantVisitorInquiry}
      className={cn("grid", compact ? "gap-3" : "gap-4", className)}
    >
      <input type="hidden" name="tenantSlug" value={slug} />
      <div className={cn("grid sm:grid-cols-2", compact ? "gap-3" : "gap-4")}>
        <Input
          name="name"
          required
          minLength={2}
          placeholder="Your name"
          className={fieldClass}
        />
        <Input
          name="email"
          required
          type="email"
          placeholder="Email address"
          className={fieldClass}
        />
      </div>
      <Input
        name="subject"
        placeholder="Shoot type or subject"
        className={fieldClass}
      />
      <Textarea
        name="message"
        required
        minLength={5}
        placeholder="Tell us what you need"
        className={cn(
          compact ? "min-h-24" : "min-h-36",
          "rounded-none bg-transparent",
          fieldClass,
          compact ? "py-3" : "py-4",
        )}
      />
      <Button
        type="submit"
        className={cn(
          compact ? "h-10" : "h-12",
          "rounded-none bg-[#a51f24] px-6 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-white hover:bg-black",
          buttonClassName,
        )}
      >
        Send inquiry
      </Button>
    </form>
  );
}
