import type { AppId } from "@/components/pretendpro/chrome";
import type { OsTheme } from "@/components/pretendpro/WindowFrame";
import type { LocaleId } from "./locales";

export interface Strings {
  onboarding: {
    headerPrefix: string;
    licensesLink: string;
    stepLabel: (step: number) => string;
    questionWork: string;
    questionStyle: string;
    subtitleWork: string;
    subtitleStyle: string;
    recommendedHeading: string;
    desktopHeading: string;
    mobileHeading: string;
    continue: string;
    start: string;
    back: string;
    fullscreenLabel: string;
    fullscreenHint: string;
    localePickerLabel: string;
    work: Record<AppId, { title: string; description: string }>;
    styles: Record<OsTheme, string>;
  };
  shell: {
    editionHeading: Record<OsTheme, string>;
    switchTo: (name: string) => string;
    changeStyle: string;
    licenses: string;
    launcherHint: (key: number) => string;
    launcherPalette: string;
    licenseJoke: string;
    language: string;
  };
  content: {
    jargon: readonly string[];
    emailAuthors: readonly string[];
    emailSubjects: readonly string[];
    emailPreviews: readonly string[];
    formulas: readonly string[];
    stickyNote: string;
    progressLabel: string;
    progressHint: string;
  };
  licenses: {
    back: string;
    title: string;
    intro: string;
    artwork: string;
    libraries: string;
    references: string;
    disclaimer: string;
  };
  privacy: {
    back: string;
    title: string;
    intro: string;
    loading: string;
    fallbackLink: string;
    fallbackLabel: string;
  };
  meta: {
    homeTitle: string;
    homeDescription: string;
    licensesTitle: string;
    licensesDescription: string;
    privacyTitle: string;
    privacyDescription: string;
    editionTitle: Record<OsTheme, string>;
    editionDescription: Record<OsTheme, string>;
  };
}

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends readonly unknown[]
    ? T[K]
    : T[K] extends (...args: never[]) => unknown
      ? T[K]
      : T[K] extends object
        ? DeepPartial<T[K]>
        : T[K];
};

