import type { BirthdayData, GeneratedContent, Personality, Relationship } from '@/lib/types';

// ─── Template Pools ─────────────────────────────────────────────────
// Each pool contains variants. The generator picks based on personality/relationship
// to create unique-feeling content without AI.

const PERSONALITY_DESCRIPTORS: Record<Personality, string[]> = {
  chaotic: [
    'Professional chaos generator.',
    'Walking plot twist.',
    'Somehow always in the middle of something.',
    'Has never once done anything the easy way.',
    'Turns every plan into an adventure by accident.',
  ],
  funny: [
    'Certified threat to public composure.',
    'Has made at least 47 people spit out their drink.',
    'Walking comedy special.',
    'Dangerously quotable.',
    'Should probably come with a warning label.',
  ],
  soft: [
    'The person everyone calls when they need to feel okay.',
    'Makes the world a little quieter just by being in it.',
    'Radiates the kind of calm people write songs about.',
    'Somehow always knows the right thing to say.',
    'The human equivalent of a warm drink.',
  ],
  adventurous: [
    'Never met a "we probably shouldn\'t" they didn\'t ignore.',
    'Has stories that sound made up but absolutely aren\'t.',
    'Treats comfort zones like suggestions.',
    'Would say yes to literally anything at 2 AM.',
    'Probably planning something right now.',
  ],
  introvert: [
    'Has a whole universe running behind those quiet moments.',
    'Thinks in paragraphs.',
    'The kind of presence that\'s felt without words.',
    'Deeply paying attention when everyone else is just talking.',
    'Understands things most people scroll past.',
  ],
  'main-character': [
    'Walks into a room and the room notices.',
    'Has protagonist energy and zero apologies about it.',
    'Living proof that some people just have it.',
    'Was born for a montage.',
    'The kind of person movies get wrong.',
  ],
  'class-clown': [
    'Has been making people laugh since approximately birth.',
    'The reason the group chat stays alive.',
    'Can find humor in literally anything.',
    'Has a joke for every situation, including this one.',
    'Professionally unserious.',
  ],
  ambitious: [
    'Has a plan, a backup plan, and a backup for the backup.',
    'Moves through the world like they have somewhere to be.',
    'Turns "what if" into "watch me."',
    'Scary focused when they want to be.',
    'Already thinking three steps ahead.',
  ],
  mysterious: [
    'Reveals just enough to make you want more.',
    'Has layers that take years to unwrap.',
    'The kind of person you can\'t quite figure out.',
    'Carries a depth most people can\'t see.',
    'Still surprising people after all this time.',
  ],
};

const RELATIONSHIP_LINES: Record<Relationship, string[]> = {
  'best-friend': [
    'The person who\'s seen every version of you and chose to stay.',
    'Your co-conspirator in everything that matters.',
    'The one who knows your order without asking.',
  ],
  friend: [
    'Someone who makes the ordinary worth remembering.',
    'The kind of friend everyone deserves but few people find.',
    'A permanent fixture in the good stories.',
  ],
  partner: [
    'Your favorite person. No competition.',
    'The one your future self thanks you for choosing.',
    'Home in human form.',
  ],
  sibling: [
    'Built-in best friend. No refunds.',
    'The one person who truly gets the family chaos.',
    'Your first friend and the last person you\'d ever let go.',
  ],
  parent: [
    'The reason any of this makes sense.',
    'The person who made you possible.',
    'Everything good about you started somewhere. It started here.',
  ],
  'someone-special': [
    'There\'s no word for what you are. Just important.',
    'The person who showed up when it actually counted.',
    'Someone the world got right.',
  ],
  other: [
    'Important. Full stop.',
    'The kind of person you don\'t forget.',
    'Someone worth celebrating.',
  ],
};

