import type { WaitlistFormData } from "../../types";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function parseWaitlistFormData(formData: FormData): WaitlistFormData {
  const email = formData.get("email");

  if (typeof email !== "string" || !emailRegex.test(email)) {
    throw new Error("Please provide a valid email address.");
  }

  return { email };
}
