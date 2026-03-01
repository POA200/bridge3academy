import { prisma } from "@repo/db";
import { unstable_noStore as noStore } from "next/cache";

export async function getWaitlistTasks() {
  noStore();

  return prisma.task.findMany({
    where: {
      active: true,
    },
    select: {
      id: true,
      title: true,
      points: true,
      type: true,
      link: true,
    },
    orderBy: [
      { sortOrder: "asc" },
      { createdAt: "asc" },
      { points: "desc" },
    ],
  });
}
