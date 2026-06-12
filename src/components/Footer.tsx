'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Github, Twitter, Globe, MessageSquare } from 'lucide-react';

const footerLinks = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Token ($AetherOS)', href: '#token' },
    { label: 'Launch App', href: '/app' },
  ],
  Company: [
    { label: 'About', href: '#about' },
    { label: 'FAQ', href: '#about' },
    { label: 'Stacks Ecosystem', href: 'https://stacks.co', external: true },
    { label: 'Hiro Explorer', href: 'https://explorer.hiro.so', external: true },
  ],
  Developers: [
    { label: 'Stacks Docs', href: 'https://docs.stacks.co', external: true },
    { label: 'Clarity Language', href: 'https://clarity-lang.org', external: true },
    { label: 'SIP-010 Standard', href: 'https://github.com/stacksgov/sips', external: true },
    { label: 'Get Hiro Wallet', href: 'https://wallet.hiro.so', external: true },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#050507]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <div className="relative w-9 h-9">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-pink-500/30 to-purple-600/30 blur-sm" />
                <Image
                  src="/AetherOS_Logo.png"
                  alt="AetherOS Logo"
                  width={36}
                  height={36}
                  className="relative rounded-lg object-contain"
                  style={{ filter: 'drop-shadow(0 0 8px rgba(139,49,255,0.5))' }}
                />
              </div>
              <span className="font-display text-xl font-semibold text-white">AetherOS</span>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed mb-6 max-w-xs">
              AI-powered relationship intelligence platform, secured by Bitcoin via the Stacks blockchain. 
              Your network, your intelligence, your chain.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg glass-card border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/25 transition-all"
              >
                <Twitter size={15} />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg glass-card border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/25 transition-all"
              >
                <Github size={15} />
              </a>
              <a
                href="https://stacks.co"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg glass-card border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/25 transition-all"
              >
                <Globe size={15} />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs font-mono uppercase tracking-widest text-white/30 mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link, i) => (
                  <li key={i}>
                    {'external' in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-white/50 hover:text-white transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <a
                        href={link.href}
                        className="text-sm text-white/50 hover:text-white transition-colors"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/25 font-mono">
            © 2026 AetherOS. All Rights Reserved. Built with Clarity on Stacks.
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-mono text-white/25">Stacks Mainnet — Live</span>
            </div>
            <a
              href="mailto:0xward.dev@gmail.com?subject=AetherOS%20Feedback&body=Hi%20AetherOS%20team%2C%0A%0A"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{ background: 'rgba(139,49,255,0.08)', border: '1px solid rgba(139,49,255,0.2)', color: 'rgba(139,49,255,0.8)' }}
            >
              <MessageSquare size={11} />
              Feedback & Suggestions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
