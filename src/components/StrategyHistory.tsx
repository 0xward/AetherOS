'use client';

/**
 * StrategyHistory.tsx
 * Sama persis dengan versi sebelumnya — UI tidak berubah.
 * Perubahan: pakai gaiaStorage instead of Firebase strategyHistory.
 *
 * deleteStrategy sekarang butuh walletAddress karena Gaia perlu re-write file.
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  History, Trash2, ChevronDown, ChevronUp,
  RefreshCw, Crown, Clock, Database
} from 'lucide-react';
import { useStacks } from '@/components/providers/StacksProvider';
import { getStrategyHistory, deleteStrategy, type StrategyRecord } from '@/lib/gaiaStorage';

// ─── HistoryCard ──────────────────────────────────────────────────────────────

function HistoryCard({
  record,
  onDelete,
  walletAddress,
}: {
  record: StrategyRecord;
  onDelete: (id: string) => void;
  walletAddress: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const strategy = record.strategy as {
    keyInsight?: string;
    unfairAdvantage?: string;
    roadmap?: { step: number; title: string; timeframe: string }[];
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteStrategy(record.id, walletAddress);
      onDelete(record.id);
    } catch (err) {
      console.error('[AetherOS Gaia] delete error:', err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="glass-card rounded-2xl border border-white/5 overflow-hidden"
    >
      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xs font-mono text-white/30">
                {record.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                {' · '}
                {record.createdAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </span>
              {record.isPremium && (
                <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,255,140,0.08)', border: '1px solid rgba(0,255,140,0.15)', color: '#00FF8C' }}>
                  <Crown size={10} />
                  Premium
                </span>
              )}
              {/* Gaia badge */}
              <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(139,49,255,0.08)', border: '1px solid rgba(139,49,255,0.15)', color: '#8B31FF' }}>
                <Database size={9} />
                Gaia
              </span>
            </div>
            <p className="text-sm font-semibold text-white truncate">{record.context.industry}</p>
            <p className="text-xs text-white/40 truncate mt-0.5">{record.context.goals}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setExpanded(!expanded)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-white/30 hover:text-white/60 transition-colors"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-white/20 hover:text-red-400 transition-colors disabled:opacity-40"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              {deleting ? <RefreshCw size={12} className="animate-spin" /> : <Trash2 size={12} />}
            </button>
          </div>
        </div>

        {/* Key insight preview */}
        {strategy.keyInsight && (
          <p className="text-xs text-white/40 leading-relaxed line-clamp-2">{strategy.keyInsight}</p>
        )}

        {/* Expanded view */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 space-y-4">
                {strategy.unfairAdvantage && (
                  <div className="p-3 rounded-xl" style={{ background: 'rgba(139,49,255,0.05)', border: '1px solid rgba(139,49,255,0.1)' }}>
                    <p className="text-xs uppercase tracking-widest text-white/30 font-semibold mb-1">Unfair Advantage</p>
                    <p className="text-sm text-white/60">{strategy.unfairAdvantage}</p>
                  </div>
                )}

                {strategy.roadmap && strategy.roadmap.length > 0 && (
                  <div>
                    <p className="text-xs uppercase tracking-widest text-white/30 font-semibold mb-2">Roadmap</p>
                    <div className="space-y-1.5">
                      {strategy.roadmap.slice(0, 4).map((step) => (
                        <div key={step.step} className="flex items-center gap-2 text-xs text-white/50">
                          <span className="w-5 h-5 flex items-center justify-center rounded font-mono text-white/30 flex-shrink-0" style={{ background: 'rgba(255,255,255,0.04)' }}>
                            {step.step}
                          </span>
                          <span className="flex-1 truncate">{step.title}</span>
                          <span className="text-white/25 font-mono">{step.timeframe}</span>
                        </div>
                      ))}
                      {strategy.roadmap.length > 4 && (
                        <p className="text-xs text-white/25 pl-7">+{strategy.roadmap.length - 4} more steps</p>
                      )}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Background', value: record.context.background },
                    { label: 'Position', value: record.context.currentPosition },
                  ].map((item, i) => (
                    <div key={i} className="p-2.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
                      <p className="text-xs text-white/25 mb-0.5">{item.label}</p>
                      <p className="text-xs text-white/55 line-clamp-2">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function StrategyHistory() {
  const { user, isConnected } = useStacks();
  const [records, setRecords] = useState<StrategyRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user?.stxAddress) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getStrategyHistory(user.stxAddress);
      setRecords(data);
    } catch (err) {
      setError(`Failed to load history: ${err instanceof Error ? err.message : String(err)}`);
      console.error('[AetherOS Gaia] load error:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.stxAddress]);

  useEffect(() => {
    if (isConnected) load();
  }, [isConnected, load]);

  const handleDelete = (id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  };

  if (!isConnected) return null;

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="relative max-w-4xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(139,49,255,0.12)', border: '1px solid rgba(139,49,255,0.2)' }}>
              <History size={16} className="text-aether-purple" />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-white">Strategy History</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-xs text-white/30 font-mono">
                  {records.length} {records.length === 1 ? 'strategy' : 'strategies'} saved
                </p>
                <span className="text-white/10">·</span>
                <p className="text-xs font-mono flex items-center gap-1" style={{ color: 'rgba(139,49,255,0.6)' }}>
                  <Database size={9} />
                  Stored on Gaia
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={load}
            disabled={loading}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-white/30 hover:text-white/60 transition-colors"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl text-sm text-red-400" style={{ background: 'rgba(255,45,155,0.05)', border: '1px solid rgba(255,45,155,0.15)' }}>
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <RefreshCw size={24} className="text-white/20 animate-spin mx-auto mb-3" />
            <p className="text-white/30 text-sm">Loading from Gaia...</p>
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-12 glass-card rounded-2xl border border-white/5">
            <Clock size={32} className="text-white/15 mx-auto mb-3" />
            <p className="text-white/40 text-sm mb-1">No strategies saved yet</p>
            <p className="text-white/25 text-xs">Generate your first strategy above</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {records.map((record) => (
                <HistoryCard
                  key={record.id}
                  record={record}
                  onDelete={handleDelete}
                  walletAddress={user?.stxAddress ?? ''}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}
