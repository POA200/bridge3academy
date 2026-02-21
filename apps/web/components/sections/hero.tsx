import { Badge, Button, Input } from "@repo/ui";
import { Rocket } from "lucide-react";

export function Hero() {
  return (
    <section id="home" className="px-5 py-24">
      <div className="flex w-full flex-col items-center justify-between gap-8 lg:flex-row lg:gap-12">
        <div className="w-full text-left lg:w-1/2">
          <div className="max-w-[500px]">
            <Badge className="rounded-full border-transparent bg-green-700/20 px-3 py-1 text-xs text-green-500 hover:bg-green-700/20">
              <Rocket className="h-3.5 w-3.5" />
              <span>APP LAUNCHING SOON</span>
            </Badge>

            <h1 className="mt-4 text-4xl font-bold leading-tight lg:text-6xl">
              AFRICA&apos;S FIRST
              <br />
              STRUCTURED WEB3
              <br />
              <span className="text-green-500">EDUCATION PLATFORM.</span>
            </h1>

            <p className="mt-4 max-w-md text-muted-foreground">
              From zero knowledge to verified certification. Learn blockchain,
              DeFi, smart contracts, and career-ready Web3 skills without
              tutorial chaos.
            </p>

            <div className="mt-6">
              <form
                className="flex flex-col gap-3"
                aria-label="Early access form"
              >
                <Input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  className="w-full rounded-md bg-foreground/10 px-4 py-3"
                />
                <Input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full rounded-md bg-foreground/10 px-4 py-3"
                />
                <Button
                  type="submit"
                  variant="default"
                  className="mt-4 w-full transition-colors hover:bg-green-600 sm:w-auto"
                >
                  Join Early Access
                </Button>
              </form>
              <p className="mt-2 max-w-sm text-xs text-muted-foreground">
                Early members receive priority verification and scholarship
                consideration.
              </p>
            </div>
          </div>
        </div>

        <div className="flex w-full justify-center lg:w-1/2">
          <div className="flex h-80 w-full items-center justify-center rounded-md bg-foreground/10 lg:h-96">
            <span className="text-sm text-muted-foreground">Hero Image</span>
          </div>
        </div>
      </div>
    </section>
  );
}