function buildObservations(data: BirthdayData): string[] {
  const { recipientName, personality, favoriteThing, relationship } = data;
  const name = recipientName.split(' ')[0];

  // Base observations derived from personality
  const personalityObs: Record<Personality, (n: string, fav: string) => string[]> = {
    chaotic: (n, fav) => [
      `Turning a 10-minute plan into a 3-hour adventure`,
      `Having an unreasonably intense relationship with ${fav}`,
      `Starting fires (metaphorical, usually)`,
      `Making questionable decisions that somehow work out`,
      `Being the reason someone said "we can never come back here"`,
    ],
    funny: (n, fav) => [
      `Making people laugh at things they probably shouldn't`,
      `Having an unhealthy obsession with ${fav}`,
      `Delivering perfect comedic timing in real life`,
      `Saying the thing everyone was thinking but no one would say`,
      `Being genuinely funny without trying (the worst kind)`,
    ],
    soft: (n, fav) => [
      `Making people feel safe without even knowing it`,
      `Caring about ${fav} a completely normal amount (debatable)`,
      `Giving advice that actually works`,
      `Remembering the small things no one else does`,
      `Being the calm in everyone else's storm`,
    ],
    adventurous: (n, fav) => [
      `Saying "let's go" before knowing where`,
      `Having a deeply personal connection with ${fav}`,
      `Collecting experiences instead of things`,
      `Having a passport that tells better stories than most people`,
      `Never running out of "that one time" stories`,
    ],
    introvert: (n, fav) => [
      `Processing the universe one quiet thought at a time`,
      `Knowing everything about ${fav} at an expert level`,
      `Having opinions so specific they become fascinating`,
      `Being the friend who shows up when it actually matters`,
      `Thinking before speaking (revolutionary behavior)`,
    ],
    'main-character': (n, fav) => [
      `Having a personal aesthetic and never breaking character`,
      `Making ${fav} look like a lifestyle`,
      `Walking in slow motion without realizing it`,
      `Having a soundtrack playing in their head at all times`,
      `Making normal activities look cinematic`,
    ],
    'class-clown': (n, fav) => [
      `Being unable to take anything seriously for more than 8 seconds`,
      `Making ${fav} somehow funnier than it should be`,
      `Having a signature move that everyone recognizes`,
      `Turning any awkward situation into a comedy bit`,
      `Being the reason everyone checks their phone for memes`,
    ],
    ambitious: (n, fav) => [
      `Turning ${fav} into a full personality trait`,
      `Making a to-do list and actually finishing it (suspicious)`,
      `Having "main character energy" in meetings`,
      `Setting a goal and making it look easy`,
      `Inspiring people while simultaneously intimidating them`,
    ],
    mysterious: (n, fav) => [
      `Knowing everything about ${fav} but telling no one`,
      `Having a vibe that people try (and fail) to replicate`,
      `Disappearing for three days and coming back with a story`,
      `Giving answers that create more questions`,
      `Being the topic of conversation when they're not there`,
    ],
  };

  const pool = personalityObs[personality](name, favoriteThing);
  // Pick 4 shuffled observations
  return shuffleAndPick(pool, 4);
}

const EMOTIONAL_TRANSITIONS: string[] = [
  'Okay. Enough nonsense.',
  'Alright, real talk for a second.',
  'One more thing. The actual important part.',
  'Now for the part that actually matters.',
  'Okay. Let\'s be serious for exactly one minute.',
];

