import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  await prisma.task.createMany({
    data: [
      {
        title: "Follow us on Twitter",
        points: 10,
        type: "social",
      },
      {
        title: "Join our Telegram",
        points: 10,
        type: "social",
      },
      {
        title: "Join our Discord",
        points: 15,
        type: "community",
      },
      {
        title: "Share our launch post",
        points: 20,
        type: "engagement",
      },
    ],
  })

  console.log("Tasks seeded successfully 🚀")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
