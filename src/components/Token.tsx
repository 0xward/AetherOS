'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Coins, TrendingUp, Vote, Crown, ArrowRight, Copy, Check } from 'lucide-react';

const TOKEN_CA = 'SPQ189E66S20X7ATY7794HBY6743JE9YJMCKHAEF.AetherOS';

const tokenUtilities = [
  {
    icon: <Crown size={22} />,
    title: 'Premium Access',
    description: 'Hold $AetherOS to unlock elite intelligence tiers with deeper AI analysis and priority processing.',
    color: '#FF2D9B',
  },
  {
    icon: <Vote size={22} />,
    title: 'Governance Rights',
    description: 'Token holders vote on protocol upgrades, new feature priorities, and community treasury allocations.',
    color: '#8B31FF',
  },
  {
    icon: <TrendingUp size={22} />,
    title: 'Staking Rewards',
    description: 'Stake $AetherOS to earn yield from platform fees, creating long-term alignment between holders and protocol growth.',
    color: '#00FF8C',
  },
  {
    icon: <Coins size={22} />,
    title: 'Strategy Credits',
    description: 'Use $AetherOS tokens to generate strategies, with advanced models requiring token-based access.',
    color: '#6B21FF',
  },
];

const distribution = [
  { label: 'Community & Ecosystem', percent: 40, color: '#FF2D9B' },
  { label: 'Team & Advisors', percent: 20, color: '#8B31FF' },
  { label: 'Protocol Treasury', percent: 25, color: '#00FF8C' },
  { label: 'Public Sale', percent: 15, color: '#6B21FF' },
];

export default function Token() {
  const [copied, setCopied] = useState(false);

  const copyCA = () => {
    navigator.clipboard.writeText(TOKEN_CA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="token" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-purple-600/5 blur-[150px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border border-green-500/20 mb-6">
            <Coins size={13} className="text-aether-green" />
            <span className="text-xs font-mono text-white/50 tracking-widest uppercase">$AetherOS Token</span>
          </div>
          <h2 className="font-display text-5xl md:text-6xl font-bold mb-6">
            <span className="text-white">The Intelligence</span>{' '}
            <span className="gradient-text-purple-green">Economy</span>
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            $AetherOS is a SIP-010 compliant fungible token on the Stacks blockchain, with a maximum supply of 100,000,000,000,000 tokens and 6 decimals.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Token Details Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="glass-card rounded-2xl p-8 border border-gradient mb-6">
              {/* Logo + Name */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 p-[1px]">
                  <div className="w-full h-full rounded-2xl bg-[#111118] flex items-center justify-center overflow-hidden">
                    <Image
                      src="/AetherOS_Logo.png"
                      alt="AetherOS"
                      width={40}
                      height={40}
                      className="object-contain"
                      style={{ filter: 'drop-shadow(0 0 6px rgba(139,49,255,0.6))' }}
                    />
                  </div>
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold text-white">AetherOS</h3>
                  <p className="text-white/40 font-mono text-sm">$AetherOS · SIP-010</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { label: 'Standard', value: 'SIP-010' },
                  { label: 'Blockchain', value: 'Stacks' },
                  { label: 'Max Supply', value: '100T' },
                  { label: 'Decimals', value: '6' },
                  { label: 'Security', value: 'Bitcoin PoW' },
                  { label: 'Language', value: 'Clarity' },
                ].map((item, i) => (
                  <div key={i} className="bg-white/3 rounded-xl p-3 border border-white/5">
                    <p className="text-xs text-white/30 font-mono mb-1">{item.label}</p>
                    <p className="text-sm font-semibold text-white">{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Contract Address — copyable */}
              <div className="bg-white/3 rounded-xl p-4 border border-purple-500/20">
                <p className="text-xs text-white/30 font-mono mb-2 uppercase tracking-widest">Contract Address</p>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-mono text-white/70 break-all leading-relaxed">{TOKEN_CA}</p>
                  <button
                    onClick={copyCA}
                    className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border border-white/10 hover:border-purple-500/40 hover:bg-purple-500/10 transition-all"
                  >
                    {copied
                      ? <Check size={13} className="text-aether-green" />
                      : <Copy size={13} className="text-white/40" />
                    }
                  </button>
                </div>
                {copied && (
                  <p className="text-xs text-aether-green font-mono mt-2">Copied to clipboard!</p>
                )}
              </div>
            </div>

            {/* Distribution Visual */}
            <div className="glass-card rounded-2xl p-6 border border-white/5">
              <h4 className="font-semibold text-white mb-5">Token Distribution</h4>
              <div className="space-y-3">
                {distribution.map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white/60">{item.label}</span>
                      <span className="font-mono" style={{ color: item.color }}>{item.percent}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.percent}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                        className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg, ${item.color}, ${item.color}80)` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Utility Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex flex-col gap-4"
          >
            <h3 className="font-display text-3xl font-bold text-white mb-2">Token Utility</h3>
            <p className="text-white/50 text-sm leading-relaxed mb-4">
              $AetherOS is the fuel that powers the intelligence economy. From premium access to governance rights, the token creates a self-sustaining ecosystem aligned with platform growth.
            </p>

            {tokenUtilities.map((util, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group glass-card rounded-xl p-5 border border-white/5 hover:border-white/15 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${util.color}15`, border: `1px solid ${util.color}25`, color: util.color }}
                  >
                    {util.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1 group-hover:gradient-text-pink-purple transition-all">
                      {util.title}
                    </h4>
                    <p className="text-sm text-white/50">{util.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-4 p-6 rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(255,45,155,0.1), rgba(139,49,255,0.1))',
                border: '1px solid rgba(139,49,255,0.2)',
              }}
            >
              <p className="text-white/70 text-sm mb-4">
                The AetherOS smart contract is deployed on Stacks mainnet using the Clarity language — auditable, predictable, and Bitcoin-anchored.
              </p>
              <a
                href={`https://explorer.hiro.so/token/${TOKEN_CA}?chain=mainnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-aether-purple hover:text-aether-pink transition-colors"
              >
                View on Stacks Explorer <ArrowRight size={14} />
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
