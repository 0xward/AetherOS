'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Sparkles, Send, RefreshCw, ExternalLink,
  ChevronRight, Filter, Zap, Globe, Building2,
  CheckCircle, Lock, TrendingUp, DollarSign, Clock,
  Award, SlidersHorizontal, X, AlertCircle
} from 'lucide-react';
import { useStacks } from '@/components/providers/StacksProvider';

// ─── Types ────────────────────────────────────────────────────────────────────
interface UserContext {
  background: string;
  industry: string;
  goals: string;
  currentPosition: string;
  projectStage: string;
  projectDescription: string;
}

interface GrantMatch {
  id: string;
  name: string;
  organization: string;
  orgType: 'web2' | 'web3' | 'government' | 'foundation';
  category: string;
  description: string;
  fundingAmount: string;
  fundingMin?: number;
  fundingMax?: number;
  deadline: string;
  url: string;
  applyUrl: string;
  logoUrl: string;
  logoColor: string;
  tags: string[];
  eligibility: string;
  matchScore: number;
  matchReasons: string[];
  source: 'gitcoin' | 'curated' | 'federal';
  isOpen: boolean;
  featured?: boolean;
}

// ─── Config ────────────────────────────────────────────────────────────────────
const ORG_TYPE_CONFIG = {
  web2: { label: 'Web2 Giant', color: '#4285F4', bg: 'rgba(66,133,244,0.12)', border: 'rgba(66,133,244,0.25)' },
  web3: { label: 'Web3 Protocol', color: '#8B31FF', bg: 'rgba(139,49,255,0.12)', border: 'rgba(139,49,255,0.25)' },
  government: { label: 'Government', color: '#00C49A', bg: 'rgba(0,196,154,0.12)', border: 'rgba(0,196,154,0.25)' },
  foundation: { label: 'Foundation', color: '#FF9900', bg: 'rgba(255,153,0,0.12)', border: 'rgba(255,153,0,0.25)' },
};

const LOADING_STEPS = [
  'Fetching live Gitcoin grant rounds...',
  'Pulling federal grants from Grants.gov...',
  'Loading curated Web2 programs (Google, Meta, AWS)...',
  'Scanning Web3 foundation databases...',
  'Running AI compatibility analysis...',
  'Ranking 50+ grants by your profile...',
  'Generating match insights...',
];

const PROJECT_STAGES = ['Idea / Pre-MVP', 'MVP Built', 'Early Users', 'Revenue / Traction', 'Scaling'];

const FILTERS = ['All', 'web2', 'web3', 'government', 'foundation'];

// ─── Score Gauge ──────────────────────────────────────────────────────────────
function ScoreRing({ score, size = 64 }: { score: number; size?: number }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 80 ? '#00FF8C' : score >= 60 ? '#8B31FF' : '#FF2D9B';

  return (
    <div className="relative flex items-center justify-center flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth="5"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 5px ${color}80)`, transition: 'stroke-dasharray 1.2s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-bold font-mono leading-none" style={{ color }}>{score}</span>
        <span className="text-[8px] text-white/30 font-mono uppercase tracking-wider">match</span>
      </div>
    </div>
  );
}

