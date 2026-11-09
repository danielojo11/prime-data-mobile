export function formatNaira(value, withDecimals = false) {
  const number = Number(value || 0);
  const fixed = withDecimals ? number.toFixed(2) : String(Math.round(number));
  const [whole, decimal] = fixed.split('.');
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `₦${grouped}${decimal ? `.${decimal}` : ''}`;
}

export function formatCompactNaira(value) {
  return `₦${Number(value || 0).toLocaleString()}`;
}

export function formatDate(dateValue) {
  if (!dateValue) return '—';
  if (typeof dateValue === 'string') {
    if (
      dateValue.includes('Today') ||
      dateValue.includes('Yesterday') ||
      /^[A-Z][a-z]{2} \d{1,2}/.test(dateValue)
    ) {
      return dateValue;
    }
  }
  const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
  if (Number.isNaN(date.getTime())) return String(dateValue);

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const dayDiff = Math.round((startOfToday - startOfDate) / 86400000);

  const time = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  if (dayDiff === 0) return `Today, ${time}`;
  if (dayDiff === 1) return `Yesterday, ${time}`;
  return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${time}`;
}

export function formatFullDate(dateValue) {
  const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
  if (Number.isNaN(date.getTime())) return String(dateValue || '—');
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function greetingForNow() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export function initialsOf(name) {
  const parts = String(name || 'User')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function makeId(prefix = 'TRX') {
  return `${prefix}-${Math.floor(1000000 + Math.random() * 8999999)}`;
}

export function makeReferralCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}
