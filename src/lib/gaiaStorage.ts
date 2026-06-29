/**
 * gaiaStorage.ts
 * Decentralized storage via Stacks Gaia — replaces Firebase for strategy history.
 * Drop-in compatible: same StrategyRecord type, same function signatures.
 */

export interface StrategyRecord {
  id: string;
  walletAddress: string;
  isPremium: boolean;
  context: {
    background: string;
    industry: string;
    goals: string;
    currentPosition: string;
  };
  strategy: Record<string, unknown>;
  createdAt: Date;
}

// ─── Serialization helpers ────────────────────────────────────────────────────

interface SerializedRecord extends Omit<StrategyRecord, 'createdAt'> {
  createdAt: string;
}

function toSerialized(r: StrategyRecord): SerializedRecord {
  return { ...r, createdAt: r.createdAt.toISOString() };
}

function fromSerialized(r: SerializedRecord): StrategyRecord {
  return { ...r, createdAt: new Date(r.createdAt) };
}

// ─── Gaia read URL (public, no auth needed) ───────────────────────────────────

const GAIA_READ_BASE = 'https://gaia.blockstack.org/hub';
const FILE_NAME = 'aetheros-strategies.json';

function gaiaReadUrl(address: string): string {
  return `${GAIA_READ_BASE}/${address}/${FILE_NAME}`;
}

// ─── Read ─────────────────────────────────────────────────────────────────────

async function readRecords(walletAddress: string): Promise<StrategyRecord[]> {
  try {
    const res = await fetch(gaiaReadUrl(walletAddress), { cache: 'no-store' });
    if (res.status === 404) return [];
    if (!res.ok) throw new Error(`Gaia read failed: ${res.status}`);
    const raw: SerializedRecord[] = await res.json();
    return raw.map(fromSerialized).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  } catch (err) {
    console.warn('[AetherOS Gaia] read error:', err);
    return [];
  }
}

// ─── Write ────────────────────────────────────────────────────────────────────

async function writeRecords(walletAddress: string, records: StrategyRecord[]): Promise<void> {
  // Dynamic import to avoid SSR issues
  const { AppConfig, UserSession } = await import('@stacks/connect');

  // Import Storage as any — @stacks/connect UserSession and @stacks/auth UserSession
  // are structurally identical at runtime but TypeScript sees them as different
  // types because they come from separate packages.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { Storage } = await import('@stacks/storage') as any;

  const appConfig = new AppConfig(['store_write', 'publish_data']);
  const userSession = new UserSession({ appConfig });

  if (!userSession.isUserSignedIn()) {
    throw new Error('Wallet not connected — cannot write to Gaia');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const storage = new Storage({ userSession: userSession as any });
  const serialized: SerializedRecord[] = records.map(toSerialized);

  await storage.putFile(FILE_NAME, JSON.stringify(serialized), {
    encrypt: false,
    dangerouslyIgnoreSigningKey: false,
  });
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function saveStrategy(
  walletAddress: string,
  isPremium: boolean,
  context: StrategyRecord['context'],
  strategy: Record<string, unknown>
): Promise<string> {
  const records = await readRecords(walletAddress);
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const newRecord: StrategyRecord = {
    id,
    walletAddress,
    isPremium,
    context,
    strategy,
    createdAt: new Date(),
  };
  const updated = [newRecord, ...records].slice(0, 50);
  await writeRecords(walletAddress, updated);
  return id;
}

export async function getStrategyHistory(walletAddress: string): Promise<StrategyRecord[]> {
  return readRecords(walletAddress);
}

export async function deleteStrategy(id: string, walletAddress: string): Promise<void> {
  const records = await readRecords(walletAddress);
  const updated = records.filter((r) => r.id !== id);
  await writeRecords(walletAddress, updated);
}
