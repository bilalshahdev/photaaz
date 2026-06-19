export type CloudinaryUploadSignature = {
  timestamp: number;
  signature: string;
  apiKey: string;
  cloudName: string;
};

export function getCloudinaryConfig() {
  return {
    cloudName: env.CLOUDINARY_CLOUD_NAME ?? "",
    apiKey: env.CLOUDINARY_API_KEY ?? ""
  };
}
import { env } from "@/lib/env";
