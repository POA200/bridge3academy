import "@repo/ui/styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { getWaitlistTasks } from "@/lib/data/waitlist-tasks";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Bridge3Academy",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let tasks: Array<{
    id: string;
    title: string;
    points: number;
    type: string;
    link: string | null;
  }> = [];

  try {
    tasks = await getWaitlistTasks();
  } catch {
    tasks = [];
  }

  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} px-2 md:px-24 py-2 md:py-8`}>
        <Navbar tasks={tasks} />
        {children}
        <Footer tasks={tasks} />
      </body>
    </html>
  );
}
