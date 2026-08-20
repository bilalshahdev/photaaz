"use client";

import { startTransition, useState, type FormHTMLAttributes, type ReactNode, type RefObject } from "react";

type Props = Omit<FormHTMLAttributes<HTMLFormElement>, "action" | "onSubmit"> & {
  action: (formData: FormData) => void | Promise<unknown>;
  children: ReactNode;
  formRef?: RefObject<HTMLFormElement | null>;
};

export function DirectUploadForm({ action, children, formRef, ...props }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  return <form {...props} ref={formRef} onSubmit={async (event) => {
    event.preventDefault(); setError(""); setUploading(true);
    let handedToAction = false;
    try {
      const formData = new FormData(event.currentTarget);
      const tenantSlug = String(formData.get("tenantSlug") ?? "");
      const uploadedAssets: Array<Record<string, unknown>> = [];
      for (const input of Array.from(event.currentTarget.querySelectorAll<HTMLInputElement>('input[type="file"]'))) {
        const files = Array.from(input.files ?? []);
        if (!files.length || !input.name) continue;
        const assets = [];
        for (const file of files) {
          const response = await fetch("/api/uploads/cloudinary/sign", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ tenantSlug, area: input.dataset.uploadArea ?? "others", folder: input.dataset.uploadFolder || undefined, fileLabel: input.dataset.uploadLabel || undefined, fileName: file.name, fileSize: file.size, mimeType: file.type }) });
          const authorization = await response.json();
          if (!response.ok) throw new Error(authorization.error || "Upload authorization failed.");
          const upload = new FormData(); upload.append("file", file); upload.append("api_key", authorization.apiKey); upload.append("folder", authorization.folder); upload.append("public_id", authorization.publicId); upload.append("timestamp", String(authorization.timestamp)); upload.append("signature", authorization.signature);
          const cloudinaryResponse = await fetch(`https://api.cloudinary.com/v1_1/${authorization.cloudName}/image/upload`, { method: "POST", body: upload });
          const result = await cloudinaryResponse.json();
          if (!cloudinaryResponse.ok) throw new Error(result.error?.message || "Cloudinary upload failed.");
          assets.push({ grant: authorization.grant, publicId: result.public_id, secureUrl: result.secure_url, bytes: result.bytes, width: result.width, height: result.height, format: result.format, version: result.version, signature: result.signature });
          uploadedAssets.push(assets.at(-1)!);
        }
        formData.delete(input.name);
        formData.set(`__cloudinary_${input.name}`, JSON.stringify(input.multiple ? assets : assets[0]));
      }
      handedToAction = true;
      startTransition(async () => {
        try {
          await action(formData);
        } catch (cause) {
          if (uploadedAssets.length) {
            await fetch("/api/uploads/cloudinary/cleanup", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ tenantSlug, assets: uploadedAssets }) });
          }
          setError(cause instanceof Error ? cause.message : "The image uploaded, but saving failed. The temporary upload was removed.");
        } finally {
          setUploading(false);
        }
      });
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Image upload failed."); }
    finally { if (!handedToAction) setUploading(false); }
  }} aria-busy={uploading}>
    <fieldset disabled={uploading} className="contents">{children}</fieldset>
    {uploading ? <p className="text-sm font-medium text-teal-700">Uploading images securely...</p> : null}
    {error ? <p role="alert" className="text-sm font-medium text-red-700">{error}</p> : null}
  </form>;
}
