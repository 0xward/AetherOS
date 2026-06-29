'use client';

import { useEffect, useMemo, useState } from 'react';
import { Check, Clock, Handshake, Plus, ShieldCheck, X, Loader2, Link2 } from 'lucide-react';
import { useStacks } from '@/components/providers/StacksProvider';
import { loadBounties, saveBounties, type WarmIntroBounty, type SubmissionStatus } from '@/lib/bountyStorage';
import { buildCreateBounty, buildApproveBounty, buildSbtcTransfer } from '@/lib/contracts';

function short(addr = '') { return addr.length > 12 ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : (addr || 'Not connected'); }
async function sha256Hex(text: string) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

export default function WarmIntroBounties() {
  const { user, isConnected } = useStacks();
  const wallet = user?.stxAddress || '';
  const [bounties, setBounties] = useState<WarmIntroBounty[]>([]);
  const [storageMode, setStorageMode] = useState<'gaia' | 'fallback' | 'loading'>('loading');
  const [targetName, setTargetName] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [rewardSbtc, setRewardSbtc] = useState('0.001');
  const [successCriteria, setSuccessCriteria] = useState('Warm intro accepted + meeting booked');
  const [proofByBounty, setProofByBounty] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState('');

  useEffect(() => { loadBounties(wallet).then((v) => { setBounties(v); setStorageMode(wallet ? 'gaia' : 'fallback'); }); }, [wallet]);
  async function persist(next: WarmIntroBounty[]) { setBounties(next); const r = await saveBounties(next); setStorageMode(r.mode); }

  const stats = useMemo(() => ({
    open: bounties.filter((b) => b.status === 'open').length,
    pending: bounties.reduce((n, b) => n + b.submissions.filter((s) => s.status === 'pending').length, 0),
    approved: bounties.filter((b) => b.status === 'approved').length,
  }), [bounties]);

  async function createBounty() {
    if (!isConnected || !wallet || !targetName.trim()) return;
    setBusy('create');
    try {
      const ustx = Math.floor(parseFloat(rewardSbtc || '0') * 1e8); // sBTC has 8 decimals (sats)
      const tHash = await sha256Hex(`${targetName}|${targetRole}`);
      const cHash = await sha256Hex(successCriteria);
      const { openContractCall } = await import('@stacks/connect');
      await openContractCall({
        ...buildCreateBounty(ustx, tHash, cHash),
        onFinish: async (data: any) => {
          const bounty: WarmIntroBounty = { id: crypto.randomUUID(), creator: wallet, targetName, targetRole, rewardSbtc, successCriteria, status: 'open', createdAt: new Date().toISOString(), submissions: [], escrowTxId: data?.txId };
          await persist([bounty, ...bounties]);
          setTargetName(''); setTargetRole(''); setBusy('');
        },
        onCancel: () => setBusy(''),
      });
    } catch (e) { console.error(e); setBusy(''); }
  }

  function submitProof(bountyId: string) {
    if (!isConnected || !wallet || !proofByBounty[bountyId]?.trim()) return;
    const next = bounties.map((b) => b.id === bountyId ? { ...b, submissions: [...b.submissions, { id: crypto.randomUUID(), contributor: wallet, proof: proofByBounty[bountyId], note: 'Manual approval submission', createdAt: new Date().toISOString(), status: 'pending' as const }] } : b);
    persist(next); setProofByBounty({ ...proofByBounty, [bountyId]: '' });
  }

  async function approveAndPay(b: WarmIntroBounty, subId: string) {
    const sub = b.submissions.find((s) => s.id === subId);
    if (!sub) return;
    setBusy(subId);
    try {
      const sats = Math.floor(parseFloat(b.rewardSbtc || '0') * 1e8);
      const { openContractCall } = await import('@stacks/connect');
      // Step 1: mark approved on registry, then prompt sBTC transfer creator -> contributor
      await openContractCall({
        ...buildSbtcTransfer(sats, wallet, sub.contributor),
        onFinish: async () => {
          const next = bounties.map((x) => x.id === b.id ? { ...x, status: 'approved' as const, submissions: x.submissions.map((s) => s.id === subId ? { ...s, status: 'approved' as const } : s) } : x);
          await persist(next); setBusy('');
        },
        onCancel: () => setBusy(''),
      });
    } catch (e) { console.error(e); setBusy(''); }
  }

  function reject(bountyId: string, subId: string) {
    persist(bounties.map((b) => b.id === bountyId ? { ...b, submissions: b.submissions.map((s) => s.id === subId ? { ...s, status: 'rejected' as SubmissionStatus } : s) } : b));
  }

  return <section className="space-y-6">
    <div className="rounded-2xl border border-[#F7931A]/30 bg-[#F7931A]/10 p-4 text-sm text-white/70">Rewards are <b className="text-white">creator-funded</b> and paid wallet-to-wallet in <b className="text-white">sBTC</b> on approval. AetherOS never funds bounties. On-chain registry: <b className="text-white">aetheros-bounty-registry</b>. Storage: <b className="text-white">{storageMode}</b>.</div>
    <div className="grid grid-cols-3 gap-2 sm:gap-3">{[['Open', stats.open, Handshake], ['Pending', stats.pending, Clock], ['Approved', stats.approved, ShieldCheck]].map(([l, v, I]: any) => <div key={l} className="rounded-2xl border border-white/10 bg-white/[.03] p-3 sm:p-4"><I size={18} className="text-[#00FF8C] mb-3" /><p className="text-white/45 text-xs uppercase tracking-[0.2em]">{l}</p><p className="text-2xl sm:text-3xl font-bold text-white">{v}</p></div>)}</div>
    <div className="rounded-2xl border border-white/10 bg-white/[.03] p-4 sm:p-5"><div className="flex gap-2 mb-4"><Plus size={18} className="text-[#FF2D9B]" /><h2 className="text-xl font-bold text-white">Create Warm Intro Bounty</h2></div><div className="grid grid-cols-1 md:grid-cols-2 gap-3"><input value={targetName} onChange={(e) => setTargetName(e.target.value)} placeholder="Target name/company" className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none" /><input value={targetRole} onChange={(e) => setTargetRole(e.target.value)} placeholder="Role" className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none" /><input value={rewardSbtc} onChange={(e) => setRewardSbtc(e.target.value)} placeholder="Reward in sBTC (e.g. 0.001)" className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none" /><input value={successCriteria} onChange={(e) => setSuccessCriteria(e.target.value)} placeholder="Success criteria" className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none" /></div><button onClick={createBounty} disabled={!isConnected || busy === 'create'} className="mt-4 px-5 py-3 rounded-xl text-sm font-bold text-white disabled:opacity-40 inline-flex items-center gap-2" style={{ background: 'linear-gradient(135deg,#FF2D9B,#8B31FF)' }}>{busy === 'create' ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}Create bounty on-chain</button></div>
    {bounties.map((b) => <div key={b.id} className="rounded-2xl border border-white/10 bg-black/30 p-4 sm:p-5"><div className="flex justify-between gap-4"><div><p className="text-[#00FF8C] text-xs uppercase tracking-[0.2em]">{b.status}</p><h3 className="text-2xl font-bold text-white">{b.targetName}</h3><p className="text-white/55 text-sm">{b.targetRole} • creator {short(b.creator)}</p><p className="text-white/70 mt-2">Success: {b.successCriteria}</p>{b.escrowTxId && <a href={`https://explorer.hiro.so/txid/${b.escrowTxId}`} target="_blank" rel="noreferrer" className="text-[#8B31FF] text-xs inline-flex items-center gap-1 mt-2"><Link2 size={12} />View registry tx</a>}</div><div className="text-right"><p className="text-white/45 text-xs">Pledged</p><p className="text-white font-bold">{b.rewardSbtc} sBTC</p></div></div>{b.status === 'open' && <div className="mt-5 flex flex-col md:flex-row gap-3"><input value={proofByBounty[b.id] || ''} onChange={(e) => setProofByBounty({ ...proofByBounty, [b.id]: e.target.value })} placeholder="Intro proof / meeting link" className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none" /><button onClick={() => submitProof(b.id)} disabled={!isConnected} className="px-5 py-3 rounded-xl bg-white text-black font-bold disabled:opacity-40">Submit proof</button></div>}{!!b.submissions.length && <div className="mt-5 space-y-2">{b.submissions.map((s) => <div key={s.id} className="rounded-2xl bg-white/[.04] border border-white/10 p-4"><div className="flex justify-between"><p className="text-white/70 text-sm">{s.proof}</p><span className="text-xs text-white/45">{s.status}</span></div><p className="text-white/35 text-xs">by {short(s.contributor)}</p>{wallet === b.creator && s.status === 'pending' && <div className="flex gap-2 mt-3"><button onClick={() => approveAndPay(b, s.id)} disabled={busy === s.id} className="flex gap-1 px-3 py-2 rounded-lg bg-[#00FF8C] text-black text-xs font-bold disabled:opacity-40">{busy === s.id ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}Approve + Pay sBTC</button><button onClick={() => reject(b.id, s.id)} className="flex gap-1 px-3 py-2 rounded-lg bg-red-500/20 text-red-300 text-xs font-bold"><X size={13} />Reject</button></div>}</div>)}</div>}</div>)}
  </section>;
}
