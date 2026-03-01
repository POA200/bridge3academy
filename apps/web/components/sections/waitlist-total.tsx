"use client";

import { useEffect, useState } from "react";
import { getWaitlistTotal } from "@/lib/actions/get-waitlist-total";

const numberFormatter = new Intl.NumberFormat();

export function WaitlistTotal() {
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadTotal = async () => {
      try {
        const count = await getWaitlistTotal();

        if (isMounted) {
          setTotal(count);
        }
      } catch {
        if (isMounted) {
          setTotal(null);
        }
      }
    };

    void loadTotal();

    const intervalId = window.setInterval(() => {
      void loadTotal();
    }, 15000);

    const handleJoined = () => {
      void loadTotal();
    };

    window.addEventListener("waitlist:joined", handleJoined);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
      window.removeEventListener("waitlist:joined", handleJoined);
    };
  }, []);

  return (
    <p className="mt-2 max-w-sm text-sm text-foreground">
      {total === null ? (
        "Join the waitlist to secure your spot early."
      ) : (
        <>
          Over{" "}
          <span className="text-primary">{numberFormatter.format(total)}</span>{" "}
          {total === 1 ? "learner has" : "learners have"} already joined the
          waitlist.
        </>
      )}
    </p>
  );
}
