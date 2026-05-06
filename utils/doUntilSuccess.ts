import { sleepMs } from "./sleep.ts";

const countsStarted = new Set<string>();

interface Options {
  description?: string;
  /** Defoults to `0` */
  retryAfterMs?: number;
}

/**
 * @param timeout In milliseconds
 */
export default async function doUntilSuccess<T>(
  fn: () => Promise<T> | T,
  timeout: number | null = null,
  { description, retryAfterMs }: Options = {},
): Promise<T> {
  const timeoutDate = timeout === null ? Infinity : Date.now() + timeout;
  if (description && countsStarted.has(description)) console.countReset(description);

  let i = 1;
  while (true)
    try {
      if (description && i > 1) {
        // If i is 2, count the one from i === 1
        if (i === 2) console.count(description);
        console.count(description);
        countsStarted.add(description);
      }
      i++;
      return await fn();
    } catch (e) {
      if (Date.now() >= timeoutDate) throw e;
      if (retryAfterMs !== undefined) await sleepMs(retryAfterMs);
      continue;
    }
}
