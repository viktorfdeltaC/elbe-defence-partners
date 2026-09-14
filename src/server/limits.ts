/**
 * How often the contact form may be used, held in memory.
 *
 * That is enough because the site runs as one Node process on one server; it
 * would not be on a platform that spreads requests over many instances.
 *
 * Nothing is kept in the clear. IP and email addresses go in as salted hashes,
 * and the salt is drawn fresh at every start and never leaves the process — so
 * the entries cannot be read back, and they vanish with a restart at the latest.
 * The privacy policy says exactly this; change the two together.
 */
import { createHash, randomBytes } from 'node:crypto';

const SALT = randomBytes(16);
const hash = (value: string) => createHash('sha256').update(SALT).update(value.toLowerCase()).digest('base64url');

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;

const windows: SlidingWindow[] = [];

class SlidingWindow {
  private readonly hits = new Map<string, number[]>();

  constructor(
    private readonly limit: number,
    private readonly windowMs: number,
  ) {
    windows.push(this);
  }

  /** Counts one use and says whether it was still within the limit. */
  take(value: string, now = Date.now()): boolean {
    const key = hash(value);
    const recent = (this.hits.get(key) ?? []).filter((t) => now - t < this.windowMs);
    const allowed = recent.length < this.limit;
    if (allowed) recent.push(now);
    this.hits.set(key, recent);
    return allowed;
  }

  prune(now: number) {
    for (const [key, times] of this.hits) {
      const recent = times.filter((t) => now - t < this.windowMs);
      if (recent.length) this.hits.set(key, recent);
      else this.hits.delete(key);
    }
  }
}

// Expired entries go every minute, so nothing outlives its window by more than
// that — the privacy policy promises a day at most. unref(): the timer alone
// does not keep the process alive.
setInterval(() => {
  const now = Date.now();
  for (const w of windows) w.prune(now);
}, MINUTE).unref();

/** Submissions from one IP address: generous for a person, tight for a script. */
export const perIp = new SlidingWindow(6, 10 * MINUTE);

/**
 * Confirmations to one address. The address is not verified — anyone can type
 * someone else's — so it gets one confirmation a day at most. The team still
 * receives every enquiry.
 */
export const perRecipient = new SlidingWindow(1, 24 * HOUR);

/** Confirmations in total, to keep the mailbox's sending quota out of reach. */
export const allConfirmations = new SlidingWindow(30, HOUR);