const base: Strings = {
  onboarding: {
    headerPrefix: "Onboarding in",
    licensesLink: "Open source licenses",
    stepLabel: (step) => `Step ${step} of 2`,
    questionWork: "How are you planning to pretend to work?",
    questionStyle: "Which device style feels most like your job?",
    subtitleWork: "We'll streamline your fake setup experience accordingly.",
    subtitleStyle: "Purely cosmetic. Like most productivity decisions.",
    recommendedHeading: "Recommended for your device",
    desktopHeading: "Desktop styles",
    mobileHeading: "Mobile styles",
    continue: "Continue",
    start: "Start pretending",
    back: "Back",
    fullscreenLabel: "Fill my entire device screen",
    fullscreenHint: "(press Esc anytime to leave)",
    localePickerLabel: "Language",
    work: {
      docufaker: {
        title: "Deep Document Work",
        description: "Type nonsense paragraphs with total conviction.",
      },
      sheets: {
        title: "Spreadsheet Theater",
        description: "Formulas that mean nothing, charts that mean less.",
      },
      browser: {
        title: "Research Browsing",
        description: "Tabs that look important. Mostly cat videos.",
      },
      inbox: {
        title: "Urgent Inbox Triage",
        description: "Imaginary coworkers, imaginary deadlines.",
      },
      codeweb: {
        title: "Code — Web",
        description: "TypeScript that compiles. Understanding optional.",
      },
      codegame: {
        title: "Code — Game",
        description: "A game loop that loops. A game, eventually.",
      },
      deck: {
        title: "Presentation",
        description: "Slides with real stock photos and fake confidence.",
      },
      reader: {
        title: "Reading Documents",
        description: "Very important PDFs. Read at your own pace. Forever.",
      },
      photos: {
        title: "Editing Photos",
        description: "Sliders that actually slide on real CC images.",
      },
      reels: {
        title: "Editing Videos",
        description: "A timeline of clips, a render of dreams.",
      },
      sound: {
        title: "Editing Sound",
        description: "Waveforms, transport, and real CC-licensed audio.",
      },
    },
    styles: {
      fruit: "Soft translucent bar, three little traffic lights.",
      apperture: "Crisp corners, glyph buttons in the top-right.",
      bufferium: "A tab strip that is eternally almost loaded.",
      android: "Home screen grid, back / home / recents bar.",
      fos: "Notch, rounded icons, a dock, a home indicator.",
    },
  },
  shell: {
    editionHeading: {
      fruit: "PretendPro 3000 — Fruit (Mac OS X) Edition: a fake desktop for looking busy",
      apperture: "PretendPro 3000 — Apperture (Windows) Edition: a fake desktop for looking busy",
      bufferium: "PretendPro 3000 — BufferiumOS Edition: a fake desktop for looking busy",
      android: "PretendPro 3000 — Android Edition: a fake phone for looking busy",
      fos: "PretendPro 3000 — fOS Edition: a fake phone for looking busy",
    },
    switchTo: (name) => `Switch to ${name}`,
    changeStyle: "Change style…",
    licenses: "Open source licenses",
    launcherHint: (key) => `Press ${key}`,
    launcherPalette: "via palette",
    licenseJoke: "License expired due to excessive pretending.",
    language: "Language",
  },
  content: {
    jargon: [
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
    ],
    emailAuthors: [
      "Greg from Synergy",
      "Denise (VP of Vibes)",
      "The Printer",
      "Chad from Accounts Receivable-ish",
      "Manager Bot 9000",
      "Susan in Wellness Compliance",
      "Larry, Remote",
    ],
    emailSubjects: [
      "URGENT: The waffles are misaligned",
      "Re: Re: Re: Fwd: Quick question",
      "Per my last email (all 47 of them)",
      "Quick sync?? (it will not be quick)",
      "The vibes spreadsheet is BROKEN",
      "Mandatory fun scheduled for 3pm",
      "Who moved my synergy?",
      "Action required: pretend harder",
    ],
    emailPreviews: [
      "Hi! Just bumping this to the top of your mirage…",
      "No rush, but I need it yesterday, which is confusing for everyone.",
      "Per my calendar hold titled 'IMPORTANT', please acknowledge.",
      "This could have been a meeting, and it still might become one.",
      "Looping in the whole company for visibility purposes.",
      "Not urgent at all. Flagging as urgent anyway. Sorry!!",
    ],
    formulas: [
      "=VLOOKUP(CHAOS)",
      "=SUM(VIBES:INFINITY)",
      "=IF(MONDAY,CRY(),PRETEND())",
      "=AVERAGE(SYNERGY)*π",
      "=COFFEE(now)^3",
      "=PIVOT(me, gently)",
      "=MERGE(vibes, waffles)",
      "=HLOOKUP(snacks, hidden_drawer)",
    ],
    stickyNote: "You're doing great, probably.",
    progressLabel: "Loading productivity…",
    progressHint: "Almost done. It's been 99% since 2019.",
  },
  licenses: {
    back: "Back to onboarding",
    title: "Open Source Licenses",
    intro:
      "PretendPro 3000 is a parody built on generous open source work. Everything used is listed below with its author, license, and a link to the original project.",
    artwork: "Artwork & icons",
    libraries: "Libraries",
    references: "Design references",
    disclaimer:
      "PretendPro 3000 is not affiliated with Apple, Microsoft, or Google. All OS styles are affectionate parodies.",
  },
  meta: {
    homeTitle: "PretendPro 3000 — Set Up Your Fake Workday",
    homeDescription:
      "Answer two questions and PretendPro 3000 builds your ideal fake workday: pick the work you want to mimic and the window style that feels most like your job.",
    licensesTitle: "Open Source Licenses — PretendPro 3000",
    licensesDescription:
      "Attribution and license information for the open source illustrations, icons, and libraries used to build PretendPro 3000.",
    editionTitle: {
      fruit: "PretendPro 3000 — Fruit (Mac OS X) Edition",
      apperture: "PretendPro 3000 — Apperture (Windows) Edition",
      bufferium: "PretendPro 3000 — BufferiumOS Edition",
      android: "PretendPro 3000 — Android Edition",
      fos: "PretendPro 3000 — fOS Edition",
    },
    editionDescription: {
      fruit: "Pretend to work inside a Fruit-flavored Mac OS X desktop with a dock and fake apps.",
      apperture: "Pretend to work inside an Apperture desktop with a start bar and fake apps.",
      bufferium: "Pretend to work inside a BufferiumOS shelf desktop that is eternally almost done.",
      android: "Pretend to work on an Android-style phone home screen full of useless apps.",
      fos: "Pretend to work on an fOS-style phone with a dock and a home indicator.",
    },
  },
};

