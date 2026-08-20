import Image from "next/image";
import Link from "next/link";
import { Compass } from "lucide-react";
import { CustomerContactControl } from "@/components/customer/customer-contact-control";
import { NewThemeAutoHeader } from "@/components/customer/new-theme-auto-header";
import type { CustomerPublicPageProps } from "@/components/customer/customer-public-page";
import { customerPath } from "@/config/routes";
import { localizePath } from "@/i18n/locales";
import type { NewThemeKey } from "@/lib/new-themes";

type ShellProps = CustomerPublicPageProps;
const routes = [
  ["Galleries", "/gallery"],
  ["Categories", "/categories"],
  ["Blog", "/blog"],
  ["About", "/about"],
] as const;
const pathFor = (p: ShellProps, path = "") =>
  localizePath(p.locale, customerPath(p.slug, path));
const imageFor = (p: ShellProps) =>
  p.site.pageHeaders?.[p.pageKey ?? "gallery"]?.image || p.site.heroImage;

function MobileRoutes({
  p,
  theme,
  shellClass,
  linkClass,
}: {
  p: ShellProps;
  theme: NewThemeKey;
  shellClass: string;
  linkClass: string;
}) {
  return (
    <details className="relative ml-auto md:hidden">
      <summary className="cursor-pointer list-none text-xs uppercase tracking-[0.18em]">
        Menu
      </summary>
      <nav className={shellClass}>
        {routes.map(([label, path]) => (
          <Link className={linkClass} key={path} href={pathFor(p, path)}>
            {label}
          </Link>
        ))}
        <CustomerContactControl
          slug={p.slug}
          variant={theme}
          triggerClassName={linkClass}
        />
      </nav>
    </details>
  );
}

export function RelayPublicShell(p: ShellProps) {
  const image = imageFor(p);
  return (
    <main className="min-h-screen bg-[#f2f0e8] text-[#17211d]">
      <NewThemeAutoHeader className="flex min-h-14 items-center border-b border-[#17211d] bg-[#f2f0e8] px-5 font-mono text-xs uppercase">
        <Link href={pathFor(p)} className="font-black">
          {p.site.studioName}
        </Link>
        <nav className="ml-auto hidden flex-wrap justify-end gap-4 md:flex">
          {routes.map(([l, r]) => (
            <Link key={r} href={pathFor(p, r)}>
              {l}
            </Link>
          ))}
          <CustomerContactControl slug={p.slug} variant="relay" />
        </nav>
        <MobileRoutes
          p={p}
          theme="relay"
          shellClass="absolute right-0 top-8 z-50 grid w-52 border border-[#17211d] bg-[#f2f0e8] p-3"
          linkClass="border-b border-[#17211d]/25 py-3 text-left font-mono text-xs uppercase"
        />
      </NewThemeAutoHeader>
      <section className="grid border-b border-[#17211d] lg:grid-cols-[0.38fr_0.62fr]">
        <div className="flex min-h-80 flex-col justify-between p-7">
          <span className="font-mono text-xs">DISPATCH / {p.eyebrow}</span>
          <div>
            <h1 className="text-[clamp(4rem,9vw,8rem)] leading-[0.72] tracking-[-0.09em]">
              {p.title}
            </h1>
            <p className="mt-5 max-w-lg">{p.description}</p>
          </div>
        </div>
        <div className="relative min-h-80 border-l border-[#17211d]">
          {image ? (
            <Image
              src={image}
              alt={p.heroImageAlt ?? p.title}
              fill
              sizes="65vw"
              className="object-cover"
            />
          ) : null}
        </div>
      </section>
      <div className="[&_article]:rounded-none [&_article]:border-[#17211d] [&_button]:rounded-none">
        {p.children}
      </div>
      <footer className="flex justify-between bg-[#e75a3d] p-6 font-mono text-xs uppercase text-white">
        <span>{p.site.studioName}</span>
        <span>End / {new Date().getFullYear()}</span>
      </footer>
    </main>
  );
}

