import { Badge } from "@repo/ui";
import { Rocket } from "lucide-react";
import { WaitlistModal } from "./waitlist-modal";

type WaitlistTask = {
  id: string;
  title: string;
  points: number;
  type: string;
  link: string | null;
};

type HeroProps = {
  tasks: WaitlistTask[];
};

export function Hero({ tasks }: HeroProps) {
  return (
    <section
      id="home"
      className="px-2 md:px-12 lg:px-24 py-8 md:py-12 lg:py-24"
    >
      <div className="flex w-full flex-col items-center justify-between gap-8 lg:flex-row lg:gap-12">
        <div className="w-full text-left lg:w-1/2">
          <div className="max-w-[500px]">
            <Badge
              className="gap-1.5 border-primary bg-primary/10 text-primary px-3 py-1"
              variant={"outline"}
            >
              <Rocket className="h-6 w-6" />
              <span>APP LAUNCHING SOON</span>
            </Badge>

            <h1 className="mt-2 text-4xl font-bold leading-tight lg:text-5xl text-foreground">
              AFRICA&apos;S FIRST
              <br />
              STRUCTURED WEB3
              <br />
              <span className="text-primary">EDUCATION PLATFORM.</span>
            </h1>

            <p className="mt-8 max-w-md text-foreground">
              From zero knowledge to verified certification. Learn blockchain,
              DeFi, smart contracts, and career-ready Web3 skills without
              tutorial chaos.
            </p>

            <div className="mt-8 w-full">
              <WaitlistModal tasks={tasks} />
              <p className="mt-4 max-w-sm text-sm text-muted-foreground">
                Early members receive priority verification and scholarship
                consideration.
              </p>
            </div>
          </div>
        </div>

        <div className="flex w-full justify-center lg:w-1/2">
          <div className="flex aspect-square w-full max-w-[280px] items-center justify-center sm:max-w-[340px] lg:h-96 lg:max-w-[420px]">
            <div className="w-full">
              <img
                src="/b3a-hero-logo.png"
                alt="bridge3academy logo"
                width={380}
                height={380}
                className="h-full w-full rounded-md object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
