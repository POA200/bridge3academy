import { CTA } from "@/components/sections/cta";
import { FAQ } from "@/components/sections/faq";
import { Features } from "@/components/sections/features";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { prisma } from "@repo/db";

export default async function HomePage() {
  const tasks = await prisma.task.findMany({
    where: { active: true },
    select: {
      id: true,
      title: true,
      points: true,
      type: true,
      link: true,
    },
    orderBy: [{ points: "desc" }, { createdAt: "asc" }],
  });

  return (
    <>
      <div className="bg-background px-2 md:px-12">
        <Hero tasks={tasks} />
        <HowItWorks />
        <Features />
        <FAQ />
        <CTA />
      </div>
    </>
  );
}
