'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Layers, Vote, Search, Handshake, Users, Award,
  Wallet, LogOut, ChevronRight, Crown,
  RefreshCw, Copy, Check, Activity, TrendingUp
} from 'lucide-react';
import { useStacks } from '@/components/providers/StacksProvider';
import { formatTokenAmount } from '@/lib/contracts';
import dynamic from 'next/dynamic';

// Lazy load setiap tab supaya tidak load semua sekaligus
const AppSection = dynamic(() => import('@/components/AppSection'), { ssr: false, loading: () => <TabLoader /> });
const Staking = dynamic(() => import('@/components/Staking'), { ssr: false, loading: () => <TabLoader /> });
const Governance = dynamic(() => import('@/components/Governance'), { ssr: false, loading: () => <TabLoader /> });
const GrantDiscovery = dynamic(() => import('@/components/GrantDiscovery'), { ssr: false, loading: () => <TabLoader /> });
const StrategyHistory = dynamic(() => import('@/components/StrategyHistory'), { ssr: false, loading: () => <TabLoader /> });
const LiveTxFeed = dynamic(() => import('@/components/LiveTxFeed'), { ssr: false, loading: () => <TabLoader /> });
const StackingWidget = dynamic(() => import('@/components/StackingWidget'), { ssr: false, loading: () => <TabLoader /> });
const WarmIntroBounties = dynamic(() => import('@/components/WarmIntroBounties'), { ssr: false, loading: () => <TabLoader /> });
const NetworkCRM = dynamic(() => import('@/components/NetworkCRM'), { ssr: false, loading: () => <TabLoader /> });
const ReputationBadges = dynamic(() => import('@/components/ReputationBadges'), { ssr: false, loading: () => <TabLoader /> });

function TabLoader() {
  return (
    <div className="flex items-center justify-center py-32">
      <RefreshCw size={20} className="text-white/20 animate-spin" />
    </div>
  );
}

const TABS = [
  { id: 'strategy', label: 'Strategy', icon: Sparkles, color: '#FF2D9B' },
  { id: 'stake', label: 'Stake & Earn', icon: Layers, color: '#00FF8C' },
  { id: 'governance', label: 'Governance', icon: Vote, color: '#8B31FF' },
  { id: 'grants', label: 'Grants', icon: Search, color: '#FF2D9B' },
  { id: 'bounties', label: 'Bounties', icon: Handshake, color: '#F7931A' },
  { id: 'crm', label: 'CRM', icon: Users, color: '#00FF8C' },
  { id: 'badges', label: 'Badges', icon: Award, color: '#F7931A' },
  { id: 'activity', label: 'Activity', icon: Activity, color: '#00FF8C' },
  { id: 'stacking', label: 'Stacking', icon: TrendingUp, color: '#F7931A' },
] as const;

type TabId = typeof TABS[number]['id'];

