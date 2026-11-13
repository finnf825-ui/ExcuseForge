export const TARGETS = [
  'Strict Professor/Teacher',
  'Mom/Parents',
  'Best Friend',
  'Boss/Client',
  'Girlfriend/Boyfriend',
] as const;

export type TargetOption = (typeof TARGETS)[number];

export const SITUATIONS = [
  "Didn't submit assignment/homework",
  'Late to class/meeting',
  'Forgot an important date/birthday',
  "Didn't do household chores",
  'Ghosted for 3 days',
] as const;

export type SituationOption = (typeof SITUATIONS)[number];

export type ChaosLevel = 1 | 2 | 3 | 4 | 5;

export interface ChaosMeta {
  level: ChaosLevel;
  label: string;
  shortLabel: string;
  description: string;
}

export const CHAOS_LEVELS: readonly ChaosMeta[] = [
  {
    level: 1,
    label: 'Plausible & Believable',
    shortLabel: 'Plausible',
    description: 'Low risk. Sounds almost responsible enough to actually work.',
  },
  {
    level: 2,
    label: 'Mildly Dramatic',
    shortLabel: 'Dramatic',
    description: 'Sprinkles in an unlucky plot twist without raising alarms.',
  },
  {
    level: 3,
    label: 'Suspiciously Specific',
    shortLabel: 'Specific',
    description: 'Too many hyper-detailed facts to question out loud.',
  },
  {
    level: 4,
    label: 'Unhinged Genius',
    shortLabel: 'Unhinged',
    description: 'Bold, chaotic logic that forces people to pause and blink.',
  },
  {
    level: 5,
    label: 'Sci-Fi / Aliens Involved',
    shortLabel: 'Sci-Fi Chaos',
    description: 'Quantum anomalies, rogue raccoons, or extraterrestrial intervention.',
  },
] as const;

export const LOADING_MESSAGES: readonly string[] = [
  'Calculating gravitational excuses...',
  'Consulting quantum physics...',
  'Bribing the Wi-Fi router for an alibi...',
  'Blaming solar flares on your inbox...',
  'Fabricating hyper-specific transit delays...',
  'Negotiating with parallel-universe you...',
  'Checking if Mercury is in microwave...',
];

export type ReactionType = 'genius' | 'hilarious' | 'suspicious';

export interface ReactionOption {
  id: ReactionType;
  emoji: string;
  label: string;
}

export const REACTION_OPTIONS: readonly ReactionOption[] = [
  { id: 'genius', emoji: '🔥', label: 'Genius' },
  { id: 'hilarious', emoji: '💀', label: 'Hilarious' },
  { id: 'suspicious', emoji: '🤡', label: 'Too Suspicious' },
] as const;

export function isValidTarget(value: unknown): value is TargetOption {
  return typeof value === 'string' && (TARGETS as readonly string[]).includes(value);
}

export function isValidSituation(value: unknown): value is SituationOption {
  return typeof value === 'string' && (SITUATIONS as readonly string[]).includes(value);
}

export function clampChaosLevel(value: unknown): ChaosLevel {
  const num = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(num)) {
    return 3;
  }
  const rounded = Math.round(num);
  if (rounded <= 1) return 1;
  if (rounded >= 5) return 5;
  return rounded as ChaosLevel;
}

export function getChaosMeta(level: ChaosLevel): ChaosMeta {
  return CHAOS_LEVELS[level - 1] ?? CHAOS_LEVELS[2];
}

export function pickNextLoadingMessage(previousIndex = -1): { message: string; index: number } {
  if (LOADING_MESSAGES.length <= 1) {
    return { message: LOADING_MESSAGES[0] ?? 'Generating excuse...', index: 0 };
  }
  const offset = 1 + Math.floor(Math.random() * (LOADING_MESSAGES.length - 1));
  const index = previousIndex < 0
    ? Math.floor(Math.random() * LOADING_MESSAGES.length)
    : (previousIndex + offset) % LOADING_MESSAGES.length;
  return {
    message: LOADING_MESSAGES[index],
    index,
  };
}

