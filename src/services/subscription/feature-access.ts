import { hasFeature, type FeatureKey } from "@/config/features";
import type { TenantContext } from "@/types/tenant";

export function assertFeatureAccess(tenant: TenantContext, feature: FeatureKey) {
  if (!hasFeature(tenant.planKey, feature)) {
    throw new Error(`Feature '${feature}' is not enabled for plan '${tenant.planKey}'.`);
  }
}
