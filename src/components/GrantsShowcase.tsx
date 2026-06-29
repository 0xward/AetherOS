'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

// ─── Real SVG logos sourced from simple-icons (simpleicons.org) ───────────────

function LogoGoogle() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" fill="#4285F4"/>
      <path d="M5.43 14.29l-2.8 2.16C4.107 19.12 8.027 21.44 12.48 21.44c3.12 0 5.747-1.027 7.68-2.8l-2.8-2.16c-.947.64-2.507 1.32-4.88 1.32-3.653 0-6.76-2.467-7.87-5.827z" fill="#34A853"/>
      <path d="M2.63 7.107l2.8 2.133C6.573 6.573 9.28 5.12 12.48 5.12c2.107 0 3.773.8 5.04 1.947l2.76-2.76C18.133 2.293 15.627 1.04 12.48 1.04 8.027 1.04 4.107 3.36 2.63 7.107z" fill="#EA4335"/>
      <path d="M5.43 14.29C5.107 13.573 4.933 12.8 4.933 12s.174-1.573.497-2.267l-2.8-2.626C1.947 8.427 1.48 10.16 1.48 12c0 1.84.467 3.573 1.15 5.107l2.8-2.817z" fill="#FBBC05"/>
    </svg>
  );
}

function LogoMeta() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973.14.604.392 1.177.76 1.65.368.473.857.853 1.408 1.072.552.22 1.166.266 1.755.132.59-.134 1.14-.467 1.563-.942.424-.476.719-1.083.862-1.72.143-.637.136-1.3-.02-1.93-.157-.63-.473-1.214-.913-1.68.44-.467.756-1.05.913-1.68.157-.63.163-1.293.02-1.93-.143-.636-.438-1.243-.862-1.72-.424-.475-.973-.808-1.563-.942-.589-.134-1.203-.088-1.755.132zM12 8.454c.963 0 1.944.323 2.85.929-1.453 1.236-2.46 3.139-2.852 5.354-.393-2.215-1.4-4.118-2.853-5.354.906-.606 1.888-.929 2.851-.929h.004zm6.085-4.424c1.968 0 3.683 1.28 4.87 3.113C24.3 9.208 24 11.883 24 14.449c0 .706-.07 1.369-.21 1.973a4.7 4.7 0 0 1-.76 1.65c-.368.473-.857.853-1.408 1.072-.552.22-1.166.266-1.755.132-.59-.134-1.14-.467-1.563-.942-.424-.476-.719-1.083-.862-1.72-.143-.637-.136-1.3.02-1.93.157-.63.473-1.214.913-1.68-.44-.467-.756-1.05-.913-1.68-.157-.63-.163-1.293-.02-1.93.143-.636.438-1.243.862-1.72.424-.475.973-.808 1.563-.942.589-.134 1.203-.088 1.755.132z" fill="#0082FB"/>
    </svg>
  );
}

function LogoMicrosoft() {
  return (
    <svg viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
      <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
      <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
      <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
    </svg>
  );
}

