'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers, TrendingUp, Wallet, ArrowDownToLine, ArrowUpFromLine,
  Gift, RefreshCw, Crown, AlertCircle, CheckCircle, ExternalLink
} from 'lucide-react';
import { useStacks } from '@/components/providers/StacksProvider';
import {
  getTotalStaked, getRewardPool, getPendingReward,
  buildStakeTx, buildUnstakeTx, buildClaimRewardTx,
  formatTokenAmount, toRawAmount
} from '@/lib/contracts';
import { openContractCall } from '@stacks/connect';

type Tab = 'stake' | 'unstake' | 'claim';

interface TxStatus {
  type: 'success' | 'error';
  message: string;
  txid?: string;
}

export default function Staking() {
  const { user, isConnected, isPremium, tokenBalance, stakedAmount, connect, refreshOnchain } = useStacks();

  const [tab, setTab] = useState<Tab>('stake');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [txStatus, setTxStatus] = useState<TxStatus | null>(null);
  const [totalStaked, setTotalStaked] = useState(0);
  const [rewardPool, setRewardPool] = useState(0);
  const [pendingReward, setPendingReward] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);

  const loadStats = useCallback(async () => {
    setLoadingStats(true);
    try {
      const [total, pool] = await Promise.all([getTotalStaked(), getRewardPool()]);
      setTotalStaked(total);
      setRewardPool(pool);
      if (user?.stxAddress) {
        const pending = await getPendingReward(user.stxAddress);
        setPendingReward(pending);
      }
    } finally {
      setLoadingStats(false);
    }
  }, [user?.stxAddress]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const handleTx = async (txOptions: Record<string, unknown>) => {
    setLoading(true);
    setTxStatus(null);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await openContractCall({
        ...(txOptions as any),
        onFinish: (data: { txId: string }) => {
          setTxStatus({
            type: 'success',
            message: 'Transaction broadcast successfully. It will confirm in ~10 minutes.',
            txid: data.txId,
          });
          setAmount('');
          setTimeout(() => {
            refreshOnchain();
            loadStats();
          }, 3000);
        },
        onCancel: () => {
          setLoading(false);
        },
      } as any);
    } catch (err: unknown) {
      setTxStatus({
        type: 'error',
        message: err instanceof Error ? err.message : 'Transaction failed',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStake = () => {
    const raw = toRawAmount(parseFloat(amount));
    handleTx(buildStakeTx(raw));
  };

  const handleUnstake = () => {
    const raw = toRawAmount(parseFloat(amount));
    handleTx(buildUnstakeTx(raw));
  };

  const handleClaim = () => {
    handleTx(buildClaimRewardTx());
  };

  const setMax = () => {
    if (tab === 'stake') setAmount((safeTokenBalance / 1_000_000).toFixed(6));
    if (tab === 'unstake') setAmount((safeStakedAmount / 1_000_000).toFixed(6));
  };

  const safeTokenBalance = isNaN(tokenBalance) || !isFinite(tokenBalance) ? 0 : tokenBalance;
  const safeStakedAmount = isNaN(stakedAmount) || !isFinite(stakedAmount) ? 0 : stakedAmount;
  const walletTokens = safeTokenBalance / 1_000_000;
  const walletStaked = safeStakedAmount / 1_000_000;
  const pendingFormatted = isNaN(pendingReward) ? 0 : pendingReward / 1_000_000;
  const userShare = totalStaked > 0 && !isNaN(safeStakedAmount)
    ? ((safeStakedAmount / totalStaked) * 100).toFixed(2)
    : '0.00';

  return (
    <section id="staking" className="relative py-10 overflow-hidden w-full">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-green-500/4 blur-[140px]" />
        <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] rounded-full bg-purple-500/4 blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border border-green-500/20 mb-6">
            <Layers size={13} className="text-aether-green" />
            <span className="text-xs font-mono text-white/50 tracking-widest uppercase">On-Chain Staking</span>
          </div>
          <h2 className="font-display text-5xl md:text-6xl font-bold mb-6">
            <span className="text-white">Stake & Earn</span>{' '}
            <span className="gradient-text-purple-green">Rewards</span>
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            Lock your $AetherOS tokens in the smart contract to earn rewards from the protocol treasury and unlock unlimited strategy generation.
          </p>
        </motion.div>

        {/* Global Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {[
            {
              label: 'Total Staked',
              value: loadingStats ? '...' : formatTokenAmount(isNaN(totalStaked) ? 0 : totalStaked),
              suffix: '$AetherOS',
              color: '#00FF8C',
              icon: <Layers size={16} />,
            },
            {
              label: 'Reward Pool',
              value: loadingStats ? '...' : formatTokenAmount(isNaN(rewardPool) ? 0 : rewardPool),
              suffix: '$AetherOS',
              color: '#8B31FF',
              icon: <Gift size={16} />,
            },
            {
              label: 'Your Stake',
              value: isConnected ? walletStaked.toLocaleString() : '—',
              suffix: isConnected ? '$AetherOS' : 'Connect wallet',
              color: '#FF2D9B',
              icon: <TrendingUp size={16} />,
            },
            {
              label: 'Your Share',
              value: isConnected ? `${userShare}%` : '—',
              suffix: isConnected ? 'of pool' : '',
              color: '#00FF8C',
              icon: <Crown size={16} />,
            },
          ].map((stat, i) => (
            <div key={i} className="glass-card rounded-2xl p-5 border border-white/5">
              <div className="flex items-center gap-2 mb-3" style={{ color: stat.color }}>
                {stat.icon}
                <span className="text-xs font-mono text-white/40 uppercase tracking-widest">{stat.label}</span>
              </div>
              <p className="font-body text-2xl font-bold text-white tabular-nums">{stat.value}</p>
              <p className="text-xs text-white/30 mt-1 font-mono">{stat.suffix}</p>
            </div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Staking Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="glass-card-bright rounded-3xl p-8 border border-purple-500/20">
              {/* Premium status bar */}
              {isConnected && (
                <div
                  className="flex items-center gap-3 mb-6 p-3 rounded-xl"
                  style={{
                    background: isPremium ? 'rgba(0,255,140,0.05)' : 'rgba(139,49,255,0.05)',
                    border: isPremium ? '1px solid rgba(0,255,140,0.15)' : '1px solid rgba(139,49,255,0.15)',
                  }}
                >
                  <Crown size={14} style={{ color: isPremium ? '#00FF8C' : '#8B31FF' }} />
                  <div className="flex-1">
                    <p className="text-xs font-semibold" style={{ color: isPremium ? '#00FF8C' : '#8B31FF' }}>
                      {isPremium ? 'Premium Active' : 'Stake 1,000 $AetherOS to unlock premium'}
                    </p>
                    {!isPremium && walletStaked > 0 && (
                      <p className="text-xs text-white/30 mt-0.5">
                        {(1000 - walletStaked).toLocaleString()} more tokens needed
                      </p>
                    )}
                  </div>
                  {isPremium && <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />}
                </div>
              )}

              {/* Tabs */}
              <div className="flex gap-1 p-1 rounded-xl bg-white/3 border border-white/5 mb-6">
                {(['stake', 'unstake', 'claim'] as Tab[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => { setTab(t); setAmount(''); setTxStatus(null); }}
                    className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all capitalize"
                    style={{
                      background: tab === t ? 'linear-gradient(135deg, #FF2D9B, #8B31FF)' : 'transparent',
                      color: tab === t ? '#fff' : 'rgba(255,255,255,0.4)',
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Not connected state */}
              {!isConnected ? (
                <div className="text-center py-10">
                  <Wallet size={36} className="text-white/20 mx-auto mb-4" />
                  <p className="text-white/50 text-sm mb-6">Connect your Stacks wallet to stake $AetherOS</p>
                  <button onClick={connect} className="btn-primary px-8 py-3 rounded-xl font-bold text-white text-sm">
                    <span>Connect Stacks</span>
                  </button>
                </div>
              ) : tab === 'claim' ? (
                <div className="space-y-6">
                  <div className="p-5 rounded-2xl text-center" style={{ background: 'rgba(0,255,140,0.04)', border: '1px solid rgba(0,255,140,0.12)' }}>
                    <p className="text-xs font-mono text-white/40 uppercase tracking-widest mb-2">Pending Reward</p>
                    <p className="font-body text-4xl font-bold text-white tabular-nums mb-1">
                      {pendingFormatted.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                    </p>
                    <p className="text-sm text-aether-green font-mono">$AetherOS</p>
                  </div>
                  <p className="text-xs text-white/30 text-center leading-relaxed">
                    Rewards are proportional to your share of the total staked pool. The team deposits rewards into the contract periodically.
                  </p>
                  <button
                    onClick={handleClaim}
                    disabled={loading || pendingReward === 0}
                    className="w-full btn-primary flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {loading
                      ? <><RefreshCw size={16} className="animate-spin" /><span>Claiming...</span></>
                      : <><Gift size={16} /><span>Claim Reward</span></>
                    }
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Balance info */}
                  <div className="flex justify-between text-xs font-mono text-white/40 px-1">
                    <span>Wallet: {isNaN(walletTokens) ? '0' : walletTokens.toLocaleString(undefined, { maximumFractionDigits: 2 })} $AetherOS</span>
                    <span>Staked: {isNaN(walletStaked) ? '0' : walletStaked.toLocaleString(undefined, { maximumFractionDigits: 2 })} $AetherOS</span>
                  </div>

                  {/* Amount input */}
                  <div className="relative">
                    <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center" style={{ background: 'rgba(139,49,255,0.15)' }}>
                        <Image src="/AetherOS_Logo.png" alt="AetherOS" width={20} height={20} className="object-contain" />
                      </div>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        min="0"
                        step="any"
                        className="flex-1 bg-transparent text-lg font-semibold text-white placeholder-white/20 outline-none"
                      />
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs font-mono text-white/40">$AetherOS</span>
                        <button onClick={setMax} className="text-xs font-bold text-aether-purple hover:text-aether-pink transition-colors">MAX</button>
                      </div>
                    </div>
                  </div>

                  {/* Quick amounts */}
                  <div className="flex gap-2">
                    {[100, 500, 1000, 5000].map((v) => (
                      <button
                        key={v}
                        onClick={() => setAmount(v.toString())}
                        className="flex-1 py-1.5 rounded-lg text-xs font-mono transition-all"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}
                      >
                        {v.toLocaleString()}
                      </button>
                    ))}
                  </div>

                  {/* Info */}
                  {tab === 'stake' && parseFloat(amount) > 0 && (
                    <div className="p-3 rounded-xl text-xs text-white/40 space-y-1" style={{ background: 'rgba(139,49,255,0.05)', border: '1px solid rgba(139,49,255,0.1)' }}>
                      {parseFloat(amount) + walletStaked >= 1000 && !isPremium && (
                        <p className="text-aether-green">This stake will unlock Premium access</p>
                      )}
                      <p>New staked total: {(parseFloat(amount || '0') + (isNaN(walletStaked) ? 0 : walletStaked)).toLocaleString(undefined, { maximumFractionDigits: 2 })} $AetherOS</p>
                    </div>
                  )}

                  <button
                    onClick={tab === 'stake' ? handleStake : handleUnstake}
                    disabled={loading || !amount || parseFloat(amount) <= 0}
                    className="w-full btn-primary flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <><RefreshCw size={16} className="animate-spin" /><span>Processing...</span></>
                    ) : tab === 'stake' ? (
                      <><ArrowDownToLine size={16} /><span>Stake $AetherOS</span></>
                    ) : (
                      <><ArrowUpFromLine size={16} /><span>Unstake $AetherOS</span></>
                    )}
                  </button>
                </div>
              )}

              {/* TX Status */}
              <AnimatePresence>
                {txStatus && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-5 p-4 rounded-xl text-sm"
                    style={{
                      background: txStatus.type === 'success' ? 'rgba(0,255,140,0.05)' : 'rgba(255,45,155,0.05)',
                      border: txStatus.type === 'success' ? '1px solid rgba(0,255,140,0.15)' : '1px solid rgba(255,45,155,0.15)',
                    }}
                  >
                    <div className="flex items-start gap-2">
                      {txStatus.type === 'success'
                        ? <CheckCircle size={15} className="text-aether-green flex-shrink-0 mt-0.5" />
                        : <AlertCircle size={15} className="text-aether-pink flex-shrink-0 mt-0.5" />
                      }
                      <div>
                        <p style={{ color: txStatus.type === 'success' ? '#00FF8C' : '#FF2D9B' }}>{txStatus.message}</p>
                        {txStatus.txid && (
                          <a
                            href={`https://explorer.hiro.so/txid/${txStatus.txid}?chain=mainnet`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-white/40 hover:text-white/70 mt-2 transition-colors"
                          >
                            View on Explorer <ExternalLink size={10} />
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* How it works */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-5"
          >
            <h3 className="font-display text-3xl font-bold text-white">How Staking Works</h3>

            {[
              {
                step: '01',
                title: 'Stake Your Tokens',
                description: 'Lock $AetherOS into the smart contract. Your tokens remain yours — they are held by the contract and can be withdrawn at any time.',
                color: '#FF2D9B',
              },
              {
                step: '02',
                title: 'Earn Proportional Rewards',
                description: 'The AetherOS team deposits rewards into the contract from the protocol treasury. Your share is proportional to your stake relative to the total pool.',
                color: '#8B31FF',
              },
              {
                step: '03',
                title: 'Unlock Premium Access',
                description: 'Stake at least 1,000 $AetherOS to unlock unlimited AI strategy generation, removing the one-free-strategy limit permanently while staked.',
                color: '#00FF8C',
              },
              {
                step: '04',
                title: 'Claim Anytime',
                description: 'Rewards accumulate in real time. Claim whenever you want — your pending reward is always visible on-chain and yours to collect.',
                color: '#FF2D9B',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-xl p-5 border border-white/5 flex gap-4"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-mono text-xs font-bold"
                  style={{ background: `${item.color}12`, border: `1px solid ${item.color}25`, color: item.color }}
                >
                  {item.step}
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                  <p className="text-sm text-white/45 leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}

            <div className="p-5 rounded-2xl mt-2" style={{ background: 'rgba(0,255,140,0.04)', border: '1px solid rgba(0,255,140,0.1)' }}>
              <p className="text-xs text-white/40 leading-relaxed">
                The staking contract is deployed at{' '}
                <a
                  href="https://explorer.hiro.so/txid/0x0aded6ae168f5a6a3491108d6ff83642c6a3339e429905a172838ffc17137755?chain=mainnet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-aether-green hover:text-white transition-colors font-mono text-xs"
                >
                  SPQ189...HAEF.aetheros-staking
                </a>
                {' '}on Stacks mainnet. All logic is on-chain, transparent, and auditable.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
