import type { Route } from "next";
import { Edit3, Eye, UsersRound } from "lucide-react";
import { AdminTable, AdminTableEmptyRow } from "@/components/admin/admin-crud-ui";
import { AdminAddButton, AdminIconLink, AdminPageHeader, AdminPanel } from "@/components/admin/admin-ui";
import { getAdminCustomers } from "@/services/admin/admin-data";
import { formatSubscriptionDate, getSubscriptionLifecycle, getSubscriptionTextClass } from "@/services/subscription/lifecycle";

export default async function AdminCustomersPage() {
  const customers = await getAdminCustomers();

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="w-full">
        <AdminPageHeader eyebrow="Customers" title="Customer directory." body="View customer sites in one clean table. Open a customer to manage details, package access, status, domain, and notifications." />

        <AdminPanel
          title="Customers"
          icon={UsersRound}
          actions={
            <AdminAddButton href={"/admin/customers/new" as Route}>Add customer</AdminAddButton>
          }
        >
          <AdminTable minWidth="1080px">
              <thead className="bg-slate-50 text-xs uppercase tracking-[0.16em] text-slate-500">
                <tr>
                  <th className="p-4 font-semibold">Customer</th>
                  <th className="p-4 font-semibold">Owner</th>
                  <th className="p-4 font-semibold">Package</th>
                  <th className="p-4 font-semibold">Access</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Content</th>
                  <th className="p-4 font-semibold">Created</th>
                  <th className="p-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {customers.length ? (
                  customers.map((customer) => {
                    const packageState = getSubscriptionLifecycle(customer.subscription);

                    return (
                      <tr key={customer.id} className="align-middle transition hover:bg-slate-50/70">
                        <td className="p-4">
                          <p className="font-semibold text-slate-950">{customer.name}</p>
                          <p className="mt-1 font-mono text-xs text-slate-500">/{customer.slug}</p>
                        </td>
                        <td className="p-4 text-slate-600">
                          <p className="font-medium text-slate-800">{customer.owner?.name ?? "No owner"}</p>
                          <p className="mt-1 text-xs text-slate-500">{customer.owner?.email ?? "-"}</p>
                        </td>
                        <td className="p-4">
                          <p className="font-semibold text-slate-950">{customer.subscription?.plan.name ?? "No package"}</p>
                          <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-500">{customer.subscription?.status ?? "No subscription"}</p>
                        </td>
                        <td className="p-4 text-slate-600">
                          <p>{customer.subscription?.currentPeriodEnds ? formatSubscriptionDate(customer.subscription.currentPeriodEnds) : "Not set"}</p>
                          <p className={`mt-1 text-xs font-semibold ${getSubscriptionTextClass(packageState.tone)}`}>{packageState.label}</p>
                        </td>
                        <td className="p-4">
                          <span className={getStatusBadgeClass(customer.status)}>{customer.status}</span>
                        </td>
                        <td className="p-4 text-slate-600">
                          <p>{customer._count.albums} galleries</p>
                          <p className="mt-1 text-xs text-slate-500">
                            {customer._count.photos} photos · {customer._count.blogs} blogs · {customer._count.notifications} notes
                          </p>
                        </td>
                        <td className="p-4 text-slate-600">{formatSubscriptionDate(customer.createdAt)}</td>
                        <td className="p-4">
                          <div className="flex justify-end gap-2">
                            <AdminIconLink href={`/admin/customers/${customer.id}` as Route} icon={Eye} label={`View ${customer.name}`} tooltip="View customer" />
                            <AdminIconLink href={`/admin/customers/${customer.id}` as Route} icon={Edit3} label={`Edit ${customer.name}`} tooltip="Edit customer" />
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <AdminTableEmptyRow colSpan={8}>No customers yet. Add the first customer to create a tenant site.</AdminTableEmptyRow>
                )}
              </tbody>
          </AdminTable>
        </AdminPanel>
      </div>
    </main>
  );
}

function getStatusBadgeClass(status: string) {
  switch (status) {
    case "ACTIVE":
      return "inline-flex rounded-full bg-primary/5 px-3 py-1 text-xs font-semibold text-primary";
    case "SUSPENDED":
      return "inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800";
    case "DELETED":
      return "inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700";
    default:
      return "inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600";
  }
}