function LogoAWS() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path d="M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576.04.063.056.127.056.183 0 .08-.048.16-.152.24l-.503.335a.383.383 0 0 1-.208.072c-.08 0-.16-.04-.239-.112a2.47 2.47 0 0 1-.287-.375 6.18 6.18 0 0 1-.248-.471c-.622.734-1.405 1.101-2.347 1.101-.67 0-1.205-.191-1.596-.574-.391-.384-.59-.894-.59-1.533 0-.678.239-1.23.726-1.644.487-.415 1.133-.623 1.955-.623.272 0 .551.024.846.064.296.04.6.104.918.176v-.583c0-.607-.127-1.030-.375-1.277-.255-.248-.686-.367-1.3-.367-.28 0-.568.031-.863.103-.295.072-.583.16-.862.272a2.287 2.287 0 0 1-.28.104.488.488 0 0 1-.127.023c-.112 0-.168-.08-.168-.247v-.391c0-.128.016-.224.056-.28a.597.597 0 0 1 .224-.167c.279-.144.614-.264 1.005-.36a4.84 4.84 0 0 1 1.246-.151c.95 0 1.644.216 2.091.647.439.43.662 1.085.662 1.963v2.586zm-3.24 1.214c.263 0 .534-.048.822-.144.287-.096.543-.271.758-.51.128-.152.224-.32.272-.512.047-.191.08-.423.08-.694v-.335a6.66 6.66 0 0 0-.735-.136 6.02 6.02 0 0 0-.75-.048c-.535 0-.926.104-1.19.32-.263.215-.39.518-.39.917 0 .375.095.655.295.846.191.2.47.296.838.296zm6.41.862c-.144 0-.24-.024-.304-.08-.064-.048-.12-.16-.168-.311L7.586 5.55a1.398 1.398 0 0 1-.072-.32c0-.128.064-.2.191-.2h.783c.151 0 .255.025.31.08.065.048.113.16.16.312l1.342 5.284 1.245-5.284c.04-.16.088-.264.151-.312a.549.549 0 0 1 .32-.08h.638c.152 0 .256.025.32.08.063.048.12.16.151.312l1.261 5.348 1.381-5.348c.048-.16.104-.264.16-.312a.52.52 0 0 1 .311-.08h.743c.127 0 .2.065.2.2 0 .04-.009.08-.017.128a1.137 1.137 0 0 1-.056.2l-1.923 6.17c-.048.16-.104.263-.168.311a.51.51 0 0 1-.303.08h-.687c-.151 0-.255-.024-.32-.08-.063-.056-.119-.16-.15-.32l-1.238-5.148-1.23 5.14c-.04.16-.087.264-.15.32-.065.056-.177.08-.32.08h-.687zm10.604.215c-.415 0-.83-.048-1.229-.143-.399-.096-.71-.2-.918-.32-.128-.071-.215-.151-.247-.223a.563.563 0 0 1-.048-.224v-.407c0-.167.064-.247.183-.247.048 0 .096.008.144.024.048.016.12.048.2.08.271.12.566.215.878.279.319.064.63.096.95.096.502 0 .894-.088 1.165-.264a.86.86 0 0 0 .415-.758.777.777 0 0 0-.215-.559c-.144-.151-.416-.287-.807-.415l-1.157-.36c-.583-.183-1.014-.454-1.277-.813a1.902 1.902 0 0 1-.4-1.158c0-.335.073-.63.216-.886.144-.255.335-.479.575-.654.24-.184.51-.32.83-.415.32-.096.655-.136 1.006-.136.175 0 .359.008.535.032.183.024.35.056.518.088.16.04.312.08.455.127.144.048.256.096.336.144a.69.69 0 0 1 .24.2.43.43 0 0 1 .071.263v.375c0 .168-.064.256-.184.256a.83.83 0 0 1-.303-.096 3.652 3.652 0 0 0-1.532-.311c-.455 0-.815.071-1.062.223-.248.152-.375.383-.375.71 0 .224.08.416.24.567.159.152.454.304.877.44l1.134.358c.574.184.99.44 1.237.767.247.327.367.702.367 1.117 0 .343-.072.655-.207.926-.144.272-.336.511-.583.703-.248.2-.543.343-.886.447-.36.111-.734.167-1.142.167zM21.347 16.31c-2.583 1.912-6.34 2.927-9.573 2.927-4.527 0-8.603-1.677-11.684-4.463-.241-.216-.025-.512.264-.343 3.328 1.932 7.44 3.096 11.688 3.096 2.867 0 6.02-.591 8.924-1.819.439-.19.806.287.381.602zm1.096-1.254c-.33-.422-2.183-.2-3.015-.1-.252.03-.29-.19-.063-.35 1.475-1.037 3.9-.737 4.182-.39.282.347-.073 2.75-1.463 3.895-.213.18-.416.084-.322-.15.313-.777 1.01-2.52.681-2.905z" fill="#FF9900"/>
    </svg>
  );
}

function LogoGitHub() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" fill="#ffffff"/>
    </svg>
  );
}

function LogoGitcoin() {
  return (
    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="16" cy="16" r="16" fill="#02E2AC"/>
      <path d="M16 6.4C10.698 6.4 6.4 10.698 6.4 16c0 4.112 2.587 7.644 6.272 9.032V20.8h2.304v4.232A9.626 9.626 0 0 0 16 25.6c5.302 0 9.6-4.298 9.6-9.6S21.302 6.4 16 6.4z" fill="white"/>
      <path d="M16 9.6c-3.53 0-6.4 2.87-6.4 6.4 0 2.792 1.797 5.168 4.32 6.024V18.56h1.92v3.52a6.408 6.408 0 0 0 .16.008c3.53 0 6.4-2.87 6.4-6.4 0-3.53-2.87-6.4-6.4-6.4z" fill="#02E2AC"/>
    </svg>
  );
}

