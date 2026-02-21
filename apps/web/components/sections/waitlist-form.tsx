"use client";

import { useState } from "react";
import { Button } from "@repo/ui";
import { joinWaitlist } from "@/lib/actions/join-waitlist";

export function WaitlistForm() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await joinWaitlist(email);
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-4">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded-md border p-3"
        placeholder="Enter your email"
      />
      <Button type="submit" className="w-full">
        Join Waitlist
      </Button>
    </form>
  );
}
