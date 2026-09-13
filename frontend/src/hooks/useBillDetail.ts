'use client';

import { useCallback, useEffect, useState } from 'react';
import { getBillById } from '@/lib/api/bills';
import type { Bill } from '@/lib/types/bill';

export function useBillDetail(billId: string) {
  const [bill, setBill] = useState<Bill | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    getBillById(billId)
      .then((res) => {
        if (!cancelled) setBill(res);
      })
      .catch((err) => {
        if (!cancelled)
          setError(
            err instanceof Error ? err : new Error('Failed to load bill.'),
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

  return { bill, isLoading, error, refetch };
}
