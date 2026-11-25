import { createAvatar } from "@dicebear/core";
import { adventurer, funEmoji, micah } from "@dicebear/collection";
import { hashString } from "@/lib/hash";

// generated locally, id is `family:variant`. art ships without background, the container decides

const SIZE = { size: 128 };

export interface AvatarItem {
  id: string;
  render: () => string;
}

export interface AvatarFamily {
  id: string;
  label: string;
  items: AvatarItem[];
}

// hue and hairstyle are forced: left to the seed, DiceBear mostly outputs light-skinned feminine silhouettes
const SKIN_TONES = ["f2d3b1", "ecad80", "9e5622", "763900"];

const MASCULINE_HAIR = ["short01", "short04", "short07", "short11", "short16"] as const;
const FEMININE_HAIR = ["long03", "long08", "long12", "long16", "long20"] as const;

function adventurerItems(): AvatarItem[] {
  const items: AvatarItem[] = [];

  for (const [genderIndex, hairSet] of [MASCULINE_HAIR, FEMININE_HAIR].entries()) {
    const gender = genderIndex === 0 ? "h" : "f";

    SKIN_TONES.forEach((skin, skinIndex) => {
      const seed = `aventurier-${gender}${skinIndex}`;
      items.push({
        id: `adventurer:${gender}${skinIndex}`,
        render: () =>
          createAvatar(adventurer, {
            seed,
            ...SIZE,
            skinColor: [skin],
            hair: [hairSet[skinIndex % hairSet.length]],
            hairProbability: 100,
            // last gendered marker left in the style
            earringsProbability: gender === "h" ? 0 : 60,
          }).toDataUri(),
      });
    });
  }

  return items;
}

function seededItems(
  familyId: string,
  render: (seed: string) => string,
  seeds: string[],
): AvatarItem[] {
  return seeds.map((seed) => ({
    id: `${familyId}:${seed}`,
    render: () => render(seed),
  }));
}

const PORTRAIT_SEEDS = ["Nala", "Ibrahim", "Sofia", "Kenji", "Amara", "Léo", "Priya", "Noah"];
const EMOJI_SEEDS = ["Vega", "Lyra", "Kepler", "Atlas", "Orion", "Nova", "Rigel", "Mira"];
const ORB_SEEDS = ["Atlas", "Nova", "Orion", "Vega", "Lyra", "Kepler", "Rigel", "Mira"];

export const AVATAR_FAMILIES: AvatarFamily[] = [
  {
    id: "orbs-3d",
    label: "Avatars 3D",
    items: seededItems("orbs-3d", render3D, ORB_SEEDS),
  },
  {
    id: "adventurer",
    label: "Aventuriers",
    items: adventurerItems(),
  },
  {
    id: "micah",
    label: "Portraits",
    items: seededItems(
      "micah",
      (seed) => createAvatar(micah, { seed, ...SIZE }).toDataUri(),
      PORTRAIT_SEEDS,
    ),
  },
  {
    id: "fun-emoji",
    label: "Émojis",
    items: seededItems(
      "fun-emoji",
      (seed) => createAvatar(funEmoji, { seed, ...SIZE }).toDataUri(),
      EMOJI_SEEDS,
    ),
  },
];

const cache = new Map<string, string>();

export function avatarUri(id: string): string | undefined {
  if (!id) return undefined;

  const cached = cache.get(id);
  if (cached) return cached;

  const item = AVATAR_FAMILIES.flatMap((family) => family.items).find(
    (candidate) => candidate.id === id,
  );
  if (!item) return undefined;

  const uri = item.render();
  cache.set(id, uri);
  return uri;
}

const FACES = [
  { eyes: '<circle cx="47" cy="58" r="5.5"/><circle cx="81" cy="58" r="5.5"/>', mouth: '<path d="M50 76q14 12 28 0" fill="none" stroke-width="4.5" stroke-linecap="round"/>' },
  { eyes: '<circle cx="47" cy="58" r="5.5"/><circle cx="81" cy="58" r="5.5"/>', mouth: '<ellipse cx="64" cy="79" rx="7" ry="8"/>' },
  { eyes: '<path d="M40 60q7-9 14 0" fill="none" stroke-width="4.5" stroke-linecap="round"/><path d="M74 60q7-9 14 0" fill="none" stroke-width="4.5" stroke-linecap="round"/>', mouth: '<path d="M52 77q12 8 24 0" fill="none" stroke-width="4.5" stroke-linecap="round"/>' },
];

function render3D(seed: string): string {
  const hash = hashString(seed);
  const hue = hash % 360;
  // unsigned shift on purpose: past 2^31 `>>` makes the hash negative and the index leaves `FACES`
  const squircle = (hash >>> 8) % 2 === 0;
  const face = FACES[(hash >>> 4) % FACES.length];
  const sparkle = (hash >>> 12) % 3 === 0;

  const light = `hsl(${hue} 75% 80%)`;
  const mid = `hsl(${hue} 70% 62%)`;
  const deep = `hsl(${hue} 62% 40%)`;
  const ink = `hsl(${hue} 45% 18%)`;

  const shape = squircle
    ? `<rect x="19" y="15" width="90" height="90" rx="28" fill="url(#body-${hash})" />`
    : `<circle cx="64" cy="60" r="45" fill="url(#body-${hash})" />`;

  const sparkleMark = sparkle
    ? `<path d="M99 26l2.6 6.4 6.4 2.6-6.4 2.6-2.6 6.4-2.6-6.4-6.4-2.6 6.4-2.6z" fill="white" opacity="0.85" />`
    : "";

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
    <defs>
      <radialGradient id="body-${hash}" cx="34%" cy="28%" r="80%">
        <stop offset="0%" stop-color="${light}" />
        <stop offset="55%" stop-color="${mid}" />
        <stop offset="100%" stop-color="${deep}" />
      </radialGradient>
      <radialGradient id="shadow-${hash}" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="black" stop-opacity="0.28" />
        <stop offset="100%" stop-color="black" stop-opacity="0" />
      </radialGradient>
    </defs>
    <ellipse cx="64" cy="117" rx="32" ry="6" fill="url(#shadow-${hash})" />
    ${shape}
    <ellipse cx="47" cy="37" rx="19" ry="12" fill="white" opacity="0.32" />
    ${sparkleMark}
    <g fill="${ink}" stroke="${ink}">${face.eyes}${face.mouth}</g>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
