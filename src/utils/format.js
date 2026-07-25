
export function formatDate(dateTime) {
  if (!dateTime) return '';
  const d = new Date(dateTime);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatDateBadge(dateTime) {
  if (!dateTime) return { day: '--', month: '---' };
  const d = new Date(dateTime);
  if (Number.isNaN(d.getTime())) return { day: '--', month: '---' };
  return {
    day: d.toLocaleDateString('en-GB', { day: '2-digit' }),
    month: d.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase(),
  };
}

export function formatTime(dateTime) {
  if (!dateTime) return '';
  const d = new Date(dateTime);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

export function formatPrice(price) {
  const n = Number(price);
  if (Number.isNaN(n)) return price;
  return n === 0 ? 'Free' : `$${n}`;
}