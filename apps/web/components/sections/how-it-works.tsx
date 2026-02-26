import { Card } from "@repo/ui";

type HowItWorksCardContent = {
  title: string;
  description: string;
};

const howItWorksCards: HowItWorksCardContent[] = [
  {
    title: "Apply and get verified",
    description:
      "Join the waitlist, complete verification tasks, and secure your seat.",
  },
  {
    title: "Learn with structure",
    description:
      "Progress through guided modules from fundamentals to advanced concepts.",
  },
  {
    title: "Build proof of work",
    description:
      "Complete practical workshops and portfolio-ready project simulations.",
  },
  {
    title: "Graduate with certification",
    description:
      "Receive verified digital credentials and stronger portfolio visibility.",
  },
];

function HowItWorksCard({ title, description }: HowItWorksCardContent) {
  return (
    <Card className="h-full rounded-lg px-6 py-10 shadow-none border-1 border-primary bg-primary/4 backdrop-blur-md">
      <div className="flex h-full flex-col justify-between gap-58">
        <h3 className="text-2xl font-medium leading-[1.15] text-foreground">
          {title}:
        </h3>
        <p className="text-lg font-light leading-relaxed text-foreground">
          {description}
        </p>
      </div>
    </Card>
  );
}

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="px-2 py-8 md:px-12 md:py-12 lg:px-24 lg:py-24"
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-4 md:mb-4 lg:mb-8 text-center md:mb-12">
          <p className="mb-1 text-sm font-medium tracking-[0.18em] text-primary uppercase">
            How It Works
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-foreground">
            A clear path from <span className="text-primary">curiosity</span> to{" "}
            <span className="text-primary">career</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 gap-6 px-2 md:px-12 lg:px-24">
          {howItWorksCards.map((card) => (
            <HowItWorksCard
              key={card.title}
              title={card.title}
              description={card.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