const canadian: DeepPartial<Strings> = {
  onboarding: {
    questionWork: "How are you planning to pretend to work, eh?",
    subtitleWork: "We'll streamline your fake setup experience accordingly. Sorry in advance.",
    subtitleStyle: "Purely cosmetic, but we'll honour your choice.",
    start: "Start pretending, eh",
    work: {
      docufaker: {
        title: "Deep Document Work",
        description: "Type nonsense paragraphs with total conviction. Apologize after.",
      },
      browser: { title: "Research Browsing", description: "Tabs that look important. Mostly moose." },
    },
  },
  content: {
    jargon: [
      "Synergizing double-double metrics across cross-functional breakfast verticals.",
      "Leveraging Nanaimo-bar thinking to ideate poutine adjacencies.",
      "Our Q3 vibes have been quartered, stapled, and laminated for the board, eh.",
      "Circling back to the circle we circled back from yesterday. Sorry!",
      "Deep-diving into shallow pools of actionable snack insights, favourite ones.",
      "The synergy pancakes are drizzled with maple and aligned with our napping strategy.",
      "Moving the needle sideways, which is technically still moving it, buddy.",
      "Unpacking the bandwidth of the office toque ahead of the toque retro.",
      "Touching base, then tagging base, then booking a rink for a meeting about base.",
      "Operationalizing the wiggle room to maximize our pretend throughput. Sorry about that.",
      "Aligning stakeholders on the strategic direction of the hallway, eh.",
      "Right-sizing the coffee budget with aggressive pretend accounting (in loonies).",
    ],
    emailAuthors: [
      "Greg from Synergy",
      "Denise (VP of Vibes)",
      "The Printer, eh",
      "Chad from Accounts Receivable-ish",
      "Manager Bot 9000",
      "Susan in Wellness Compliance",
      "Larry, Remote (Yukon)",
    ],
    emailSubjects: [
      "URGENT: The double-doubles are misaligned",
      "Re: Re: Re: Fwd: Quick question, sorry",
      "Per my last email (all 47 of them)",
      "Quick sync?? (it will not be quick)",
      "The vibes spreadsheet is BROKEN, eh",
      "Mandatory fun scheduled for 3pm",
      "Who moved my synergy?",
      "Action required: pretend harder, please",
    ],
    stickyNote: "You're doing great, probably. Sorry.",
  },
};

const british: DeepPartial<Strings> = {
  onboarding: {
    questionWork: "How are you planning to pretend to work today?",
    subtitleWork: "We shall streamline your fake setup experience accordingly.",
    subtitleStyle: "Purely cosmetic. Like most productivity decisions, frankly.",
    start: "Right then, start pretending",
    work: {
      browser: { title: "Research Browsing", description: "Tabs that look important. Mostly a faff." },
      inbox: {
        title: "Urgent Inbox Triage",
        description: "Imaginary colleagues, imaginary deadlines.",
      },
    },
  },
  content: {
    jargon: [
      "Synergising biscuit metrics across cross-functional elevenses verticals.",
      "Leveraging crumpet-based thinking whilst ideating scone adjacencies.",
      "Our Q3 vibes have been quartered, stapled, and laminated for the board.",
      "Circling back to the circle we circled back from yesterday, cheers.",
      "Deep-diving into shallow pools of actionable biscuit insights.",
      "The synergy crumpets are aligned with our core competency of a quick sit-down.",
      "Moving the needle sideways, which is technically still moving it, to be fair.",
      "Unpacking the bandwidth of the office fern ahead of the fern retro.",
      "Touching base, then tagging base, then booking a room to discuss base.",
      "Operationalising the wiggle room to maximise our pretend throughput.",
      "Aligning stakeholders on the strategic direction of the corridor.",
      "Right-sizing the tea budget through aggressive pretend accounting.",
    ],
    emailAuthors: [
      "Greg from Synergy",
      "Denise (VP of Vibes)",
      "The Photocopier",
      "Chad from Accounts Receivable-ish",
      "Manager Bot 9000",
      "Susan in Wellbeing Compliance",
      "Larry, WFH",
    ],
    emailSubjects: [
      "URGENT: The biscuits are misaligned",
      "Re: Re: Re: Fwd: Quick question",
      "Per my last email (all 47 of them)",
      "Quick catch-up?? (it will not be quick)",
      "The vibes spreadsheet has gone POP",
      "Mandatory fun scheduled for 3pm",
      "Who moved my synergy?",
      "Action required: pretend harder, cheers",
    ],
    stickyNote: "You're doing brilliantly, probably.",
  },
};

