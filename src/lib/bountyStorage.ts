/** Gaia-first storage for Warm Intro Bounties. Creator-funded rewards; platform never funds rewards. */
export type SubmissionStatus = 'pending' | 'approved' | 'rejected';
export type BountyStatus = 'open' | 'approved' | 'closed';

export interface BountySubmission {
  id: string;
  contributor: string;
  proof: string;
  note: string;
  createdAt: string;
  status: SubmissionStatus;
}

export interface WarmIntroBounty {
  id: string;
  creator: string;
  targetName: string;
  targetRole: string;
  rewardSbtc: string;
  successCriteria: string;
  status: BountyStatus;
  createdAt: string;
  submissions: BountySubmission[];
  escrowTxId?: string;
}

const FILE_NAME = 'aetheros-bounties.json';
const GAIA_READ_BASE = 'https://gaia.blockstack.org/hub';
const FALLBACK_KEY = 'aetheros:bounties:fallback';

export function bountyGaiaUrl(address: string) {
  return `${GAIA_READ_BASE}/${address}/${FILE_NAME}`;
}

async function getStorage() {
  const { AppConfig, UserSession } = await import('@stacks/connect');
  const { Storage } = await import('@stacks/storage');
  const appConfig = new AppConfig(['store_write', 'publish_data']);
  const userSession = new UserSession({ appConfig });
  if (!userSession.isUserSignedIn()) return null;
  return new Storage({ userSession: userSession as any });
}

export async function loadBounties(ownerAddress?: string): Promise<WarmIntroBounty[]> {
  if (ownerAddress) {
    try {
      const res = await fetch(bountyGaiaUrl(ownerAddress), { cache: 'no-store' });
      if (res.ok) return await res.json();
    } catch {}
  }
  if (typeof window !== 'undefined') {
    try { return JSON.parse(localStorage.getItem(FALLBACK_KEY) || '[]'); } catch {}
  }
  return [];
}

export async function saveBounties(bounties: WarmIntroBounty[]): Promise<{ mode: 'gaia' | 'fallback' }> {
  try {
    const storage = await getStorage();
    if (storage) {
      await storage.putFile(FILE_NAME, JSON.stringify(bounties, null, 2), { encrypt: false });
      return { mode: 'gaia' };
    }
  } catch (err) {
    console.warn('[AetherOS] Gaia bounty save failed; fallback used', err);
  }
  if (typeof window !== 'undefined') localStorage.setItem(FALLBACK_KEY, JSON.stringify(bounties));
  return { mode: 'fallback' };
}
