import Image from "next/image";
import Link from "next/link";
import { Aperture } from "lucide-react";
import { AuthPanel } from "@/components/auth/auth-panel";
import { signInPath, signUpPath } from "@/config/routes";
import { localizePath } from "@/i18n/locales";
import { getRequestLocale } from "@/i18n/server";

type AuthShellProps = {
  mode: "sign-in" | "sign-up";
};

export async function AuthShell({ mode }: AuthShellProps) {
  const locale = await getRequestLocale();
  const alternateHref = localizePath(locale, mode === "sign-up" ? signInPath() : signUpPath());

  return (
    <main className="grain relative min-h-screen overflow-hidden bg-[#101418]">
      <Image
        src="https://images.unsplash.com/photo-1500051638674-ff996a0ec29e?auto=format&fit=crop&w=2200&q=85"
        alt="Photographer studio desk and camera equipment"
        fill
        priority
        className="object-cover opacity-54"
      />
      <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(17,16,13,0.96),rgba(17,16,13,0.72),rgba(17,16,13,0.38))]" />
      <div className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">
        <section className="max-w-3xl text-white">
          <Link href={localizePath(locale, "/")} className="inline-flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-full bg-white text-foreground">
              <Aperture className="size-5" aria-hidden="true" />
            </span>
            <span className="font-brand text-2xl font-black tracking-[-0.04em]">Photaaz</span>
          </Link>
          <h2 className="mt-12 font-display text-6xl font-black leading-none tracking-[-0.05em] sm:text-7xl">
            Publish-ready portfolios begin with a clean studio setup.
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/68">
            Account, tenant, theme, galleries, and domain setup are separated from day one so each photographer gets a fast,
            scalable workspace.
          </p>
          <Link href={alternateHref} className="mt-8 inline-flex text-sm font-semibold text-accent">
            {mode === "sign-up" ? "Already have an account? Sign in" : "New studio? Create an account"}
          </Link>
        </section>
        <AuthPanel mode={mode} />
      </div>
    </main>
  );
}
