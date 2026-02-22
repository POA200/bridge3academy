import { CTA } from "../../components/sections/cta";
import { FAQ } from "../../components/sections/faq";
import { Features } from "../../components/sections/features";
import { Hero } from "../../components/sections/hero";
import { HowItWorks } from "../../components/sections/how-it-works";
import { Tracks } from "../../components/sections/tracks";
import { prisma } from "@repo/db";

export default async function MarketingPage() {
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
    <main>
      <Hero tasks={tasks} />
      <HowItWorks />
      <Features />
      <Tracks />
      <FAQ />
      <CTA />
    </main>
  );
}
