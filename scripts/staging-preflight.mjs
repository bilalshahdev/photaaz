import fs from "node:fs";
import process from "node:process";
import dotenv from "dotenv";

const envFile = process.argv[2];
if (envFile) {
  if (!fs.existsSync(envFile)) {
    console.error(`Staging environment file not found: ${envFile}`);
    process.exit(1);
  }
  dotenv.config({ path: envFile, override: true });
}

const errors = [];
const warnings = [];
const required = [
  "DATABASE_URL", "NEXT_PUBLIC_APP_URL", "NEXT_PUBLIC_ROOT_DOMAIN",
  "BETTER_AUTH_URL", "BETTER_AUTH_SECRET", "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET", "PADDLE_API_KEY",
  "NEXT_PUBLIC_PADDLE_CLIENT_TOKEN", "PADDLE_WEBHOOK_SECRET",
];

for (const key of required) if (!process.env[key]?.trim()) errors.push(`${key} is required.`);
if (process.env.PHOTAAZ_ENVIRONMENT !== "staging") errors.push("PHOTAAZ_ENVIRONMENT must be 'staging'.");
if (process.env.PADDLE_ENVIRONMENT !== "sandbox") errors.push("Staging must use PADDLE_ENVIRONMENT=sandbox.");
if (process.env.CLOUDINARY_ENVIRONMENT_FOLDER !== "staging") errors.push("CLOUDINARY_ENVIRONMENT_FOLDER must be 'staging'.");

for (const key of ["NEXT_PUBLIC_APP_URL", "BETTER_AUTH_URL"]) {
  const value = process.env[key] ?? "";
  if (value && !value.startsWith("https://")) errors.push(`${key} must use HTTPS.`);
  if (/prod(uction)?\b/i.test(value)) errors.push(`${key} appears to reference production.`);
}
if ((process.env.BETTER_AUTH_SECRET ?? "").length < 32) errors.push("BETTER_AUTH_SECRET must be at least 32 characters in staging.");
if (/\/production(?:\/|$)/i.test(process.env.CLOUDINARY_ENVIRONMENT_FOLDER ?? "")) errors.push("Cloudinary staging folder cannot be production.");
if (/live|production/i.test(process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN ?? "")) errors.push("Paddle client token appears to be a live token.");
if (/prod(uction)?/i.test(process.env.DATABASE_URL ?? "")) errors.push("DATABASE_URL appears to reference production; verify the database name/host.");

const emailProvider = process.env.EMAIL_PROVIDER ?? "disabled";
if (emailProvider === "disabled") warnings.push("Email is disabled; email-flow evidence cannot be collected.");
if (emailProvider === "resend" && !process.env.RESEND_API_KEY) errors.push("RESEND_API_KEY is required when EMAIL_PROVIDER=resend.");
if (emailProvider === "smtp" && !(process.env.SMTP_HOST && process.env.SMTP_USERNAME && process.env.SMTP_PASSWORD)) errors.push("SMTP host, username and password are required when EMAIL_PROVIDER=smtp.");

console.log("Photaaz staging preflight");
for (const warning of warnings) console.warn(`WARN: ${warning}`);
for (const error of errors) console.error(`FAIL: ${error}`);
if (errors.length) process.exit(1);
console.log("PASS: staging configuration is isolated and structurally complete.");
