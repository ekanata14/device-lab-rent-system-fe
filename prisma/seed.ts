import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding LabSettings...");
  await prisma.labSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      isManuallyClosed: false,
      openTime: "08:00",
      closeTime: "17:00",
    },
  });

  const dummyPrinters = [
    {
      id: "ENDER-01",
      name: "Ender 3 V2",
      model: "Creality Ender 3 V2",
      status: "available",
    },
    {
      id: "PRUSA-01",
      name: "Prusa MK3S+",
      model: "Original Prusa i3 MK3S+",
      status: "available",
    },
    {
      id: "BAMBU-01",
      name: "Bambu Lab X1C",
      model: "Bambu Lab X1 Carbon",
      status: "available",
    },
  ];

  console.log("Seeding Printers...");
  for (const printer of dummyPrinters) {
    await prisma.printer.upsert({
      where: { id: printer.id },
      update: {},
      create: printer,
    });
  }

  console.log("Done seeding dummy data!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
