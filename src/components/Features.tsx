'use client';

import { motion } from 'framer-motion';
import { Brain, Link2, BarChart3, Shield, Zap, Lock, Globe, Target, Handshake, Award, Users } from 'lucide-react';

const features = [
  {
    icon: <Brain size={28} />,
    title: 'AI Strategy Engine',
    description: 'Powered by Groq, AetherOS generates 7-step professional networking blueprints tailored to your background, industry, and goals.',
    color: 'from-pink-500 to-purple-600',
    glow: 'rgba(255,45,155,0.2)',
    tag: 'Core Feature',
  },
  {
    icon: <Link2 size={28} />,
    title: 'Stacks Blockchain Identity',
    description: 'Your strategies and network identity are anchored on the Stacks blockchain — Bitcoin-secured, tamper-proof, and truly yours.',
    color: 'from-purple-600 to-blue-500',
    glow: 'rgba(139,49,255,0.2)',
    tag: 'Web3 Native',
  },
  {
    icon: <Target size={28} />,
    title: 'High-Value Target Profiling',
    description: 'AetherOS identifies 3–5 types of high-value connections most relevant to your goals, with detailed outreach angles and timing strategies.',
    color: 'from-green-400 to-cyan-500',
    glow: 'rgba(0,255,140,0.15)',
    tag: 'Intelligence',
  },
  {
    icon: <BarChart3 size={28} />,
    title: 'Relationship Analytics',
    description: 'Track connection priorities, engagement scores, and relationship-building timelines with behavioral analytics.',
    color: 'from-orange-400 to-pink-500',
    glow: 'rgba(255,150,50,0.2)',
    tag: 'Analytics',
  },
  {
    icon: <Shield size={28} />,
    title: 'On-Chain Strategy History',
    description: 'Every strategy you generate is stored with your Stacks wallet identity — persistent, private, and always accessible.',
    color: 'from-pink-500 to-red-500',
    glow: 'rgba(255,45,155,0.15)',
    tag: 'Decentralized',
  },
  {
    icon: <Zap size={28} />,
    title: 'SIP-010 Token Utility',
    description: 'The AetherOS ($AetherOS) token powers premium strategy unlocks, governance, and exclusive intelligence tiers.',
    color: 'from-yellow-400 to-orange-500',
    glow: 'rgba(255,220,50,0.2)',
    tag: 'Tokenomics',
  },
  {
    icon: <Globe size={28} />,
    title: 'Cross-Platform Outreach',
    description: 'Get channel-specific messaging strategies for LinkedIn, X/Twitter, email, events, and more — with psychological edge analysis.',
    color: 'from-cyan-400 to-blue-500',
    glow: 'rgba(0,200,255,0.2)',
    tag: 'Multi-Channel',
  },
  {
    icon: <Lock size={28} />,
    title: 'Privacy-First Architecture',
    description: 'Your data is never sold. Wallet-authenticated sessions ensure your professional strategies remain yours alone.',
    color: 'from-purple-500 to-pink-600',
    glow: 'rgba(139,49,255,0.2)',
    tag: 'Privacy',
  },
  {
    icon: <Handshake size={28} />,
    title: 'sBTC Warm Intro Bounties',
    description: 'Pledge sBTC to source warm introductions. Creator-funded bounties recorded on the aetheros-bounty-registry contract, paid wallet-to-wallet on approval. No platform custody.',
    color: 'from-orange-400 to-yellow-500',
    glow: 'rgba(247,147,26,0.22)',
    tag: 'Bitcoin Native',
  },
  {
    icon: <Award size={28} />,
    title: 'On-Chain Certificate Badges',
    description: 'Non-transferable SBT certificates (aetheros-certificate-sbt) prove verified contributions and reputation — your tamper-proof Web3 networking resume.',
    color: 'from-amber-400 to-orange-500',
    glow: 'rgba(255,180,50,0.2)',
    tag: 'Reputation',
  },
  {
    icon: <Users size={28} />,
    title: 'Gaia-First Private CRM',
    description: 'A decentralized contact CRM stored on Stacks Gaia. Track targets, notes, and AI-drafted outreach — owned by your wallet, not a centralized server.',
    color: 'from-green-400 to-emerald-500',
    glow: 'rgba(0,255,140,0.18)',
    tag: 'Decentralized',
  },
];

export default function Features() {
  return (
    <section id="features" className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-transparent to-purple-500/50" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border border-purple-500/20 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-aether-purple animate-pulse" />
            <span className="text-xs font-mono text-white/50 tracking-widest uppercase">Platform Capabilities</span>
          </div>
          <h2 className="font-display text-5xl md:text-6xl font-bold mb-6">
            <span className="text-white">Everything You Need to</span>{' '}
            <span className="gradient-text">Dominate Your Network</span>
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto leading-relaxed">
            AetherOS combines cutting-edge AI with the immutability of the Bitcoin-anchored Stacks blockchain to give you a strategic edge in professional networking.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className={`group relative glass-card rounded-2xl p-6 border border-white/5 hover:border-white/15 transition-all duration-300 ${
                i === 0 || i === 2 ? 'lg:col-span-2' : ''
              }`}
              style={{
                '--glow-color': feature.glow,
              } as React.CSSProperties}
            >
              {/* Glow on hover */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ boxShadow: `inset 0 0 60px ${feature.glow}` }}
              />

              <div className="relative">
                {/* Tag */}
                <span className="inline-block px-2 py-0.5 rounded-md bg-white/5 text-xs font-mono text-white/30 mb-4 border border-white/5">
                  {feature.tag}
                </span>

                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} p-[1px] mb-5`}>
                  <div className="w-full h-full rounded-xl bg-[#111118] flex items-center justify-center">
                    <div className={`bg-gradient-to-br ${feature.color} bg-clip-text`}
                      style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      {feature.icon}
                    </div>
                  </div>
                </div>

                <h3 className="font-display text-xl font-semibold text-white mb-3 group-hover:gradient-text-pink-purple transition-all">
                  {feature.title}
                </h3>
                <p className="text-sm text-white/50 leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
