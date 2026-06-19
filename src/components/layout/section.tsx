import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/layout/container";

type SectionProps = ComponentPropsWithoutRef<"section"> & {
  eyebrow?: string;
  title?: string;
  body?: ReactNode;
  containerClassName?: string;
};

export function Section({ eyebrow, title, body, children, className, containerClassName, ...props }: SectionProps) {
  return (
    <section className={cn("py-14 sm:py-20", className)} {...props}>
      <Container className={containerClassName}>
        {eyebrow || title || body ? (
          <header className="mb-10 max-w-3xl">
            {eyebrow ? <p className="font-nav text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">{eyebrow}</p> : null}
            {title ? <h2 className="mt-3 font-display text-5xl font-light leading-none tracking-[-0.055em] text-[#101418]">{title}</h2> : null}
            {body ? <div className="mt-4 text-sm leading-7 text-[#59636b]">{body}</div> : null}
          </header>
        ) : null}
        {children}
      </Container>
    </section>
  );
}
