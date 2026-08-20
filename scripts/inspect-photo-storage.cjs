// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

(async () => {
  const photos = await prisma.photo.findMany({ select: { cloudinaryId: true, secureUrl: true }, take: 500 });
  const groups = { development: 0, staging: 0, production: 0, legacy: 0, local: 0, demo: 0 };
  for (const photo of photos) {
    const value = `${photo.cloudinaryId || ""} ${photo.secureUrl || ""}`;
    if (value.includes("photaaz/development/")) groups.development++;
    else if (value.includes("photaaz/staging/")) groups.staging++;
    else if (value.includes("photaaz/production/")) groups.production++;
    else if (value.includes("local/") || value.includes("/uploads/")) groups.local++;
    else if (value.includes("demo/")) groups.demo++;
    else groups.legacy++;
  }
  console.log(JSON.stringify({ total: photos.length, groups, samples: photos.slice(0, 8) }, null, 2));
})().finally(() => prisma.$disconnect());