export function buildGeminiPrompt(
  target: TargetOption,
  situation: SituationOption,
  chaosLevel: ChaosLevel
): string {
  const meta = getChaosMeta(chaosLevel);
  return [
    `Generate ONE original, punchy, hilarious first-person excuse ready to send directly to the recipient.`,
    `Recipient (Target): ${target}`,
    `What happened (Situation): ${situation}`,
    `Chaos Level: ${chaosLevel}/5 (${meta.label} — ${meta.description})`,
    `Tone rules:`,
    `- Level 1 must sound genuinely believable, polite, and plausible.`,
    `- Level 2 adds a mildly dramatic everyday mishap.`,
    `- Level 3 adds weirdly specific, overly detailed circumstances that make it funny.`,
    `- Level 4 uses unhinged, confident procrastinator logic.`,
    `- Level 5 goes full sci-fi/absurdist (aliens, time dilation, rogue AI, wormholes, secret agents).`,
    `Output requirements:`,
    `- Return ONLY the excuse text itself (2 to 4 sentences max).`,
    `- Do NOT include quotation marks around the whole response, labels, preambles, or hashtags.`,
  ].join('\n');
}

const TARGET_OPENERS: Record<TargetOption, Record<ChaosLevel, readonly string[]>> = {
  'Strict Professor/Teacher': {
    1: ['I sincerely apologize for the delay, Professor.', 'I wanted to reach out right away regarding the class deadline.'],
    2: ['Professor, I promise this is not my usual standard, and I have screenshots.', 'I owe you an honest explanation before you look at the portal, Professor.'],
    3: ['Professor, please hear me out before checking the timestamp.', 'I know how this looks on Canvas, Professor, so here is the exact chain of events.'],
    4: ['Professor, technically my brain operated in a different fiscal quarter last night.', 'Before you deduct points, Professor, consider that even Newton needed an apple to fall first.'],
    5: ['Professor, I have a peer-reviewed explanation involving localized temporal interference.', 'You are going to want to sit down for this academic update, Professor.'],
  },
  'Mom/Parents': {
    1: ['Hey Mom, sorry I dropped the ball on this.', 'I meant to handle this earlier and totally misjudged my schedule today.'],
    2: ['Mom, do not panic, everything is fine now, I just hit a bizarre snag.', 'Okay, before you give me the disappointed sigh, hear what happened first.'],
    3: ['Mom, I swear I had a reminder set, but a sequence of hyper-specific household events ambushed me.', 'Look, I love you, and my only defense is a 47-minute detour that defied common sense.'],
    4: ['Mom, in my defense, I was protecting the family peace through strategic stillness.', 'Wait before you ground my soul—I was conducting crucial research on why humans procrastinate.'],
    5: ['Mom, I cannot disclose the full details without violating an NDA with the Galactic Council.', 'Okay, hear me out: an unidentified orb hovered over the driveway and scrambled my calendar app.'],
  },
  'Best Friend': {
    1: ['Bro, I am so sorry, today completely snowballed on me.', 'Okay I messed up—my entire afternoon went off the rails.'],
    2: ['Bestie, do not murder me yet because the lore behind this is actually tragic.', 'I know I look terrible right now, but wait until you hear the clownery that trapped me.'],
    3: ['Listen, I was literally holding my shoes when a neighbor’s runaway Roomba started an international incident.', 'Bro, I would have been there, except I got locked in a philosophical standoff with a vending machine.'],
    4: ['Look, my aura entered airplane mode and refused to reconnect to society.', 'Bestie, my last two brain cells went on strike for better snacks and I had to negotiate.'],
    5: ['Dude, a UFO beamed up my Wi-Fi router specifically to keep me from replying to you.', 'Okay do not freak out, but a time-traveling version of me warned me not to move for 72 hours.'],
  },
  'Boss/Client': {
    1: ['Apologies for the inconvenience—I ran into an unexpected technical bottleneck this morning.', 'Thank you for your patience; I encountered an unforeseen delay and am resolving it now.'],
    2: ['I apologize for the holdup; my workstation decided to run a mandatory firmware update at the worst possible second.', 'Sorry for the delay—a sudden transit snarl and a dead laptop battery teamed up against me.'],
    3: ['I owe you a transparent update: a municipal pigeon knocked out the fiber junction box outside my building at 8:42 AM.', 'Apologies for the timing—my calendar synced to Reykjavik time after a VPN glitch and threw off my morning.'],
    4: ['To ensure peak deliverable synergy, I temporarily decoupled from linear time and underestimated the reentry window.', 'Apologies for the delay—I was stress-testing our disaster recovery plan by accidentally living through one.'],
    5: ['Full transparency: an extraterrestrial probe mistook my laptop charger for a beacon and caused a brief quantum outage.', 'Apologies for the holdup—a rogue satellite briefly hijacked my Smart Fridge, my router, and my sense of chronology.'],
  },
  'Girlfriend/Boyfriend': {
    1: ['Babe, I am genuinely sorry—I completely lost track of time and hate that I let you down.', 'I messed up and I am so sorry; my day got flipped upside down and I should have texted sooner.'],
    2: ['Baby, please do not be mad—I was rushing to pull everything together and got hit with the dumbest streak of bad luck.', 'Okay, I know I am in the doghouse, so let me explain what went wrong before I bring snacks.'],
    3: ['Babe, I literally had the reminder pinned, then got trapped helping an elderly neighbor chase a tuxedo cat out of a flowerbed.', 'Listen, my love, I tried to leave on time, but my keys fell behind a radiator that required two coat hangers and a prayer.'],
    4: ['Babe, I was actually trying to surprise you with extreme mystery and accidentally overcommitted to the bit.', 'Hear me out: I got emotionally stunned thinking about how lucky I am to have you and lost three days to daydreaming.'],
    5: ['Babe, I swear on my heart—aliens abducted my phone specifically because they were jealous of our relationship.', 'Okay, wild story: a wormhole opened inside the laundry basket and swallowed my Tuesday through Thursday.'],
  },
};

