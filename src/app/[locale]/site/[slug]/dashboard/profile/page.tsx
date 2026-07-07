import Image from "next/image";
import { notFound } from "next/navigation";
import { AtSign, ImageIcon, Save, UserRound } from "lucide-react";
import { updateCustomerProfile } from "@/actions/customer-settings-actions";
import {
  CustomerDashboardHeader,
  CustomerDashboardPage,
  CustomerPanel
} from "@/components/customer/customer-dashboard-ui";
import { TextareaField, TextField } from "@/components/forms/form-controls";
import { Button } from "@/components/ui/button";
import { getCustomerProfileView } from "@/services/tenant/customer-dashboard-data";

type CustomerProfilePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CustomerProfilePage({ params }: CustomerProfilePageProps) {
  const { slug } = await params;
  const data = await getCustomerProfileView(slug);

  if (!data) {
    notFound();
  }

  const profile = data.profile;

  return (
    <CustomerDashboardPage>
      <CustomerDashboardHeader
        eyebrow="Profile"
        title="Public identity."
        body="Update the name, photo, bio, and direct contact details used for your dashboard profile and public About sections. Business and homepage settings stay in Settings."
        media={
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            {profile.avatarUrl ? (
              <Image
                src={profile.avatarUrl}
                alt={`${profile.displayName} profile`}
                width={720}
                height={420}
                className="h-56 w-full object-cover"
              />
            ) : (
              <div className="flex h-56 items-center justify-center bg-slate-100">
                <UserRound className="size-16 text-slate-300" aria-hidden="true" />
              </div>
            )}
            <div className="p-4">
              <p className="font-display text-3xl font-black tracking-[-0.04em] text-slate-950">{profile.displayName}</p>
              <p className="mt-1 text-sm text-slate-600">{profile.location}</p>
            </div>
          </div>
        }
      />

      <form action={updateCustomerProfile} className="mt-5 grid gap-5">
        <input type="hidden" name="tenantSlug" value={slug} />

        <section className="grid gap-5 xl:grid-cols-2">
          <CustomerPanel title="Personal details" icon={UserRound}>
            <div className="grid gap-4">
              <TextField label="Display name" name="displayName" defaultValue={profile.displayName} />
              <TextField
                label="About title"
                name="headline"
                defaultValue={profile.headline}
                placeholder="The photographer behind the frame."
                description="Shown as the main title inside your public About page."
              />
              <TextField
                label="Profile photo"
                name="avatarFile"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                description="Upload JPG, PNG, WebP, or GIF. Keep it under 8MB."
              />
              <TextareaField
                label="Bio"
                name="bio"
                defaultValue={profile.bio}
                description="Write a detailed biography. This appears below your profile image on the public About page."
              />
            </div>
          </CustomerPanel>

          <CustomerPanel title="Contact details" icon={AtSign}>
            <div className="grid gap-4">
              <TextField label="Public email" name="email" type="email" defaultValue={profile.email} />
              <TextField label="Phone" name="phone" defaultValue={profile.phone} />
              <TextField label="Location" name="location" defaultValue={profile.location} />
            </div>
          </CustomerPanel>
        </section>

        <CustomerPanel title="Profile usage" icon={ImageIcon}>
          <div className="grid gap-3 text-sm leading-6 text-slate-600 md:grid-cols-3">
            <p className="rounded-md border border-slate-200 bg-slate-50 p-4">The About page can use this photo and bio.</p>
            <p className="rounded-md border border-slate-200 bg-slate-50 p-4">Dashboard avatar can use the uploaded profile photo.</p>
            <p className="rounded-md border border-slate-200 bg-slate-50 p-4">Business and homepage details stay managed from Settings.</p>
          </div>
        </CustomerPanel>

        <div className="flex justify-end border-t border-slate-200 pt-5">
          <Button type="submit" className="h-11 gap-2 bg-slate-950 px-5 shadow-sm hover:bg-teal-800">
            <Save className="size-4" aria-hidden="true" />
            Save profile
          </Button>
        </div>
      </form>
    </CustomerDashboardPage>
  );
}
