'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Shield, Zap } from 'lucide-react';
import { useStacks } from '@/components/providers/StacksProvider';

const stats = [
  { value: '7-Step', label: 'AI Strategy Engine' },
  { value: 'SIP-010', label: 'Native Stacks Token' },
  { value: '100M+', label: 'Max Supply (AetherOS)' },
  { value: 'BTC-Secured', label: 'Powered by Stacks' },
];

export default function Hero() {
  const { isConnected, connect } = useStacks();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [typedText, setTypedText] = useState('');
  const fullText = 'Your AI Network Strategist, Secured On-Chain.';

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 45);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: { x: number; y: number; vx: number; vy: number; size: number; color: string; alpha: number }[] = [];
    const colors = ['#FF2D9B', '#8B31FF', '#00FF8C', '#6B21FF'];

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.6 + 0.1,
      });
    }

    let animId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(139, 49, 255, ${(1 - dist / 120) * 0.15})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });

      // Draw particles
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      });

      animId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden grid-bg">
      {/* Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-50" />

      {/* Ambient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-600/20 blur-[120px] animate-orb-1" />
        <div className="absolute top-1/2 right-1/4 w-80 h-80 rounded-full bg-pink-500/15 blur-[100px] animate-orb-2" />
        <div className="absolute bottom-1/4 left-1/2 w-72 h-72 rounded-full bg-green-400/10 blur-[80px] animate-orb-3" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center pt-32 pb-20">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border border-purple-500/30 mb-8"
        >
          <Sparkles size={13} className="text-aether-pink" />
          <span className="text-xs font-mono text-white/60 tracking-widest uppercase">
            Now live on Stacks Blockchain
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.95] mb-6"
        >
          <span className="block text-white">Build Elite</span>
          <span className="block gradient-text">Professional</span>
          <span className="block text-white">Networks.</span>
        </motion.h1>

        {/* Typewriter Subheadline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="h-12 flex items-center justify-center mb-10"
        >
          <p className="text-lg md:text-xl text-white/50 font-mono max-w-2xl">
            {typedText}
            <span className="cursor-blink text-aether-purple">|</span>
          </p>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <button
            onClick={() => { if (!isConnected) { connect(); } else { window.location.href = '/app'; } }}
            className="btn-primary flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-white glow-purple"
          >
            <span>{isConnected ? 'Launch App' : 'Connect Stacks & Start'}</span>
            <ArrowRight size={18} />
          </button>
          <a
            href="#about"
            className="btn-outline flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-white/80"
          >
            Learn More
          </a>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex flex-wrap items-center justify-center gap-6 mb-20"
        >
          {[
            { icon: <Shield size={14} />, text: 'Bitcoin-Secured via Stacks' },
            { icon: <Zap size={14} />, text: 'AI-Powered Strategy Engine' },
            { icon: <Sparkles size={14} />, text: 'SIP-010 Native Token' },
          ].map((badge, i) => (
            <div key={i} className="flex items-center gap-2 text-white/40 text-xs font-mono">
              <span className="text-aether-purple">{badge.icon}</span>
              {badge.text}
            </div>
          ))}
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 + i * 0.1 }}
              className="glass-card rounded-2xl p-5 border-gradient hover:scale-[1.02] transition-transform"
            >
              <div className="text-2xl md:text-3xl font-display font-bold gradient-text-pink-purple mb-1">
                {stat.value}
              </div>
              <div className="text-xs text-white/40 font-mono tracking-wide">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Ecosystem logos strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.3 }}
          className="flex flex-col items-center gap-3 mt-8"
        >
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <div className="w-5 h-8 rounded-full border border-white/20 flex justify-center pt-1.5">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-2 rounded-full bg-aether-purple"
          />
        </div>
      </motion.div>
    </section>
  );
}
