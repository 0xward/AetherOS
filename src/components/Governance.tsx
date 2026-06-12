'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Vote, Plus, CheckCircle, XCircle, Clock, Users,
  AlertCircle, RefreshCw, ExternalLink, ChevronDown, ChevronUp, Shield
} from 'lucide-react';
import { useStacks } from '@/components/providers/StacksProvider';
import {
  getProposal, getProposalCount, hasVoted, getVotingPower,
  buildCreateProposalTx, buildVoteTx, buildFinalizeProposalTx,
  formatTokenAmount, type Proposal
} from '@/lib/contracts';
import { openContractCall } from '@stacks/connect';

interface TxStatus {
  type: 'success' | 'error';
  message: string;
  txid?: string;
}

function ProposalCard({
  proposal,
  walletAddress,
  onVote,
  onFinalize,
  loading,
}: {
  proposal: Proposal;
  walletAddress: string;
  onVote: (id: number, voteFor: boolean) => void;
  onFinalize: (id: number) => void;
  loading: boolean;
}) {
  const [voted, setVoted] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (walletAddress) {
      hasVoted(proposal.id, walletAddress).then(setVoted);
    }
  }, [proposal.id, walletAddress]);

  const totalVotes = proposal.votesFor + proposal.votesAgainst;
  const forPercent = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0;
  const againstPercent = totalVotes > 0 ? (proposal.votesAgainst / totalVotes) * 100 : 0;

  // Stacks produces ~144 blocks/day. Estimate remaining time.
  const blocksLeft = Math.max(0, proposal.endsAt - proposal.createdAt);
  const daysLeft = Math.floor(blocksLeft / 144);
  const isActive = !proposal.executed;
  const isExpired = proposal.executed;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl border border-white/5 overflow-hidden"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono text-white/30">#{proposal.id}</span>
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={
                  isExpired
                    ? proposal.passed
                      ? { background: 'rgba(0,255,140,0.1)', color: '#00FF8C', border: '1px solid rgba(0,255,140,0.2)' }
                      : { background: 'rgba(255,45,155,0.1)', color: '#FF2D9B', border: '1px solid rgba(255,45,155,0.2)' }
                    : { background: 'rgba(139,49,255,0.1)', color: '#8B31FF', border: '1px solid rgba(139,49,255,0.2)' }
                }
              >
                {isExpired ? (proposal.passed ? 'Passed' : 'Rejected') : `Active · ${daysLeft}d left`}
              </span>
            </div>
            <h4 className="font-display text-xl font-bold text-white">{proposal.title}</h4>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-white/30 hover:text-white/60 transition-colors"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {/* Vote bars */}
        <div className="space-y-2 mb-5">
          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-aether-green">For</span>
              <span className="text-white/40">{formatTokenAmount(proposal.votesFor)} votes · {forPercent.toFixed(1)}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${forPercent}%` }}
                transition={{ duration: 0.6 }}
                className="h-full rounded-full bg-gradient-to-r from-green-500 to-green-400"
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-aether-pink">Against</span>
              <span className="text-white/40">{formatTokenAmount(proposal.votesAgainst)} votes · {againstPercent.toFixed(1)}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${againstPercent}%` }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="h-full rounded-full bg-gradient-to-r from-pink-600 to-pink-400"
              />
            </div>
          </div>
        </div>

        {/* Expanded description */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-5 overflow-hidden"
            >
              <p className="text-sm text-white/50 leading-relaxed p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                {proposal.description}
              </p>
              <div className="flex items-center gap-2 mt-3">
                <p className="text-xs font-mono text-white/25">
                  Proposed by {proposal.proposer.slice(0, 10)}...{proposal.proposer.slice(-6)}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        {walletAddress && isActive && (
          <div className="flex gap-3">
            {voted ? (
              <div className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm text-white/40" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <CheckCircle size={14} className="text-aether-green" />
                <span>Already voted</span>
              </div>
            ) : (
              <>
                <button
                  onClick={() => onVote(proposal.id, true)}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40"
                  style={{ background: 'rgba(0,255,140,0.08)', border: '1px solid rgba(0,255,140,0.2)', color: '#00FF8C' }}
                >
                  <CheckCircle size={14} />
                  <span>Vote For</span>
                </button>
                <button
                  onClick={() => onVote(proposal.id, false)}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40"
                  style={{ background: 'rgba(255,45,155,0.08)', border: '1px solid rgba(255,45,155,0.2)', color: '#FF2D9B' }}
                >
                  <XCircle size={14} />
                  <span>Vote Against</span>
                </button>
              </>
            )}
          </div>
        )}

        {walletAddress && !isActive && !proposal.executed && (
          <button
            onClick={() => onFinalize(proposal.id)}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40"
            style={{ background: 'rgba(139,49,255,0.08)', border: '1px solid rgba(139,49,255,0.2)', color: '#8B31FF' }}
          >
            <Clock size={14} />
            <span>Finalize Proposal</span>
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default function Governance() {
  const { user, isConnected, stakedAmount, connect } = useStacks();

  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loadingProposals, setLoadingProposals] = useState(true);
  const [votingPower, setVotingPower] = useState(0);
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [txStatus, setTxStatus] = useState<TxStatus | null>(null);

  const canCreateProposal = stakedAmount >= 100_000_000; // 100 tokens

  const loadProposals = useCallback(async () => {
    if (!user?.stxAddress) {
      setLoadingProposals(false);
      return;
    }
    setLoadingProposals(true);
    try {
      const count = await getProposalCount(user.stxAddress);
      const [power, ...proposalResults] = await Promise.all([
        getVotingPower(user.stxAddress),
        ...Array.from({ length: count }, (_, i) => getProposal(i + 1, user.stxAddress)),
      ]);
      setVotingPower(power);
      setProposals(proposalResults.filter(Boolean) as Proposal[]);
    } finally {
      setLoadingProposals(false);
    }
  }, [user?.stxAddress]);

  useEffect(() => {
    loadProposals();
  }, [loadProposals]);

  const handleTx = async (txOptions: Record<string, unknown>, successMsg: string) => {
    setLoading(true);
    setTxStatus(null);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await openContractCall({
        ...(txOptions as any),
        onFinish: (data: { txId: string }) => {
          setTxStatus({ type: 'success', message: successMsg, txid: data.txId });
          setTitle('');
          setDescription('');
          setShowCreate(false);
          setTimeout(loadProposals, 3000);
        },
        onCancel: () => setLoading(false),
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

  const handleCreateProposal = () => {
    if (!title.trim() || !description.trim()) return;
    handleTx(
      buildCreateProposalTx(title.trim(), description.trim()),
      'Proposal submitted. It will appear once the transaction confirms.'
    );
  };

  const handleVote = (proposalId: number, voteFor: boolean) => {
    handleTx(
      buildVoteTx(proposalId, voteFor),
      `Vote cast successfully. Your voting power: ${formatTokenAmount(votingPower)} $AetherOS.`
    );
  };

  const handleFinalize = (proposalId: number) => {
    handleTx(
      buildFinalizeProposalTx(proposalId),
      'Proposal finalized. Result is now recorded on-chain.'
    );
  };

  return (
    <section id="governance" className="relative py-10 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full bg-pink-500/4 blur-[140px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-purple-500/4 blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border border-pink-500/20 mb-6">
            <Vote size={13} className="text-aether-pink" />
            <span className="text-xs font-mono text-white/50 tracking-widest uppercase">On-Chain Governance</span>
          </div>
          <h2 className="font-display text-5xl md:text-6xl font-bold mb-6">
            <span className="text-white">Shape the</span>{' '}
            <span className="gradient-text-pink-purple">Protocol</span>
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            $AetherOS stakers govern the protocol. Propose changes, vote on upgrades, and influence the direction of AetherOS — all recorded permanently on Stacks.
          </p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12"
        >
          {[
            {
              label: 'Total Proposals',
              value: loadingProposals ? '...' : proposals.length.toString(),
              icon: <Vote size={16} />,
              color: '#FF2D9B',
            },
            {
              label: 'Your Voting Power',
              value: isConnected ? formatTokenAmount(votingPower) : '—',
              suffix: isConnected ? '$AetherOS' : 'Connect wallet',
              icon: <Users size={16} />,
              color: '#8B31FF',
            },
            {
              label: 'Required to Propose',
              value: '100',
              suffix: '$AetherOS staked',
              icon: <Shield size={16} />,
              color: '#00FF8C',
            },
          ].map((stat, i) => (
            <div key={i} className="glass-card rounded-2xl p-5 border border-white/5">
              <div className="flex items-center gap-2 mb-3" style={{ color: stat.color }}>
                {stat.icon}
                <span className="text-xs font-mono text-white/40 uppercase tracking-widest">{stat.label}</span>
              </div>
              <p className="font-body text-2xl font-bold text-white tabular-nums">{stat.value}</p>
              {stat.suffix && <p className="text-xs text-white/30 mt-1 font-mono">{stat.suffix}</p>}
            </div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: create + info */}
          <div className="flex flex-col gap-6">
            {/* Not connected */}
            {!isConnected ? (
              <div className="glass-card-bright rounded-2xl p-6 border border-purple-500/20 text-center">
                <Vote size={32} className="text-white/20 mx-auto mb-4" />
                <p className="text-white/50 text-sm mb-5">Connect your wallet to participate in governance</p>
                <button onClick={connect} className="btn-primary w-full py-3 rounded-xl font-bold text-white text-sm">
                  <span>Connect Wallet</span>
                </button>
              </div>
            ) : (
              <div className="glass-card-bright rounded-2xl p-6 border border-purple-500/20">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-semibold text-white">Create Proposal</h3>
                  {canCreateProposal && (
                    <button
                      onClick={() => setShowCreate(!showCreate)}
                      className="w-8 h-8 flex items-center justify-center rounded-xl transition-all"
                      style={
                        showCreate
                          ? { background: 'rgba(255,45,155,0.15)', border: '1px solid rgba(255,45,155,0.25)', color: '#FF2D9B' }
                          : { background: 'linear-gradient(135deg,#FF2D9B,#8B31FF)', color: '#fff' }
                      }
                    >
                      <Plus size={14} />
                    </button>
                  )}
                </div>

                {!canCreateProposal && (
                  <div className="p-3 rounded-xl mb-4 text-xs text-white/40" style={{ background: 'rgba(255,45,155,0.05)', border: '1px solid rgba(255,45,155,0.1)' }}>
                    Stake at least 100 $AetherOS to create proposals. You currently have {formatTokenAmount(stakedAmount)} staked.
                  </div>
                )}

                <AnimatePresence>
                  {showCreate && canCreateProposal && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4 overflow-hidden"
                    >
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-white/30 font-semibold mb-2">Title</label>
                        <input
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          maxLength={100}
                          placeholder="Proposal title..."
                          className="w-full rounded-xl p-3 text-sm"
                          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-white/30 font-semibold mb-2">Description</label>
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          maxLength={500}
                          rows={4}
                          placeholder="Describe the proposal in detail..."
                          className="w-full rounded-xl p-3 text-sm resize-none"
                          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                        />
                        <p className="text-xs text-white/20 text-right mt-1">{description.length}/500</p>
                      </div>
                      <button
                        onClick={handleCreateProposal}
                        disabled={loading || !title.trim() || !description.trim()}
                        className="w-full btn-primary py-3 rounded-xl font-bold text-white text-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {loading
                          ? <><RefreshCw size={14} className="animate-spin" /><span>Submitting...</span></>
                          : <><Plus size={14} /><span>Submit Proposal</span></>
                        }
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Voting power */}
                <div className="mt-5 pt-5 border-t border-white/5">
                  <p className="text-xs text-white/30 mb-1 font-mono uppercase tracking-widest">Your Voting Power</p>
                  <p className="font-body text-2xl font-bold text-white tabular-nums">{formatTokenAmount(votingPower)}</p>
                  <p className="text-xs text-white/30 font-mono">$AetherOS (= staked balance)</p>
                </div>
              </div>
            )}

            {/* Rules */}
            <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-4">
              <h4 className="font-semibold text-white">Governance Rules</h4>
              {[
                { label: 'Minimum stake to vote', value: '100 $AetherOS' },
                { label: 'Minimum stake to propose', value: '100 $AetherOS' },
                { label: 'Voting window', value: '~10 days (1,440 blocks)' },
                { label: 'Vote weight', value: 'Proportional to stake' },
                { label: 'Passing threshold', value: 'Simple majority' },
                { label: 'Finalization', value: 'Manual call after window' },
              ].map((rule, i) => (
                <div key={i} className="flex justify-between text-xs">
                  <span className="text-white/35">{rule.label}</span>
                  <span className="text-white/70 font-mono">{rule.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: proposals list */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display text-2xl font-bold text-white">Active Proposals</h3>
              <button onClick={loadProposals} className="w-8 h-8 flex items-center justify-center rounded-lg text-white/30 hover:text-white/60 transition-colors" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <RefreshCw size={13} className={loadingProposals ? 'animate-spin' : ''} />
              </button>
            </div>

            {/* TX status */}
            <AnimatePresence>
              {txStatus && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-5 p-4 rounded-xl text-sm flex items-start gap-2"
                  style={{
                    background: txStatus.type === 'success' ? 'rgba(0,255,140,0.05)' : 'rgba(255,45,155,0.05)',
                    border: txStatus.type === 'success' ? '1px solid rgba(0,255,140,0.15)' : '1px solid rgba(255,45,155,0.15)',
                  }}
                >
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
                        className="inline-flex items-center gap-1 text-xs text-white/40 hover:text-white/70 mt-1 transition-colors"
                      >
                        View on Explorer <ExternalLink size={10} />
                      </a>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {loadingProposals ? (
              <div className="text-center py-16">
                <RefreshCw size={24} className="text-white/20 animate-spin mx-auto mb-3" />
                <p className="text-white/30 text-sm">Loading proposals from chain...</p>
              </div>
            ) : !isConnected ? (
              <div className="text-center py-16 glass-card rounded-2xl border border-white/5">
                <Vote size={36} className="text-white/15 mx-auto mb-4" />
                <p className="text-white/30 text-sm">Connect wallet to view and vote on proposals</p>
              </div>
            ) : proposals.length === 0 ? (
              <div className="text-center py-16 glass-card rounded-2xl border border-white/5">
                <Vote size={36} className="text-white/15 mx-auto mb-4" />
                <p className="text-white/40 text-sm mb-2">No proposals yet</p>
                <p className="text-white/25 text-xs">Stake 100 $AetherOS and be the first to create one</p>
              </div>
            ) : (
              <div className="space-y-4">
                {proposals.map((proposal) => (
                  <ProposalCard
                    key={proposal.id}
                    proposal={proposal}
                    walletAddress={user?.stxAddress ?? ''}
                    onVote={handleVote}
                    onFinalize={handleFinalize}
                    loading={loading}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
