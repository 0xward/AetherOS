'use client';

import { motion } from 'framer-motion';

const steps = [
  {
    number: '01',
    title: 'Connect Your Stacks Wallet',
    description: 'Authenticate with your Hiro or Leather wallet. Your on-chain identity becomes your AetherOS access key — no email, no passwords.',
    color: '#FF2D9B',
  },
  {
    number: '02',
    title: 'Input Your Professional Context',
    description: 'Share your background, industry, current position, and networking goals. AetherOS uses this to build your strategic profile.',
    color: '#8B31FF',
  },
  {
    number: '03',
    title: 'AI Analyzes Your Unfair Advantages',
    description: 'Our Groq-powered engine maps your positioning, identifies leverage points, and selects 3–5 ideal high-value target profiles.',
    color: '#6B21FF',
  },
  {
    number: '04',
    title: 'Receive Your Personalized Blueprint',
    description: 'Get a 7-step strategic networking plan: target selection, outreach messages, timing strategy, psychological edge analysis, and more.',
    color: '#FF2D9B',
  },
  {
    number: '05',
    title: 'Execute & Track On-Chain',
    description: 'Your strategies are saved with your wallet identity on Stacks. Access your complete history at any time, fully decentralized.',
    color: '#00FF8C',
  },
  {
    number: '06',
    title: 'Unlock Premium with $AetherOS',
    description: 'Hold AetherOS tokens to unlock advanced intelligence tiers, priority AI processing, and exclusive networking templates.',
    color: '#8B31FF',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-32 overflow-hidden">
      {/* Diagonal accent */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
        <div className="absolute -bottom-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-500/50 to-transparent" />
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full bg-purple-600/5 blur-[120px]" />
        <div className="absolute top-0 left-0 w-[300px] h-[300px] rounded-full bg-pink-500/5 blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-start">
          {/* Left: Header */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="sticky top-32"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border border-pink-500/20 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-aether-pink animate-pulse" />
              <span className="text-xs font-mono text-white/50 tracking-widest uppercase">How It Works</span>
            </div>
            <h2 className="font-display text-5xl md:text-6xl font-bold leading-tight mb-8">
              <span className="gradient-text-pink-purple">Six Steps</span>
              <br />
              <span className="text-white">to Strategic</span>
              <br />
              <span className="text-white">Network Mastery</span>
            </h2>
            <p className="text-white/50 text-lg leading-relaxed mb-10">
              AetherOS turns your professional background into a precision-engineered networking weapon. 
              Built on Stacks, every strategy you generate is secured by Bitcoin&apos;s proof-of-work and owned entirely by you.
            </p>

            {/* Stacks Feature Callout */}
            <div className="glass-card rounded-2xl p-6 border border-purple-500/20">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">⚡</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Powered by Stacks + Bitcoin</h4>
                  <p className="text-sm text-white/50 leading-relaxed">
                    Stacks enables smart contracts that settle on Bitcoin. Your AetherOS identity and strategy history inherit Bitcoin-level security without compromise.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Steps */}
          <div className="flex flex-col gap-4">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group glass-card rounded-2xl p-6 border border-white/5 hover:border-white/15 transition-all"
              >
                <div className="flex items-start gap-5">
                  {/* Step Number */}
                  <div
                    className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-display text-xl font-bold"
                    style={{
                      background: `linear-gradient(135deg, ${step.color}20, ${step.color}10)`,
                      border: `1px solid ${step.color}30`,
                      color: step.color,
                    }}
                  >
                    {step.number}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-white text-lg mb-2 group-hover:gradient-text-pink-purple transition-all">
                      {step.title}
                    </h3>
                    <p className="text-sm text-white/50 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
