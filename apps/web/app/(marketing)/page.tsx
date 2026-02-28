import { CTA } from "../../components/sections/cta";
import { FAQ } from "../../components/sections/faq";
import { Curriculum } from "../../components/sections/curriculum";
import { Hero } from "../../components/sections/hero";
import { HowItWorks } from "../../components/sections/how-it-works";
import { Testimonials } from "../../components/sections/testimonials";
import { Tracks } from "../../components/sections/tracks";
import { getWaitlistTasks } from "@/lib/data/waitlist-tasks";

export default async function MarketingPage() {
  const tasks = await getWaitlistTasks();

  return (
    <main>
      <Hero tasks={tasks} />
      <HowItWorks />
      <Curriculum />
      <Testimonials />
      <Tracks />
      <FAQ />
      <CTA />
    </main>
  );
}