const australian: DeepPartial<Strings> = {
  onboarding: {
    questionWork: "How are ya planning to pretend to work?",
    subtitleWork: "We'll sort your fake setup out, no worries.",
    subtitleStyle: "Purely cosmetic. She'll be right.",
    start: "Righto, start pretending",
    work: {
      browser: { title: "Research Browsing", description: "Tabs that look important. Heaps of cats." },
      inbox: { title: "Urgent Inbox Triage", description: "Imaginary colleagues, imaginary deadlines." },
    },
  },
  content: {
    jargon: [
      "Synergising sausage-sizzle metrics across cross-functional smoko verticals.",
      "Leveraging lamington-based thinking to ideate Tim Tam adjacencies.",
      "Our Q3 vibes have been quartered, stapled, and laminated for the board.",
      "Circling back this arvo to the circle we circled back from yesterday.",
      "Deep-diving into shallow pools of heaps actionable snack insights.",
      "The synergy pavlova is aligned with our core competency of a solid nap.",
      "Moving the needle sideways, which is technically still moving it, mate.",
      "Unpacking the bandwidth of the office gum tree ahead of the gum tree retro.",
      "Touching base, then tagging base, then booking a meeting about base after smoko.",
      "Operationalising the wiggle room to maximise our pretend throughput, no worries.",
      "Aligning stakeholders on the strategic direction of the hallway, easy.",
      "Right-sizing the flat white budget through aggressive pretend accounting.",
    ],
    emailAuthors: [
      "Gazza from Synergy",
      "Denise (VP of Vibes)",
      "The Printer",
      "Chad from Accounts Receivable-ish",
      "Manager Bot 9000",
      "Shazza in Wellbeing Compliance",
      "Baz, Remote",
    ],
    emailSubjects: [
      "URGENT: The sausage sizzle is misaligned",
      "Re: Re: Re: Fwd: Quick one",
      "Per my last email (all 47 of them)",
      "Quick chat this arvo?? (it will not be quick)",
      "The vibes spreadsheet is COOKED",
      "Mandatory fun scheduled for 3pm",
      "Who moved my synergy?",
      "Action required: pretend harder, legend",
    ],
    stickyNote: "You're doing great, probably. No worries.",
  },
};

const austrian: DeepPartial<Strings> = {
  onboarding: {
    questionWork: "How are you planning to pretend to work, bitte?",
    subtitleWork: "We will streamline your fake setup with Alpine efficiency.",
    subtitleStyle: "Purely cosmetic. Like most Kaffeepause decisions.",
    start: "Start pretending, servus",
    work: {
      docufaker: {
        title: "Deep Document Work",
        description: "Type nonsense Dokumente with total conviction.",
      },
      browser: { title: "Research Browsing", description: "Tabs that look important. Mostly Katzen." },
    },
  },
  content: {
    jargon: [
      "Synergizing Jause metrics across cross-functional Kaffeepause verticals.",
      "Leveraging Sachertorte-based thinking to ideate Apfelstrudel adjacencies.",
      "Our Q3 vibes have been quartered, stapled, and laminated für den Vorstand.",
      "Circling back to the circle we circled back from yesterday, oida.",
      "Deep-diving into shallow Alpine pools of actionable Schnitzel insights.",
      "The synergy Kaiserschmarrn is aligned with our core competency of napping.",
      "Moving the needle sideways, which is technically still Bewegung.",
      "Unpacking the bandwidth of the office Edelweiß ahead of the Edelweiß retro.",
      "Touching base, then tagging base, then booking a Besprechung about base.",
      "Operationalizing the Wiggle-Raum to maximize our pretend throughput.",
      "Aligning stakeholders on the strategic direction of the Gang.",
      "Right-sizing the Melange budget through aggressive pretend Buchhaltung.",
    ],
    emailAuthors: [
      "Gregor from Synergy",
      "Denise (VP of Vibes)",
      "Der Drucker",
      "Chad from Accounts Receivable-ish",
      "Manager Bot 9000",
      "Susanne in Wellness Compliance",
      "Lorenz, Remote (Tirol)",
    ],
    emailSubjects: [
      "URGENT: The Jause is misaligned",
      "Re: Re: Re: Fwd: Kurze Frage",
      "Per my last email (all 47 of them)",
      "Quick sync?? (it will not be kurz)",
      "The vibes Tabelle is BROKEN",
      "Mandatory fun scheduled for 15:00",
      "Who moved my Synergie?",
      "Action required: pretend harder, bitte",
    ],
    stickyNote: "You're doing great, wahrscheinlich.",
  },
};

