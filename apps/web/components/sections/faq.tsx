"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";

type FAQItem = {
  id: string;
  question: string;
  answer: string;
};

const faqItems: FAQItem[] = [
  {
    id: "faq-1",
    question: "Is Bridge3 free?",
    answer:
      "Bridge3 offers early access pathways and scholarship opportunities. Pricing and cohort options are shared clearly before enrollment.",
  },
  {
    id: "faq-2",
    question: "Do I need coding knowledge?",
    answer:
      "No prior coding experience is required for the Foundation path. The curriculum is structured to take you from fundamentals to practical execution.",
  },
  {
    id: "faq-3",
    question: "Is certification recognized?",
    answer:
      "Certification is designed to be portfolio-ready and skills-based, showing verified proof of work that you can share with teams and recruiters.",
  },
  {
    id: "faq-4",
    question: "Who is this for?",
    answer:
      "Bridge3 is for students, career-switchers, and early professionals who want a structured path into blockchain, DeFi, and Web3 product roles.",
  },
  {
    id: "faq-5",
    question: "How long does it take?",
    answer:
      "Most learners can complete core milestones in a few months, depending on pace and consistency. Each level includes clear outcomes and checkpoints.",
  },
];

export function FAQ() {
  const [openItemId, setOpenItemId] = useState<string | null>(null);

  const toggleItem = (itemId: string) => {
    setOpenItemId((currentId) => (currentId === itemId ? null : itemId));
  };

  return (
    <section
      id="faqs"
      className="px-2 py-8 md:px-12 md:py-12 lg:px-24 lg:py-24"
    >
      <div className="mx-auto w-full max-w-4xl">
        <h2 className="mb-4 text-center text-2xl font-bold text-primary md:text-4xl">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqItems.map((item) => {
            const isOpen = openItemId === item.id;

            return (
              <article
                key={item.id}
                className="rounded-lg bg-foreground/1 backdrop-blur-md border-2 border-foreground/20"
              >
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  className="flex w-full items-center justify-between rounded-md bg-foreground/1 backdrop-blur-md border border-foreground/20 px-5 py-4 text-left"
                  aria-expanded={isOpen}
                  aria-controls={`${item.id}-panel`}
                >
                  <span className="text-xl md:text-2xl font-medium text-foreground">
                    {item.question}
                  </span>
                  <span className="text-foreground" aria-hidden="true">
                    {isOpen ? (
                      <Minus className="h-5 w-5" />
                    ) : (
                      <Plus className="h-5 w-5" />
                    )}
                  </span>
                </button>

                {isOpen ? (
                  <div id={`${item.id}-panel`} className="border-t px-5 py-4">
                    <p className="text-md md:text-lg leading-relaxed text-foreground/90">
                      {item.answer}
                    </p>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