// ─── Logo with Fallback ───────────────────────────────────────────────────────
function OrgLogo({ grant }: { grant: GrantMatch }) {
  const [imgErr, setImgErr] = useState(false);
  const initials = grant.organization.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  if (imgErr) {
    return (
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold font-mono flex-shrink-0"
        style={{ background: `${grant.logoColor}20`, border: `1px solid ${grant.logoColor}40`, color: grant.logoColor }}
      >
        {initials}
      </div>
    );
  }

  return (
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
      style={{ background: '#1a1a24', border: `1px solid ${grant.logoColor}30` }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={grant.logoUrl}
        alt={grant.organization}
        className="w-7 h-7 object-contain"
        onError={() => setImgErr(true)}
      />
    </div>
  );
}

// ─── Grant Card ───────────────────────────────────────────────────────────────
function GrantCard({ grant, index }: { grant: GrantMatch; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const orgConfig = ORG_TYPE_CONFIG[grant.orgType];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative rounded-2xl border transition-all duration-300 overflow-hidden"
      style={{
        background: grant.featured
          ? `linear-gradient(135deg, rgba(139,49,255,0.08), rgba(255,45,155,0.04))`
          : 'rgba(255,255,255,0.03)',
        borderColor: expanded ? `${grant.logoColor}40` : 'rgba(255,255,255,0.07)',
      }}
    >
      {/* Featured badge */}
      {grant.featured && (
        <div className="absolute top-0 right-0 px-2 py-0.5 rounded-bl-xl text-[9px] font-mono font-bold uppercase tracking-wider"
          style={{ background: 'linear-gradient(90deg, #FF2D9B, #8B31FF)', color: 'white' }}>
          Top Match
        </div>
      )}

      {/* Card Header — always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-start gap-4 p-5 text-left"
      >
        <OrgLogo grant={grant} />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <div>
              <h4 className="text-white font-semibold text-sm leading-tight group-hover:text-white transition-colors pr-2">
                {grant.name}
              </h4>
              <p className="text-white/40 text-xs mt-0.5 font-mono">{grant.organization}</p>
            </div>
            <ScoreRing score={grant.matchScore} size={52} />
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span
              className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full border"
              style={{ color: orgConfig.color, background: orgConfig.bg, borderColor: orgConfig.border }}
            >
              {orgConfig.label}
            </span>
            <span className="flex items-center gap-1 text-[10px] text-white/40 font-mono">
              <DollarSign size={9} className="text-aether-green" />
              {grant.fundingAmount}
            </span>
            <span className="flex items-center gap-1 text-[10px] text-white/40 font-mono">
              <Clock size={9} className="text-aether-purple" />
              {grant.deadline}
            </span>
          </div>

          {/* Match reasons — always show top 1 */}
          {grant.matchReasons[0] && (
            <div className="flex items-start gap-1.5 mt-2">
              <Zap size={10} className="text-aether-pink mt-0.5 flex-shrink-0" />
              <p className="text-white/50 text-[11px] leading-relaxed">{grant.matchReasons[0]}</p>
            </div>
          )}
        </div>

        <ChevronRight
          size={14}
          className={`flex-shrink-0 text-white/20 transition-transform duration-200 mt-1 ${expanded ? 'rotate-90' : ''}`}
        />
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-white/5 pt-4 space-y-4">
              {/* Description */}
              <p className="text-white/60 text-xs leading-relaxed">{grant.description}</p>

              {/* All match reasons */}
              <div className="space-y-1.5">
                <p className="text-[10px] font-mono uppercase tracking-widest text-white/30 mb-2">Why you match</p>
                {grant.matchReasons.map((reason, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle size={11} className="text-aether-green mt-0.5 flex-shrink-0" />
                    <span className="text-white/70 text-xs">{reason}</span>
                  </div>
                ))}
              </div>

              {/* Eligibility */}
              <div className="bg-white/3 rounded-xl p-3 border border-white/5">
                <p className="text-[10px] font-mono uppercase tracking-widest text-white/30 mb-1">Eligibility</p>
                <p className="text-white/60 text-xs leading-relaxed">{grant.eligibility}</p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {grant.tags.map(tag => (
                  <span key={tag} className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/8 text-white/40">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Match score bar */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[10px] font-mono text-white/30">Compatibility</span>
                  <span className="text-[10px] font-mono" style={{ color: grant.matchScore >= 80 ? '#00FF8C' : '#8B31FF' }}>
                    {grant.matchScore}%
                  </span>
                </div>
                <div className="h-1 rounded-full bg-white/5">
                  <div
                    className="h-1 rounded-full transition-all duration-1000"
                    style={{
                      width: `${grant.matchScore}%`,
                      background: `linear-gradient(90deg, ${grant.logoColor}, #8B31FF)`,
                      boxShadow: `0 0 8px ${grant.logoColor}60`,
                    }}
                  />
                </div>
              </div>

              {/* CTA */}
              <a
                href={grant.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-95"
                style={{
                  background: `linear-gradient(135deg, ${grant.logoColor}CC, #8B31FF)`,
                  boxShadow: `0 0 20px ${grant.logoColor}30`,
                }}
                onClick={e => e.stopPropagation()}
              >
                <ExternalLink size={14} />
                Apply / Learn More
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────
function SourcesBar({ sources }: { sources: { curated: number; gitcoin: number; federal: number } }) {
  return (
    <div className="flex items-center gap-4 flex-wrap">
      <div className="flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-aether-purple" />
        <span className="text-[10px] font-mono text-white/40">{sources.curated} Curated (Web2/Web3)</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-aether-green" />
        <span className="text-[10px] font-mono text-white/40">{sources.gitcoin} Live Gitcoin Rounds</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
        <span className="text-[10px] font-mono text-white/40">{sources.federal} Federal Grants</span>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function GrantDiscovery() {
  const { user, isConnected, connect } = useStacks();
  const [context, setContext] = useState<UserContext>({
    background: '',
    industry: '',
    goals: '',
    currentPosition: '',
    projectStage: '',
    projectDescription: '',
  });
  const [loading, setLoading] = useState(false);
  const [grants, setGrants] = useState<GrantMatch[]>([]);
  const [sources, setSources] = useState({ curated: 0, gitcoin: 0, federal: 0 });
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('All');
  const [freeUsed, setFreeUsed] = useState(false);
  const [loadStep, setLoadStep] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const resultsRef = useRef<HTMLDivElement>(null);

  const shortAddress = user?.stxAddress
    ? `${user.stxAddress.slice(0, 8)}...${user.stxAddress.slice(-6)}`
    : '';

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected && freeUsed) { connect(); return; }

    setLoading(true);
    setGrants([]);
    setError(null);
    setFilter('All');
    setLoadStep(0);

    // Animate loading steps
    const stepInterval = setInterval(() => {
      setLoadStep(prev => {
        if (prev >= LOADING_STEPS.length - 1) { clearInterval(stepInterval); return prev; }
        return prev + 1;
      });
    }, 900);

    try {
      const res = await fetch('/api/grants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context }),
      });

      if (!res.ok) throw new Error('Grant matching failed. Please try again.');
      const data = await res.json();

      setGrants(data.grants ?? []);
      setSources(data.sources ?? { curated: 0, gitcoin: 0, federal: 0 });
      if (!isConnected) setFreeUsed(true);

      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      clearInterval(stepInterval);
      setLoading(false);
    }
  };

  // Filter + search
  const visibleGrants = grants.filter(g => {
    const matchesFilter = filter === 'All' || g.orgType === filter;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || g.name.toLowerCase().includes(q)
      || g.organization.toLowerCase().includes(q)
      || g.category.toLowerCase().includes(q)
      || g.tags.some(t => t.toLowerCase().includes(q));
    return matchesFilter && matchesSearch;
  });

  const topMatch = grants[0];

  return (
    <section id="grants" className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-aether-green/30 to-transparent" />
        <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-green-400/4 blur-[160px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-purple-600/5 blur-[140px]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border border-green-400/20 mb-6">
            <Award size={12} className="text-aether-green" />
            <span className="text-xs font-mono text-white/50 tracking-widest uppercase">
              {isConnected ? `Connected: ${shortAddress}` : 'Grant Intelligence'}
            </span>
            {isConnected && <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />}
          </div>

          <h2 className="font-display text-5xl md:text-6xl font-bold mb-5">
            <span className="text-white">Find Your</span>{' '}
            <span className="gradient-text">Perfect Grant</span>
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto leading-relaxed">
            AI matches you to 50+ live grant programs — from Google and Meta to Ethereum Foundation and federal agencies.
            Real data, real opportunities, zero noise.
          </p>

          {/* Source logos strip */}
          <div className="flex items-center justify-center gap-4 mt-8 flex-wrap opacity-40">
            {['Google', 'Meta', 'Microsoft', 'AWS', 'ETH Foundation', 'Gitcoin', 'NSF'].map(org => (
              <span key={org} className="text-xs font-mono text-white/60 px-3 py-1 rounded-full bg-white/5 border border-white/8">
                {org}
              </span>
            ))}
            <span className="text-xs font-mono text-white/40">+45 more</span>
          </div>
        </motion.div>

        {/* ── Input Form ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="glass-card-bright rounded-3xl p-8 md:p-10 border border-aether-green/15 mb-8"
        >
          {/* Guest mode banner */}
          {!isConnected && (
            <div className="flex items-center justify-between mb-7 p-4 rounded-xl bg-amber-500/5 border border-amber-500/15">
              <div className="flex items-center gap-3">
                <Lock size={15} className="text-amber-400" />
                <div>
                  <p className="text-sm font-medium text-white/80">Guest Mode</p>
                  <p className="text-xs text-white/40">
                    {freeUsed ? 'Free search used — connect wallet for unlimited' : '1 free grant search available'}
                  </p>
                </div>
              </div>
              <button onClick={connect} className="btn-primary flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white">
                Connect Wallet
              </button>
            </div>
          )}

          <form onSubmit={handleSearch} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { key: 'background', label: 'Your Background', placeholder: 'Full-stack developer, 5 years Solidity + React, prev. startup founder...', textarea: true },
                { key: 'industry', label: 'Industry / Focus', placeholder: 'DeFi, NFT infrastructure, ZK proofs...', textarea: false },
                { key: 'currentPosition', label: 'Current Position', placeholder: 'Indie developer, CTO at pre-seed startup...', textarea: false },
                { key: 'goals', label: 'What Do You Need Funding For?', placeholder: 'Build open source DEX aggregator, fund cryptography research...', textarea: false },
              ].map(field => (
                <div key={field.key} className={field.textarea ? 'md:col-span-2' : ''}>
                  <label className="block text-[10px] uppercase tracking-widest text-white/40 font-semibold mb-2">
                    {field.label}
                  </label>
                  {field.textarea ? (
                    <textarea
                      required
                      value={context[field.key as keyof UserContext]}
                      onChange={e => setContext({ ...context, [field.key]: e.target.value })}
                      placeholder={field.placeholder}
                      rows={2}
                      className="w-full rounded-xl p-4 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-aether-green/40 transition-all"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', color: '#fff', caretColor: '#00FF8C' }}
                    />
                  ) : (
                    <input
                      required
                      type="text"
                      value={context[field.key as keyof UserContext]}
                      onChange={e => setContext({ ...context, [field.key]: e.target.value })}
                      placeholder={field.placeholder}
                      className="w-full rounded-xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-aether-green/40 transition-all"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', color: '#fff', caretColor: '#00FF8C' }}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Project stage select */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-white/40 font-semibold mb-2">
                  Project Stage
                </label>
                <select
                  value={context.projectStage}
                  onChange={e => setContext({ ...context, projectStage: e.target.value })}
                  className="w-full rounded-xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-aether-green/40 transition-all appearance-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', color: context.projectStage ? '#fff' : 'rgba(255,255,255,0.3)' }}
                >
                  <option value="">Select stage...</option>
                  {PROJECT_STAGES.map(s => <option key={s} value={s} style={{ background: '#111118' }}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-white/40 font-semibold mb-2">
                  Project Description (optional)
                </label>
                <input
                  type="text"
                  value={context.projectDescription}
                  onChange={e => setContext({ ...context, projectDescription: e.target.value })}
                  placeholder="One sentence: what you're building..."
                  className="w-full rounded-xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-aether-green/40 transition-all"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', color: '#fff', caretColor: '#00FF8C' }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || (!isConnected && freeUsed)}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-white text-base disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:scale-[1.01] active:scale-99"
              style={{
                background: 'linear-gradient(135deg, #00FF8C22, #8B31FF44)',
                border: '1px solid rgba(0,255,140,0.35)',
                boxShadow: loading ? 'none' : '0 0 24px rgba(0,255,140,0.15)',
              }}
            >
              {loading ? (
                <><RefreshCw size={18} className="animate-spin text-aether-green" /><span>Scanning {grants.length > 0 ? grants.length : '50+'} Grants...</span></>
              ) : !isConnected && freeUsed ? (
                <><Lock size={18} /><span>Connect Wallet to Continue</span></>
              ) : (
                <><Search size={18} className="text-aether-green" /><span>Find My Matching Grants</span></>
              )}
            </button>
          </form>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-5 flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
              >
                <AlertCircle size={15} />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading steps */}
          <AnimatePresence>
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-7 space-y-2">
                {LOADING_STEPS.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: i <= loadStep ? 1 : 0.2, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 text-xs font-mono"
                    style={{ color: i <= loadStep ? 'rgba(0,255,140,0.8)' : 'rgba(255,255,255,0.2)' }}
                  >
                    <span>{i <= loadStep ? '✓' : '○'}</span>{msg}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Results ── */}
        <AnimatePresence>
          {grants.length > 0 && (
            <motion.div
              ref={resultsRef}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Results header */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-aether-green animate-pulse" />
                    <span className="text-sm font-semibold text-white">{grants.length} Grants Matched</span>
                    <span className="text-xs text-white/30 font-mono">· sorted by compatibility</span>
                  </div>
                  <SourcesBar sources={sources} />
                </div>
                {topMatch && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-aether-green/8 border border-aether-green/20">
                    <TrendingUp size={13} className="text-aether-green" />
                    <span className="text-xs font-mono text-white/60">Top match: </span>
                    <span className="text-xs font-semibold text-aether-green">{topMatch.matchScore}% — {topMatch.organization}</span>
                  </div>
                )}
              </div>

              {/* Search + Filter bar */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search grants, orgs, tags..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-aether-green/40 transition-all"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', color: '#fff' }}
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white">
                      <X size={13} />
                    </button>
                  )}
                </div>

                {/* Filter tabs */}
                <div className="flex gap-1.5 p-1 rounded-xl bg-white/3 border border-white/6 flex-wrap">
                  {FILTERS.map(f => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all capitalize"
                      style={{
                        background: filter === f ? 'rgba(0,255,140,0.15)' : 'transparent',
                        color: filter === f ? '#00FF8C' : 'rgba(255,255,255,0.35)',
                        border: filter === f ? '1px solid rgba(0,255,140,0.3)' : '1px solid transparent',
                      }}
                    >
                      {f === 'All' ? 'All' : ORG_TYPE_CONFIG[f as keyof typeof ORG_TYPE_CONFIG]?.label ?? f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Count after filter */}
              {(filter !== 'All' || searchQuery) && (
                <p className="text-xs font-mono text-white/30">
                  Showing {visibleGrants.length} of {grants.length} grants
                  {filter !== 'All' && ` · Filtered: ${ORG_TYPE_CONFIG[filter as keyof typeof ORG_TYPE_CONFIG]?.label}`}
                </p>
              )}

              {/* Grant cards grid */}
              {visibleGrants.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {visibleGrants.map((grant, i) => (
                    <GrantCard key={grant.id} grant={grant} index={i} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-white/30 text-sm font-mono">
                  No grants match your filters. Try clearing the search.
                </div>
              )}

              {/* Bottom CTA */}
              <div className="mt-8 p-6 rounded-2xl border border-aether-purple/20 bg-aether-purple/5 text-center">
                <Sparkles size={20} className="text-aether-purple mx-auto mb-3" />
                <p className="text-white/70 text-sm font-semibold mb-1">Want AI to write your grant proposal?</p>
                <p className="text-white/40 text-xs mb-4">Use the Strategy Engine above to get personalized outreach scripts and proposal frameworks for any of these grants.</p>
                <button
                  onClick={() => document.getElementById('app')?.scrollIntoView({ behavior: 'smooth' })}
                  className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white"
                >
                  <Send size={14} />
                  Generate Application Strategy
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
