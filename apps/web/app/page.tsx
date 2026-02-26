import { CTA } from "@/components/sections/cta";
import { FAQ } from "@/components/sections/faq";
import { Curriculum } from "@/components/sections/curriculum";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Testimonials } from "@/components/sections/testimonials";
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
      <div className="bg-background">
        <Hero tasks={tasks} />
        <HowItWorks />
        <Curriculum />
        <Testimonials />
        <FAQ />
        <CTA />
      </div>
    </>
  );
}
