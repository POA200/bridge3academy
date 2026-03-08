import { prisma } from "@repo/db";
import { unstable_noStore as noStore } from "next/cache";

export async function getTestimonials() {
  noStore();

  try {
    return await prisma.testimonial.findMany({
      where: {
        active: true,
      },
      select: {
        id: true,
        name: true,
        quote: true,
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
  } catch {
    return [];
  }
}
