"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getInPageHref } from "@/lib/navigation";
import { SocialLinks } from "@/components/layout/social-links";
import { WaitlistModal } from "@/components/sections/waitlist-modal";

type WaitlistTask = {
  id: string;
  title: string;
  points: number;
  type: string;
  link: string | null;
};

const footerLinks = [
  { label: "Academy", href: "/#about" },
  { label: "Curriculum", href: "/#curriculum" },
  { label: "Legal", href: "/legal", disabled: true },
  { label: "Contact", href: "/#about" },
];

type FooterProps = {
  tasks: WaitlistTask[];
};

export function Footer({ tasks }: FooterProps) {
  const pathname = usePathname();

  const scrollToSection = (href: string) => {
    const hashIndex = href.indexOf("#");
    if (hashIndex === -1) {
      return;
    }

    const sectionId = href.slice(hashIndex + 1);
    const section = document.getElementById(sectionId);

    if (!section) {
      return;
    }

    const navbarOffset = 112;
    const top =
      section.getBoundingClientRect().top + window.scrollY - navbarOffset;

    window.scrollTo({ top, behavior: "smooth" });
    window.history.replaceState(null, "", `#${sectionId}`);
  };

  const handleFooterLinkClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    const hasSectionHash = href.includes("#");

    if (!hasSectionHash || pathname !== "/") {
      return;
    }

    event.preventDefault();
    scrollToSection(href);
  };

  return (
    <footer className="mt-12 rounded-none bg-gradient-to-b from-background via-background to-primary/15 px-4 py-10 md:mt-20 md:px-8 md:py-14 lg:px-12">
      <div className="mx-auto w-full">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <Link href="/" className="inline-flex items-center gap-2">
              <Image
                src="/bridge3academy logo.png"
                alt="Bridge3Academy logo"
                width={48}
                height={48}
                className="h-12 w-12"
              />
              <span className="text-2xl font-regular leading-tight text-foreground">
                Bridge <span className="text-primary">3</span>
                <br />
                Academy
              </span>
            </Link>

            <p className="mt-8 text-lg leading-relaxed text-foreground">
              From zero knowledge to verified certification. Learn blockchain,
              DeFi, smart contracts, and career-ready Web3 skills without
              tutorial chaos.
            </p>

            <div className="mt-5 space-y-3 max-w-md">
              <WaitlistModal tasks={tasks} />
            </div>
          </div>

          <div className="flex flex-col items-start justify-between gap-8 lg:items-end">
            <nav className="flex flex-col items-start text-xl md:text-2xl text-foreground lg:items-end">
              {footerLinks.map((link) =>
                link.disabled ? (
                  <span
                    key={link.label}
                    className="cursor-not-allowed text-muted-foreground"
                    aria-disabled="true"
                  >
                    {link.label}
                  </span>
                ) : (
                  <Link
                    key={link.label}
                    href={getInPageHref(pathname, link.href)}
                    className="transition-colors hover:text-primary"
                    onClick={(event) => handleFooterLinkClick(event, link.href)}
                  >
                    {link.label}
                  </Link>
                ),
              )}
            </nav>

            <SocialLinks tasks={tasks} />
          </div>
        </div>

        <div className="my-8 md:my-10 border-t border-foreground/40" />

        <p className="text-center text-lg md:text-xl text-foreground/85">
          © {new Date().getFullYear()} Bridge3 Academy. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
