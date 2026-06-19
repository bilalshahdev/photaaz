export type TenantStatus = "ACTIVE" | "SUSPENDED" | "DELETED";

export type TenantContext = {
  tenantId: string;
  slug: string;
  status: TenantStatus;
  locale: "en" | "ur";
  domain?: string;
  planKey: string;
};
