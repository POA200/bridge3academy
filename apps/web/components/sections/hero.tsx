import { Button, Skeleton } from "@repo/ui";

export function Hero() {
  return (
    <section id="home" className="py-24 text-center">
      <h1 className="text-4xl font-bold">Learn. Build. Earn.</h1>
      <p className="mt-4 text-muted-foreground">
        Join the next generation of builders.
      </p>
      <div className="mt-6">
        <Button variant="default">Join Waitlist</Button>
      </div>
      <div className="mt-4 flex justify-center">
        <Skeleton className="h-4 w-40" />
      </div>
    </section>
  );
}
