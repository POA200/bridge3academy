"use client";

import { Button } from "@repo/ui";
import { useMemo, useState } from "react";

type CurriculumLevel = "general" | "ecosystem-support" | "skill-set";

type CurriculumPhase = {
  title: string;
  description: string;
};

type CurriculumTrack = {
  id: CurriculumLevel;
  label: string;
  title: string;
  overview: string;
  phases?: CurriculumPhase[];
  topics: string[];
  outcome: string;
  ctaLabel: string;
};

const curriculumTracks: CurriculumTrack[] = [
  {
    id: "general",
    label: "General",
    title: "General Track",
    overview:
      "A two-level learning phase designed to move students from foundational understanding to confident practical use of Web3 tools and ecosystems.",
    phases: [
      {
        title: "Educational Level 1",
        description:
          "Builds core understanding of blockchain, Bitcoin, Web3, smart contracts, NFTs, DeFi, AI, and the broader crypto economy.",
      },
      {
        title: "Educational Level 2",
        description:
          "Focuses on practical Web3 usage, essential tools, ecosystem participation, digital security, communication, and real-world applications.",
      },
    ],
    topics: [
      "Blockchain and Web3 fundamentals",
      "Crypto economy and emerging technologies",
      "Practical ecosystem participation and security",
    ],
    outcome:
      "Students complete this track with a strong conceptual foundation and practical confidence for real ecosystem engagement.",
    ctaLabel: "View full curriculum",
  },
  {
    id: "ecosystem-support",
    label: "Ecosystem Support",
    title: "Ecosystem Support Track",
    overview:
      "Introduces how blockchain ecosystems function end-to-end, from user interaction to decentralized application flow and foundational infrastructure language.",
    topics: [
      "How blockchain ecosystems are structured",
      "How users interact with ecosystem products",
      "How decentralized applications operate",
      "Core infrastructure concepts and language",
    ],
    outcome:
      "Students gain ecosystem-level literacy that prepares them to support, navigate, and contribute meaningfully within Web3 environments.",
    ctaLabel: "Explore ecosystem support track",
  },
  {
    id: "skill-set",
    label: "Skill Set",
    title: "Skill Set Track",
    overview:
      "Students choose a specialization aligned with their career direction and build practical competency through guided assignments and project execution.",
    topics: [
      "Designer Track",
      "Creator Track",
      "Community and Growth Track",
      "Builder Track (planned partnership for development-focused learning)",
    ],
    outcome:
      "Each path emphasizes hands-on training, assignments, and project-based learning to ensure measurable skill acquisition.",
    ctaLabel: "Review specialization paths",
  },
];

export function Curriculum() {
  const [activeLevel, setActiveLevel] = useState<CurriculumLevel>("general");

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
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center">
        <p className="text-sm font-regular tracking-[0.2em] text-primary uppercase">
          Curriculum Overview
        </p>

        <p className="max-w-4xl text-center text-foreground text-md md:text-lg font-semibold">
          Bridge3 Academy offers a structured learning system designed to take
          students from Web3 fundamentals to real ecosystem participation and
          skill development.
        </p>

        <div className="mt-2 flex items-center rounded-full border border-primary/30 bg-primary/15 p-1">
          {curriculumTracks.map((track) => {
            const isActive = track.id === activeLevel;

            return (
              <button
                key={track.id}
                type="button"
                onClick={() => setActiveLevel(track.id)}
                className={`rounded-full px-2 py-1 text-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
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
          className="mt-4 h-[340px] w-full rounded-none border border-border/80 bg-gradient-to-r from-background via-muted/40 to-background"
          aria-hidden="true"
        />

        <div className="mt-4 w-full">
          <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold leading-tight text-foreground">
            {activeTrack.title}
          </h3>

          <p className="mt-3 text-base md:text-lg text-foreground">
            {activeTrack.overview}
          </p>

          {activeTrack.phases?.length ? (
            <div className="mt-4 space-y-3">
              {activeTrack.phases.map((phase) => (
                <div key={phase.title}>
                  <h4 className="text-lg font-semibold text-foreground">
                    {phase.title}
                  </h4>
                  <p className="text-base text-foreground">
                    {phase.description}
                  </p>
                </div>
              ))}
            </div>
          ) : null}

          <ul className="mt-3 list-disc space-y-1 pl-6 text-lg md:text-base text-foreground">
            {activeTrack.topics.map((topic) => (
              <li key={topic}>{topic}</li>
            ))}
          </ul>

          <p className="mt-4 text-base md:text-lg text-foreground">
            {activeTrack.outcome}
          </p>
        </div>

        <Button type="button" className="mt-6 w-full" size="lg" disabled>
          {activeTrack.ctaLabel}
        </Button>
      </div>
    </section>
  );
}
