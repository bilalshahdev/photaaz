import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_ROOT_DOMAIN: z.string().default("localhost:3000"),
  BETTER_AUTH_SECRET: z.string().min(16).optional(),
  BETTER_AUTH_URL: z.string().url().optional(),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  PADDLE_API_KEY: z.string().optional(),
  PADDLE_WEBHOOK_SECRET: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development")
});

export const env = envSchema.parse(process.env);

export function requireEnv<Key extends keyof typeof env>(key: Key) {
  const value = env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${String(key)}`);
  }

  return value;
}
