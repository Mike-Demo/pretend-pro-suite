export interface FakeEmail {
  id: string;
  from: string;
  subject: string;
  preview: string;
  urgent: boolean;
  time: string;
}

const jargonSnippets = [
  "Synergizing waffle metrics across cross-functional breakfast verticals.",
  "Leveraging donut-based thinking to ideate muffin adjacencies.",
  "Our Q3 vibes have been quartered, stapled, and laminated for the board.",
  "Circling back to the circle we circled back from yesterday.",
  "Deep-diving into shallow pools of actionable snack insights.",
  "The synergy pancakes are aligned with our core competency of napping.",
  "Moving the needle sideways, which is technically still moving it.",
  "Unpacking the bandwidth of the office fern ahead of the fern retro.",
  "Touching base, then tagging base, then scheduling a meeting about base.",
  "Operationalizing the wiggle room to maximize our pretend throughput.",
  "Aligning stakeholders on the strategic direction of the hallway.",
  "Right-sizing the coffee budget through aggressive pretend accounting.",
] as const;

const emailAuthors = [
  "Greg from Synergy",
  "Denise (VP of Vibes)",
  "The Printer",
  "Chad from Accounts Receivable-ish",
  "Manager Bot 9000",
  "Susan in Wellness Compliance",
  "Larry, Remote",
] as const;

const emailSubjects = [
  "URGENT: The waffles are misaligned",
  "Re: Re: Re: Fwd: Quick question",
  "Per my last email (all 47 of them)",
  "Quick sync?? (it will not be quick)",
  "The vibes spreadsheet is BROKEN",
  "Mandatory fun scheduled for 3pm",
  "Who moved my synergy?",
  "Action required: pretend harder",
] as const;

const emailPreviews = [
  "Hi! Just bumping this to the top of your mirage…",
  "No rush, but I need it yesterday, which is confusing for everyone.",
  "Per my calendar hold titled 'IMPORTANT', please acknowledge.",
  "This could have been a meeting, and it still might become one.",
  "Looping in the whole company for visibility purposes.",
  "Not urgent at all. Flagging as urgent anyway. Sorry!!",
] as const;

export const spreadsheetFormulas = [
  "=VLOOKUP(CHAOS)",
  "=SUM(VIBES:INFINITY)",
  "=IF(MONDAY,CRY(),PRETEND())",
  "=AVERAGE(SYNERGY)*π",
  "=COFFEE(now)^3",
  "=PIVOT(me, gently)",
  "=MERGE(vibes, waffles)",
  "=HLOOKUP(snacks, hidden_drawer)",
] as const;

/** Localized copy injected by callers; defaults keep the US English flavour. */
export interface ContentPack {
  jargon: readonly string[];
  emailAuthors: readonly string[];
  emailSubjects: readonly string[];
  emailPreviews: readonly string[];
}

export const defaultContentPack: ContentPack = {
  jargon: jargonSnippets,
  emailAuthors,
  emailSubjects,
  emailPreviews,
};

export function randomJargon(
  count: number,
  seedOffset = 0,
  pack: ContentPack = defaultContentPack,
): string[] {
  const source = pack.jargon.length > 0 ? pack.jargon : jargonSnippets;
  const result: string[] = [];
  for (let i = 0; i < count; i += 1) {
    const idx = (i * 5 + seedOffset * 3) % source.length;
    result.push(source[idx] ?? source[0] ?? "");
  }
  return result;
}

export function generateFakeEmail(
  sequence: number,
  pack: ContentPack = defaultContentPack,
): FakeEmail {
  const from = pack.emailAuthors[sequence % pack.emailAuthors.length] ?? "Someone";
  const subject = pack.emailSubjects[sequence % pack.emailSubjects.length] ?? "Hi";
  const preview = pack.emailPreviews[sequence % pack.emailPreviews.length] ?? "";
  const urgent = sequence % 2 === 0;
  const minutesAgo = (sequence * 7) % 59;
  return {
    id: `fake-email-${sequence}`,
    from,
    subject,
    preview,
    urgent,
    time: `${Math.max(minutesAgo, 1)}m ago`,
  };
}

export function seedEmails(count: number, pack: ContentPack = defaultContentPack): FakeEmail[] {
  return Array.from({ length: count }, (_, i) => generateFakeEmail(i, pack));
}
