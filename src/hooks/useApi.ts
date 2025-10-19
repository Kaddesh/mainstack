import { useQuery } from '@tanstack/react-query';
import { apiService } from '../utils/api';
import type { User, Wallet, Transaction } from '../types/api';

// Query keys for React Query
export const queryKeys = {
  user: ['user'] as const,
  wallet: ['wallet'] as const,
  transactions: ['transactions'] as const,
};

// Custom hooks for API data fetching
export const useUser = () => {
  return useQuery<User, Error>({
    queryKey: queryKeys.user,
    queryFn: apiService.getUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useWallet = () => {
  return useQuery<Wallet, Error>({
    queryKey: queryKeys.wallet,
    queryFn: apiService.getWallet,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useTransactions = () => {
  return useQuery<Transaction[], Error>({
    queryKey: queryKeys.transactions,
    queryFn: apiService.getTransactions,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Utility hook for getting all data at once
export const useAllData = () => {
  const userQuery = useUser();
  const walletQuery = useWallet();
  const transactionsQuery = useTransactions();

  return {
    user: userQuery,
    wallet: walletQuery,
    transactions: transactionsQuery,
    isLoading: userQuery.isLoading || walletQuery.isLoading || transactionsQuery.isLoading,
    isError: userQuery.isError || walletQuery.isError || transactionsQuery.isError,
    error: userQuery.error || walletQuery.error || transactionsQuery.error,
  };
};