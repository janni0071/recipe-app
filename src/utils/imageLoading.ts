// Eager-load enough cards to cover the first screenful (roughly 2 grid rows
// on desktop, a few rows of mobile scroll) regardless of how many recipes
// exist, so the list can grow without every image loading eagerly again.
export const EAGER_CARD_COUNT = 6;
