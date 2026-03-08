import { revalidatePath } from "next/cache";
import { prisma } from "@repo/db";

export const dynamic = "force-dynamic";

const db = prisma as any;

type AdminTestimonial = {
  id: string;
  name: string;
  quote: string;
  active: boolean;
  sortOrder: number;
  createdAt: Date;
};

function parseName(value: string) {
  return value.trim();
}

function parseQuote(value: string) {
  return value.trim();
}

async function createTestimonial(formData: FormData) {
  "use server";

  const name = parseName(String(formData.get("name") ?? ""));
  const quote = parseQuote(String(formData.get("quote") ?? ""));

  if (!name || !quote || quote.length > 500) {
    return;
  }

  const highestSortOrder = await db.testimonial.aggregate({
    _max: { sortOrder: true },
  });

  await db.testimonial.create({
    data: {
      name,
      quote,
      active: true,
      sortOrder: (highestSortOrder._max.sortOrder ?? -1) + 1,
    },
  });

  revalidatePath("/testimonials");
  revalidatePath("/");
}

async function moveTestimonialByOffset(testimonialId: string, offset: -1 | 1) {
  const id = testimonialId.trim();

  if (!id) {
    return;
  }

  const orderedTestimonials: Array<{ id: string; sortOrder: number }> =
    await db.testimonial.findMany({
      select: {
        id: true,
        sortOrder: true,
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });

  const currentIndex = orderedTestimonials.findIndex(
    (testimonial) => testimonial.id === id,
  );

  if (currentIndex < 0) {
    return;
  }

  const targetIndex = currentIndex + offset;

  if (targetIndex < 0 || targetIndex >= orderedTestimonials.length) {
    return;
  }

  const orderedTestimonialIds: string[] = orderedTestimonials.map(
    (testimonial: { id: string }) => testimonial.id,
  );

  [orderedTestimonialIds[currentIndex], orderedTestimonialIds[targetIndex]] = [
    orderedTestimonialIds[targetIndex],
    orderedTestimonialIds[currentIndex],
  ];

  await prisma.$transaction(
    orderedTestimonialIds.map((orderedTestimonialId: string, index: number) =>
      db.testimonial.update({
        where: { id: orderedTestimonialId },
        data: { sortOrder: index },
      }),
    ),
  );

  revalidatePath("/testimonials");
  revalidatePath("/");
}

async function moveTestimonialUp(formData: FormData) {
  "use server";

  const testimonialId = String(formData.get("testimonialId") ?? "");

  await moveTestimonialByOffset(testimonialId, -1);
}

async function moveTestimonialDown(formData: FormData) {
  "use server";

  const testimonialId = String(formData.get("testimonialId") ?? "");

  await moveTestimonialByOffset(testimonialId, 1);
}

async function updateTestimonial(formData: FormData) {
  "use server";

  const testimonialId = String(formData.get("testimonialId") ?? "").trim();
  const name = parseName(String(formData.get("name") ?? ""));
  const quote = parseQuote(String(formData.get("quote") ?? ""));

  if (!testimonialId || !name || !quote || quote.length > 500) {
    return;
  }

  await db.testimonial.update({
    where: { id: testimonialId },
    data: {
      name,
      quote,
    },
  });

  revalidatePath("/testimonials");
  revalidatePath("/");
}

async function disableTestimonial(formData: FormData) {
  "use server";

  const testimonialId = String(formData.get("testimonialId") ?? "").trim();

  if (!testimonialId) {
    return;
  }

  await db.testimonial.update({
    where: { id: testimonialId },
    data: { active: false },
  });

  revalidatePath("/testimonials");
  revalidatePath("/");
}

async function enableTestimonial(formData: FormData) {
  "use server";

  const testimonialId = String(formData.get("testimonialId") ?? "").trim();

  if (!testimonialId) {
    return;
  }

  await db.testimonial.update({
    where: { id: testimonialId },
    data: { active: true },
  });

  revalidatePath("/testimonials");
  revalidatePath("/");
}

async function deleteTestimonial(formData: FormData) {
  "use server";

  const testimonialId = String(formData.get("testimonialId") ?? "").trim();

  if (!testimonialId) {
    return;
  }

  await db.testimonial.delete({
    where: { id: testimonialId },
  });

  revalidatePath("/testimonials");
  revalidatePath("/");
}

export default async function TestimonialsPage() {
  let testimonials: AdminTestimonial[] = [];
  let dbErrorMessage: string | null = null;

  try {
    testimonials = await db.testimonial.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
  } catch {
    dbErrorMessage =
      "Unable to connect to the database. Configure DATABASE_URL in your environment and restart the admin server.";
  }

  return (
    <main className="mx-auto w-full max-w-5xl space-y-8 p-6">
      <section className="space-y-2">
        <h1 className="text-2xl font-bold">Testimonials Admin</h1>
        <p className="text-sm text-muted-foreground">
          Create, edit, arrange, and disable testimonials shown on the web app.
        </p>
        {dbErrorMessage ? (
          <p className="rounded-md border border-destructive-border bg-destructive-muted px-3 py-2 text-sm text-destructive">
            {dbErrorMessage}
          </p>
        ) : null}
      </section>

      <section className="rounded-lg border p-4">
        <h2 className="mb-4 text-lg font-semibold">Add Testimonial</h2>
        <form action={createTestimonial} className="grid gap-3">
          <input
            name="name"
            placeholder="Learner name"
            required
            className="rounded-md border px-3 py-2"
          />
          <textarea
            name="quote"
            placeholder="Testimonial quote"
            required
            maxLength={500}
            rows={4}
            className="rounded-md border px-3 py-2"
          />
          <button
            type="submit"
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
            disabled={Boolean(dbErrorMessage)}
          >
            Add Testimonial
          </button>
        </form>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">All Testimonials</h2>

        {testimonials.length === 0 ? (
          <p className="rounded-md border p-4 text-sm text-muted-foreground">
            No testimonials found.
          </p>
        ) : (
          testimonials.map((testimonial, index) => (
            <div key={testimonial.id} className="rounded-lg border p-4">
              <form action={updateTestimonial} className="grid gap-3">
                <input
                  type="hidden"
                  name="testimonialId"
                  value={testimonial.id}
                />

                <input
                  name="name"
                  defaultValue={testimonial.name}
                  required
                  className="rounded-md border px-3 py-2"
                />
                <textarea
                  name="quote"
                  defaultValue={testimonial.quote}
                  required
                  maxLength={500}
                  rows={4}
                  className="rounded-md border px-3 py-2"
                />

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="submit"
                    formAction={moveTestimonialUp}
                    className="rounded-md border px-3 py-2 text-sm"
                    disabled={Boolean(dbErrorMessage) || index === 0}
                  >
                    Move Up
                  </button>

                  <button
                    type="submit"
                    formAction={moveTestimonialDown}
                    className="rounded-md border px-3 py-2 text-sm"
                    disabled={
                      Boolean(dbErrorMessage) ||
                      index === testimonials.length - 1
                    }
                  >
                    Move Down
                  </button>

                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      testimonial.active
                        ? "bg-success-muted text-success"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {testimonial.active ? "Active" : "Disabled"}
                  </span>

                  <button
                    type="submit"
                    className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground"
                    disabled={Boolean(dbErrorMessage)}
                  >
                    Save Changes
                  </button>
                </div>
              </form>

              {testimonial.active ? (
                <form action={disableTestimonial} className="mt-2">
                  <input
                    type="hidden"
                    name="testimonialId"
                    value={testimonial.id}
                  />
                  <button
                    type="submit"
                    className="rounded-md border border-destructive-border px-3 py-2 text-sm text-destructive"
                    disabled={Boolean(dbErrorMessage)}
                  >
                    Disable Testimonial
                  </button>
                </form>
              ) : (
                <form action={enableTestimonial} className="mt-2">
                  <input
                    type="hidden"
                    name="testimonialId"
                    value={testimonial.id}
                  />
                  <button
                    type="submit"
                    className="rounded-md border px-3 py-2 text-sm"
                    disabled={Boolean(dbErrorMessage)}
                  >
                    Enable Testimonial
                  </button>
                </form>
              )}

              <form action={deleteTestimonial} className="mt-2">
                <input
                  type="hidden"
                  name="testimonialId"
                  value={testimonial.id}
                />
                <button
                  type="submit"
                  className="rounded-md border border-destructive-border px-3 py-2 text-sm text-destructive"
                  disabled={Boolean(dbErrorMessage)}
                >
                  Delete Testimonial
                </button>
              </form>
            </div>
          ))
        )}
      </section>
    </main>
  );
}
