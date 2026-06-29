'use client';
import { useEffect, useState } from 'react';
import { Award, ShieldCheck, Loader2 } from 'lucide-react';
import { useStacks } from '@/components/providers/StacksProvider';
import { buildMintCertificate, getCertificateNextId } from '@/lib/contracts';

const OWNER = 'SPQ189E66S20X7ATY7794HBY6743JE9YJMCKHAEF';
const BADGES = ['Warm Intro Approved', 'Premium Strategist', 'Stacks Builder', 'Network Operator'];

export default function ReputationBadges() {
  const { user, isConnected } = useStacks();
  const wallet = user?.stxAddress || '';
  const isOwner = wallet === OWNER;
  const [minted, setMinted] = useState(0);
  const [recipient, setRecipient] = useState('');
  const [busy, setBusy] = useState('');

  useEffect(() => { getCertificateNextId().then((n) => setMinted(Math.max(0, n - 1))); }, []);

  async function mint(badge: string) {
    if (!isConnected || !isOwner || !recipient) return;
    setBusy(badge);
    try {
      const { openContractCall } = await import('@stacks/connect');
      const evidence = Array.from(crypto.getRandomValues(new Uint8Array(32))).map((b) => b.toString(16).padStart(2, '0')).join('');
      await openContractCall({ ...buildMintCertificate(recipient, badge, evidence), onFinish: () => setBusy('') , onCancel: () => setBusy('') });
    } catch (e) { console.error(e); setBusy(''); }
  }

  return <section className="space-y-5">
    <div className="rounded-2xl border border-white/10 bg-white/[.03] p-4 sm:p-5">
      <div className="flex gap-2 mb-3"><Award className="text-[#F7931A]" /><h2 className="text-xl font-bold text-white">On-chain Certificate Badges</h2></div>
      <p className="text-white/65 text-sm">Non-transferable SBT certificates secured on Bitcoin via Stacks.</p>
      <p className="text-white/40 text-xs mt-2">Contract: aetheros-certificate-sbt • Minted so far: {minted}</p>
    </div>
    {isOwner && (
      <div className="rounded-2xl border border-[#00FF8C]/30 bg-[#00FF8C]/10 p-5">
        <p className="text-white/70 text-sm mb-3">Admin mint (contract owner only)</p>
        <input value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="Recipient STX address (SP...)" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none" />
      </div>
    )}
    <div className="grid md:grid-cols-2 gap-4">
      {BADGES.map((b) => (
        <div key={b} className="rounded-2xl border border-white/10 bg-black/30 p-5">
          <ShieldCheck className="text-[#00FF8C] mb-3" />
          <h3 className="text-white font-bold">{b}</h3>
          <p className="text-white/50 text-sm">Mintable after verified contribution or admin approval.</p>
          {isOwner && <button onClick={() => mint(b)} disabled={!recipient || !!busy} className="mt-3 px-4 py-2 rounded-lg bg-[#F7931A]/20 text-[#F7931A] text-sm font-bold disabled:opacity-40">{busy === b ? <Loader2 size={13} className="inline animate-spin" /> : 'Mint'}</button>}
        </div>
      ))}
    </div>
  </section>;
}
