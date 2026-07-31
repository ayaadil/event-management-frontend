import { useEffect, useRef } from 'react';

/**
 * يشغّل دالة fetchFn تلقائيًا كل interval (بالمللي ثانية)
 * ويوقف نفسه تلقائيًا لو الصفحة مو ظاهرة (tab غير نشط) لتوفير الطلبات.
 *
 * @param {Function} fetchFn - الدالة اللي تجيب البيانات (لازم ترجع Promise)
 * @param {number} interval - الفترة بالمللي ثانية (افتراضي 15000)
 * @param {boolean} enabled - لتفعيل/تعطيل الـ polling
 */
export function useAutoRefresh(fetchFn, interval = 15000, enabled = true) {
  const fetchRef = useRef(fetchFn);
  fetchRef.current = fetchFn;

  useEffect(() => {
    if (!enabled) return;

    const tick = () => {
      if (document.visibilityState === 'visible') {
        fetchRef.current?.();
      }
    };

    // أول تحديث فور رجوع التبويب للظهور (لو كان مخفي وقت آخر تحديث)
    document.addEventListener('visibilitychange', tick);

    const id = setInterval(tick, interval);
    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', tick);
    };
  }, [interval, enabled]);
}