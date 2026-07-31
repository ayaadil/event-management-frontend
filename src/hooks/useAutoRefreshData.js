import { useState, useEffect, useCallback } from 'react';
import { useAutoRefresh } from './useAutoRefresh';

/**
 * هوك عام: يجيب بيانات من fetchFn، يخزنها، ويحدثها تلقائيًا.
 * تستخدمه في أي صفحة تبي بياناتها تتحدث لوحدها.
 *
 * @param {Function} fetchFn - async function ترجع البيانات
 * @param {number} interval - فترة التحديث بالمللي ثانية
 * @param {boolean} enabled - تفعيل/تعطيل
 */
export function useAutoRefreshData(fetchFn, interval = 15000, enabled = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      const result = await fetchFn();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    load();
  }, [load]);

  useAutoRefresh(load, interval, enabled);

  return { data, loading, error, refresh: load };
}