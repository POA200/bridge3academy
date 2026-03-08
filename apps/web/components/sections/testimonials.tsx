"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

type Testimonial = {
  id: string;
  name: string;
  quote: string;
};

type TestimonialsProps = {
  testimonials: Testimonial[];
};

const CARDS_PER_PAGE = 3;

function TestimonialCard({ name, quote }: Testimonial) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <article className="rounded-xl border border-primary/30 bg-gradient-to-b from-primary/30 via-background to-background p-4 md:p-5">
      <div className="flex h-full flex-col justify-between gap-6">
        <div>
          <div
            className="mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-primary bg-primary/20 backdrop-blur-lg text-sm font-semibold text-primary"
            aria-hidden="true"
          >
            {initials}
          </div>

          <p className="text-lg md:text-xl leading-snug text-foreground italic">
            “{quote}”
          </p>
        </div>

        <p className="text-lg md:text-xl text-foreground">— {name}</p>
      </div>
    </article>
  );
}

function EmptyTestimonialsState() {
  return (
    <article className="rounded-xl border border-primary/30 bg-gradient-to-b from-primary/20 via-background to-background p-5 md:p-6 max-w-lg mx-auto">
      <div className="flex h-full flex-col justify-center gap-3">
        <p className="text-xl font-semibold text-foreground">
          Your success story could be next
        </p>
        <p className="text-sm md:text-base text-muted-foreground">
          We’re excited to share learner experiences soon, check back for real
          stories from the Bridge3Academy community.
        </p>
      </div>
    </article>
  );
}

export function Testimonials({ testimonials }: TestimonialsProps) {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(testimonials.length / CARDS_PER_PAGE);
  const hasTestimonials = testimonials.length > 0;
  const hasMultiplePages = totalPages > 1;

  const currentTestimonials = useMemo(() => {
    const start = page * CARDS_PER_PAGE;
    return testimonials.slice(start, start + CARDS_PER_PAGE);
  }, [page, testimonials]);

  const goPrev = () => {
    if (!hasMultiplePages) {
      return;
    }

    setPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  const goNext = () => {
    if (!hasMultiplePages) {
      return;
    }

    setPage((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
  };

  return (
    <section
      id="testimonials"
      className="px-2 py-8 md:px-12 md:py-12 lg:px-24 lg:py-24"
    >
      <h2 className="sr-only">Testimonials</h2>

      <div className="mx-auto max-w-[1200px]">
        {hasTestimonials ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {currentTestimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} {...testimonial} />
            ))}
          </div>
        ) : (
          <EmptyTestimonialsState />
        )}

        {hasMultiplePages ? (
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={goPrev}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground"
              aria-label="Show previous testimonials"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2" aria-hidden="true">
              {Array.from({ length: totalPages }).map((_, index) => (
                <span
                  key={index}
                  className={`block h-0.5 w-6 rounded-full ${
                    index === page ? "bg-foreground" : "bg-foreground/35"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={goNext}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground"
              aria-label="Show next testimonials"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
