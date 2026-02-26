"use client";

import { Button } from "@repo/ui";
import { useMemo, useState } from "react";

type CurriculumLevel = "foundation" | "intermediate" | "advanced";

type CurriculumTrack = {
  id: CurriculumLevel;
  label: string;
  title: string;
  topics: string[];
  ctaLabel: string;
};

const curriculumTracks: CurriculumTrack[] = [
  {
    id: "foundation",
    label: "Foundation",
    title: "Foundation",
    topics: [
      "Blockchain and Web3 fundamentals",
      "Cryptocurrency basics",
      "DeFi introduction",
    ],
    ctaLabel: "View full curriculum",
  },
  {
    id: "intermediate",
    label: "Intermediate",
    title: "Intermediate",
    topics: [
      "Smart contract architecture",
      "On-chain tooling and workflows",
      "Security-first product development",
    ],
    ctaLabel: "Explore intermediate path",
  },
  {
    id: "advanced",
    label: "Advanced",
    title: "Advanced",
    topics: [
      "Protocol design and governance",
      "Advanced DeFi systems",
      "Capstone with mentor review",
    ],
    ctaLabel: "Review advanced curriculum",
  },
];

export function Curriculum() {
  const [activeLevel, setActiveLevel] = useState<CurriculumLevel>("foundation");

  const activeTrack = useMemo(
    () => curriculumTracks.find((track) => track.id === activeLevel),
    [activeLevel],
  );

  if (!activeTrack) {
    return null;
  }

  return (
    <section
      id="curriculum"
      className="px-2 py-8 md:px-12 md:py-12 lg:px-24 lg:py-24"
    >
      <div className="mx-auto flex w-full max-w-[720px] flex-col items-center">
        <p className="text-sm font-medium tracking-[0.2em] text-primary uppercase">
          Curriculum Overview
        </p>

        <div className="mt-4 flex items-center rounded-full border border-primary/30 bg-primary/15 p-1">
          {curriculumTracks.map((track) => {
            const isActive = track.id === activeLevel;

            return (
              <button
                key={track.id}
                type="button"
                onClick={() => setActiveLevel(track.id)}
                className={`rounded-full px-4 py-1.5 text-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-transparent text-primary"
                }`}
                aria-pressed={isActive}
              >
                {track.label}
              </button>
            );
          })}
        </div>

        <div
          className="mt-8 h-[340px] w-full rounded-none border border-border/80 bg-gradient-to-r from-background via-muted/40 to-background"
          aria-hidden="true"
        />

        <div className="mt-6 w-full">
          <h3 className="text-4xl font-bold leading-tight text-foreground">
            {activeTrack.title}
          </h3>
          <ul className="mt-4 list-disc space-y-1 pl-6 text-xl text-foreground">
            {activeTrack.topics.map((topic) => (
              <li key={topic}>{topic}</li>
            ))}
          </ul>
        </div>

        <Button
          type="button"
          className="mt-8 h-12 w-full text-lg font-medium"
          size="lg"
        >
          {activeTrack.ctaLabel}
        </Button>
      </div>
    </section>
  );
}
