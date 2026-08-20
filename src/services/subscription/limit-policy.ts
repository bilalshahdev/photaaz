export function assertCanCreateWithinLimit(
  currentCount: number,
  limit: number | null | undefined,
  label: string,
) {
  assertNonNegativeCount(currentCount);
  if (limit == null) return;
  if (currentCount >= limit) throw limitError(limit, label);
}

export function assertResultingCountWithinLimit(
  nextCount: number,
  limit: number | null | undefined,
  label: string,
) {
  assertNonNegativeCount(nextCount);
  if (limit == null) return;
  if (nextCount > limit) throw limitError(limit, label);
}

export function canCreateWithinLimit(
  currentCount: number,
  limit: number | null | undefined,
) {
  assertNonNegativeCount(currentCount);
  return limit == null || currentCount < limit;
}

function assertNonNegativeCount(count: number) {
  if (!Number.isInteger(count) || count < 0) {
    throw new Error("Limit counts must be non-negative integers.");
  }
}

function limitError(limit: number, label: string) {
  return new Error(
    `Your plan allows ${limit} ${label}${limit === 1 ? "" : "s"}. Upgrade or contact support to increase this limit.`,
  );
}