function LogoEthereum() {
  return (
    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path d="M16 0l-.217.736v21.851l.217.217 9.928-5.868z" fill="#343434"/>
      <path d="M16 0L6.072 16.936l9.928 5.868V0z" fill="#8C8C8C"/>
      <path d="M16 24.572l-.122.149v7.585l.122.357 9.934-13.99z" fill="#3C3C3B"/>
      <path d="M16 32.663V24.572l-9.928-6.099z" fill="#8C8C8C"/>
      <path d="M16 22.804l9.928-5.868-9.928-4.514z" fill="#141414"/>
      <path d="M6.072 16.936L16 22.804v-10.38z" fill="#393939"/>
    </svg>
  );
}

function LogoPolygon() {
  return (
    <svg viewBox="0 0 38.4 33.5" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path d="M29 10.2a2.1 2.1 0 0 0-2.1 0l-4.9 2.9-3.3 1.9-4.9 2.9a2.1 2.1 0 0 1-2.1 0l-3.8-2.3a2.1 2.1 0 0 1-1-1.8V9.9a2 2 0 0 1 1-1.8l3.8-2.2a2.1 2.1 0 0 1 2.1 0l3.8 2.2a2.1 2.1 0 0 1 1 1.8v2.9l3.3-1.9V7.9a2 2 0 0 0-1-1.8l-7-4.1a2.1 2.1 0 0 0-2.1 0L3.1 6.1A2 2 0 0 0 2 7.9v8.3a2 2 0 0 0 1 1.8l7.1 4.1a2.1 2.1 0 0 0 2.1 0l4.9-2.8 3.3-1.9 4.9-2.8a2.1 2.1 0 0 1 2.1 0l3.8 2.2a2.1 2.1 0 0 1 1 1.8v3.9a2 2 0 0 1-1 1.8L28.4 27a2.1 2.1 0 0 1-2.1 0l-3.8-2.2a2.1 2.1 0 0 1-1-1.8v-2.9l-3.3 1.9v2.9a2 2 0 0 0 1 1.8l7.1 4.1a2.1 2.1 0 0 0 2.1 0l7.1-4.1a2.1 2.1 0 0 0 1-1.8v-8.2a2 2 0 0 0-1-1.8z" fill="#8247E5"/>
    </svg>
  );
}

function LogoSolana() {
  return (
    <svg viewBox="0 0 397.7 311.7" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <linearGradient id="sol-a" x1="360.88" y1="351.45" x2="141.21" y2="-69.99" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#9945ff"/>
        <stop offset=".14" stopColor="#8752f3"/>
        <stop offset=".42" stopColor="#5497d5"/>
        <stop offset=".68" stopColor="#43b4ca"/>
        <stop offset=".82" stopColor="#28e0b9"/>
        <stop offset="1" stopColor="#19fb9b"/>
      </linearGradient>
      <path d="M64.6 237.9a14.1 14.1 0 0 1 9.9-4.1h317.4c6.3 0 9.4 7.6 5 12L330.1 307.6a14.1 14.1 0 0 1-9.9 4.1H2.8c-6.3 0-9.4-7.6-5-12zM64.6 4.1A14.5 14.5 0 0 1 74.5 0h317.4c6.3 0 9.4 7.6 5 12L330.1 73.8a14.1 14.1 0 0 1-9.9 4.1H2.8c-6.3 0-9.4-7.6-5-12zM330.1 120.4a14.1 14.1 0 0 0-9.9-4.1H2.8c-6.3 0-9.4 7.6-5 12l67.8 61.7a14.1 14.1 0 0 0 9.9 4.1h317.4c6.3 0 9.4-7.6 5-12z" fill="url(#sol-a)"/>
    </svg>
  );
}

function LogoOptimism() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="50" cy="50" r="50" fill="#FF0420"/>
      <text
        x="50" y="67"
        textAnchor="middle"
        fontFamily="'Arial Black','Impact','Haettenschweiler',sans-serif"
        fontWeight="900"
        fontStyle="italic"
        fontSize="42"
        fill="white"
        letterSpacing="-2"
      >OP</text>
    </svg>
  );
}

