"use client";

import { VelvetInquiryForm } from "@/components/customer/velvet-inquiry-form";
import type { CustomerSiteThemeVariant } from "@/lib/customer-theme";
import type { NewThemeKey } from "@/lib/new-themes";
import { cn } from "@/lib/utils";

export function ThemeInquiryForm({
  slug,
  variant,
  className,
  compact = false,
}: {
  slug: string;
  variant: CustomerSiteThemeVariant | NewThemeKey;
  className?: string;
  compact?: boolean;
}) {
  const dark = [
    "cinematic",
    "luxury",
    "monochrome",
    "proscenium",
  ].includes(variant);
  const fieldClassName = cn(
    variant === "minimal" &&
      "rounded-md border-[#b8b1a6] bg-white/65 font-sans focus-visible:ring-[#1d7a70]",
    variant === "editorial" &&
      "border-0 border-b border-[#a86a4c] px-0 font-serif text-lg focus-visible:ring-0",
    variant === "masonry" &&
      "border-2 border-black bg-white font-mono font-semibold uppercase tracking-[0.12em] focus-visible:ring-0",
    variant === "cinematic" &&
      "border-white/15 bg-white/[0.04] font-sans text-white focus-visible:ring-teal-300",
    variant === "luxury" &&
      "border-[#c9a875]/45 bg-transparent font-serif text-[#fbf4e8] focus-visible:ring-[#c9a875]",
    variant === "monochrome" &&
      "border-white/40 bg-black font-mono text-white focus-visible:ring-white",
    variant === "panorama" &&
      "rounded-xl border-[#8ca39a] bg-white/70 text-[#17201c] focus-visible:ring-[#1d7a70]",
    variant === "relay" &&
      "border-[#17211d]/35 bg-[#fffdf5] font-mono focus-visible:ring-[#e75a3d]",
    variant === "fieldbook" &&
      "border border-[#26322b]/45 bg-[#f5efdf]/35 px-4 font-serif outline-none focus-visible:border-[#26322b] focus-visible:ring-0 focus-visible:ring-offset-0",
    variant === "kaleido" &&
      "rounded-full border-2 border-[#232136] bg-white px-5 focus-visible:ring-[#ff6b5e]",
    variant === "proscenium" &&
      "border-[#f1e9dc]/25 bg-[#1a151d] font-serif text-[#f1e9dc] focus-visible:ring-[#d44b3e]",
    variant === "cartograph" &&
      "border-[#6f9484]/70 bg-[#e8eee8] font-mono text-[#10271f] placeholder:text-[#10271f]/55 focus-visible:ring-[#dd6f45]",
    variant === "vitrine" &&
      "border-[#9b8d76] bg-[#f3efe6] font-serif text-[#26221e] focus-visible:ring-[#8e4037]",
  );
  const buttonClassName = cn(
    variant === "minimal" &&
      "rounded-md bg-[#1d7a70] font-sans tracking-[0.12em] hover:bg-[#155f57]",
    variant === "editorial" &&
      "bg-[#9a4f32] font-serif text-sm normal-case tracking-normal hover:bg-[#743a25]",
    variant === "masonry" &&
      "border-2 border-black bg-black font-mono tracking-[0.18em] hover:bg-[#177d74]",
    variant === "cinematic" &&
      "border border-teal-300 bg-transparent text-teal-200 hover:bg-teal-300 hover:text-black",
    variant === "luxury" &&
      "border border-[#c9a875] bg-[#c9a875] text-[#11100d] hover:bg-transparent hover:text-[#c9a875]",
    variant === "monochrome" &&
      "border border-white bg-white text-black hover:bg-black hover:text-white",
    variant === "panorama" &&
      "rounded-full bg-[#1d7a70] text-white hover:bg-[#155f57]",
    variant === "relay" && "bg-[#e75a3d] text-white hover:bg-[#17211d]",
    variant === "fieldbook" &&
      "border border-[#26322b] bg-transparent text-[#26322b] hover:bg-[#26322b] hover:text-[#ede6d5]",
    variant === "kaleido" &&
      "rounded-full bg-[#232136] text-white hover:bg-[#ff6b5e]",
    variant === "proscenium" &&
      "border border-[#d44b3e] bg-[#d44b3e] text-white hover:bg-transparent",
    variant === "cartograph" && "bg-[#dd6f45] text-white hover:bg-[#10271f]",
    variant === "vitrine" &&
      "border border-[#26221e] bg-[#26221e] text-[#f3efe6] hover:bg-[#8e4037]",
  );

  return (
    <VelvetInquiryForm
      slug={slug}
      tone={dark ? "dark" : "light"}
      className={className}
      fieldClassName={fieldClassName}
      buttonClassName={buttonClassName}
      compact={compact}
    />
  );
}
