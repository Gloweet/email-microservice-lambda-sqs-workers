import { CreateEmailOptions, Resend } from "resend";
import { Schema } from "../schema";
import { getRecipientsField, getSenderField } from "../helpers/email";

// Resend has a limit of 2 emails per second
const retryAfter = 500;

function isResendRateLimitError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;

  // Resend SDK returns the error as a plain Error with a message string
  const message = (error as Error).message;
  return message?.includes("rate_limit_exceeded");
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function sendEmail(body: Schema, resend?: Resend) {
  if (!resend) {
    throw new Error("Resend instance is required");
  }

  const payload: CreateEmailOptions = {
    from: getSenderField(body.from),
    to: getRecipientsField(body.to),
    subject: body.subject,
    html: body.html,
    text: body.text,
    react: undefined,
  };
  const { data, error } = await resend.emails.send(payload);

  if (error) {
    if (isResendRateLimitError(error)) {
      await sleep(retryAfter);
      return sendEmail(body, resend);
    }
    // Throw to trigger Lambda retry and DLQ if needed
    throw new Error(JSON.stringify({ ...error, payload }));
  }
}