export function FieldbookPublicShell(p: ShellProps) {
  const image = imageFor(p);
  return (
    <main className="min-h-screen bg-[#ede6d5] font-serif text-[#26322b]">
      <NewThemeAutoHeader className="flex items-center border-b-2 border-[#26322b] bg-[#ede6d5] px-5 py-3">
        <Link href={pathFor(p)} className="text-2xl italic">
          {p.site.studioName}
        </Link>
        <nav className="ml-auto hidden gap-4 font-mono text-xs uppercase md:flex">
          {routes.map(([l, r]) => (
            <Link key={r} href={pathFor(p, r)}>
              {l}
            </Link>
          ))}
          <CustomerContactControl slug={p.slug} variant="fieldbook" />
        </nav>
        <MobileRoutes
          p={p}
          theme="fieldbook"
          shellClass="absolute right-0 top-8 z-50 grid w-52 border-2 border-[#26322b] bg-[#ede6d5] p-3"
          linkClass="border-b border-[#26322b]/30 py-3 text-left font-mono text-xs uppercase"
        />
      </NewThemeAutoHeader>
      <section className="grid min-h-[55vh] border-b-2 border-[#26322b] lg:grid-cols-[5rem_1fr_1fr]">
        <div className="hidden border-r-2 border-[#26322b] p-3 font-mono text-[10px] uppercase [writing-mode:vertical-rl] lg:block">
          FIELD ENTRY / {p.eyebrow}
        </div>
        <div className="flex flex-col justify-between p-7 lg:border-r-2 lg:border-[#26322b]">
          <span className="font-mono text-xs uppercase">Filed page</span>
          <h1 className="font-serif text-[clamp(4rem,9vw,8rem)] italic leading-[0.78]">
            {p.title}
          </h1>
          <p className="border-t border-[#26322b] pt-4">{p.description}</p>
        </div>
        <div className="relative m-5 min-h-72 border-2 border-[#26322b] p-2">
          {image ? (
            <Image
              src={image}
              alt={p.title}
              fill
              sizes="50vw"
              className="object-cover p-2"
            />
          ) : null}
        </div>
      </section>
      <div className="px-4 [&_article]:rounded-none [&_article]:border-[#26322b] [&_h2]:font-serif [&_h2]:italic">
        {p.children}
      </div>
      <footer className="grid bg-[#26322b] p-7 font-mono text-xs uppercase text-[#ede6d5] md:grid-cols-3">
        <span>{p.site.studioName}</span>
        <span>{p.site.location}</span>
        <span className="md:text-right">Filed {new Date().getFullYear()}</span>
      </footer>
    </main>
  );
}

export function KaleidoPublicShell(p: ShellProps) {
  const image = imageFor(p);
  return (
    <main className="min-h-screen bg-[#f6f2e7] text-[#232136]">
      <NewThemeAutoHeader className="m-4 flex items-center rounded-full border-2 border-[#232136] bg-[#f6f2e7] px-5 py-3">
        <Link href={pathFor(p)} className="text-xl font-black">
          {p.site.studioName}
        </Link>
        <nav className="ml-auto hidden flex-wrap gap-4 font-bold md:flex">
          {routes.map(([l, r]) => (
            <Link key={r} href={pathFor(p, r)}>
              {l}
            </Link>
          ))}
          <CustomerContactControl slug={p.slug} variant="kaleido" />
        </nav>
        <MobileRoutes
          p={p}
          theme="kaleido"
          shellClass="absolute right-0 top-9 z-50 grid w-56 rounded-3xl border-2 border-[#232136] bg-[#ff6b5e] p-4"
          linkClass="py-2 text-left text-xl font-black"
        />
      </NewThemeAutoHeader>
      <section className="grid min-h-[60vh] grid-cols-2 bg-[#ffcf56] lg:grid-cols-[0.3fr_0.5fr_0.2fr]">
        <div className="grid place-items-center p-5">
          <h1 className="rotate-[-4deg] text-[clamp(4rem,8vw,8rem)] font-black leading-[0.75] tracking-[-0.08em]">
            {p.title}
          </h1>
        </div>
        <div className="relative m-5 min-h-80 overflow-hidden rounded-[50%_50%_18%_18%] border-4 border-[#232136]">
          {image ? (
            <Image
              src={image}
              alt={p.title}
              fill
              sizes="50vw"
              className="object-cover"
            />
          ) : null}
        </div>
        <div className="grid place-items-center bg-[#52b8a5] p-4 text-center font-bold">
          {p.description}
        </div>
      </section>
      <div className="[&_article]:rounded-[2rem] [&_button]:rounded-full">
        {p.children}
      </div>
      <footer className="grid grid-cols-2 bg-[#232136] text-[#f6f2e7] sm:grid-cols-4">
        {[
          p.site.studioName,
          "Rooms",
          "Journal",
          String(new Date().getFullYear()),
        ].map((x) => (
          <span
            key={x}
            className="grid min-h-24 place-items-center border border-white/20 font-bold"
          >
            {x}
          </span>
        ))}
      </footer>
    </main>
  );
}

