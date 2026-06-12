'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getTokenBalance, getStakeInfo, isPremiumEligible } from '@/lib/contracts';

interface StacksUser {
  stxAddress: string;
}

interface StacksContextType {
  user: StacksUser | null;
  isConnected: boolean;
  isConnecting: boolean;
  tokenBalance: number;
  stakedAmount: number;
  isPremium: boolean;
  isLoadingOnchain: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  refreshOnchain: () => Promise<void>;
}

const StacksContext = createContext<StacksContextType>({
  user: null,
  isConnected: false,
  isConnecting: false,
  tokenBalance: 0,
  stakedAmount: 0,
  isPremium: false,
  isLoadingOnchain: false,
  connect: async () => {},
  disconnect: () => {},
  refreshOnchain: async () => {},
});

const STORAGE_KEY = 'aetheros_wallet_address';

export function StacksProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<StacksUser | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [stakedAmount, setStakedAmount] = useState(0);
  const [isPremium, setIsPremium] = useState(false);
  const [isLoadingOnchain, setIsLoadingOnchain] = useState(false);

  const refreshOnchain = useCallback(async (address?: string) => {
    const addr = address ?? user?.stxAddress;
    if (!addr) return;
    setIsLoadingOnchain(true);
    try {
      const [balance, stakeInfo, premium] = await Promise.all([
        getTokenBalance(addr),
        getStakeInfo(addr),
        isPremiumEligible(addr),
      ]);
      setTokenBalance(balance);
      setStakedAmount(stakeInfo?.amount ?? 0);
      setIsPremium(premium);
    } catch {
      // silently fail
    } finally {
      setIsLoadingOnchain(false);
    }
  }, [user?.stxAddress]);

  // Restore session dari localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setUser({ stxAddress: saved });
        refreshOnchain(saved);
      }
    } catch {
      // SSR atau localStorage tidak tersedia
    }
  }, []);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    try {
      const { connect: stacksConnect } = await import('@stacks/connect');
      const response = await stacksConnect();

      // @stacks/connect v8 mengembalikan object dengan addresses
      const addresses = (response as { addresses?: { symbol: string; address: string }[] })?.addresses ?? [];
      const stxEntry =
        addresses.find((a) => a.symbol === 'STX') ??
        addresses.find((a) => a.address.startsWith('SP') || a.address.startsWith('ST'));

      const stxAddress = stxEntry?.address ?? '';
      if (stxAddress) {
        setUser({ stxAddress });
        localStorage.setItem(STORAGE_KEY, stxAddress);
        refreshOnchain(stxAddress);
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      if (
        !msg.toLowerCase().includes('cancel') &&
        !msg.toLowerCase().includes('reject') &&
        !msg.toLowerCase().includes('user rejected')
      ) {
        console.error('[AetherOS] Connect error:', error);
      }
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    try {
      const { disconnect: stacksDisconnect } = await import('@stacks/connect');
      stacksDisconnect();
    } catch {
      // ignore
    }
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    setTokenBalance(0);
    setStakedAmount(0);
    setIsPremium(false);
  }, []);

  return (
    <StacksContext.Provider
      value={{
        user,
        isConnected: !!user,
        isConnecting,
        tokenBalance,
        stakedAmount,
        isPremium,
        isLoadingOnchain,
        connect,
        disconnect,
        refreshOnchain,
      }}
    >
      {children}
    </StacksContext.Provider>
  );
}

export function useStacks() {
  return useContext(StacksContext);
}