const klingon: DeepPartial<Strings> = {
  onboarding: {
    headerPrefix: "taghlu' — onboarding in",
    licensesLink: "chelqa' open source (licenses)",
    stepLabel: (step) => `qaSpu' ${step} / 2`,
    questionWork: "nuqDaq Qu' DaSIQrup'a'? (which work will you pretend?)",
    questionStyle: "nuq jan DaparHa'? (which device style?)",
    subtitleWork: "batlh Qu' DaHutlh. Honour without labour.",
    subtitleStyle: "'oH Doch neH — cosmetic only.",
    recommendedHeading: "Duj Dochvam (recommended for your device)",
    desktopHeading: "raS jan (desktop styles)",
    mobileHeading: "ghopDu' jan (mobile styles)",
    continue: "ruch (continue)",
    start: "Qu' taghlu'! (start pretending)",
    back: "chegh (back)",
    fullscreenLabel: "Hoch jIH lo' (fill entire screen)",
    fullscreenHint: "(Esc — mej)",
    work: {
      docufaker: { title: "ghItlh Qu' (documents)", description: "batlh mu'mey qaS — nonsense, boldly." },
      sheets: { title: "mI' raS (spreadsheets)", description: "mI'mey Hutlh meq. Numbers without reason." },
      browser: { title: "nejwI' (browsing)", description: "vay' potlh rur. Mostly vIghro' videos." },
      inbox: { title: "QIn ghom (inbox)", description: "not real coworkers. not real deadlines." },
      codeweb: { title: "De' ngoq — Web", description: "ngoq qaS. understanding: Hutlh." },
      codegame: { title: "De' ngoq — QujmeH", description: "a loop that loops. a game, eventually." },
      deck: { title: "cha' (presentation)", description: "nagh beQmey — slides of glory." },
      reader: { title: "laD (reading)", description: "ghItlhmey potlh. laD 'ej laDqa'." },
      photos: { title: "nagh HoS (photos)", description: "sliders that slide. batlh!" },
      reels: { title: "HaSta (video)", description: "timeline vIghro'. render Qapla'." },
      sound: { title: "wab (sound)", description: "wab beQmey 'ej transport." },
    },
    styles: {
      fruit: "translucent bar, wej traffic lights.",
      apperture: "sharp corners, glyphs nIH'a'.",
      bufferium: "tab strip — reH 99%.",
      android: "home grid, wej buttons.",
      fos: "notch, dock, home indicator.",
    },
  },
  shell: {
    editionHeading: {
      fruit: "PretendPro 3000 — Fruit (Mac OS X): batlh Qu' Hutlh (fake desktop)",
      apperture: "PretendPro 3000 — Apperture (Windows): batlh Qu' Hutlh (fake desktop)",
      bufferium: "PretendPro 3000 — BufferiumOS: batlh Qu' Hutlh (fake desktop)",
      android: "PretendPro 3000 — Android: batlh Qu' Hutlh (fake phone)",
      fos: "PretendPro 3000 — fOS: batlh Qu' Hutlh (fake phone)",
    },
    switchTo: (name) => `${name} ghoS (switch to)`,
    changeStyle: "jan choH… (change style)",
    licenses: "chelqa' open source",
    launcherHint: (key) => `${key} yIqIp`,
    launcherPalette: "palette lo'",
    licenseJoke: "license Hegh — excessive pretending.",
    language: "Hol (language)",
  },
  content: {
    jargon: [
      "batlh synergy waffle metrics — Qapla'!",
      "donut ngoq vIlo' 'ej muffin adjacencies vIchenmoH.",
      "Q3 vibes vIQaw'pu'. laminated for the council.",
      "circle vIcheghqa'. today, yesterday, forever.",
      "Hoch snack insights vInej — shallow pools, deep honour.",
      "synergy pancakes 'ej naps: today is a good day to nap.",
      "needle sideways vIvo' — 'oH movement 'oH.",
      "office fern bandwidth vIpoQ. fern retro tugh.",
      "base vIHot, base vIper, base qulmey vIchenmoH.",
      "wiggle room vIlo' — pretend throughput HoS.",
      "hallway strategic direction vIjatlh. batlh!",
      "raktajino budget vIright-size. aggressive pretend accounting.",
    ],
    emailAuthors: [
      "Greg vestai-Synergy",
      "Denise (VP of Vibes)",
      "printer HoD",
      "Chad, Accounts Receivable-ish",
      "Manager Bot 9000",
      "Susan, Wellness Compliance",
      "Larry, Remote (Qo'noS)",
    ],
    emailSubjects: [
      "potlh! waffles misaligned",
      "Re: Re: Re: Fwd: qatlho'",
      "per my last QIn (47 QInmey)",
      "quick sync?? (nIt Hutlh)",
      "vibes spreadsheet ghomHa'",
      "mandatory fun — 3pm",
      "synergy vIleghbe'! who moved it?",
      "Qu': pretend harder. Qapla'!",
    ],
    emailPreviews: [
      "QIn vIngeH. top of your mirage.",
      "nIt Hutlh. I need it yesterday.",
      "calendar hold 'IMPORTANT' — acknowledge.",
      "this could have been a qulmey. it may still become one.",
      "Hoch company vIper — visibility.",
      "not urgent. flagged urgent. jIQoS!",
    ],
    formulas: [
      "=VLOOKUP(no'wI')",
      "=SUM(batlh:'ampas)",
      "=IF(jaj Qob,SaQ(),pretend())",
      "=AVERAGE(synergy)*π",
      "=raktajino(DaH)^3",
      "=PIVOT(jIH, gently)",
      "=MERGE(batlh, waffles)",
      "=HLOOKUP(Soj, hidden_drawer)",
    ],
    stickyNote: "Qapla'! you are doing great, probably.",
    progressLabel: "productivity ghoS…",
    progressHint: "99% since 2019. today is a good day to wait.",
  },
  licenses: {
    back: "onboarding chegh",
    title: "open source chelqa' (licenses)",
    intro:
      "PretendPro 3000 'oH parody 'e'. open source Qu' batlh vIlo'. below: author, license, 'ej link.",
    artwork: "nagh beQ 'ej Degh (artwork & icons)",
    libraries: "libraries",
    references: "design references",
    disclaimer:
      "PretendPro 3000 Apple, Microsoft, Google je rurbe'. affectionate parody 'oH.",
  },
  meta: {
    homeTitle: "PretendPro 3000 — batlh Qu' Hutlh (Klingon)",
    homeDescription:
      "cha' yu'meH vIjang 'ej PretendPro 3000 Qu' Hutlh vIchenmoH. Pretend productivity in Klingon.",
    licensesTitle: "open source chelqa' — PretendPro 3000",
    licensesDescription: "PretendPro 3000 open source Qu' 'ej chelqa'. Attribution in Klingon.",
  },
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function merge<T>(target: T, patch: unknown): T {
  if (!isPlainObject(patch)) return target;
  if (!isPlainObject(target)) return patch as T;
  const out: Record<string, unknown> = { ...target };
  for (const [key, value] of Object.entries(patch)) {
    if (value === undefined) continue;
    out[key] = isPlainObject(value) ? merge(out[key], value) : value;
  }
  return out as T;
}

const overrides: Record<LocaleId, DeepPartial<Strings>> = {
  "us-en": {},
  "ca-en": canadian,
  "uk-en": british,
  "au-en": australian,
  "at-en": austrian,
  tlh: klingon,
};

const cache = new Map<LocaleId, Strings>();

/** Locale strings with US English as the fallback for anything not overridden. */
export function stringsFor(locale: LocaleId): Strings {
  const cached = cache.get(locale);
  if (cached) return cached;
  const resolved = merge(base, overrides[locale]);
  cache.set(locale, resolved);
  return resolved;
}