export function ProsceniumPublicShell(p: ShellProps) {
  const image = imageFor(p);
  return (
    <main className="min-h-screen bg-[#120f15] font-serif text-[#f1e9dc]">
      <NewThemeAutoHeader className="flex h-16 items-center border-b border-white/20 bg-[#120f15] px-5">
        <Link href={pathFor(p)} className="text-2xl italic">
          {p.site.studioName}
        </Link>
        <nav className="ml-auto hidden gap-5 font-sans text-xs uppercase tracking-[0.16em] md:flex">
          {routes.map(([l, r]) => (
            <Link key={r} href={pathFor(p, r)}>
              {l}
            </Link>
          ))}
          <CustomerContactControl slug={p.slug} variant="proscenium" />
        </nav>
        <MobileRoutes
          p={p}
          theme="proscenium"
          shellClass="absolute right-0 top-9 z-50 grid w-60 border border-[#d44b3e] bg-[#120f15] p-4"
          linkClass="border-b border-white/15 py-3 text-left font-sans text-xs uppercase tracking-[0.16em]"
        />
      </NewThemeAutoHeader>
      <section className="relative flex min-h-[65vh] items-end overflow-hidden p-7">
        {image ? (
          <Image
            src={image}
            alt={p.title}
            fill
            sizes="100vw"
            className="object-cover opacity-45"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-r from-[#120f15] via-transparent to-transparent" />
        <div className="relative">
          <span className="font-sans text-xs uppercase tracking-[0.35em] text-[#d44b3e]">
            Program / {p.eyebrow}
          </span>
          <h1 className="mt-5 text-[clamp(5rem,12vw,12rem)] italic leading-[0.65]">
            {p.title}
          </h1>
          <p className="mt-7 max-w-xl text-lg">{p.description}</p>
        </div>
      </section>
      <div className="[&_article]:rounded-none [&_article]:border-white/20 [&_h2]:font-serif [&_h2]:italic">
        {p.children}
      </div>
      <footer className="flex min-h-40 items-end justify-between bg-[#d44b3e] p-7">
        <span className="text-5xl italic">Curtain.</span>
        <span>{new Date().getFullYear()}</span>
      </footer>
    </main>
  );
}

export function CartographPublicShell(p: ShellProps) {
  const image = imageFor(p);
  return (
    <main className="min-h-screen bg-[#dfe7df] text-[#10271f]">
      <NewThemeAutoHeader className="m-5 flex items-center rounded-full border border-[#10271f] bg-[#dfe7df] px-5 py-3 font-mono text-xs uppercase">
        <Compass className="mr-3 size-4" />
        <Link href={pathFor(p)} className="font-bold">
          {p.site.studioName}
        </Link>
        <nav className="ml-auto hidden gap-5 md:flex">
          {routes.map(([l, r]) => (
            <Link key={r} href={pathFor(p, r)}>
              {l}
            </Link>
          ))}
          <CustomerContactControl slug={p.slug} variant="cartograph" />
        </nav>
        <MobileRoutes
          p={p}
          theme="cartograph"
          shellClass="absolute right-0 top-9 z-50 grid w-56 border border-[#10271f] bg-[#dfe7df] p-4"
          linkClass="border-b border-[#10271f]/25 py-3 text-left font-mono text-xs uppercase"
        />
      </NewThemeAutoHeader>
      <section className="relative grid min-h-[60vh] overflow-hidden border-y border-[#10271f] lg:grid-cols-[0.4fr_0.6fr]">
        <div className="absolute inset-0 opacity-15 [background-image:linear-gradient(#10271f_1px,transparent_1px),linear-gradient(90deg,#10271f_1px,transparent_1px)] [background-size:70px_70px]" />
        <div className="relative flex flex-col justify-center p-7">
          <span className="font-mono text-xs">N 33.68 / PAGE {p.eyebrow}</span>
          <h1 className="mt-5 text-[clamp(4rem,9vw,9rem)] leading-[0.75] tracking-[-0.08em]">
            {p.title}
          </h1>
          <p className="mt-6">{p.description}</p>
        </div>
        <div className="relative m-7 min-h-80 overflow-hidden rounded-[45%_18%_40%_22%] border-2 border-[#10271f]">
          {image ? (
            <Image
              src={image}
              alt={p.title}
              fill
              sizes="60vw"
              className="object-cover"
            />
          ) : null}
        </div>
      </section>
      <div className="relative border-l border-[#dd6f45] [&_article]:rounded-none [&_button]:rounded-none">
        {p.children}
      </div>
      <footer className="grid bg-[#10271f] p-7 font-mono text-xs uppercase text-[#dfe7df] md:grid-cols-3">
        <span>{p.site.studioName}</span>
        <span>Route complete</span>
        <span className="md:text-right">{new Date().getFullYear()}</span>
      </footer>
    </main>
  );
}

export function VitrinePublicShell(p: ShellProps) {
  const image = imageFor(p);
  return (
    <main className="min-h-screen bg-[#e7e2d8] font-serif text-[#26221e]">
      <NewThemeAutoHeader className="grid grid-cols-[1fr_auto_1fr] items-center border-b border-[#9b8d76] bg-[#e7e2d8] px-5 py-4">
        <span className="text-xs uppercase tracking-[0.2em]">Room index</span>
        <Link href={pathFor(p)} className="text-2xl">
          {p.site.studioName}
        </Link>
        <nav className="ml-auto hidden gap-4 text-sm md:flex">
          {routes.map(([l, r]) => (
            <Link key={r} href={pathFor(p, r)}>
              {l}
            </Link>
          ))}
          <CustomerContactControl slug={p.slug} variant="vitrine" />
        </nav>
        <MobileRoutes
          p={p}
          theme="vitrine"
          shellClass="absolute right-0 top-9 z-50 grid w-56 border border-[#9b8d76] bg-[#e7e2d8] p-4"
          linkClass="border-b border-[#9b8d76]/50 py-3 text-left font-serif"
        />
      </NewThemeAutoHeader>
      <section className="grid min-h-[65vh] items-center gap-8 p-7 lg:grid-cols-[0.28fr_0.44fr_0.28fr]">
        <div>
          <p className="text-xs uppercase tracking-[0.28em]">
            Exhibition / {p.eyebrow}
          </p>
          <h1 className="mt-5 text-6xl leading-[0.85]">{p.title}</h1>
        </div>
        <div className="relative aspect-[3/4] border-[1rem] border-[#f3efe6] bg-[#26221e] p-1 shadow-xl">
          {image ? (
            <Image
              src={image}
              alt={p.title}
              fill
              sizes="45vw"
              className="object-cover p-1"
            />
          ) : null}
        </div>
        <p className="border-t border-[#9b8d76] pt-4 text-lg">
          {p.description}
        </p>
      </section>
      <div className="border-t border-[#9b8d76] [&_article]:rounded-none [&_article]:border-[#9b8d76] [&_h2]:font-serif">
        {p.children}
      </div>
      <footer className="grid bg-[#26221e] p-8 text-[#e7e2d8] md:grid-cols-2">
        <span className="text-5xl">{p.site.studioName}</span>
        <span className="border-l border-white/25 pl-5">
          Exhibition catalogue · {new Date().getFullYear()}
        </span>
      </footer>
    </main>
  );
}

export function NewThemePublicShell({
  theme,
  ...props
}: ShellProps & { theme: NewThemeKey }) {
  if (theme === "relay") return <RelayPublicShell {...props} />;
  if (theme === "fieldbook") return <FieldbookPublicShell {...props} />;
  if (theme === "kaleido") return <KaleidoPublicShell {...props} />;
  if (theme === "proscenium") return <ProsceniumPublicShell {...props} />;
  if (theme === "cartograph") return <CartographPublicShell {...props} />;
  return <VitrinePublicShell {...props} />;
}
