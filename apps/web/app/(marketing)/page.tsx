import { CTA } from "../../components/sections/cta";
import { FAQ } from "../../components/sections/faq";
import { Features } from "../../components/sections/features";
import { Hero } from "../../components/sections/hero";
import { HowItWorks } from "../../components/sections/how-it-works";
import { Tracks } from "../../components/sections/tracks";

export default function MarketingPage() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <Features />
      <Tracks />
      <FAQ />
      <CTA />
    </main>
  );
}
