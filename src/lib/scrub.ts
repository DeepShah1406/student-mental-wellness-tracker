/**
 * Utility to scrub Personal Identifiable Information (PII) from text
 * before sending to external APIs.
 */

// Regex patterns
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

// Matches Indian phone numbers: e.g. +91 9876543210, 09876543210, 9876543210
const PHONE_REGEX = /(\+91|0)?[6-9]\d{9}/g;

// Regex for common name structures (e.g. My name is X, I am Y)
const INTRO_NAME_REGEX = /\b(?:[mM]y\s+[nN]ame\s+[iI]s|[iI]\s+[aA]m|[tT]his\s+[iI]s|[mM]yself)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\b/g;

/**
 * Redacts emails, phone numbers, and simple name introductions from the text.
 */
export function scrubPII(text: string): string {
  if (!text) return "";

  let scrubbed = text;

  // 1. Redact Emails
  scrubbed = scrubbed.replace(EMAIL_REGEX, "[EMAIL_REDACTED]");

  // 2. Redact Phone Numbers
  scrubbed = scrubbed.replace(PHONE_REGEX, "[PHONE_REDACTED]");

  // 3. Redact Name Introductions
  scrubbed = scrubbed.replace(INTRO_NAME_REGEX, (match, name) => {
    // Keep the prefix, replace only the name
    const prefix = match.substring(0, match.toLowerCase().indexOf(name.toLowerCase()));
    return `${prefix}[NAME_REDACTED]`;
  });

  return scrubbed;
}
