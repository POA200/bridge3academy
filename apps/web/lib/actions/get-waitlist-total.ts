"use server";

import { prisma } from "@repo/db";

export async function getWaitlistTotal() {
  return prisma.waitlistUser.count();
}