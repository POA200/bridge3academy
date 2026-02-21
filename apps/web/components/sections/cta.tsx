import Link from "next/link";

export function CTA() {
  return (
    <section id="about" style={{ padding: "2rem 1rem" }}>
      <h2>About</h2>
      <p>Bridge3Academy helps aspiring builders learn practical skills.</p>
      <Link href="/waitlist">Join the waitlist</Link>
    </section>
  );
}
