export interface CrisisResource {
  name: string;
  phone: string;
  availability: string;
}

export const CRISIS_RESOURCES: CrisisResource[] = [
  {
    name: "Kiran Mental Health Helpline (Govt of India)",
    phone: "1800-599-0019",
    availability: "24/7 (Toll-Free, Multi-lingual)"
  },
  {
    name: "AASRA Suicide Prevention Helpline",
    phone: "+91-9820466726",
    availability: "24/7 (English / Hindi)"
  },
  {
    name: "Tele-MANAS Helpline (Govt of India)",
    phone: "14416 or 1800-891-4416",
    availability: "24/7"
  }
];

const CRISIS_KEYWORDS = [
  "suicide",
  "kill myself",
  "end my life",
  "want to die",
  "hanging myself",
  "cutting myself",
  "harming myself",
  "self-harm",
  "wish i was dead",
  "overdose",
  "ending my life",
  "suicidal",
  "kill my self",
  "harm my self"
];

/**
 * Checks a text input for critical self-harm or suicide indicators.
 * Returns true if a keyword matches.
 */
export function checkCrisis(text: string): boolean {
  if (!text) return false;
  const normalized = text.toLowerCase();
  return CRISIS_KEYWORDS.some(keyword => normalized.includes(keyword));
}
