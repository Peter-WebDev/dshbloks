import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, WidgetType } from "../src/generated/prisma/client.js";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

export async function main() {
  console.log("Start seeding...");

  // Skapa test-användare
  const user = await prisma.user.create({
    data: {
      email: "johnny@example.com",
      name: "Johnny Wishbone",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=johnny",
      emailVerified: true,
    },
  });

  console.log("Created user:", user);

  // Skapa default dashboard
  const dashboard = await prisma.dashboard.create({
    data: {
      userId: user.id,
      name: "Weather Dashboard",
      isDefault: true,
      widgets: {
        create: [
          {
            type: WidgetType.weather,
            title: "Borås",
            config: {
              location: "Borås",
              unit: "celsius",
            },
            order: 0,
          },
          {
            type: WidgetType.weather,
            title: "Stockholm",
            config: {
              location: "Stockholm",
              unit: "celsius",
            },
            order: 1,
          },
          {
            type: WidgetType.clock,
            title: "Stockholm",
            config: {
              timezone: "Europe/Stockholm",
              format: "24h",
            },
            order: 2,
          },
        ],
      },
    },
    include: {
      widgets: true,
    },
  });

  console.log("Created dashboard with widgets:", dashboard);
  console.log("Seeding finished!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });