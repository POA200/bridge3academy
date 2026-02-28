import {
  ChevronRight,
  MessageCircle,
  Send,
  Twitter,
  VenetianMask,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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
  { label: "Legal", href: "/legal" },
  { label: "Contact", href: "/#about" },
];

const socialLinks = [
  { label: "X", href: "#", icon: Twitter },
  { label: "Discord", href: "#", icon: VenetianMask },
  { label: "Telegram", href: "#", icon: Send },
  { label: "WhatsApp", href: "#", icon: MessageCircle },
];

type FooterProps = {
  tasks: WaitlistTask[];
};

export function Footer({ tasks }: FooterProps) {
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
              {footerLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;

                return (
                  <Link
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-primary bg-primary/15 text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </Link>
                );
              })}
            </div>
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
