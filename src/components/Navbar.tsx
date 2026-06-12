'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X, Wallet, LogOut, Copy, Check, ChevronDown } from 'lucide-react';
import { useStacks } from '@/components/providers/StacksProvider';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Token', href: '#token' },
  { label: 'About', href: '#about' },
  { label: 'Launch App', href: '/app' },
];

export default function Navbar() {
  const { user, isConnected, isConnecting, connect, disconnect } = useStacks();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isWalletDropOpen, setIsWalletDropOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const copyAddress = () => {
    if (user?.stxAddress) {
      navigator.clipboard.writeText(user.stxAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shortAddress = user?.stxAddress
    ? `${user.stxAddress.slice(0, 6)}...${user.stxAddress.slice(-4)}`
    : '';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled ? 'bg-[#050507]/90 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 flex-shrink-0">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-pink-500/30 to-purple-600/30 blur-sm group-hover:blur-md transition-all" />
            <Image
              src="/AetherOS_Logo.png"
              alt="AetherOS Logo"
              width={36}
              height={36}
              className="relative rounded-lg object-contain"
              style={{ filter: 'drop-shadow(0 0 8px rgba(139,49,255,0.6))' }}
            />
          </div>
          <span className="font-display text-xl font-semibold tracking-wide text-white group-hover:gradient-text transition-all">
            AetherOS
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="nav-link text-sm text-white/60 hover:text-white transition-colors font-body tracking-wide"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA + Wallet */}
        <div className="hidden md:flex items-center gap-3">
          {isConnected && user ? (
            <div className="relative">
              <button
                onClick={() => setIsWalletDropOpen(!isWalletDropOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl glass-card border border-purple-500/30 hover:border-purple-500/60 transition-all"
              >
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-sm font-mono text-white/80">{shortAddress}</span>
                <ChevronDown size={14} className={`text-white/40 transition-transform ${isWalletDropOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isWalletDropOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    className="absolute top-full right-0 mt-2 w-52 glass-card rounded-xl p-2 border border-white/10"
                  >
                    <div className="px-3 py-2 border-b border-white/10 mb-1">
                      <p className="text-xs text-white/40 font-mono">Connected Wallet</p>
                      <p className="text-xs text-white/80 font-mono mt-0.5 truncate">{shortAddress}</p>
                    </div>
                    <button
                      onClick={copyAddress}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 text-white/60 hover:text-white transition-all text-sm"
                    >
                      {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                      {copied ? 'Copied!' : 'Copy Address'}
                    </button>
                    <button
                      onClick={() => { disconnect(); setIsWalletDropOpen(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-500/10 text-white/60 hover:text-red-400 transition-all text-sm"
                    >
                      <LogOut size={14} />
                      Disconnect
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={connect}
              disabled={isConnecting}
              className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
            >
              <Wallet size={16} />
              <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
            </button>
          )}
          <a
            href="/app"
            className="px-5 py-2.5 rounded-xl bg-white text-black text-sm font-bold hover:bg-aether-green transition-all"
          >
            Launch App
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="md:hidden text-white/70 hover:text-white"
        >
          {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0D0D14]/95 backdrop-blur-xl border-b border-white/5"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMobileOpen(false)}
                  className="text-white/70 hover:text-white transition-colors text-lg font-medium py-1"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
                {isConnected ? (
                  <div className="flex items-center justify-between px-4 py-3 glass-card rounded-xl border border-purple-500/30">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-400" />
                      <span className="text-sm font-mono text-white/80">{shortAddress}</span>
                    </div>
                    <button onClick={disconnect} className="text-red-400 hover:text-red-300">
                      <LogOut size={16} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={connect}
                    className="btn-primary flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white w-full"
                  >
                    <Wallet size={16} />
                    <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
                  </button>
                )}
                <a
                  href="/app"
                  className="px-5 py-3 rounded-xl bg-white text-black text-sm font-bold hover:bg-aether-green transition-all text-center"
                  onClick={() => setIsMobileOpen(false)}
                >
                  Launch App
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
