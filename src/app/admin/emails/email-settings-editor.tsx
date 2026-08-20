"use client";

import { useState } from "react";
import { CheckboxField, TextField } from "@/components/forms/form-controls";
import { LocalizedInput, LocalizedTextarea, type AdminLocaleOption } from "@/components/admin/localized-fields";
import { saveEmailSetting } from "@/app/admin/actions";
import type { LocalizedString } from "@/services/platform/platform-data";
import { EmailSettingButton } from "./email-form-button";

type EmailSettingItem = {
  id: string;
  key: string;
  label: LocalizedString;
  description: LocalizedString;
  enabled: boolean;
  category: string;
};

export function EmailSettingsEditor({
  settings,
  locales
}: {
  settings: EmailSettingItem[];
  locales: AdminLocaleOption[];
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {settings.map((setting) => (
        <EmailSettingForm key={setting.key} setting={setting} locales={locales} />
      ))}
    </div>
  );
}

function EmailSettingForm({ setting, locales }: { setting: EmailSettingItem; locales: AdminLocaleOption[] }) {
  const [label, setLabel] = useState<LocalizedString>(setting.label);
  const [description, setDescription] = useState<LocalizedString>(setting.description);

  return (
    <form
      action={async (formData) => {
        await saveEmailSetting({
          key: setting.key,
          label,
          description,
          category: String(formData.get("category")),
          enabled: formData.get("enabled") === "on"
        });
      }}
      className="grid gap-3 rounded-lg border border-slate-200 p-4"
    >
      <LocalizedInput label="Label" value={label} locales={locales} onChange={setLabel} placeholder="Email name" />
      <TextField name="category" label="Category" defaultValue={setting.category} placeholder="Category name" />
      <LocalizedTextarea label="Description" value={description} locales={locales} onChange={setDescription} placeholder="What this email does" />
      <CheckboxField name="enabled" defaultChecked={setting.enabled} label="Email enabled" controlPosition="right" />
      <EmailSettingButton />
    </form>
  );
}
