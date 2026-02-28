import { prisma } from "@repo/db";

export async function getWaitlistTasks() {
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
    orderBy: [{ points: "desc" }, { createdAt: "asc" }],
  });
}