function LogoNSF() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="50" cy="50" r="50" fill="#00A3E0"/>
      <text x="50" y="65" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontWeight="900" fontSize="34" fill="white">NSF</text>
    </svg>
  );
}

function LogoMozilla() {
  return (
    <svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="60" height="60" rx="8" fill="#FF7139"/>
      <text
        x="30" y="40"
        textAnchor="middle"
        fontFamily="'Arial Black','Impact','Haettenschweiler',sans-serif"
        fontWeight="900"
        fontSize="22"
        fill="white"
        letterSpacing="-1"
      >MOZ</text>
      <text
        x="30" y="54"
        textAnchor="middle"
        fontFamily="'Arial Black','Impact','Haettenschweiler',sans-serif"
        fontWeight="900"
        fontSize="11"
        fill="rgba(255,255,255,0.75)"
        letterSpacing="2"
      >ILLA</text>
    </svg>
  );
}

// ─── Grant data ────────────────────────────────────────────────────────────────

interface Grant {
  id: string;
  name: string;
  type: 'web2' | 'web3' | 'gov' | 'foundation';
  LogoComponent: React.FC;
  color: string;
  bgColor: string;
}

const grants: Grant[] = [
  { id: 'google',    name: 'Google',    type: 'web2',       LogoComponent: LogoGoogle,    color: '#4285F4', bgColor: 'rgba(66,133,244,0.12)' },
  { id: 'meta',      name: 'Meta',      type: 'web2',       LogoComponent: LogoMeta,      color: '#0082FB', bgColor: 'rgba(0,130,251,0.12)' },
  { id: 'microsoft', name: 'Microsoft', type: 'web2',       LogoComponent: LogoMicrosoft, color: '#00A4EF', bgColor: 'rgba(0,164,239,0.12)' },
  { id: 'aws',       name: 'AWS',       type: 'web2',       LogoComponent: LogoAWS,       color: '#FF9900', bgColor: 'rgba(255,153,0,0.12)' },
  { id: 'github',    name: 'GitHub',    type: 'web2',       LogoComponent: LogoGitHub,    color: '#e6edf3', bgColor: 'rgba(110,118,129,0.18)' },
  { id: 'gitcoin',   name: 'Gitcoin',   type: 'web3',       LogoComponent: LogoGitcoin,   color: '#02E2AC', bgColor: 'rgba(2,226,172,0.12)' },
  { id: 'ethereum',  name: 'Ethereum',  type: 'web3',       LogoComponent: LogoEthereum,  color: '#8C8C8C', bgColor: 'rgba(140,140,140,0.12)' },
  { id: 'polygon',   name: 'Polygon',   type: 'web3',       LogoComponent: LogoPolygon,   color: '#8247E5', bgColor: 'rgba(130,71,229,0.12)' },
  { id: 'solana',    name: 'Solana',    type: 'web3',       LogoComponent: LogoSolana,    color: '#9945FF', bgColor: 'rgba(153,69,255,0.12)' },
  { id: 'optimism',  name: 'Optimism',  type: 'web3',       LogoComponent: LogoOptimism,  color: '#FF0420', bgColor: 'rgba(255,4,32,0.12)' },
  { id: 'nsf',       name: 'NSF',       type: 'gov',        LogoComponent: LogoNSF,       color: '#00A3E0', bgColor: 'rgba(0,163,224,0.12)' },
  { id: 'mozilla',   name: 'Mozilla',   type: 'foundation', LogoComponent: LogoMozilla,   color: '#FF7139', bgColor: 'rgba(255,113,57,0.12)' },
];

const typeLabels: Record<string, { label: string; color: string }> = {
  web2:       { label: 'Web2',       color: '#4285F4' },
  web3:       { label: 'Web3',       color: '#8B31FF' },
  gov:        { label: 'Gov',        color: '#00C49A' },
  foundation: { label: 'Foundation', color: '#FF7139' },
};

// ─── Pill card used inside the marquee rows ────────────────────────────────────

