import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

export const customerSiteContainerClass = "mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-10";

type CustomerSiteContainerProps = ComponentPropsWithoutRef<"div"> & {
  as?: "div" | "section";
};

export function CustomerSiteContainer({ as: Component = "div", className, ...props }: CustomerSiteContainerProps) {
  return <Component className={cn(customerSiteContainerClass, className)} {...props} />;
}
