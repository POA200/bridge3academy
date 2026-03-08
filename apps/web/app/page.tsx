import { CTA } from "@/components/sections/cta";
import { FAQ } from "@/components/sections/faq";
import { Curriculum } from "@/components/sections/curriculum";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
{
  /*import { Tracks } from "@/components/sections/tracks";*/
}
import { Testimonials } from "@/components/sections/testimonials";
import { getTestimonials } from "@/lib/data/testimonials";
import { getWaitlistTasks } from "@/lib/data/waitlist-tasks";

export default async function HomePage() {
  const tasks = await getWaitlistTasks();
  const testimonials = await getTestimonials();

  return (
    <>
      <div className="bg-background">
        <Hero tasks={tasks} />
        <HowItWorks />
        <Curriculum />
        <Testimonials testimonials={testimonials} />
        {/*<Tracks />*/}
        <FAQ />
        <CTA />
      </div>
    </>
  );
}
