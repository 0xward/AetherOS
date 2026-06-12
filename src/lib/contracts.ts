import {
  callReadOnlyFunction,
  cvToValue,
  principalCV,
  uintCV,
  stringUtf8CV,
  boolCV,
  AnchorMode,
  PostConditionMode,
} from '@stacks/transactions';
import { StacksMainnet } from '@stacks/network';

const NETWORK = new StacksMainnet();

const TOKEN_CONTRACT = {
  address: 'SPQ189E66S20X7ATY7794HBY6743JE9YJMCKHAEF',
  name: 'AetherOS',
} as const;

const STAKING_CONTRACT = {
  address: 'SPQ189E66S20X7ATY7794HBY6743JE9YJMCKHAEF',
  name: 'aetheros-staking',
} as const;

// Safely convert any Clarity value to a plain JS number.
// cvToValue can return bigint, string, number, or a wrapped { value } object.
function toNum(raw: unknown): number {
  if (raw === null || raw === undefined) return 0;
  // Unwrap { value: ... } wrapper that cvToValue sometimes produces
  if (typeof raw === 'object' && raw !== null && 'value' in raw) {
    return toNum((raw as { value: unknown }).value);
  }
  if (typeof raw === 'bigint') return Number(raw);
  if (typeof raw === 'number') return raw;
  if (typeof raw === 'string') return parseInt(raw, 10) || 0;
  return 0;
}

// Safely convert any Clarity value to a plain JS string.
// cvToValue can return a plain string, or a wrapped { type, value } object
// (this happens for tuple fields, where cvToJSON is used internally).
function toStr(raw: unknown): string {
  if (raw === null || raw === undefined) return '';
  // Unwrap { value: ... } wrapper that cvToValue sometimes produces
  if (typeof raw === 'object' && raw !== null && 'value' in raw) {
    return toStr((raw as { value: unknown }).value);
  }
  if (typeof raw === 'string') return raw;
  return String(raw);
}

// Safely convert any Clarity value to a plain JS boolean.
// Tuple fields of type bool come back as { type: 'bool', value: true|false },
// and Boolean(...) on that object would always be true — so unwrap first.
function toBool(raw: unknown): boolean {
  if (raw === null || raw === undefined) return false;
  if (typeof raw === 'object' && raw !== null && 'value' in raw) {
    return toBool((raw as { value: unknown }).value);
  }
  if (typeof raw === 'boolean') return raw;
  if (typeof raw === 'string') return raw === 'true';
  return Boolean(raw);
}

// Unwrap (ok value) or (some value) from Clarity response
function unwrap(val: unknown): unknown {
  if (val === null || val === undefined) return null;
  if (typeof val === 'object' && val !== null) {
    const v = val as Record<string, unknown>;
    // Clarity string types: { type: 'string-utf8'|'string-ascii', value: '...' }
    if (typeof v.type === 'string' && (v.type.includes('string') || v.type === 'principal') && 'value' in v) {
      return v.value;
    }
    // (ok x) → { type: 'ok', value: x } or { ok: x }
    if ('value' in v) return unwrap(v.value);
    if ('ok' in v) return unwrap(v.ok);
    if ('some' in v) return unwrap(v.some);
  }
  return val;
}

// ─── TOKEN ───────────────────────────────────────────────

export async function getTokenBalance(walletAddress: string): Promise<number> {
  try {
    const result = await callReadOnlyFunction({
      contractAddress: TOKEN_CONTRACT.address,
      contractName: TOKEN_CONTRACT.name,
      functionName: 'get-balance',
      functionArgs: [principalCV(walletAddress)],
      network: NETWORK,
      senderAddress: walletAddress,
    });
    return toNum(unwrap(cvToValue(result)));
  } catch {
    return 0;
  }
}

// ─── STAKING ─────────────────────────────────────────────

