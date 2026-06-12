'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Sparkles, Target, Globe, Lock } from 'lucide-react';
import Image from 'next/image';

const faqs = [
  {
    q: 'What is AetherOS?',
    a: 'AetherOS is an AI-powered professional network intelligence platform built on the Stacks blockchain. It uses advanced AI to generate tailored networking strategies based on your background, helping you build high-value professional relationships strategically.',
  },
  {
    q: 'Why is AetherOS built on Stacks?',
    a: 'Stacks enables smart contracts that settle on Bitcoin — giving AetherOS Bitcoin-level security and immutability without sacrificing functionality. Your identity and strategy history are anchored to the most secure blockchain in existence.',
  },
  {
    q: 'Do I need to connect a wallet to use AetherOS?',
    a: 'You can try one free strategy without a wallet. However, connecting your Hiro or Leather wallet (Stacks wallets) unlocks unlimited strategies, on-chain strategy history, and access to premium intelligence tiers using $AetherOS tokens.',
  },
  {
    q: 'Which wallets are supported?',
    a: 'AetherOS supports all Stacks-compatible wallets including Hiro Wallet (web & mobile) and Leather Wallet. Any wallet that supports the Stacks Connect protocol will work seamlessly.',
  },
  {
    q: 'What is the $AetherOS token?',
    a: '$AetherOS is a SIP-010 fungible token on the Stacks blockchain. It powers premium feature access, governance voting, and staking rewards within the AetherOS ecosystem. The contract is written in Clarity — a decidable language that makes it auditable and predictable.',
  },
  {
    q: 'Is my professional data private?',
    a: 'Yes. AetherOS never sells or shares your data. Wallet authentication means your session is cryptographically yours. Strategy results are processed by AI and can be optionally stored on-chain — entirely under your control.',
  },
  {
    q: 'How does the AI strategy engine work?',
    a: 'The engine follows a 7-step intelligence process: context analysis, target selection, relationship angle identification, personalized message generation, timing & channel strategy, a 2–4 week relationship building plan, and psychological edge analysis.',
  },
  {
    q: 'Is AetherOS available on mobile?',
    a: 'Yes, AetherOS is fully responsive and works on all devices. You can connect your Hiro or Leather mobile wallet and use the full platform from your phone.',
  },
];

const values = [
  {
    icon: <Sparkles size={20} />,
    title: 'Intelligence-First',
    description: 'Every feature is designed to give you a genuine strategic advantage in professional networking.',
    color: '#FF2D9B',
  },
  {
    icon: <Lock size={20} />,
    title: 'Decentralized & Private',
    description: 'Your data belongs to you. Bitcoin-backed security via Stacks keeps it immutable and tamper-proof.',
    color: '#8B31FF',
  },
  {
    icon: <Target size={20} />,
    title: 'Precision Over Volume',
    description: 'AetherOS is built for quality connections — targeted, strategic, and deeply personalized outreach.',
    color: '#00FF8C',
  },
  {
    icon: <Globe size={20} />,
    title: 'Truly Yours',
    description: 'A wallet is your identity. No accounts to lose, no passwords to forget. Own your network intelligence.',
    color: '#6B21FF',
  },
];

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07 }}
      className={`border-b border-white/5 ${index === 0 ? 'border-t' : ''}`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="font-medium text-white/80 group-hover:text-white transition-colors pr-4">{q}</span>
        <ChevronDown
          size={18}
          className={`text-white/30 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-aether-purple' : ''}`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="text-white/50 text-sm leading-relaxed pb-5">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function About() {
  return (
    <section id="about" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
        <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] rounded-full bg-purple-600/5 blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* About Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border border-purple-500/20 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-aether-purple animate-pulse" />
            <span className="text-xs font-mono text-white/50 tracking-widest uppercase">About AetherOS</span>
          </div>
          <h2 className="font-display text-5xl md:text-6xl font-bold mb-6">
            <span className="text-white">The Future of</span>{' '}
            <span className="gradient-text">Professional Intelligence</span>
          </h2>
          <p className="text-white/50 text-lg max-w-3xl mx-auto leading-relaxed">
            AetherOS was built on a simple belief: relationships are the most valuable asset a professional can have. 
            In a world of generic networking noise, we restore depth, strategy, and quality — secured forever on the blockchain.
          </p>
        </motion.div>

        {/* About Content */}
        <div className="grid lg:grid-cols-2 gap-16 mb-24">
          {/* Logo & Mission */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-8"
          >
            <div className="glass-card rounded-3xl p-10 border border-white/5 flex items-center justify-center"
              style={{ background: 'radial-gradient(circle at center, rgba(139,49,255,0.08), transparent)' }}>
              <div className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-pink-500/40 to-purple-600/40 blur-xl" />
                  <Image
                    src="/AetherOS_Logo.png"
                    alt="AetherOS"
                    width={96}
                    height={96}
                    className="relative rounded-2xl"
                    style={{ filter: 'drop-shadow(0 0 20px rgba(139,49,255,0.6))' }}
                  />
                </div>
                <h3 className="font-display text-4xl font-bold gradient-text mb-2">AetherOS</h3>
                <p className="text-white/40 font-mono text-sm">Autonomous Intelligence OS · v1.0</p>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 border border-white/5">
              <p className="text-white/60 leading-relaxed text-sm mb-4">
                AetherOS is an elite network intelligence platform designed for those who understand that 
                relationships are the most valuable asset in any career or business.
              </p>
              <p className="text-white/60 leading-relaxed text-sm">
                Using Groq + the Stacks blockchain, AetherOS acts as your personal strategic consultant — 
                building your &quot;High-Value Network&quot; with military-grade precision and Bitcoin-level security.
              </p>
            </div>
          </motion.div>

          {/* Values */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {values.map((val, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-6 border border-white/5 hover:border-white/15 transition-all group"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${val.color}15`, border: `1px solid ${val.color}25`, color: val.color }}
                >
                  {val.icon}
                </div>
                <h4 className="font-semibold text-white mb-2 group-hover:gradient-text-pink-purple transition-all">{val.title}</h4>
                <p className="text-sm text-white/50 leading-relaxed">{val.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <div className="text-center mb-12">
            <h3 className="font-display text-4xl md:text-5xl font-bold mb-4">
              <span className="text-white">Frequently Asked</span>{' '}
              <span className="gradient-text-pink-purple">Questions</span>
            </h3>
            <p className="text-white/40 text-sm">Everything you need to know about AetherOS.</p>
          </div>

          <div className="glass-card rounded-2xl p-8 border border-white/5">
            {faqs.map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} index={i} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