function GrantPill({ grant }: { grant: Grant }) {
  const Logo = grant.LogoComponent;
  const typeConf = typeLabels[grant.type];

  return (
    <div
      className="flex items-center gap-2.5 px-4 py-2 rounded-full flex-shrink-0 select-none cursor-default"
      style={{
        background: 'rgba(13,13,20,0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: `1px solid ${grant.color}22`,
      }}
    >
      {/* Logo */}
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center p-1 flex-shrink-0"
        style={{ background: grant.bgColor, border: `1px solid ${grant.color}30` }}
      >
        <Logo />
      </div>

      {/* Name */}
      <span className="text-[12px] font-mono font-semibold text-white/70 tracking-wide whitespace-nowrap">
        {grant.name}
      </span>

      {/* Type badge */}
      <span
        className="text-[9px] font-mono font-bold tracking-widest px-2 py-0.5 rounded-full"
        style={{
          color: typeConf.color,
          background: `${typeConf.color}16`,
          border: `1px solid ${typeConf.color}30`,
        }}
      >
        {typeConf.label}
      </span>
    </div>
  );
}

// ─── Main export ───────────────────────────────────────────────────────────────

export default function GrantsShowcase() {
  // Split grants into two rows for opposite-direction scroll
  const row1 = grants.slice(0, 6);
  const row2 = grants.slice(6);

  // Duplicate each row so the loop is seamless
  const row1Double = [...row1, ...row1];
  const row2Double = [...row2, ...row2];

  return (
    <section className="relative py-16 overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-600/6 blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-pink-500/5 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-green-400/3 blur-[160px]" />
      </div>
      <div className="absolute inset-0 grid-bg opacity-15 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10 relative z-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border border-green-500/20 mb-5">
            <Sparkles size={12} className="text-aether-green" />
            <span className="text-xs font-mono text-white/50 tracking-widest uppercase">Grant Intelligence</span>
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          </div>
          <h2 className="font-display text-5xl md:text-6xl font-bold mb-3">
            <span className="text-white">50+ </span>
            <span className="gradient-text-pink-purple">Live Grants</span>
          </h2>
          <p className="text-white/40 font-mono text-sm tracking-wide mb-5">
            AI-matched to your profile
          </p>
          <motion.button
            onClick={() => document.getElementById('grants')?.scrollIntoView({ behavior: 'smooth' })}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white"
            style={{
              background: 'linear-gradient(135deg, rgba(255,45,155,0.12), rgba(139,49,255,0.12))',
              border: '1px solid rgba(139,49,255,0.3)',
              boxShadow: '0 0 20px rgba(139,49,255,0.12)',
            }}
            whileHover={{ boxShadow: '0 0 32px rgba(139,49,255,0.25)', scale: 1.04 }}
          >
            Browse Active Grants
            <ArrowRight size={14} />
          </motion.button>
        </motion.div>

        {/* ── Marquee rows ── */}
        <div className="relative">

          {/* Left + right edge fade masks */}
          <div
            className="absolute inset-y-0 left-0 w-24 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to right, #05050a, transparent)' }}
          />
          <div
            className="absolute inset-y-0 right-0 w-24 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to left, #05050a, transparent)' }}
          />

          {/* Row 1 — scrolls left */}
          <div className="overflow-hidden mb-3">
            <motion.div
              className="flex gap-3"
              style={{ width: 'max-content' }}
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 30, ease: 'linear', repeat: Infinity }}
            >
              {row1Double.map((grant, i) => (
                <GrantPill key={`r1-${grant.id}-${i}`} grant={grant} />
              ))}
            </motion.div>
          </div>

          {/* Row 2 — scrolls right */}
          <div className="overflow-hidden">
            <motion.div
              className="flex gap-3"
              style={{ width: 'max-content' }}
              animate={{ x: ['-50%', '0%'] }}
              transition={{ duration: 36, ease: 'linear', repeat: Infinity }}
            >
              {row2Double.map((grant, i) => (
                <GrantPill key={`r2-${grant.id}-${i}`} grant={grant} />
              ))}
            </motion.div>
          </div>
        </div>

        {/* Bottom stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex items-center justify-center gap-8 mt-8 relative z-20 flex-wrap"
        >
          {[
            { label: 'Web2 Giants',       count: '5+',  color: '#4285F4' },
            { label: 'Web3 Protocols',    count: '20+', color: '#8B31FF' },
            { label: 'Gov & Foundation',  count: '15+', color: '#00C49A' },
            { label: 'Live Right Now',    count: '50+', color: '#FF2D9B' },
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: stat.color }} />
              <span className="font-mono text-xs font-bold" style={{ color: stat.color }}>{stat.count}</span>
              <span className="text-white/30 text-xs font-mono">{stat.label}</span>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