export async function getStakeInfo(walletAddress: string): Promise<{
  amount: number;
  stakedAt: number;
  lastClaim: number;
} | null> {
  try {
    const result = await callReadOnlyFunction({
      contractAddress: STAKING_CONTRACT.address,
      contractName: STAKING_CONTRACT.name,
      functionName: 'get-stake',
      functionArgs: [principalCV(walletAddress)],
      network: NETWORK,
      senderAddress: walletAddress,
    });
    const raw = cvToValue(result);
    // get-stake returns (optional { amount, staked-at, last-claim })
    // cvToValue wraps optional as { type: 'some'|'none', value: ... }
    const val = unwrap(raw) as Record<string, unknown> | null;
    if (!val || typeof val !== 'object') return null;
    const amount = toNum(val.amount ?? val['amount']);
    const stakedAt = toNum(val['staked-at'] ?? val.stakedAt);
    const lastClaim = toNum(val['last-claim'] ?? val.lastClaim);
    if (amount === 0 && stakedAt === 0) return null;
    return { amount, stakedAt, lastClaim };
  } catch {
    return null;
  }
}

export async function getPendingReward(walletAddress: string): Promise<number> {
  try {
    const result = await callReadOnlyFunction({
      contractAddress: STAKING_CONTRACT.address,
      contractName: STAKING_CONTRACT.name,
      functionName: 'get-pending-reward',
      functionArgs: [principalCV(walletAddress)],
      network: NETWORK,
      senderAddress: walletAddress,
    });
    return toNum(unwrap(cvToValue(result)));
  } catch {
    return 0;
  }
}

export async function getTotalStaked(): Promise<number> {
  try {
    const result = await callReadOnlyFunction({
      contractAddress: STAKING_CONTRACT.address,
      contractName: STAKING_CONTRACT.name,
      functionName: 'get-total-staked',
      functionArgs: [],
      network: NETWORK,
      senderAddress: STAKING_CONTRACT.address,
    });
    return toNum(unwrap(cvToValue(result)));
  } catch {
    return 0;
  }
}

export async function getRewardPool(): Promise<number> {
  try {
    const result = await callReadOnlyFunction({
      contractAddress: STAKING_CONTRACT.address,
      contractName: STAKING_CONTRACT.name,
      functionName: 'get-reward-pool',
      functionArgs: [],
      network: NETWORK,
      senderAddress: STAKING_CONTRACT.address,
    });
    return toNum(unwrap(cvToValue(result)));
  } catch {
    return 0;
  }
}

export async function isPremiumEligible(walletAddress: string): Promise<boolean> {
  try {
    const result = await callReadOnlyFunction({
      contractAddress: STAKING_CONTRACT.address,
      contractName: STAKING_CONTRACT.name,
      functionName: 'is-premium-eligible',
      functionArgs: [principalCV(walletAddress)],
      network: NETWORK,
      senderAddress: walletAddress,
    });
    const val = unwrap(cvToValue(result));
    // Clarity true = boolean true or the string 'true'
    if (typeof val === 'boolean') return val;
    if (typeof val === 'string') return val === 'true';
    return false;
  } catch {
    return false;
  }
}

// ─── GOVERNANCE ──────────────────────────────────────────

export interface Proposal {
  id: number;
  title: string;
  description: string;
  proposer: string;
  votesFor: number;
  votesAgainst: number;
  createdAt: number;
  endsAt: number;
  executed: boolean;
  passed: boolean;
}

export async function getProposal(proposalId: number, senderAddress: string): Promise<Proposal | null> {
  try {
    const result = await callReadOnlyFunction({
      contractAddress: STAKING_CONTRACT.address,
      contractName: STAKING_CONTRACT.name,
      functionName: 'get-proposal',
      functionArgs: [uintCV(proposalId)],
      network: NETWORK,
      senderAddress,
    });
    const raw = cvToValue(result);
    const val = unwrap(raw) as Record<string, unknown> | null;
    if (!val || typeof val !== 'object') return null;
    return {
      id: toNum(val.id),
      title: toStr(val.title),
      description: toStr(val.description),
      proposer: toStr(val.proposer),
      votesFor: toNum(val['votes-for'] ?? val.votesFor),
      votesAgainst: toNum(val['votes-against'] ?? val.votesAgainst),
      createdAt: toNum(val['created-at'] ?? val.createdAt),
      endsAt: toNum(val['ends-at'] ?? val.endsAt),
      executed: toBool(val.executed),
      passed: toBool(val.passed),
    };
  } catch {
    return null;
  }
}

