import Link from "next/link";
import type { Route } from "next";
import { redirect } from "next/navigation";
import { ArrowLeft, UserPlus } from "lucide-react";
import { registerCustomerFromAdmin } from "@/app/admin/actions";
import { AdminPage, AdminPageHeader, AdminPanel } from "@/components/admin/admin-ui";
import { SelectField, TextField } from "@/components/forms/form-controls";
import { Button } from "@/components/ui/button";
import { getAdminPlans } from "@/services/admin/admin-data";

export default async function AdminNewCustomerPage() {
  const plans = await getAdminPlans();

  return (
    <AdminPage>
        <AdminPageHeader eyebrow="Customers" title="Add customer." body="Create a customer tenant, assign the starting package, and open their detail page after creation from the customer directory." />

        <AdminPanel
          title="Customer Details"
          icon={UserPlus}
          actions={
            <Button asChild variant="outline" className="border-slate-300 bg-white">
              <Link href={"/admin/customers" as Route}>
                <ArrowLeft className="size-4" aria-hidden="true" />
                Back
              </Link>
            </Button>
          }
        >
          <form
            action={async (formData) => {
              "use server";
              await registerCustomerFromAdmin({
                studioName: String(formData.get("studioName")),
                slug: String(formData.get("slug")),
                email: String(formData.get("email")),
                planId: String(formData.get("planId") ?? "")
              });
              redirect("/admin/customers");
            }}
            className="grid gap-5 lg:max-w-2xl"
          >
            <TextField name="studioName" required label="Customer name" placeholder="Bilal Photography" className="h-11" />
            <TextField name="slug" required label="Public slug" placeholder="bilal" className="h-11 font-mono" />
            <TextField name="email" required label="Owner email" type="email" placeholder="client@example.com" className="h-11" />
            <SelectField name="planId" label="Starting package" defaultValue={plans[0]?.id} triggerClassName="h-11" options={plans.map((plan) => ({ label: plan.name, value: plan.id }))} />
            <div className="flex flex-wrap gap-2 border-t border-slate-200 pt-5">
              <Button type="submit" className="bg-slate-950 text-white hover:bg-teal-800">
                <UserPlus className="size-4" aria-hidden="true" />
                Create customer
              </Button>
              <Button asChild type="button" variant="outline" className="border-slate-300 bg-white">
                <Link href={"/admin/customers" as Route}>Cancel</Link>
              </Button>
            </div>
          </form>
        </AdminPanel>
    </AdminPage>
  );
}