const SITUATION_BODIES: Record<SituationOption, Record<ChaosLevel, readonly string[]>> = {
  "Didn't submit assignment/homework": {
    1: [
      'My cloud folder failed to sync before the portal closed, so the draft sat in local storage waiting for a connection.',
      'I exported the final PDF right before midnight, only to realize this morning that the upload never confirmed on the submission tab.',
    ],
    2: [
      'My laptop crashed right as I clicked submit, then insisted on a 40-minute update while I stared at the spinning wheel in pure despair.',
      'I finished the whole thing on time, accidentally uploaded my grocery list instead, and only noticed when I reopened the folder.',
    ],
    3: [
      'A raccoon chewed through the outdoor cable line at 11:54 PM, forcing me to hotspot from my kitchen windowsill until the battery hit 1%.',
      'I named the file "Final_FINAL_v3_ACTUALLY_DONE.pdf" and somehow confused my own browser into caching a blank template.',
    ],
    4: [
      'My essay achieved sentience around 2 AM, realized it deserved a higher word count, and encrypted itself out of artistic pride.',
      'I submitted the assignment via telepathic intent because my keyboard only typed Wingdings after I spilled sparkling water on the shift key.',
    ],
    5: [
      'An extraterrestrial peer-reviewer intercepted my Wi-Fi packet mid-upload to verify my citations on dark matter.',
      'A localized gravitational anomaly compressed midnight into 0.4 seconds, erasing the submission window before photons could leave my screen.',
    ],
  },
  'Late to class/meeting': {
    1: [
      'An unexpected road closure rerouted my entire commute, adding twenty-five minutes to a trip that normally takes ten.',
      'My morning alarm failed to sound after an overnight phone restart, and I sprinted out the door the instant I woke up.',
    ],
    2: [
      'My bus driver pulled over for an emergency duck crossing on the boulevard and we all agreed not to rush nature.',
      'I locked my keys inside the apartment while taking out the trash in mismatched socks and had to negotiate with a spare key under a flowerpot.',
    ],
    3: [
      'I got stuck behind a slow-moving parade of electric scooters carrying an unsecured sheet cake and could not safely pass for twelve blocks.',
      'My elevator stopped on floor three for nineteen minutes while someone’s golden retriever refused to step past a shiny floor tile.',
    ],
    4: [
      'I arrived early in spirit, took a power blink at 8:15 AM, and somehow woke up in a slightly later timeline.',
      'My GPS insisted on taking the scenic route through my own existential dread before recalculating to the front door.',
    ],
    5: [
      'A minor time-dilation rift opened on the crosswalk, turning a three-minute walk into a 42-minute relativistic detour.',
      'Mothership traffic control held my street in a tractor beam while calibrating their abduction radius.',
    ],
  },
  'Forgot an important date/birthday': {
    1: [
      'I had it marked on next week’s page by mistake, and I feel awful because I genuinely wanted to celebrate properly.',
      'Work and family deadlines piled up so fast this week that the date slipped straight past me without a single alert going off.',
    ],
    2: [
      'My calendar app silently logged me out after an update, wiping every recurring birthday notification I swore was locked in.',
      'I bought the card early, hid it so well I outsmarted myself, and lost track of the actual day while tearing apart my desk.',
    ],
    3: [
      'I set three reminders labeled "BIG DAY DO NOT FORGET" without writing whose day it was, so I spent all Tuesday congratulating my barista.',
      'My phone switched itself to 2027 after a weird timezone bug and convinced me I still had twelve days to plan something iconic.',
    ],
    4: [
      'Time is a social construct, so technically I am celebrating you 364 days early for next year with maximum enthusiasm.',
      'I deliberately skipped the standard day to protest Hallmark’s monopoly on affection and launch an unscheduled surprise week instead.',
    ],
    5: [
      'A solar storm selectively wiped the exact 24-hour block from Earth’s digital calendars—and my cerebral cortex.',
      'Aliens borrowed me for a quick lunar focus group and dropped me back off after the cake was already cut.',
    ],
  },
  "Didn't do household chores": {
    1: [
      'I ran out of cleaning supplies halfway through and got stuck on an errand run before I could finish the rest of the list.',
      'I got pulled into an urgent task right when I was about to start, and the evening vanished before I got back to the kitchen.',
    ],
    2: [
      'The vacuum cleaner made a sound like a jet engine about to achieve lift-off, so I paused for household safety.',
      'I soaked one pan so it would be easier to scrub, blinked, and somehow the sink evolved into a modern art installation.',
    ],
    3: [
      'I started folding laundry, found an old jacket pocket receipt from 2022, and spiraled into organizing three years of nostalgia instead of sweeping.',
      'A very polite spider set up camp right next to the dish soap and I spent two hours drafting an eviction notice.',
    ],
    4: [
      'I left the dishes untouched to cultivate beneficial probiotic grit and keep the kitchen floor humble.',
      'My mop unionized with the broom at 4 PM and demanded better working conditions before touching a single crumb.',
    ],
    5: [
      'Gravity temporarily reversed in the living room, so I left the clutter pinned to the ceiling until NASA gave the all-clear.',
      'A miniature black hole formed inside the laundry hamper and swallowed every matching sock before I could fold them.',
    ],
  },
  'Ghosted for 3 days': {
    1: [
      'My phone screen died unexpectedly and I had no backup device until the repair shop got the replacement part in today.',
      'I hit a brutal wall of burnout and slept through half the weekend with my notifications muted without realizing how many days passed.',
    ],
    2: [
      'I read your message in the shower, mentally typed a whole paragraph back, and genuinely thought I hit send until five minutes ago.',
      'My charger broke right before a hectic three-day stretch and every outlet near me felt purely decorative.',
    ],
    3: [
      'I put my phone on Do Not Disturb to survive one 90-minute focus session and forgot to toggle it off for 72 straight hours.',
      'My cat stepped on my keyboard, archived every active chat thread, and looked me dead in the eye while I assumed everyone was just busy.',
    ],
    4: [
      'I went on a sudden silent monk arc to recharge my charisma stat, completely forgetting that humans still use text messages.',
      'I typed out four separate replies, critiqued my own punctuation, and entered a three-day editing spiral.',
    ],
    5: [
      'My phone fell into a quantum pocket dimension between the couch cushions and only materialized after three planetary rotations.',
      'Extraterrestrials confiscated my SIM card because my group chat memes were disrupting deep-space radar.',
    ],
  },
};

