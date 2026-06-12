'use client';

import { motion } from 'framer-motion';
import { Wallet, ArrowRight } from 'lucide-react';
import { useStacks } from '@/components/providers/StacksProvider';

const tickerItems = [
  '🧠 AI Network Intelligence',
  '🏆 50+ Live Grant Programs',
  '💰 Google.org Grants',
  '⚡ Stacks Blockchain',
  '🔒 Bitcoin-Secured',
  '🎯 7-Step Strategy Engine',
  '🌐 Gitcoin QF Rounds',
  '💎 $AetherOS Token',
  '🏛️ Federal Grant Matching',
  '🚀 Meta Research Awards',
  '🔑 Wallet-Native Auth',
  '📊 Relationship Analytics',
  '🤝 Ethereum Foundation',
  '✨ On-Chain History',
];

export function Ticker() {
  const doubled = [...tickerItems, ...tickerItems];

  return (
    <div className="relative overflow-hidden py-4 border-y border-white/5 bg-white/[0.01]">
      <div className="ticker-track">
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-2 px-6 text-xs font-mono text-white/30 whitespace-nowrap">
            {item}
            <span className="text-aether-purple opacity-40">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function CTASection() {
  const { isConnected, connect } = useStacks();

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-pink-500/10 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-purple-600/10 blur-[100px]" />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border border-pink-500/20 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-aether-pink animate-pulse" />
            <span className="text-xs font-mono text-white/50 tracking-widest uppercase">Ready to Dominate?</span>
          </div>

          <h2 className="font-display text-5xl md:text-7xl font-bold leading-[0.95] mb-8">
            <span className="text-white">Your Network.</span>
            <br />
            <span className="gradient-text">Your Intelligence.</span>
            <br />
            <span className="text-white">Your Chain.</span>
          </h2>

          <p className="text-white/50 text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
            Join the elite professionals who use AetherOS to turn strategic networking into their greatest competitive advantage. 
            Secured by Bitcoin. Powered by AI.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => {
                if (!isConnected) { connect(); } else { window.location.href = '/app'; }
              }}
              className="btn-primary flex items-center gap-3 px-8 py-4 rounded-xl text-base font-bold text-white glow-purple"
            >
              <Wallet size={18} />
              <span>{isConnected ? 'Open App' : 'Connect Wallet & Begin'}</span>
              <ArrowRight size={16} />
            </button>
            <a
              href="https://stacks.co/build/get-started"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-white/70"
            >
              Learn About Stacks
            </a>
          </div>

          {/* Social proof */}
          <div className="mt-16 flex items-center justify-center gap-8 flex-wrap">
            {[
              { label: 'Bitcoin-Secured', sublabel: 'via Stacks PoX' },
              { label: 'Open Source', sublabel: 'Clarity Contract' },
              { label: 'Privacy First', sublabel: 'No Email Required' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="text-sm font-semibold text-white/60">{item.label}</div>
                <div className="text-xs text-white/25 font-mono mt-0.5">{item.sublabel}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
