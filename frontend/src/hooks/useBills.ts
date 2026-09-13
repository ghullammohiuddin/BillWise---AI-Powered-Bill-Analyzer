'use client';

import { useCallback, useEffect, useState } from 'react';
import { getBills } from '@/lib/api/bills';
import type { BillListItem } from '@/lib/types/bill';

interface UseBillsResult {
  bills: BillListItem[];
  total: number;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useBills(): UseBillsResult {
  const [bills, setBills] = useState<BillListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    getBills({ limit: 50, offset: 0 })
      .then((res) => {
        if (cancelled) return;
        setBills(res.bills);
        setTotal(res.total);
      })
      .catch((err) => {
        if (!cancelled)
          setError(
            err instanceof Error ? err : new Error('Failed to load bills.'),
          );
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const refetch = useCallback(() => setReloadKey((k) => k + 1), []);

  return { bills, total, isLoading, error, refetch };
}
