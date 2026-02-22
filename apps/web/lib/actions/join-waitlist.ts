"use server";

import { prisma } from "@repo/db";

type JoinWaitlistPayload = {
  name: string;
  email: string;
  completedTaskIds: string[];
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizePayload(payload: string | JoinWaitlistPayload) {
  if (typeof payload === "string") {
    return {
      name: "Early Access User",
      email: payload,
      completedTaskIds: [],
    };
  }

  return {
    name: payload.name.trim(),
    email: payload.email.trim().toLowerCase(),
    completedTaskIds: Array.from(
      new Set(payload.completedTaskIds.filter((taskId) => Boolean(taskId))),
    ),
  };
}

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

export async function joinWaitlist(payload: string | JoinWaitlistPayload) {
  const normalized = normalizePayload(payload);

  if (normalized.name.length < 2) {
    throw new Error("Please provide your full name.");
  }

  if (!emailRegex.test(normalized.email)) {
    throw new Error("Please provide a valid email address.");
  }

  const tasks = normalized.completedTaskIds.length
    ? await prisma.task.findMany({
        where: { id: { in: normalized.completedTaskIds }, active: true },
        select: { id: true, points: true },
      })
    : [];

  const verifiedTaskIds = tasks.map((task) => task.id);

  const result = await prisma.$transaction(async (transaction) => {
    const waitlistUser = await transaction.waitlistUser.upsert({
      where: { email: normalized.email },
      update: { name: normalized.name },
      create: {
        name: normalized.name,
        email: normalized.email,
      },
    });

    if (verifiedTaskIds.length > 0) {
      await transaction.userTask.createMany({
        data: verifiedTaskIds.map((taskId) => ({
          userId: waitlistUser.id,
          taskId,
        })),
        skipDuplicates: true,
      });
    }

    const scoreAggregate = await transaction.task.aggregate({
      _sum: { points: true },
      where: {
        active: true,
        users: {
          some: {
            userId: waitlistUser.id,
            completed: true,
          },
        },
      },
    });

    const totalScore = scoreAggregate._sum.points ?? 0;

    await transaction.waitlistUser.update({
      where: { id: waitlistUser.id },
      data: { score: totalScore },
    });

    return {
      score: totalScore,
      completedTaskCount: verifiedTaskIds.length,
    };
  });

  return { success: true, ...result };
}