const FINAL_LINES: Record<Personality, string[]> = {
  chaotic: [
    'Go make this year absolutely unhinged.',
    'Stay exactly this impossible to predict.',
    'Your next chapter starts now. Make it weird.',
  ],
  funny: [
    'Keep making the world funnier than it deserves.',
    'Stay exactly this ridiculous. It\'s working.',
    'Go ruin someone else\'s composure today.',
  ],
  soft: [
    'Keep being the warmth in someone\'s life.',
    'The world is better because you\'re gentle with it.',
    'Stay soft. It\'s your superpower.',
  ],
  adventurous: [
    'Go find something you\'ve never seen before.',
    'Your next adventure is already looking for you.',
    'Stay curious. Stay moving. Stay you.',
  ],
  introvert: [
    'Your quiet presence changes more than you know.',
    'Keep noticing the things no one else does.',
    'The world needs your kind of depth.',
  ],
  'main-character': [
    'Go write the next chapter. Make it dramatic.',
    'Stay impossible to look away from.',
    'Your next era starts now.',
  ],
  'class-clown': [
    'Never stop being the reason people laugh.',
    'Keep being exactly this unhinged. It\'s a gift.',
    'Go make someone spit out their drink today.',
  ],
  ambitious: [
    'Your next level is already within reach.',
    'Go make the impossible look easy. Again.',
    'Stay hungry. Stay dangerous.',
  ],
  mysterious: [
    'Keep them guessing. Keep moving.',
    'Stay exactly this unknowable.',
    'Go be the plot twist in someone\'s story.',
  ],
};

const SECRET_MESSAGES: string[] = [
  'You found the secret. You really do pay attention to everything.',
  'Hidden message unlocked: You\'re actually someone\'s favorite person.',
  'Secret discovered. You\'re nosier than they thought. They love that about you.',
  'Look at you, finding hidden things. Very on brand.',
  'You found it. This means you\'re either curious or bored. Both are valid.',
];

const FALLBACK_MESSAGES: Record<Relationship, string[]> = {
  'best-friend': [
    'You already know everything they\'d want to say. This is just proof it\'s mutual.',
    'Some people come into your life and just stay. You\'re that person.',
  ],
  friend: [
    'You matter more than you probably realize. Today is just a reminder.',
    'The world is better because you\'re in it. Simple as that.',
  ],
  partner: [
    'Every day with you is the best kind of ordinary.',
    'You are the favorite part of someone\'s every day.',
  ],
  sibling: [
    'Through every fight, every inside joke, every late night — still the first call.',
    'Being related is luck. Actually liking each other is rare.',
  ],
  parent: [
    'Everything good started with you. Today we celebrate the beginning of everything.',
    'Thank you for being the reason we\'re here. Literally.',
  ],
  'someone-special': [
    'You showed up at the right time and never left. Thank you for that.',
    'Not everyone gets someone like you. They know how lucky they are.',
  ],
  other: [
    'You are more important than you think. Today proves it.',
    'This exists because someone wanted you to know you matter.',
  ],
};

const MEMORY_INTROS: string[] = [
  'One thing they wanted you to remember…',
  'They wanted to make sure you never forget this…',
  'A moment they carry with them…',
  'Something they never want you to forget…',
];

// ─── Utility ────────────────────────────────────────────────────────

function shuffleAndPick<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function pickOne<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ─── Main Generator ─────────────────────────────────────────────────

export function generateContent(data: BirthdayData): GeneratedContent {
  const name = data.recipientName.split(' ')[0];

  const introLines = [
    `Hey, ${name}.`,
    'Someone has been planning something for you.',
    'Before you see it…',
  ];

  const personalityDescriptors = shuffleAndPick(
    PERSONALITY_DESCRIPTORS[data.personality] ?? PERSONALITY_DESCRIPTORS.chaotic,
    3
  );

  const relationshipLine = pickOne(
    RELATIONSHIP_LINES[data.relationship] ?? RELATIONSHIP_LINES.other
  );

  const observations = buildObservations(data);

  const memoryIntro = pickOne(MEMORY_INTROS);

  const emotionalTransition = pickOne(EMOTIONAL_TRANSITIONS);

  const fallbackMessage = pickOne(
    FALLBACK_MESSAGES[data.relationship] ?? FALLBACK_MESSAGES.other
  );

  const finalLine = pickOne(
    FINAL_LINES[data.personality] ?? FINAL_LINES.chaotic
  );

  const secretMessage = pickOne(SECRET_MESSAGES);

  return {
    introLines,
    observations,
    memoryIntro,
    personalityDescriptors,
    emotionalTransition,
    fallbackMessage,
    finalLine,
    secretMessage,
    relationshipLine,
  };
}
