'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Send, Wallet, Lock, RefreshCw,
  ExternalLink, ChevronDown, ChevronRight,
  Target, Map, Globe, Zap, CheckCircle, Circle,
  TrendingUp, Users, Shield, Star, Crown
} from 'lucide-react';
import { useStacks } from '@/components/providers/StacksProvider';
import { formatTokenAmount } from '@/lib/contracts';
import { saveStrategy } from '@/lib/gaiaStorage';

interface UserContext {
  background: string;
  industry: string;
  goals: string;
  currentPosition: string;
}

interface RoadmapStep {
  step: number;
  title: string;
  summary: string;
  actions: string[];
  timeframe: string;
}

interface ScoreBreakdown {
  label: string;
  score: number;
}

interface NetworkTarget {
  title: string;
  why: string;
  approach: string;
  compatibilityScore: number;
  scoreBreakdown: ScoreBreakdown[];
}

interface Web3Resource {
  name: string;
  category: string;
  relevance: string;
  matchScore: number;
  url: string;
  dbDescription: string;
}

interface StrategyOutput {
  roadmap: RoadmapStep[];
  targets: NetworkTarget[];
  web3Resources: Web3Resource[];
  keyInsight: string;
  unfairAdvantage: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  DeFi: 'text-green-400 bg-green-400/10 border-green-400/20',
  Infrastructure: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  Social: 'text-pink-400 bg-pink-400/10 border-pink-400/20',
  Governance: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  Analytics: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  Grants: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
  Staking: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20',
  Research: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
  Media: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
  NFT: 'text-violet-400 bg-violet-400/10 border-violet-400/20',
  Tooling: 'text-teal-400 bg-teal-400/10 border-teal-400/20',
  Community: 'text-lime-400 bg-lime-400/10 border-lime-400/20',
};

function ScoreGauge({ score, size = 80 }: { score: number; size?: number }) {
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = (score / 100) * circumference;
  const color = score >= 80 ? '#00FF8C' : score >= 60 ? '#8B31FF' : '#FF2D9B';

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={color} strokeWidth="6"
          strokeDasharray={`${dash} ${circumference}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 1s ease', filter: `drop-shadow(0 0 6px ${color}60)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-base font-bold font-mono" style={{ color }}>{score}</span>
        <span className="text-[9px] text-white/30 font-mono uppercase tracking-wider">score</span>
      </div>
    </div>
  );
}

function MiniBar({ label, score }: { label: string; score: number }) {
  const color = score >= 75 ? '#00FF8C' : score >= 55 ? '#8B31FF' : '#FF2D9B';
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-white/40 font-mono w-28 shrink-0">{label}</span>
      <div className="flex-1 h-1 rounded-full bg-white/5">
        <div
          className="h-1 rounded-full transition-all duration-700"
          style={{ width: `${score}%`, background: color, boxShadow: `0 0 6px ${color}60` }}
        />
      </div>
      <span className="text-[10px] font-mono w-6 text-right" style={{ color }}>{score}</span>
    </div>
  );
}

const LOADING_STEPS = [
  'Analyzing professional context...',
  'Identifying high-value targets...',
  'Mapping Web3 ecosystem...',
  'Calculating compatibility scores...',
  'Crafting 7-step roadmap...',
  'Enriching with protocol data...',
];

