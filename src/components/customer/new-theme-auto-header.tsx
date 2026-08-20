"use client";

import { useEffect, useRef, type ComponentProps } from "react";
import { useNavbarVisibility } from "@/components/layout/customer-site-nav";
import { cn } from "@/lib/utils";

export function NewThemeAutoHeader({ className, ...props }: ComponentProps<"header">) {
  const ref = useRef<HTMLElement>(null);
  const { isTopHidden, setNavbarHeight } = useNavbarVisibility();

  useEffect(() => {
    const header = ref.current;
    if (!header) return;

    const updateHeight = () => setNavbarHeight(header.offsetHeight);
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(header);
    return () => observer.disconnect();
  }, [setNavbarHeight]);

  return (
    <header
      ref={ref}
      className={cn(
        "sticky top-0 z-40 transition-transform duration-300 ease-out",
        isTopHidden && "-translate-y-full",
        className,
      )}
      {...props}
    />
  );
}
