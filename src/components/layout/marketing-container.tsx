import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/layout/container";

type MarketingContainerProps = ComponentPropsWithoutRef<"div">;

export function MarketingContainer({ className, ...props }: MarketingContainerProps) {
  return <Container className={cn(className)} {...props} />;
}
