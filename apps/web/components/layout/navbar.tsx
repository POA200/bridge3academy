"use client";

import { Button } from "@repo/ui";
import { ChevronRight, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const navLinks = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "Curriculum", href: "/#curriculum" },
  { label: "Tracks", href: "/#tracks" },
  { label: "FAQs", href: "/#faqs" },
  { label: "About", href: "/#about" },
];

const navLinkClass =
  "text-foreground transition-colors hover:text-primary focus-visible:text-primary focus-visible:outline-none";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const touchStartYRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
      }

      if (event.key !== "Tab" || !panelRef.current) {
        return;
      }

      const focusableElements = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );

      if (focusableElements.length === 0) {
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      if (!firstElement || !lastElement) {
        return;
      }
      const activeElement = document.activeElement;

      if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }

      if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="sticky top-0 z-40 p-5">
      <nav className="flex w-full items-center justify-between rounded-xl border-2 border-border bg-foreground/4 px-4 py-3 backdrop-blur-md md:px-6">
        <Link
          href="/"
          className="flex items-center gap-3"
          aria-label="Bridge3Academy home"
        >
          <Image
            src="/bridge3academy logo.png"
            alt="Bridge3Academy logo"
            width={20}
            height={20}
            priority
          />
          <span className="leading-tight">
            <span className="block text-base font-semibold text-foreground">
              Bridge<span className="text-primary">3</span>
            </span>
            <span className="block text-sm text-foreground">Academy</span>
          </span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={navLinkClass}>
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Button asChild variant="link">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/waitlist" className="inline-flex items-center">
              Join Waitlist
              <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <button
          type="button"
          className="rounded-md p-2 text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
      </nav>

      <div
        className={`fixed inset-0 z-50 transform bg-foreground/4 backdrop-blur-md transition-transform duration-300 ease-out md:hidden ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "pointer-events-none translate-x-full"
        }`}
        onTouchStart={(event) => {
          touchStartYRef.current = event.touches[0]?.clientY ?? null;
        }}
        onTouchEnd={(event) => {
          if (touchStartYRef.current === null) {
            return;
          }

          const touchEndY = event.changedTouches[0]?.clientY;
          if (
            typeof touchEndY === "number" &&
            touchEndY - touchStartYRef.current > 70
          ) {
            setIsMobileMenuOpen(false);
          }

          touchStartYRef.current = null;
        }}
      >
        <div
          ref={panelRef}
          className="flex min-h-screen w-full flex-col justify-between border-l border-border/80 p-6 bg-background"
        >
          <div>
            <div className="mb-8 flex items-center justify-between">
              <span className="text-lg font-semibold text-foreground">
                Menu
              </span>
              <button
                ref={closeButtonRef}
                type="button"
                className="rounded-md p-2 text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close navigation menu"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="flex flex-col gap-6 text-lg">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${navLinkClass} flex w-full items-center justify-between`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>{link.label}</span>
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Button asChild variant="link" className="w-full justify-center">
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                Login
              </Link>
            </Button>
            <Button asChild className="w-full">
              <Link href="/waitlist" onClick={() => setIsMobileMenuOpen(false)}>
                Join Waitlist
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
