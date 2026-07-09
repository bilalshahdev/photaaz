export type TenantStatus = "ACTIVE" | "SUSPENDED" | "DELETED";

export type TenantContext = {
  tenantId: string;
  slug: string;
  status: TenantStatus;
  locale: import("@/i18n/locales").AppLocale;
  domain?: string;
  planKey: string;
};
