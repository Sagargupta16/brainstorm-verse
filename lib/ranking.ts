// "Hot" ranking, modelled on the Hacker News formula:
//   score = (upvotes + 1) / (ageHours + OFFSET) ^ GRAVITY
// The +1 lets a brand-new idea with no votes still rank by freshness, the
// offset stops a seconds-old post from dividing by ~0, and the gravity makes
// older ideas sink unless votes keep pace with their age.
export const HOT_GRAVITY = 1.8;
export const HOT_OFFSET_HOURS = 2;

const MS_PER_HOUR = 3_600_000;

export const FEED_SORTS = ["hot", "new", "top"] as const;
export type FeedSort = (typeof FEED_SORTS)[number];

export function parseFeedSort(value: string | undefined): FeedSort {
  return FEED_SORTS.find((sort) => sort === value) ?? "hot";
}

/** Reference implementation; the feed computes the same value inside MongoDB. */
export function hotScore(upvotes: number, createdAt: Date, now = new Date()) {
  const ageHours = Math.max(
    0,
    (now.getTime() - createdAt.getTime()) / MS_PER_HOUR,
  );
  return (upvotes + 1) / Math.pow(ageHours + HOT_OFFSET_HOURS, HOT_GRAVITY);
}

/** hotScore as a MongoDB aggregation expression, so sorting happens in the database. */
export function hotScoreExpression(now: Date) {
  const ageHours = {
    $max: [0, { $divide: [{ $subtract: [now, "$createdAt"] }, MS_PER_HOUR] }],
  };
  return {
    $divide: [
      { $add: [{ $ifNull: ["$upvotes", 0] }, 1] },
      { $pow: [{ $add: [ageHours, HOT_OFFSET_HOURS] }, HOT_GRAVITY] },
    ],
  };
}
