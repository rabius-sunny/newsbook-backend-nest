'use client';

import requests from '@/services/network/http';
import useSWR, { KeyedMutator } from 'swr';

type UseAsyncClientReturn<T> = {
  data: T | undefined;
  error: any;
  loading: boolean;
  mutate: KeyedMutator<T>;
  validating: boolean;
};

export default function useAsync<T>(
  url: string | (() => string | null) | null,
  revalidateIfStale = true,
  revalidateOnFocus = false,
  revalidateOnReconnect = true,
): UseAsyncClientReturn<T> {
  const key = typeof url === 'function' ? url() : url;

  const fetcher = async (url: string): Promise<T> => {
    return await requests.get<T>(url);
  };

  const { data, error, isLoading, mutate, isValidating } = useSWR<T>(
    key,
    fetcher,
    {
      revalidateIfStale,
      revalidateOnFocus,
      revalidateOnReconnect,
      shouldRetryOnError: false,
    },
  );

  return {
    data: data as T,
    error,
    loading: isLoading,
    mutate,
    validating: isValidating,
  };
}