const TARGET_CLOSERS: Record<TargetOption, Record<ChaosLevel, readonly string[]>> = {
  'Strict Professor/Teacher': {
    1: ['I have the completed work ready to upload right now if you are willing to accept it.'],
    2: ['I can send over the timestamped draft and file metadata immediately.'],
    3: ['I already documented the whole incident with screenshots for your academic amusement.'],
    4: ['Hopefully you can award partial credit for creative survival under pressure.'],
    5: ['I am ready to submit now—assuming the campus router is free of cosmic interference.'],
  },
  'Mom/Parents': {
    1: ['I am fixing it right now and promise not to let it happen again.'],
    2: ['I am already making up for it, so please keep dinner warm.'],
    3: ['I owe you an extra coffee run this week as an official peace offering.'],
    4: ['Honestly, you raised a problem-solver, and that problem is almost solved.'],
    5: ['Anyway, I survived contact with the unknown and I am finally back on Earth.'],
  },
  'Best Friend': {
    1: ['I owe you iced coffee and full apologies immediately.'],
    2: ['Forgive me and let me buy the next round of snacks so we can laugh about this.'],
    3: ['Bring snacks because I have photographic evidence and zero dignity left.'],
    4: ['Just be glad I returned from the void with both shoes still matching.'],
    5: ['Anyway, the mothership dropped me off near Taco Bell—want anything?'],
  },
  'Boss/Client': {
    1: ['I am prioritizing this right now and will have everything in your inbox shortly.'],
    2: ['Everything is back online now, and you will have the complete update within the hour.'],
    3: ['I have added triple redundancy to my setup so this freak sequence never repeats.'],
    4: ['Moving forward, my calendar and I are entering an aggressive accountability era.'],
    5: ['If the aliens return for a follow-up, I will put you on the calendar invite first.'],
  },
  'Girlfriend/Boyfriend': {
    1: ['Let me make it up to you tonight with your favorite dinner—no excuses this time.'],
    2: ['I am bringing your favorite takeout right now as an official peace treaty.'],
    3: ['Please accept this embarrassing truth plus unlimited forehead kisses as compensation.'],
    4: ['Clearly the universe just wanted me to appreciate you even harder today.'],
    5: ['Next time the UFO shows up, I am demanding a plus-one ticket for you too.'],
  },
};

export function generateFallbackExcuse(
  target: TargetOption,
  situation: SituationOption,
  chaosLevel: ChaosLevel,
  seed?: number
): string {
  const openers = TARGET_OPENERS[target][chaosLevel];
  const bodies = SITUATION_BODIES[situation][chaosLevel];
  const closers = TARGET_CLOSERS[target][chaosLevel];

  const pick = <T,>(arr: readonly T[], offset: number): T => {
    if (seed !== undefined && Number.isFinite(seed)) {
      const idx = Math.abs(Math.floor(seed) + offset) % arr.length;
      return arr[idx];
    }
    return arr[Math.floor(Math.random() * arr.length)];
  };

  const opener = pick(openers, 0);
  const body = pick(bodies, 1);
  const closer = pick(closers, 2);

  return `${opener} ${body} ${closer}`;
}

export function formatExcuseForCopy(excuse: string): string {
  return excuse.trim();
}
