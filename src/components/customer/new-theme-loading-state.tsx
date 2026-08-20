"use client";

import { usePathname } from "next/navigation";
import { isNewThemeKey, type NewThemeKey } from "@/lib/new-themes";

function themeFromPath(pathname: string): NewThemeKey | null {
  return (
    (pathname
      .split("/")
      .find(
        (part) =>
          isNewThemeKey(part) || isNewThemeKey(part.replace(/-demo$/, "")),
      )
      ?.replace(/-demo$/, "") as NewThemeKey | undefined) ?? null
  );
}

export function NewThemeLoadingState() {
  const theme = themeFromPath(usePathname());
  if (theme === "relay")
    return (
      <main className="grid min-h-screen animate-pulse grid-cols-[0.38fr_0.62fr] bg-[#f2f0e8]">
        <div className="border-r border-[#17211d] p-8">
          <div className="h-3 w-24 bg-[#e75a3d]" />
          <div className="mt-[40vh] h-24 w-4/5 bg-[#17211d]/15" />
        </div>
        <div className="m-8 bg-[#17211d]/15" />
      </main>
    );
  if (theme === "fieldbook")
    return (
      <main className="grid min-h-screen animate-pulse bg-[#ede6d5] lg:grid-cols-[5rem_1fr_1fr]">
        <div className="border-r-2 border-[#26322b]" />
        <div className="m-8 border-y-2 border-[#26322b]" />
        <div className="m-8 border-2 border-[#26322b] bg-[#26322b]/10" />
      </main>
    );
  if (theme === "kaleido")
    return (
      <main className="grid min-h-screen animate-pulse grid-cols-2 bg-[#ffcf56]">
        <div className="m-12 rounded-full bg-[#ff6b5e]" />
        <div className="m-12 rounded-[50%_50%_18%_18%] border-4 border-[#232136] bg-[#52b8a5]" />
      </main>
    );
  if (theme === "proscenium")
    return (
      <main className="flex min-h-screen animate-pulse items-end bg-[#120f15] p-10">
        <div className="h-40 w-3/5 bg-[#d44b3e]/25" />
      </main>
    );
  if (theme === "cartograph")
    return (
      <main className="grid min-h-screen animate-pulse place-items-center bg-[#dfe7df]">
        <div className="aspect-[4/3] w-3/5 rounded-[50%_20%_45%_25%] border-2 border-[#10271f] bg-[#6f9484]/25" />
      </main>
    );
  if (theme === "vitrine")
    return (
      <main className="grid min-h-screen animate-pulse place-items-center bg-[#e7e2d8]">
        <div className="aspect-[3/4] h-[65vh] border-[1rem] border-[#f3efe6] bg-[#26221e]/20 shadow-xl" />
      </main>
    );
  return <main className="min-h-screen animate-pulse bg-slate-100" />;
}