export async function getProposalCount(senderAddress: string): Promise<number> {
  try {
    const result = await callReadOnlyFunction({
      contractAddress: STAKING_CONTRACT.address,
      contractName: STAKING_CONTRACT.name,
      functionName: 'get-proposal-count',
      functionArgs: [],
      network: NETWORK,
      senderAddress,
    });
    return toNum(unwrap(cvToValue(result)));
  } catch {
    return 0;
  }
}

export async function hasVoted(proposalId: number, voter: string): Promise<boolean> {
  try {
    const result = await callReadOnlyFunction({
      contractAddress: STAKING_CONTRACT.address,
      contractName: STAKING_CONTRACT.name,
      functionName: 'has-voted',
      functionArgs: [uintCV(proposalId), principalCV(voter)],
      network: NETWORK,
      senderAddress: voter,
    });
    const val = unwrap(cvToValue(result));
    if (typeof val === 'boolean') return val;
    if (typeof val === 'string') return val === 'true';
    return false;
  } catch {
    return false;
  }
}

export async function getVotingPower(walletAddress: string): Promise<number> {
  try {
    const result = await callReadOnlyFunction({
      contractAddress: STAKING_CONTRACT.address,
      contractName: STAKING_CONTRACT.name,
      functionName: 'get-voting-power',
      functionArgs: [principalCV(walletAddress)],
      network: NETWORK,
      senderAddress: walletAddress,
    });
    return toNum(unwrap(cvToValue(result)));
  } catch {
    return 0;
  }
}

// ─── WRITE TRANSACTIONS ──────────────────────────────────

export function buildStakeTx(amount: number): Record<string, unknown> {
  return {
    contractAddress: STAKING_CONTRACT.address,
    contractName: STAKING_CONTRACT.name,
    functionName: 'stake',
    functionArgs: [
      principalCV(`${TOKEN_CONTRACT.address}.${TOKEN_CONTRACT.name}`),
      uintCV(amount),
    ],
    network: NETWORK,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
  };
}

export function buildUnstakeTx(amount: number): Record<string, unknown> {
  return {
    contractAddress: STAKING_CONTRACT.address,
    contractName: STAKING_CONTRACT.name,
    functionName: 'unstake',
    functionArgs: [
      principalCV(`${TOKEN_CONTRACT.address}.${TOKEN_CONTRACT.name}`),
      uintCV(amount),
    ],
    network: NETWORK,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
  };
}

export function buildClaimRewardTx(): Record<string, unknown> {
  return {
    contractAddress: STAKING_CONTRACT.address,
    contractName: STAKING_CONTRACT.name,
    functionName: 'claim-reward',
    functionArgs: [
      principalCV(`${TOKEN_CONTRACT.address}.${TOKEN_CONTRACT.name}`),
    ],
    network: NETWORK,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
  };
}

export function buildCreateProposalTx(title: string, description: string): Record<string, unknown> {
  return {
    contractAddress: STAKING_CONTRACT.address,
    contractName: STAKING_CONTRACT.name,
    functionName: 'create-proposal',
    functionArgs: [stringUtf8CV(title), stringUtf8CV(description)],
    network: NETWORK,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
  };
}

export function buildVoteTx(proposalId: number, voteFor: boolean): Record<string, unknown> {
  return {
    contractAddress: STAKING_CONTRACT.address,
    contractName: STAKING_CONTRACT.name,
    functionName: 'vote',
    functionArgs: [uintCV(proposalId), boolCV(voteFor)],
    network: NETWORK,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
  };
}

export function buildFinalizeProposalTx(proposalId: number): Record<string, unknown> {
  return {
    contractAddress: STAKING_CONTRACT.address,
    contractName: STAKING_CONTRACT.name,
    functionName: 'finalize-proposal',
    functionArgs: [uintCV(proposalId)],
    network: NETWORK,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
  };
}

// ─── UTILS ───────────────────────────────────────────────

export function formatTokenAmount(raw: number): string {
  if (!raw || isNaN(raw) || !isFinite(raw)) return '0';
  const val = raw / 1_000_000;
  // Tampilkan tanpa desimal — profesional dan bersih
  return Math.floor(val).toLocaleString();
}

export function toRawAmount(human: number): number {
  return Math.floor(human * 1_000_000);
}
