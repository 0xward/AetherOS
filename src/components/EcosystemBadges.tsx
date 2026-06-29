'use client';

/**
 * EcosystemBadges.tsx
 * Logo-logo resmi ekosistem Stacks — pakai file lokal dari /public/logos/
 *
 * Mapping logo:
 * - Gaia     → /logos/gaia-logo.png     (Blockstack icon)
 * - Clarity  → /logos/stacks-logo.png   (STX orange)
 * - STX      → /logos/stx-logo.png      (STX purple)
 * - Leather  → /logos/leather-logo.png  (Leather L)
 * - Groq     → /logos/groq-logo.png     (Groq g)
 * - Bitcoin  → CoinGecko CDN (reliable public)
 * - Hiro     → CoinGecko CDN
 * - sBTC     → inline SVG (no official logo file)
 */

import { motion } from 'framer-motion';
import Image from 'next/image';

// ─── Types ────────────────────────────────────────────────────────────────────

interface EcoBadge {
  name: string;
  description: string;
  color: string;
  logoUrl: string | null;
  inlineSvg?: React.ReactNode;
  isLocal?: boolean; // true = /public/logos/, false = external CDN
}

// ─── Inline SVGs untuk yang tidak punya file ─────────────────────────────────

function SbtcIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="#FF5500" />
      <text x="5" y="22" fontSize="18" fontWeight="900" fontFamily="serif" fill="white">₿</text>
      <rect x="18" y="14" width="10" height="10" rx="2" fill="#1A1A1A" />
      <text x="19.5" y="22.5" fontSize="10" fontWeight="bold" fontFamily="monospace" fill="#FF5500">S</text>
    </svg>
  );
}

// ─── Badge definitions ────────────────────────────────────────────────────────

const BADGES: EcoBadge[] = [
  {
    name: 'Bitcoin',
    description: 'L1 Security Anchor',
    color: '#F7931A',
    logoUrl: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
    isLocal: false,
  },
  {
    name: 'STX',
    description: 'Native Token',
    color: '#5546FF',
    logoUrl: '/logos/stx-logo.png',
    isLocal: true,
  },
  {
    name: 'sBTC',
    description: '1:1 BTC on Stacks',
    color: '#FF5500',
    logoUrl: null,
    inlineSvg: <SbtcIcon size={28} />,
  },
  {
    name: 'Leather',
    description: 'Stacks Wallet',
    color: '#E8E0D5',
    logoUrl: '/logos/leather-logo.png',
    isLocal: true,
  },
  {
    name: 'Xverse',
    description: 'Bitcoin & Stacks Wallet',
    color: '#6B5CE7',
    logoUrl: '/logos/xverse-logo.png',
    isLocal: true,
  },
  {
    name: 'Hiro',
    description: 'Explorer & API',
    color: '#7B4FFF',
    logoUrl: 'https://assets.coingecko.com/coins/images/2069/small/Stacks_logo_full.png',
    isLocal: false,
  },
  {
    name: 'Gaia',
    description: 'Decentralized Storage',
    color: '#E91E8C',
    logoUrl: '/logos/gaia-logo.png',
    isLocal: true,
  },
  {
    name: 'Clarity',
    description: 'Smart Contract Language',
    color: '#FF5500',
    logoUrl: '/logos/stacks-logo.png',
    isLocal: true,
  },
  {
    name: 'Groq',
    description: 'AI Inference',
    color: '#E8432D',
    logoUrl: '/logos/groq-logo.png',
    isLocal: true,
  },
];

// ─── LogoBadge helper ─────────────────────────────────────────────────────────

function LogoBadge({ badge, size = 28 }: { badge: EcoBadge; size?: number }) {
  if (badge.inlineSvg) {
    return <>{badge.inlineSvg}</>;
  }
  return (
    <Image
      src={badge.logoUrl!}
      alt={badge.name}
      width={size}
      height={size}
      className="rounded-lg object-contain"
      unoptimized={!badge.isLocal} // skip optimization for external CDN only
    />
  );
}

// ─── EcoBadgeRow — horizontal pill badges ────────────────────────────────────

export function EcoBadgeRow({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 flex-wrap ${className}`}>
      {BADGES.map((badge, i) => (
        <motion.div
          key={badge.name}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.05 }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
          style={{
            background: `${badge.color}10`,
            border: `1px solid ${badge.color}25`,
          }}
          title={badge.description}
        >
          <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
            <LogoBadge badge={badge} size={20} />
          </div>
          <span className="text-xs font-mono font-semibold" style={{ color: badge.color }}>
            {badge.name}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

// ─── EcoBadgeGrid — grid dengan deskripsi ────────────────────────────────────

export function EcoBadgeGrid({ className = '' }: { className?: string }) {
  return (
    <div className={`grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-3 ${className}`}>
      {BADGES.map((badge, i) => (
        <motion.div
          key={badge.name}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.06 }}
          className="glass-card rounded-2xl p-4 border border-white/5 hover:border-white/15 transition-all group flex flex-col items-center gap-2 text-center"
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden"
            style={{ background: `${badge.color}15`, border: `1px solid ${badge.color}25` }}
          >
            <LogoBadge badge={badge} size={32} />
          </div>
          <div>
            <p className="text-xs font-semibold font-mono" style={{ color: badge.color }}>
              {badge.name}
            </p>
            <p className="text-[10px] text-white/30 mt-0.5 leading-tight">{badge.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ─── EcoLogoTicker — scrolling logo strip ────────────────────────────────────

export function EcoLogoTicker({ className = '' }: { className?: string }) {
  const doubled = [...BADGES, ...BADGES];
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="logo-ticker-track">
        {doubled.map((badge, i) => (
          <div
            key={i}
            className="flex items-center gap-2 px-4 py-2 rounded-xl flex-shrink-0"
            style={{
              background: `${badge.color}08`,
              border: `1px solid ${badge.color}18`,
            }}
          >
            <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
              <LogoBadge badge={badge} size={20} />
            </div>
            <span className="text-xs font-mono text-white/50 whitespace-nowrap">{badge.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EcoBadgeGrid;
