import { Mail } from "lucide-react";
import { AdminPageHeader, AdminPanel } from "@/components/admin/admin-ui";
import { saveEmailSetting } from "@/app/admin/actions";
import { getAdminEmailSettings } from "@/services/admin/admin-data";

export default async function AdminEmailsPage() {
  const settings = await getAdminEmailSettings();

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AdminPageHeader eyebrow="Emails & Notifications" title="Manage email triggers." body="Enable or disable subscription, account, and manual email categories. Delivery providers can plug into these settings later." />
        <AdminPanel title="Email Switches" icon={Mail}>
          <div className="grid gap-4 md:grid-cols-2">
            {settings.map((setting) => (
              <form
                key={setting.key}
                action={async (formData) => {
                  "use server";
                  await saveEmailSetting({
                    key: setting.key,
                    label: String(formData.get("label")),
                    description: String(formData.get("description") ?? ""),
                    category: String(formData.get("category")),
                    enabled: formData.get("enabled") === "on"
                  });
                }}
                className="grid gap-3 border border-slate-200 p-4"
              >
                <input name="label" defaultValue={setting.label} className="h-10 border border-slate-200 px-3 font-semibold outline-none focus:border-teal-700" />
                <input name="category" defaultValue={setting.category} className="h-10 border border-slate-200 px-3 outline-none focus:border-teal-700" />
                <textarea name="description" defaultValue={setting.description ?? ""} className="min-h-20 resize-y border border-slate-200 px-3 py-2 outline-none focus:border-teal-700" />
                <label className="flex items-center gap-2 text-sm font-medium">
                  <input name="enabled" type="checkbox" defaultChecked={setting.enabled} />
                  Email enabled
                </label>
                <button type="submit" className="h-10 bg-slate-950 px-4 font-nav text-xs font-semibold uppercase tracking-[0.18em] text-white">Save setting</button>
              </form>
            ))}
          </div>
        </AdminPanel>
      </div>
    </main>
  );
}
