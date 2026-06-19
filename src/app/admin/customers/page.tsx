import Link from "next/link";
import type { Route } from "next";
import { UserPlus, UsersRound } from "lucide-react";
import { AdminPageHeader, AdminPanel } from "@/components/admin/admin-ui";
import { registerCustomerFromAdmin, updateTenantPlan, updateTenantStatus } from "@/app/admin/actions";
import { getAdminCustomers, getAdminPlans } from "@/services/admin/admin-data";

export default async function AdminCustomersPage() {
  const [customers, plans] = await Promise.all([getAdminCustomers(), getAdminPlans()]);

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AdminPageHeader eyebrow="Customers" title="Manage customer sites." body="Inspect users, update tenant status, assign packages, extend access, and open each customer detail page." />

        <section className="mb-6 grid gap-6 xl:grid-cols-[0.64fr_0.36fr]">
          <AdminPanel title="Tenant List" icon={UsersRound}>
            <div className="overflow-x-auto border border-slate-200">
              <table className="w-full min-w-[980px] border-collapse text-left text-sm">
                <thead className="bg-slate-100 text-xs uppercase tracking-[0.16em] text-slate-500">
                  <tr>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Owner</th>
                    <th className="p-4">Plan</th>
                    <th className="p-4">Ends</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Stats</th>
                    <th className="p-4">Open</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.id} className="border-t border-slate-200 align-top">
                      <td className="p-4">
                        <p className="font-semibold text-slate-950">{customer.name}</p>
                        <p className="mt-1 text-slate-500">/{customer.slug}</p>
                      </td>
                      <td className="p-4 text-slate-600">
                        <p>{customer.owner?.name ?? "No owner"}</p>
                        <p className="mt-1 text-xs">{customer.owner?.email ?? "-"}</p>
                      </td>
                      <td className="p-4">
                        <form
                          action={async (formData) => {
                            "use server";
                            await updateTenantPlan({
                              tenantId: customer.id,
                              planId: String(formData.get("planId")),
                              status: String(formData.get("subscriptionStatus")) as "TRIALING" | "ACTIVE" | "PAST_DUE" | "CANCELED" | "EXPIRED",
                              currentPeriodEnds: String(formData.get("currentPeriodEnds") ?? ""),
                              adminNote: String(formData.get("adminNote") ?? "")
                            });
                          }}
                          className="grid gap-2"
                        >
                          <select name="planId" defaultValue={customer.subscription?.planId ?? plans[0]?.id} className="h-9 border border-slate-200 px-2 outline-none focus:border-teal-700">
                            {plans.map((plan) => (
                              <option key={plan.id} value={plan.id}>{plan.name}</option>
                            ))}
                          </select>
                          <select name="subscriptionStatus" defaultValue={customer.subscription?.status ?? "TRIALING"} className="h-9 border border-slate-200 px-2 outline-none focus:border-teal-700">
                            <option value="TRIALING">Trialing</option>
                            <option value="ACTIVE">Active</option>
                            <option value="PAST_DUE">Past due</option>
                            <option value="CANCELED">Canceled</option>
                            <option value="EXPIRED">Expired</option>
                          </select>
                          <input name="currentPeriodEnds" type="date" defaultValue={customer.subscription?.currentPeriodEnds?.toISOString().slice(0, 10) ?? ""} className="h-9 border border-slate-200 px-2 outline-none focus:border-teal-700" />
                          <input name="adminNote" placeholder="Admin note / compensation reason" defaultValue={customer.subscription?.adminNote ?? ""} className="h-9 border border-slate-200 px-2 outline-none focus:border-teal-700" />
                          <button className="h-9 bg-slate-950 px-3 font-nav text-xs font-semibold uppercase tracking-[0.16em] text-white" type="submit">Save plan</button>
                        </form>
                      </td>
                      <td className="p-4 text-slate-600">
                        {customer.subscription?.currentPeriodEnds?.toLocaleDateString() ?? "Not set"}
                      </td>
                      <td className="p-4">
                        <form
                          action={async (formData) => {
                            "use server";
                            await updateTenantStatus({
                              tenantId: customer.id,
                              status: String(formData.get("status")) as "ACTIVE" | "SUSPENDED" | "DELETED"
                            });
                          }}
                          className="flex gap-2"
                        >
                          <select name="status" defaultValue={customer.status} className="h-9 border border-slate-200 px-2 outline-none focus:border-teal-700">
                            <option value="ACTIVE">Active</option>
                            <option value="SUSPENDED">Suspended</option>
                            <option value="DELETED">Deleted</option>
                          </select>
                          <button className="h-9 border border-slate-950 px-3 font-nav text-xs font-semibold uppercase tracking-[0.16em]" type="submit">Update</button>
                        </form>
                      </td>
                      <td className="p-4 text-slate-600">
                        {customer._count.albums} galleries · {customer._count.photos} photos · {customer._count.notifications} notes
                      </td>
                      <td className="p-4">
                        <Link href={`/admin/customers/${customer.id}` as Route} className="font-semibold text-teal-700">Details</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AdminPanel>

          <AdminPanel title="Register Customer" icon={UserPlus}>
            <form
              action={async (formData) => {
                "use server";
                await registerCustomerFromAdmin({
                  studioName: String(formData.get("studioName")),
                  slug: String(formData.get("slug")),
                  email: String(formData.get("email")),
                  planId: String(formData.get("planId") ?? "")
                });
              }}
              className="grid gap-3"
            >
              <input name="studioName" required placeholder="Customer / photographer name" className="h-11 border border-slate-200 px-3 outline-none focus:border-teal-700" />
              <input name="slug" required placeholder="public-slug" className="h-11 border border-slate-200 px-3 outline-none focus:border-teal-700" />
              <input name="email" required type="email" placeholder="client@example.com" className="h-11 border border-slate-200 px-3 outline-none focus:border-teal-700" />
              <select name="planId" defaultValue={plans[0]?.id} className="h-11 border border-slate-200 px-3 outline-none focus:border-teal-700">
                {plans.map((plan) => (
                  <option key={plan.id} value={plan.id}>{plan.name}</option>
                ))}
              </select>
              <button type="submit" className="h-11 bg-slate-950 px-4 font-nav text-xs font-semibold uppercase tracking-[0.18em] text-white">Create customer</button>
            </form>
          </AdminPanel>
        </section>
      </div>
    </main>
  );
}
