import { useState, useEffect, useCallback } from 'react';
import { getTokenBalance, isTokenBalanceError } from '@/services/web3/wallet.service';

export interface WalletBalances {
  USDC: string | null;
  WLD: string | null;
}

export interface UseWalletBalanceResult {
  balances: WalletBalances;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch and manage wallet token balances for USDC and WLD
 * 
 * @param address The wallet address to fetch balances for
 * @returns Object containing balances, loading state, error state, and refetch function
 */
export function useWalletBalance(address?: string): UseWalletBalanceResult {
  const [balances, setBalances] = useState<WalletBalances>({
    USDC: null,
    WLD: null
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalances = useCallback(async () => {
    if (!address) {
      setError("Wallet address is required");
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch USDC balance
      const usdcResult = await getTokenBalance(address, 'USDC');
      
      // Fetch WLD balance
      const wldResult = await getTokenBalance(address, 'WLD');
      
      const newBalances: WalletBalances = {
        USDC: null,
        WLD: null
      };
      
      // Process USDC result
      if (!isTokenBalanceError(usdcResult)) {
        newBalances.USDC = usdcResult.formattedBalance;
      } else {
        console.error('Error fetching USDC balance:', usdcResult.error);
      }
      
      // Process WLD result
      if (!isTokenBalanceError(wldResult)) {
        newBalances.WLD = wldResult.formattedBalance;
      } else {
        console.error('Error fetching WLD balance:', wldResult.error);
      }
      
      setBalances(newBalances);
      
      // Set error if both requests failed
      if (isTokenBalanceError(usdcResult) && isTokenBalanceError(wldResult)) {
        setError('Failed to fetch token balances');
      }
    } catch (err) {
      console.error('Unexpected error in useWalletBalance:', err);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  // Fetch balances when address changes
  useEffect(() => {
    if (address) {
      fetchBalances();
    } else {
      // Reset state when address is not available
      setBalances({ USDC: null, WLD: null });
      setError(null);
    }
  }, [address, fetchBalances]);

  return {
    balances,
    isLoading,
    error,
    refetch: fetchBalances
  };
} 