export default function AppSection() {
  const { user, isConnected, isPremium, stakedAmount, connect } = useStacks();
  const [context, setContext] = useState<UserContext>({ background: '', industry: '', goals: '', currentPosition: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StrategyOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [freeUsed, setFreeUsed] = useState(false);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'roadmap' | 'targets' | 'resources'>('roadmap');
  const [gaiaSaving, setGaiaSaving] = useState(false);

  const shortAddress = user?.stxAddress
    ? `${user.stxAddress.slice(0, 8)}...${user.stxAddress.slice(-6)}`
    : '';

  const canGenerate = isPremium || !freeUsed;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canGenerate) { connect(); return; }

    setLoading(true);
    setResult(null);
    setError(null);
    setActiveStep(null);
    setActiveTab('roadmap');
    setGaiaSaving(false);

    try {
      const response = await fetch('/api/strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context, walletAddress: user?.stxAddress }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Strategy generation failed');
      }

      const data = await response.json();
      setResult(data.strategy);
      if (!isPremium) setFreeUsed(true);

      // ── Client-side Gaia save ──────────────────────────────────────────────
      // Dipanggil dari client supaya UserSession (wallet) tersedia untuk Gaia write.
      // API route tetap save ke Firebase sebagai backup — ini nambah Gaia layer.
      if (user?.stxAddress && data.strategy) {
        setGaiaSaving(true);
        try {
          await saveStrategy(
            user.stxAddress,
            isPremium,
            context,
            data.strategy as Record<string, unknown>
          );
        } catch (gaiaErr) {
          // Silent fail — Firebase sudah jadi backup, UI tidak perlu error
          console.warn('[AetherOS Gaia] save failed (Firebase backup active):', gaiaErr);
        } finally {
          setGaiaSaving(false);
        }
      }
      // ──────────────────────────────────────────────────────────────────────

    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="app" className="relative py-10 overflow-hidden w-full">
      <div className="absolute inset-0">
        <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-500/40 to-transparent" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-pink-500/5 blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-purple-600/5 blur-[120px]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border border-pink-500/20 mb-6">
            <Sparkles size={13} className="text-aether-pink" />
            <span className="text-xs font-mono text-white/50 tracking-widest uppercase">
              {isConnected ? `Connected: ${shortAddress}` : 'Intelligence Engine'}
            </span>
            {isConnected && <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />}
          </div>
          <h2 className="font-display text-5xl md:text-6xl font-bold mb-5">
            <span className="text-white">Generate Your</span>{' '}
            <span className="gradient-text">Strategy</span>
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            {isPremium
              ? 'Premium active — unlimited strategy generation unlocked.'
              : isConnected
              ? 'Stake 1,000 $AetherOS to unlock unlimited strategies.'
              : 'Try one free strategy — connect your Stacks wallet for more.'}
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="glass-card-bright rounded-3xl p-8 md:p-12 border border-purple-500/20 mb-8"
        >
          {/* Premium badge */}
          {isPremium && (
            <div className="flex items-center gap-3 mb-8 p-4 rounded-xl bg-green-500/5 border border-green-500/20">
              <Crown size={16} className="text-aether-green" />
              <div>
                <p className="text-sm font-medium text-white/80">Premium Active</p>
                <p className="text-xs text-white/40">
                  {formatTokenAmount(stakedAmount)} $AetherOS staked · Unlimited strategies unlocked
                </p>
              </div>
              <div className="ml-auto w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            </div>
          )}

          {/* Connected but not premium */}
          {isConnected && !isPremium && (
            <div className="flex items-center justify-between mb-8 p-4 rounded-xl bg-purple-500/5 border border-purple-500/15">
              <div className="flex items-center gap-3">
                <Lock size={16} className="text-purple-400" />
                <div>
                  <p className="text-sm font-medium text-white/80">Stake to Unlock Unlimited</p>
                  <p className="text-xs text-white/40">
                    Stake 1,000 $AetherOS to remove the 1-strategy limit
                  </p>
                </div>
              </div>
              <a href="#staking" className="btn-primary flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white">
                Stake Now
              </a>
            </div>
          )}

          {/* Not connected */}
          {!isConnected && (
            <div className="flex items-center justify-between mb-8 p-4 rounded-xl bg-amber-500/5 border border-amber-500/15">
              <div className="flex items-center gap-3">
                <Lock size={16} className="text-amber-400" />
                <div>
                  <p className="text-sm font-medium text-white/80">Guest Mode Active</p>
                  <p className="text-xs text-white/40">
                    {freeUsed ? 'Trial limit reached — connect wallet to continue' : '1 free strategy remaining'}
                  </p>
                </div>
              </div>
              <button onClick={connect} className="btn-primary flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white">
                <Wallet size={12} /><span>Connect</span>
              </button>
            </div>
          )}

          <form onSubmit={handleGenerate} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-5">
              {[
                { key: 'background', label: 'Background & Skills', placeholder: 'Software Architect, 10 years scaling FinTech systems, ex-Goldman...', type: 'textarea' },
                { key: 'industry', label: 'Industry & Focus', placeholder: 'FinTech, DeFi, High-Frequency Trading...', type: 'input' },
                { key: 'currentPosition', label: 'Current Position', placeholder: 'Senior VP at Series-B startup, Founder...', type: 'input' },
                { key: 'goals', label: 'Networking Goal', placeholder: 'Connect with C-level at major exchanges, find LP introductions...', type: 'input' },
              ].map((field) => (
                <div key={field.key} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                  <label className="block text-xs uppercase tracking-widest text-white/40 font-semibold mb-2">
                    {field.label}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      required
                      value={context[field.key as keyof UserContext]}
                      onChange={(e) => setContext({ ...context, [field.key]: e.target.value })}
                      placeholder={field.placeholder}
                      rows={3}
                      className="w-full rounded-xl p-4 text-sm resize-none focus:outline-none focus:ring-1 transition-all"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#ffffff',
                        caretColor: '#8B31FF',
                      }}
                    />
                  ) : (
                    <input
                      required
                      type="text"
                      value={context[field.key as keyof UserContext]}
                      onChange={(e) => setContext({ ...context, [field.key]: e.target.value })}
                      placeholder={field.placeholder}
                      className="w-full rounded-xl p-4 text-sm focus:outline-none focus:ring-1 transition-all"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#ffffff',
                        caretColor: '#8B31FF',
                      }}
                    />
                  )}
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading || !canGenerate}
              className="w-full btn-primary flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-white text-base disabled:opacity-40 disabled:cursor-not-allowed glow-purple transition-all"
            >
              {loading ? (
                <><RefreshCw size={18} className="animate-spin" /><span>Generating Intelligence...</span></>
              ) : !canGenerate ? (
                <><Lock size={18} /><span>Stake 1,000 $AetherOS to Continue</span></>
              ) : isPremium ? (
                <><Crown size={18} /><span>Generate Intelligence Strategy</span></>
              ) : (
                <><Send size={18} /><span>{isConnected ? 'Generate Strategy (1 Free)' : 'Generate Free Strategy'}</span></>
              )}
            </button>
          </form>

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-8 space-y-3">
                {LOADING_STEPS.map((msg, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.5 }}
                    className="flex items-center gap-3 text-xs font-mono text-white/40">
                    <span className="text-aether-pink">&gt;</span>{msg}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ===== DASHBOARD OUTPUT ===== */}
        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-6">

              {/* Status bar */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs font-mono text-white/50 uppercase tracking-widest">Intelligence Report Generated</span>
                </div>
                {isConnected && (
                  <div className="flex items-center gap-2 text-xs text-white/30 font-mono">
                    {gaiaSaving ? (
                      <>
                        <RefreshCw size={10} className="animate-spin text-purple-400" />
                        <span style={{ color: 'rgba(139,49,255,0.6)' }}>Saving to Gaia...</span>
                      </>
                    ) : (
                      <>
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                        Saved to Gaia · {shortAddress}
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Key Insight + Advantage cards */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="glass-card rounded-2xl p-5 border border-purple-500/15">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap size={14} className="text-aether-purple" />
                    <span className="text-xs font-mono uppercase tracking-widest text-white/40">Key Insight</span>
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed">{result.keyInsight}</p>
                </div>
                <div className="glass-card rounded-2xl p-5 border border-pink-500/15">
                  <div className="flex items-center gap-2 mb-3">
                    <Star size={14} className="text-aether-pink" />
                    <span className="text-xs font-mono uppercase tracking-widest text-white/40">Unfair Advantage</span>
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed">{result.unfairAdvantage}</p>
                </div>
              </div>

              {/* Tab switcher */}
              <div className="flex gap-1 p-1 glass-card rounded-2xl border border-white/5">
                {([
                  { key: 'roadmap', label: '7-Step Roadmap', icon: Map },
                  { key: 'targets', label: 'Target Profiles', icon: Target },
                  { key: 'resources', label: 'Web3 Resources', icon: Globe },
                ] as const).map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-semibold font-mono uppercase tracking-wider transition-all ${
                      activeTab === key
                        ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-white border border-purple-500/30'
                        : 'text-white/30 hover:text-white/60'
                    }`}
                  >
                    <Icon size={13} />{label}
                  </button>
                ))}
              </div>

              {/* === ROADMAP TAB === */}
              {activeTab === 'roadmap' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                  {result.roadmap.map((step, i) => (
                    <motion.div
                      key={step.step}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07 }}
                      className="glass-card rounded-2xl border border-white/5 overflow-hidden"
                    >
                      <button
                        onClick={() => setActiveStep(activeStep === step.step ? null : step.step)}
                        className="w-full flex items-center gap-4 p-5 text-left hover:bg-white/2 transition-colors"
                      >
                        {/* Step number */}
                        <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono"
                          style={{ background: 'linear-gradient(135deg, #FF2D9B, #8B31FF)', boxShadow: '0 0 14px rgba(139,49,255,0.4)' }}>
                          {step.step}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-0.5">
                            <span className="text-white font-semibold text-sm">{step.title}</span>
                            <span className="text-[10px] font-mono text-white/30 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                              {step.timeframe}
                            </span>
                          </div>
                          <p className="text-white/40 text-xs leading-relaxed">{step.summary}</p>
                        </div>

                        {activeStep === step.step
                          ? <ChevronDown size={14} className="shrink-0 text-white/30" />
                          : <ChevronRight size={14} className="shrink-0 text-white/20" />}
                      </button>

                      <AnimatePresence>
                        {activeStep === step.step && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 pb-5 pt-0 border-t border-white/5">
                              <div className="pt-4 space-y-2">
                                {step.actions.map((action, j) => (
                                  <div key={j} className="flex items-start gap-3">
                                    <CheckCircle size={13} className="mt-0.5 shrink-0 text-aether-green" />
                                    <span className="text-white/70 text-xs leading-relaxed">{action}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}

                  {/* Progress tracker */}
                  <div className="glass-card rounded-2xl p-5 border border-white/5">
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp size={13} className="text-aether-purple" />
                      <span className="text-xs font-mono uppercase tracking-widest text-white/40">Roadmap Progress</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {result.roadmap.map((step) => (
                        <button
                          key={step.step}
                          onClick={() => { setActiveStep(step.step); }}
                          className="flex-1 h-1.5 rounded-full transition-all hover:scale-y-150"
                          style={{ background: 'linear-gradient(90deg, #FF2D9B, #8B31FF)', opacity: 0.3 + (step.step / result.roadmap.length) * 0.7 }}
                          title={step.title}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-[10px] text-white/20 font-mono">Day 1</span>
                      <span className="text-[10px] text-white/20 font-mono">Month 2+</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* === TARGETS TAB === */}
              {activeTab === 'targets' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  {result.targets.map((target, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="glass-card rounded-2xl p-6 border border-white/5"
                    >
                      <div className="flex items-start gap-5">
                        {/* Score gauge */}
                        <div className="shrink-0">
                          <ScoreGauge score={target.compatibilityScore} size={72} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <Users size={14} className="text-aether-purple" />
                            <h4 className="text-white font-semibold text-sm">{target.title}</h4>
                          </div>
                          <p className="text-white/60 text-xs leading-relaxed mb-3">{target.why}</p>

                          {/* Approach block */}
                          <div className="bg-purple-500/5 border border-purple-500/15 rounded-xl p-3 mb-4">
                            <p className="text-[10px] font-mono uppercase tracking-widest text-purple-400/70 mb-1">Approach</p>
                            <p className="text-white/70 text-xs leading-relaxed">{target.approach}</p>
                          </div>

                          {/* Score breakdown bars */}
                          <div className="space-y-1.5">
                            {target.scoreBreakdown.map((item, j) => (
                              <MiniBar key={j} label={item.label} score={item.score} />
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* === RESOURCES TAB === */}
              {activeTab === 'resources' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="grid md:grid-cols-2 gap-4">
                    {result.web3Resources.map((resource, i) => (
                      <motion.a
                        key={i}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.08 }}
                        className="glass-card rounded-2xl p-5 border border-white/5 hover:border-purple-500/30 transition-all group block"
                        style={{ textDecoration: 'none' }}
                      >
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Shield size={12} className="text-aether-purple" />
                              <span className="text-white font-semibold text-sm group-hover:text-aether-purple transition-colors">
                                {resource.name}
                              </span>
                            </div>
                            <span className={`inline-flex items-center text-[10px] font-mono px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[resource.category] ?? 'text-white/40 bg-white/5 border-white/10'}`}>
                              {resource.category}
                            </span>
                          </div>

                          <div className="flex flex-col items-end gap-1 shrink-0">
                            {/* Match score pill */}
                            <div className="flex items-center gap-1 bg-green-400/10 border border-green-400/20 rounded-full px-2 py-0.5">
                              <Circle size={5} className="text-green-400 fill-green-400" />
                              <span className="text-[10px] font-mono text-green-400">{resource.matchScore}% match</span>
                            </div>
                            <ExternalLink size={12} className="text-white/20 group-hover:text-aether-purple transition-colors" />
                          </div>
                        </div>

                        <p className="text-white/50 text-xs leading-relaxed mb-2">{resource.relevance}</p>
                        <p className="text-white/25 text-[10px] font-mono">{resource.dbDescription}</p>

                        {/* Match bar */}
                        <div className="mt-3 h-0.5 rounded-full bg-white/5">
                          <div
                            className="h-0.5 rounded-full transition-all duration-700"
                            style={{ width: `${resource.matchScore}%`, background: 'linear-gradient(90deg, #8B31FF, #00FF8C)' }}
                          />
                        </div>
                      </motion.a>
                    ))}
                  </div>

                  <div className="mt-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/15 flex items-start gap-3">
                    <Sparkles size={13} className="text-amber-400 mt-0.5 shrink-0" />
                    <p className="text-xs text-white/40 leading-relaxed">
                      Protocol recommendations are matched to your specific background and goals. URLs are verified from our curated Web3 database. Always do your own research before engaging with any protocol.
                    </p>
                  </div>
                </motion.div>
              )}

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
