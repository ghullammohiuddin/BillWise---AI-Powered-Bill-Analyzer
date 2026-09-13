'use client';

import { useCallback, useEffect, useState } from 'react';
import { getComparison } from '@/lib/api/comparison';
import type { ComparisonResult } from '@/lib/types/comparison';

export function useComparison(billId: string) {
  const [data, setData] = useState<ComparisonResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    getComparison(billId)
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err) => {
        if (!cancelled)
          setError(
            err instanceof Error
              ? err
              : new Error('Failed to load comparison.'),
          );
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [billId, reloadKey]);

  const refetch = useCallback(() => setReloadKey((k) => k + 1), []);

  return { data, isLoading, error, refetch };
}
