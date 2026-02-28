import { CTA } from "@/components/sections/cta";
import { FAQ } from "@/components/sections/faq";
import { Curriculum } from "@/components/sections/curriculum";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Testimonials } from "@/components/sections/testimonials";
import { getWaitlistTasks } from "@/lib/data/waitlist-tasks";

export default async function HomePage() {
  const tasks = await getWaitlistTasks();

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
