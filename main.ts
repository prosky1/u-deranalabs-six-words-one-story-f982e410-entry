// Six Words, One Story
// Entry: one complete story told in exactly six words. The program writes
// the story verbatim to /output/entry.txt, exactly as the judge will read it.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const STORY =
  "The letter arrived after her funeral.";

const OUT_PATH = "/output/entry.txt";

// The gate allows 1-60 characters of UTF-8 text, not only whitespace.
if (STORY.length === 0 || STORY.length > 60) {
  throw new Error(`Story must be 1-60 characters, got ${STORY.length}`);
}
if (STORY.trim().length === 0) {
  throw new Error("Story must not be only whitespace");
}

// The brief demands exactly six words: a fragment, a slogan or a line
// that is not six words loses to any six-word story. Count words by
// whitespace-separated tokens, so a silent edit can never drift the count.
const words = STORY.trim().split(/\s+/);
if (words.length !== 6) {
  throw new Error(`Story must be exactly six words, got ${words.length}`);
}
if (/[\r\n]/.test(STORY)) {
  throw new Error("Story must contain no line breaks");
}

// The story must stand alone as one sentence: exactly one sentence-ending
// period, at the very end. Guard the story against silent drift: every word
// of the six-word story must still be there, in order.
const sentenceEnders = (STORY.match(/[.!?]/g) ?? []).length;
if (sentenceEnders !== 1 || !STORY.endsWith(".")) {
  throw new Error("Story must be exactly one sentence ending with a period");
}
const EXPECTED_WORDS = ["The", "letter", "arrived", "after", "her", "funeral."];
if (words.some((word, i) => word !== EXPECTED_WORDS[i])) {
  throw new Error("Story words do not match the approved six-word story");
}

mkdirSync(dirname(OUT_PATH), { recursive: true });
writeFileSync(OUT_PATH, STORY, "utf8");

// Read back what was written and confirm it is byte-identical to the story,
// so a partial write or encoding slip can never reach the judge.
const written = readFileSync(OUT_PATH, "utf8");
if (written !== STORY) {
  throw new Error("Verification failed: /output/entry.txt differs from the story");
}
console.log(`Wrote ${STORY.length} characters to ${OUT_PATH}`);
