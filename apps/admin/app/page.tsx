import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl items-center p-6">
      <section className="w-full rounded-xl border p-8">
        <p className="text-sm font-medium text-muted-foreground">
          Bridge3Academy
        </p>
        <h1 className="mt-2 text-3xl font-bold">Admin Dashboard</h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          Manage waitlist users and task configuration from one place.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Link
            href="/waitlist"
            className="rounded-lg border p-5 transition-colors hover:bg-foreground/5"
          >
            <h2 className="text-lg font-semibold">Waitlist</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              View joined users, scores, and completed tasks.
            </p>
            <span className="mt-4 inline-block rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground">
              Open Waitlist
            </span>
          </Link>

          <Link
            href="/tasks"
            className="rounded-lg border p-5 transition-colors hover:bg-foreground/5"
          >
            <h2 className="text-lg font-semibold">Tasks</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Create, edit, and disable waitlist tasks.
            </p>
            <span className="mt-4 inline-block rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground">
              Open Tasks
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
}
