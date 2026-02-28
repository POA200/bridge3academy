import {
  CheckCircle2,
  Globe,
  Rocket,
  Users,
  type LucideIcon,
} from "lucide-react";

type AboutPillar = {
  id: string;
  label: string;
  icon: LucideIcon;
};

const aboutPillars: AboutPillar[] = [
  { id: "accessibility", label: "Accessibility", icon: Globe },
  { id: "structure", label: "Structure", icon: Rocket },
  { id: "proof-of-work", label: "Proof of work", icon: CheckCircle2 },
  { id: "community", label: "Community", icon: Users },
];

function AboutPillarCard({ label, icon: Icon }: AboutPillar) {
  return (
    <article className="flex aspect-square flex-col items-center justify-center rounded-xl border border-primary bg-background p-2 text-center gap-4 text-primary">
      <Icon className="h-10 w-10 font-regular" aria-hidden="true" />
      <p className="text-xl md:text-2xl font-regular">{label}</p>
    </article>
  );
}

export function CTA() {
  return (
    <section
      id="about"
      className="px-2 py-8 md:px-12 md:py-12 lg:px-24 lg:py-24"
    >
      <div className="mx-auto grid w-full grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col justify-between">
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-primary md:text-6xl">
            ABOUT
          </h2>

          <div className="mt-12 lg:mt-0">
            <h3 className="text-2xl md:text-4xl font-semibold text-foreground">
              Mission
            </h3>
            <p className="mt-2 text-xl md:text-2xl leading-snug font-regular text-foreground">
              Bridge3 Academy reduces barriers to Web3 education in Africa
              through structured, practical, career-focused training.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:gap-5">
          {aboutPillars.map((pillar) => (
            <AboutPillarCard key={pillar.id} {...pillar} />
          ))}
        </div>
      </div>
    </section>
  );
}
