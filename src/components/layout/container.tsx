import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

type ContainerProps = ComponentPropsWithoutRef<"div"> & {
  bleed?: boolean;
};

export function Container({ bleed = false, className, ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8",
        bleed && "max-w-none",
        className
      )}
      {...props}
    />
  );
}
