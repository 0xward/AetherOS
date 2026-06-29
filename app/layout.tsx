import type { Metadata } from 'next';
import '@fontsource/cormorant-garamond/300.css';
import '@fontsource/cormorant-garamond/400.css';
import '@fontsource/cormorant-garamond/500.css';
import '@fontsource/cormorant-garamond/600.css';
import '@fontsource/cormorant-garamond/700.css';
import '@fontsource/space-grotesk/300.css';
import '@fontsource/space-grotesk/400.css';
import '@fontsource/space-grotesk/500.css';
import '@fontsource/space-grotesk/600.css';
import '@fontsource/space-grotesk/700.css';
import '@fontsource/space-mono/400.css';
import '@fontsource/space-mono/700.css';
import './globals.css';
import { StacksProvider } from '@/components/providers/StacksProvider';

export const metadata: Metadata = {
  metadataBase: new URL('https://aether-os-psi.vercel.app'),

  title: {
    default: 'AetherOS — AI Network Intelligence on Bitcoin',
    template: '%s | AetherOS',
  },
  description:
    'AetherOS is an AI-powered professional network intelligence platform built on the Stacks blockchain (Bitcoin L2). Generate 7-step networking strategies, stake $AetherOS tokens, and own your data on Gaia — all secured by Bitcoin.',

  keywords: [
    'AetherOS', 'Stacks blockchain', 'Bitcoin L2', 'AI networking', 'Web3', 'STX', 'sBTC',
    'relationship intelligence', 'professional networking', 'Clarity smart contracts',
    'Gaia storage', 'decentralized AI', 'Groq', 'SIP-010', 'Hiro wallet', 'Leather wallet',
  ],

  authors: [{ name: '0xward', url: 'https://github.com/0xward' }],
  creator: '0xward',
  publisher: 'AetherOS',

  // ── Open Graph (Facebook, LinkedIn, WhatsApp, Telegram, Discord) ──────────
  openGraph: {
    type: 'website',
    url: 'https://aether-os-psi.vercel.app',
    siteName: 'AetherOS',
    title: 'AetherOS — AI Network Intelligence on Bitcoin',
    description:
      'Generate elite 7-step professional networking strategies powered by Groq AI — secured on the Stacks blockchain (Bitcoin L2). Connect your wallet and own your intelligence.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AetherOS — AI Network Intelligence on Bitcoin',
        type: 'image/png',
      },
    ],
    locale: 'en_US',
  },

  // ── Twitter / X Card ─────────────────────────────────────────────────────
  twitter: {
    card: 'summary_large_image',
    site: '@0xward',
    creator: '@0xward',
    title: 'AetherOS — AI Network Intelligence on Bitcoin',
    description:
      'Elite AI networking strategies secured on Stacks (Bitcoin L2). Connect wallet → generate strategy → own your data on Gaia.',
    images: ['/og-image.png'],
  },

  // ── Robots ────────────────────────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // ── Icons ─────────────────────────────────────────────────────────────────
  icons: {
    icon: '/AetherOS_Logo.png',
    shortcut: '/AetherOS_Logo.png',
    apple: '/AetherOS_Logo.png',
  },

  // ── Talent.app Domain Verification ───────────────────────────────────────
  verification: {
    other: {
      'talentapp:project_verification': [
        'ffe3b1d64203299ece7da7dde52995e648d9cd26917467848fb736e481edbb5b13c28783bb113fe0d332c0d73ca5f6438c8fa7163ce9ccda6f06d34ed9267efa',
      ],
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-body bg-aether-black text-white antialiased">
        <StacksProvider>
          {children}
        </StacksProvider>
      </body>
    </html>
  );
}
