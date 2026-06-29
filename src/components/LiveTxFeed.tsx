'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity, RefreshCw, ExternalLink, ArrowUpRight,
  ArrowDownLeft, Zap, AlertCircle, Wallet, Box,
  TrendingUp, Clock
} from 'lucide-react';
import { useStacks } from '@/components/providers/StacksProvider';

// ─── Types ────────────────────────────────────────────────────────────────────

interface HiroTx {
  tx_id: string;
  tx_type: string;
  tx_status: string;
  block_time_iso?: string;
  burn_block_time_iso?: string;
  sender_address: string;
  fee_rate: string;
  token_transfer?: {
    recipient_address: string;
    amount: string;
    memo?: string;
  };
  contract_call?: {
    contract_id: string;
    function_name: string;
  };
  smart_contract?: {
    contract_id: string;
  };
}

interface StacksInfo {
  stacks_tip_height: number;
  burn_block_height: number;
  server_version: string;
}

interface SbtcBalance {
  balance: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const HIRO_BASE = 'https://api.hiro.so';

// sBTC SIP-010 contract di mainnet (Stacks Foundation official)
const SBTC_CONTRACT = 'SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function shortAddr(addr: string): string {
  if (!addr) return '';
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function formatTime(iso?: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH}h ago`;
  return `${Math.floor(diffH / 24)}d ago`;
}

function formatSTX(microStx: string | number): string {
  const n = typeof microStx === 'string' ? parseInt(microStx, 10) : microStx;
  if (isNaN(n)) return '0';
  return (n / 1_000_000).toLocaleString(undefined, { maximumFractionDigits: 4 });
}

function formatBTC(sats: string | number): string {
  const n = typeof sats === 'string' ? parseInt(sats, 10) : sats;
  if (isNaN(n) || n === 0) return '0';
  return (n / 100_000_000).toLocaleString(undefined, { maximumFractionDigits: 8 });
}

function getTxLabel(tx: HiroTx, myAddress: string): { label: string; sub: string; isOut: boolean } {
  const isOut = tx.sender_address === myAddress;

  if (tx.tx_type === 'token_transfer') {
    const amount = formatSTX(tx.token_transfer?.amount ?? '0');
    return {
      label: isOut ? 'Sent STX' : 'Received STX',
      sub: `${amount} STX ${isOut ? '→ ' + shortAddr(tx.token_transfer?.recipient_address ?? '') : '← ' + shortAddr(tx.sender_address)}`,
      isOut,
    };
  }

  if (tx.tx_type === 'contract_call') {
    const fn = tx.contract_call?.function_name ?? 'call';
    const contract = tx.contract_call?.contract_id?.split('.')[1] ?? '';
    return {
      label: fn.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      sub: contract,
      isOut: true,
    };
  }

  if (tx.tx_type === 'smart_contract') {
    const name = tx.smart_contract?.contract_id?.split('.')[1] ?? 'contract';
    return { label: 'Deploy Contract', sub: name, isOut: true };
  }

  return { label: tx.tx_type.replace(/_/g, ' '), sub: '', isOut: true };
}

function getTxColor(tx: HiroTx): string {
  if (tx.tx_status === 'failed') return '#FF2D9B';
  if (tx.tx_type === 'token_transfer') return '#00FF8C';
  if (tx.tx_type === 'contract_call') return '#8B31FF';
  if (tx.tx_type === 'smart_contract') return '#FF9900';
  return 'rgba(255,255,255,0.4)';
}

function getTxIcon(tx: HiroTx, isOut: boolean) {
  if (tx.tx_status === 'failed') return <AlertCircle size={14} />;
  if (tx.tx_type === 'token_transfer') {
    return isOut ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />;
  }
  if (tx.tx_type === 'contract_call') return <Zap size={14} />;
  if (tx.tx_type === 'smart_contract') return <Box size={14} />;
  return <Activity size={14} />;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  label, value, sub, color, icon,
}: {
  label: string;
  value: string;
  sub?: string;
  color?: string;
  icon: React.ReactNode;
}) {
  return (
    <div
      className="glass-card rounded-2xl border border-white/5 p-4 flex items-start gap-3"
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: color ? `${color}18` : 'rgba(255,255,255,0.04)', color: color ?? 'rgba(255,255,255,0.4)' }}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-white/30 font-mono uppercase tracking-widest mb-1">{label}</p>
        <p className="text-lg font-bold font-mono truncate" style={{ color: color ?? 'white' }}>{value}</p>
        {sub && <p className="text-xs text-white/30 mt-0.5 truncate">{sub}</p>}
      </div>
    </div>
  );
}

function TxRow({ tx, myAddress }: { tx: HiroTx; myAddress: string }) {
  const { label, sub, isOut } = getTxLabel(tx, myAddress);
  const color = getTxColor(tx);
  const icon = getTxIcon(tx, isOut);
  const failed = tx.tx_status === 'failed';
  const time = formatTime(tx.block_time_iso ?? tx.burn_block_time_iso);

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors hover:bg-white/[0.03] group"
    >
      {/* Icon */}
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{
          background: `${color}18`,
          color,
          opacity: failed ? 0.5 : 1,
        }}
      >
        {icon}
      </div>

      {/* Label */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-white/80 truncate" style={{ opacity: failed ? 0.5 : 1 }}>
            {label}
          </span>
          {failed && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(255,45,155,0.12)', color: '#FF2D9B', border: '1px solid rgba(255,45,155,0.2)' }}>
              failed
            </span>
          )}
        </div>
        {sub && (
          <p className="text-xs text-white/30 font-mono truncate mt-0.5">{sub}</p>
        )}
      </div>

      {/* Time + link */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="text-xs text-white/20 font-mono hidden sm:block">{time}</span>
        <a
          href={`https://explorer.hiro.so/txid/${tx.tx_id}?chain=mainnet`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-6 h-6 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 transition-opacity text-white/30 hover:text-white/60"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <ExternalLink size={10} />
        </a>
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function LiveTxFeed() {
  const { user, isConnected, connect, isConnecting } = useStacks();

  const [txs, setTxs] = useState<HiroTx[]>([]);
  const [stacksInfo, setStacksInfo] = useState<StacksInfo | null>(null);
  const [sbtcBalance, setSbtcBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'transfer' | 'contract_call'>('all');

  const fetchData = useCallback(async () => {
    if (!user?.stxAddress) return;
    setLoading(true);
    setError(null);

    try {
      const [txRes, infoRes, sbtcRes] = await Promise.allSettled([
        // tx history
        fetch(`${HIRO_BASE}/extended/v1/address/${user.stxAddress}/transactions?limit=30&offset=0`),
        // stacks network info
        fetch(`${HIRO_BASE}/v2/info`),
        // sBTC balance via SIP-010 read-only call
        fetch(`${HIRO_BASE}/v2/contracts/call-read/${SBTC_CONTRACT.replace('.', '/')}/get-balance`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sender: user.stxAddress,
            arguments: [
              // principal CV untuk address — encode sebagai hex
              // Hiro API accept raw Clarity value hex
              `0x0516${Buffer.from(user.stxAddress).toString('hex')}`,
            ],
          }),
        }),
      ]);

      // Transactions
      if (txRes.status === 'fulfilled' && txRes.value.ok) {
        const data = await txRes.value.json();
        setTxs(data.results ?? []);
      }

      // Stacks info
      if (infoRes.status === 'fulfilled' && infoRes.value.ok) {
        const info = await infoRes.value.json();
        setStacksInfo(info);
      }

      // sBTC — endpoint ini return { okay: true, result: '0x...' }
      // Decode result hex ke integer
      if (sbtcRes.status === 'fulfilled' && sbtcRes.value.ok) {
        const sbtc = await sbtcRes.value.json();
        if (sbtc.okay && sbtc.result) {
          // result adalah Clarity uint dalam hex, strip 0x01 prefix (ok + uint)
          const hex = sbtc.result.replace(/^0x/, '');
          // uint: 0x01 (ok) + 0x01 (uint type) + 16 bytes big-endian
          if (hex.length >= 36) {
            const valHex = hex.slice(4); // skip ok + uint type bytes
            const val = parseInt(valHex, 16);
            setSbtcBalance(isNaN(val) ? '0' : val.toString());
          } else {
            setSbtcBalance('0');
          }
        } else {
          setSbtcBalance('0');
        }
      }

      setLastRefresh(new Date());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Fetch error');
    } finally {
      setLoading(false);
    }
  }, [user?.stxAddress]);

  useEffect(() => {
    if (isConnected && user?.stxAddress) {
      fetchData();
    }
  }, [isConnected, user?.stxAddress, fetchData]);

  // Auto-refresh tiap 60 detik
  useEffect(() => {
    if (!isConnected) return;
    const interval = setInterval(fetchData, 60_000);
    return () => clearInterval(interval);
  }, [isConnected, fetchData]);

  const filteredTxs = txs.filter((tx) => {
    if (filter === 'all') return true;
    return tx.tx_type === filter;
  });

  // ── Not connected ──
  if (!isConnected) {
    return (
      <section className="relative py-20 overflow-hidden w-full">
        <div className="relative max-w-lg mx-auto px-6 text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(139,49,255,0.12)', border: '1px solid rgba(139,49,255,0.2)' }}>
            <Activity size={28} style={{ color: '#8B31FF' }} />
          </div>
          <h2 className="font-display text-3xl font-bold text-white mb-3">On-Chain Activity</h2>
          <p className="text-white/40 text-sm mb-6">Connect your wallet to view your live transaction feed and Bitcoin-on-Stacks balance.</p>
          <button
            onClick={connect}
            disabled={isConnecting}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white text-sm"
            style={{ background: 'linear-gradient(135deg,#FF2D9B,#8B31FF)' }}
          >
            {isConnecting ? <RefreshCw size={14} className="animate-spin" /> : <Wallet size={14} />}
            {isConnecting ? 'Connecting...' : 'Connect Stacks'}
          </button>
        </div>
      </section>
    );
  }

  // ── Connected ──
  return (
    <section className="relative py-10 overflow-hidden w-full">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-purple-500/3 blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-green-500/3 blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card border border-purple-500/20 mb-3">
              <Activity size={11} className="text-purple-400" />
              <span className="text-xs font-mono text-white/40 tracking-widest uppercase">Live Feed</span>
              {/* Live dot */}
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
              On-Chain <span className="gradient-text-purple-green">Activity</span>
            </h2>
          </div>

          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono text-white/40 hover:text-white/70 transition-colors"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <RefreshCw size={11} className={loading ? 'animate-spin' : ''} />
            {lastRefresh ? `Updated ${formatTime(lastRefresh.toISOString())}` : 'Refresh'}
          </button>
        </motion.div>

        {/* Stat cards */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8"
        >
          <StatCard
            label="Stacks Block"
            value={stacksInfo ? `#${stacksInfo.stacks_tip_height.toLocaleString()}` : '—'}
            sub="Current tip"
            color="#8B31FF"
            icon={<Box size={16} />}
          />
          <StatCard
            label="BTC Anchor"
            value={stacksInfo ? `#${stacksInfo.burn_block_height.toLocaleString()}` : '—'}
            sub="Bitcoin block"
            color="#FF9900"
            icon={<TrendingUp size={16} />}
          />
          <StatCard
            label="sBTC Balance"
            value={sbtcBalance !== null ? `${formatBTC(sbtcBalance)} sBTC` : '—'}
            sub="Your BTC on Stacks"
            color="#F7931A"
            icon={<span style={{ fontSize: 14, fontWeight: 700, color: '#F7931A' }}>₿</span>}
          />
          <StatCard
            label="Tx Count"
            value={txs.length > 0 ? `${txs.length}` : '—'}
            sub="Last 30 transactions"
            color="#00FF8C"
            icon={<Activity size={16} />}
          />
        </motion.div>

        {/* Tx Feed */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl border border-white/5 overflow-hidden"
        >
          {/* Feed header + filter */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Clock size={13} className="text-white/30" />
              <span className="text-xs font-mono text-white/30 uppercase tracking-widest">Transaction History</span>
            </div>
            <div className="flex items-center gap-1">
              {(['all', 'transfer', 'contract_call'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className="text-xs px-2.5 py-1 rounded-lg font-mono transition-all"
                  style={{
                    background: filter === f ? 'rgba(139,49,255,0.15)' : 'transparent',
                    border: filter === f ? '1px solid rgba(139,49,255,0.3)' : '1px solid transparent',
                    color: filter === f ? '#8B31FF' : 'rgba(255,255,255,0.3)',
                  }}
                >
                  {f === 'all' ? 'All' : f === 'transfer' ? 'STX' : 'Contract'}
                </button>
              ))}
            </div>
          </div>

          {/* Error state */}
          {error && (
            <div className="px-4 py-3 flex items-center gap-2 text-xs text-red-400/70 border-b border-white/5">
              <AlertCircle size={12} />
              {error}
            </div>
          )}

          {/* Loading skeleton */}
          {loading && txs.length === 0 && (
            <div className="p-4 space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-1 py-2 animate-pulse">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex-shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 bg-white/5 rounded w-1/3" />
                    <div className="h-2.5 bg-white/5 rounded w-1/2" />
                  </div>
                  <div className="h-2.5 bg-white/5 rounded w-12" />
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && filteredTxs.length === 0 && (
            <div className="py-16 text-center">
              <Activity size={24} className="text-white/10 mx-auto mb-3" />
              <p className="text-sm text-white/20">No transactions found</p>
              {filter !== 'all' && (
                <button onClick={() => setFilter('all')} className="mt-2 text-xs text-purple-400/60 hover:text-purple-400 transition-colors">
                  Clear filter
                </button>
              )}
            </div>
          )}

          {/* Tx list */}
          <AnimatePresence>
            {filteredTxs.length > 0 && (
              <div className="divide-y divide-white/[0.03] py-1">
                {filteredTxs.map((tx) => (
                  <TxRow key={tx.tx_id} tx={tx} myAddress={user?.stxAddress ?? ''} />
                ))}
              </div>
            )}
          </AnimatePresence>

          {/* Footer */}
          {filteredTxs.length > 0 && (
            <div className="px-4 py-3 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs text-white/20 font-mono">
                Powered by Hiro API · auto-refresh 60s
              </span>
              <a
                href={`https://explorer.hiro.so/address/${user?.stxAddress}?chain=mainnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-purple-400/60 hover:text-purple-400 transition-colors font-mono"
              >
                View in Explorer <ExternalLink size={10} />
              </a>
            </div>
          )}
        </motion.div>

      </div>
    </section>
  );
}
