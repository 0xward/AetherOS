'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Zap, Clock, TrendingUp, Lock, ExternalLink } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PoxInfo {
  contract_id: string;
  pox_activation_threshold_ustx: number;
  first_burnchain_block_height: number;
  current_burnchain_block_height: number;
  prepare_phase_block_length: number;
  reward_phase_block_length: number;
  reward_slots: number;
  rejection_fraction: number | null;
  total_liquid_supply_ustx: number;
  current_cycle: {
    id: number;
    min_threshold_ustx: number;
    stacked_ustx: number;
    is_pox_active: boolean;
  };
  next_cycle: {
    id: number;
    min_threshold_ustx: number;
    min_increment_ustx: number;
    stacked_ustx: number;
    prepare_phase_start_block_height: number;
    blocks_until_prepare_phase: number;
    reward_phase_start_block_height: number;
    blocks_until_reward_phase: number;
    ustx_until_pox_rejection: number | null;
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatSTX(microStx: number): string {
  const stx = microStx / 1_000_000;
  if (stx >= 1_000_000) return `${(stx / 1_000_000).toFixed(2)}M`;
  if (stx >= 1_000) return `${(stx / 1_000).toFixed(1)}K`;
  return stx.toLocaleString(undefined, { maximumFractionDigits: 0 });
}

// Estimate APY from stacked / liquid supply
// PoX distributes ~BTC block rewards → rough estimate: 6% annual
function estimateApy(stackedUstx: number, liquidUstx: number): string {
  if (liquidUstx === 0 || stackedUstx === 0) return '—';
  // Base BTC reward rate ≈ 6.25 BTC per 10 min, ~52,560 BTC/year
  // Simplified: stacking APY is roughly inverse of participation rate × BTC yield
  const participationRate = stackedUstx / liquidUstx;
  // Historical stacking APY has ranged 5-12%
  const baseApy = 0.09; // 9% base
  const apy = (baseApy / participationRate) * 0.7; // discount factor
  const capped = Math.min(apy, 0.25); // cap at 25%
  return `~${(capped * 100).toFixed(1)}%`;
}

// Progress of current cycle (blocks elapsed / total blocks per cycle)
function cycleProgress(pox: PoxInfo): number {
  const cycleLength = pox.prepare_phase_block_length + pox.reward_phase_block_length;
  const cycleStart = pox.next_cycle.reward_phase_start_block_height - cycleLength;
  const elapsed = pox.current_burnchain_block_height - cycleStart;
  return Math.min(100, Math.max(0, (elapsed / cycleLength) * 100));
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function InfoRow({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-white/[0.04] last:border-0">
      <span className="text-xs text-white/35 font-mono">{label}</span>
      <span className="text-xs font-mono font-semibold" style={{ color: color ?? 'rgba(255,255,255,0.7)' }}>
        {value}
      </span>
    </div>
  );
}

function MiniCard({
  label, value, sub, color, icon,
}: {
  label: string;
  value: string;
  sub?: string;
  color?: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="glass-card rounded-2xl border border-white/5 p-4">
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: color ? `${color}18` : 'rgba(255,255,255,0.04)', color: color ?? 'rgba(255,255,255,0.4)' }}
        >
          {icon}
        </div>
        <span className="text-xs text-white/30 font-mono uppercase tracking-widest">{label}</span>
      </div>
      <p className="text-2xl font-bold font-mono" style={{ color: color ?? 'white' }}>{value}</p>
      {sub && <p className="text-xs text-white/25 mt-1">{sub}</p>}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function StackingWidget() {
  const [pox, setPox] = useState<PoxInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);

  const fetchPox = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('https://api.hiro.so/v2/pox');
      if (!res.ok) throw new Error(`Hiro API error: ${res.status}`);
      const data: PoxInfo = await res.json();
      setPox(data);
      setLastFetch(new Date());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Fetch failed');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPox();
    // Refresh tiap 10 menit (Bitcoin blocks ~10 min)
    const interval = setInterval(fetchPox, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchPox]);

  const progress = pox ? cycleProgress(pox) : 0;
  const apy = pox ? estimateApy(pox.current_cycle.stacked_ustx, pox.total_liquid_supply_ustx) : '—';
  const cycleLength = pox ? pox.prepare_phase_block_length + pox.reward_phase_block_length : 2100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-card rounded-2xl border border-white/5 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(247,147,26,0.12)', border: '1px solid rgba(247,147,26,0.2)' }}
          >
            <span style={{ fontSize: 16, fontWeight: 700, color: '#F7931A' }}>₿</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">STX Stacking — Proof of Transfer</h3>
            <p className="text-xs text-white/30 font-mono">Live cycle data via Hiro API</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {lastFetch && (
            <span className="text-xs text-white/20 font-mono hidden sm:block">
              {lastFetch.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
          <button
            onClick={fetchPox}
            disabled={loading}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-white/30 hover:text-white/60 transition-colors"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <RefreshCw size={11} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && !pox && (
        <div className="p-6 space-y-3 animate-pulse">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-white/5 rounded-2xl" />
            ))}
          </div>
          <div className="h-2 bg-white/5 rounded-full" />
          <div className="h-20 bg-white/5 rounded-xl" />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="px-5 py-4 text-xs text-red-400/70">
          Failed to load PoX data: {error}
        </div>
      )}

      {/* Data */}
      {pox && (
        <div className="p-5 space-y-5">
          {/* Mini stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <MiniCard
              label="Current Cycle"
              value={`#${pox.current_cycle.id}`}
              sub={pox.current_cycle.is_pox_active ? 'PoX Active' : 'PoX Inactive'}
              color="#F7931A"
              icon={<Zap size={14} />}
            />
            <MiniCard
              label="Stacked STX"
              value={formatSTX(pox.current_cycle.stacked_ustx)}
              sub="This cycle"
              color="#00FF8C"
              icon={<Lock size={14} />}
            />
            <MiniCard
              label="Est. APY"
              value={apy}
              sub="BTC yield estimate"
              color="#8B31FF"
              icon={<TrendingUp size={14} />}
            />
            <MiniCard
              label="Next Cycle"
              value={`${pox.next_cycle.blocks_until_reward_phase}`}
              sub="BTC blocks away"
              color="#FF9900"
              icon={<Clock size={14} />}
            />
          </div>

          {/* Cycle progress bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/30 font-mono uppercase tracking-widest">Cycle Progress</span>
              <span className="text-xs font-mono text-white/40">{progress.toFixed(1)}%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #F7931A, #FF9900)' }}
              />
            </div>
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-xs text-white/20 font-mono">Cycle start</span>
              <span className="text-xs text-white/20 font-mono">{cycleLength} BTC blocks total</span>
            </div>
          </div>

          {/* Detail rows */}
          <div className="glass-card rounded-xl border border-white/5 px-4">
            <InfoRow label="Min threshold (this cycle)" value={`${formatSTX(pox.current_cycle.min_threshold_ustx)} STX`} />
            <InfoRow label="Min threshold (next cycle)" value={`${formatSTX(pox.next_cycle.min_threshold_ustx)} STX`} />
            <InfoRow
              label="Prepare phase starts"
              value={`Block #${pox.next_cycle.prepare_phase_start_block_height}`}
              color="#F7931A"
            />
            <InfoRow
              label="Reward phase starts"
              value={`Block #${pox.next_cycle.reward_phase_start_block_height}`}
              color="#00FF8C"
            />
            <InfoRow
              label="Total liquid STX"
              value={`${formatSTX(pox.total_liquid_supply_ustx)} STX`}
            />
            <InfoRow
              label="Participation rate"
              value={`${((pox.current_cycle.stacked_ustx / pox.total_liquid_supply_ustx) * 100).toFixed(1)}%`}
              color="#8B31FF"
            />
          </div>

          {/* CTA */}
          <div className="flex items-center justify-between pt-1">
            <p className="text-xs text-white/20 font-mono">
              BTC block #{pox.current_burnchain_block_height.toLocaleString()} · auto-refresh 10min
            </p>
            <a
              href="https://stacking.club"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs font-mono text-orange-400/60 hover:text-orange-400 transition-colors"
            >
              Stacking Club <ExternalLink size={10} />
            </a>
          </div>
        </div>
      )}
    </motion.div>
  );
}