export default function AppPage() {
  const { user, isConnected, isConnecting, isPremium, stakedAmount, tokenBalance, connect, disconnect, refreshOnchain } = useStacks();
  const [activeTab, setActiveTab] = useState<TabId>('strategy');
  const [copiedAddress, setCopiedAddress] = useState(false);

  // Redirect ke landing kalau tidak connect setelah 5 detik di halaman ini dan tidak sedang connecting
  useEffect(() => {
    // Tidak paksa redirect — user boleh explore dulu walau belum connect
  }, []);

  const shortAddress = user?.stxAddress
    ? `${user.stxAddress.slice(0, 8)}...${user.stxAddress.slice(-6)}`
    : '';

  const copyAddress = () => {
    if (user?.stxAddress) {
      navigator.clipboard.writeText(user.stxAddress);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-aether-black">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 border-b border-white/5" style={{ background: 'rgba(5,5,7,0.9)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-7 h-7 rounded-lg overflow-hidden flex items-center justify-center" style={{ background: 'rgba(139,49,255,0.2)' }}>
              <Image src="/AetherOS_Logo.png" alt="AetherOS" width={20} height={20} className="object-contain" />
            </div>
            <span className="font-display text-base font-semibold text-white hidden sm:block">AetherOS</span>
          </Link>

          {/* Tab bar — desktop */}
          <nav className="hidden md:flex items-center gap-1 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={{
                    background: active ? `${tab.color}18` : 'transparent',
                    border: active ? `1px solid ${tab.color}30` : '1px solid transparent',
                    color: active ? tab.color : 'rgba(255,255,255,0.4)',
                  }}
                >
                  <Icon size={12} />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Wallet */}
          <div className="flex items-center gap-2">
            {isConnected ? (
              <div className="flex items-center gap-2">
                {/* Premium badge */}
                {isPremium && (
                  <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold" style={{ background: 'rgba(0,255,140,0.08)', border: '1px solid rgba(0,255,140,0.15)', color: '#00FF8C' }}>
                    <Crown size={10} />
                    Premium
                  </div>
                )}

                {/* Address */}
                <button
                  onClick={copyAddress}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  <span className="hidden sm:block">{shortAddress}</span>
                  <span className="sm:hidden">Connected</span>
                  {copiedAddress ? <Check size={10} className="text-green-400" /> : <Copy size={10} />}
                </button>

                {/* Disconnect */}
                <button
                  onClick={disconnect}
                  className="w-8 h-8 flex items-center justify-center rounded-lg transition-all text-white/30 hover:text-red-400"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                  title="Disconnect"
                >
                  <LogOut size={13} />
                </button>
              </div>
            ) : (
              <button
                onClick={connect}
                disabled={isConnecting}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold text-white transition-all disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg,#FF2D9B,#8B31FF)' }}
              >
                {isConnecting ? <RefreshCw size={12} className="animate-spin" /> : <Wallet size={12} />}
                {isConnecting ? 'Connecting...' : 'Connect Stacks'}
              </button>
            )}
          </div>
        </div>

        {/* Tab bar — mobile */}
        <div className="md:hidden flex items-center gap-1 px-4 pb-2 overflow-x-auto scrollbar-hide">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0"
                style={{
                  background: active ? `${tab.color}18` : 'transparent',
                  border: active ? `1px solid ${tab.color}30` : '1px solid transparent',
                  color: active ? tab.color : 'rgba(255,255,255,0.4)',
                }}
              >
                <Icon size={11} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Wallet summary bar — hanya kalau connected */}
      {isConnected && (
        <div className="border-b border-white/5" style={{ background: 'rgba(255,255,255,0.015)' }}>
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-4 overflow-x-auto scrollbar-hide">
            {[
              { label: 'Balance', value: `${formatTokenAmount(tokenBalance)} $AetherOS` },
              { label: 'Staked', value: `${formatTokenAmount(stakedAmount)} $AetherOS` },
              { label: 'Status', value: isPremium ? 'Premium' : 'Standard', color: isPremium ? '#00FF8C' : 'rgba(255,255,255,0.4)' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 flex-shrink-0">
                {i > 0 && <div className="w-px h-3 bg-white/10" />}
                <span className="text-xs text-white/30">{item.label}:</span>
                <span className="text-xs font-mono font-semibold" style={{ color: item.color ?? 'rgba(255,255,255,0.7)' }}>
                  {item.value}
                </span>
              </div>
            ))}
            <button
              onClick={() => refreshOnchain()}
              className="ml-auto flex-shrink-0 text-white/20 hover:text-white/50 transition-colors"
            >
              <RefreshCw size={11} />
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <main className="w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            {activeTab === 'strategy' && (
              <div>
                <AppSection />
                <StrategyHistory />
              </div>
            )}
            {activeTab === 'stake' && <Staking />}
            {activeTab === 'governance' && <Governance />}
            {activeTab === 'grants' && <GrantDiscovery />}
            {activeTab === 'bounties' && <div className="max-w-3xl mx-auto px-4 py-6"><WarmIntroBounties /></div>}
            {activeTab === 'crm' && <div className="max-w-3xl mx-auto px-4 py-6"><NetworkCRM /></div>}
            {activeTab === 'badges' && <div className="max-w-3xl mx-auto px-4 py-6"><ReputationBadges /></div>}
            {activeTab === 'activity' && <LiveTxFeed />}
            {activeTab === 'stacking' && (
              <div className="max-w-4xl mx-auto px-6 py-10">
                <StackingWidget />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom bar — kalau belum connect */}
      {!isConnected && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4" style={{ background: 'linear-gradient(to top, rgba(5,5,7,0.98), transparent)' }}>
          <div className="max-w-md mx-auto">
            <button
              onClick={connect}
              disabled={isConnecting}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-white text-sm disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg,#FF2D9B,#8B31FF)', boxShadow: '0 0 30px rgba(139,49,255,0.3)' }}
            >
              {isConnecting ? <RefreshCw size={15} className="animate-spin" /> : <Wallet size={15} />}
              {isConnecting ? 'Connecting...' : 'Connect Stacks to Unlock All Features'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
