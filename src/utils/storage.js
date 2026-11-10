const PREFIX = 'toolshare_';

export const storage = {
  get(key) {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch {
      // ignore quota errors
    }
  },
  remove(key) {
    localStorage.removeItem(PREFIX + key);
  },
  clearAll() {
    Object.keys(localStorage).forEach((k) => {
      if (k.startsWith(PREFIX)) localStorage.removeItem(k);
    });
  },
};

export const uid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

export const formatDate = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const todayISO = () => new Date().toISOString().slice(0, 10);

export const daysBetween = (start, end) => {
  const a = new Date(start);
  const b = new Date(end);
  return Math.max(0, Math.round((b - a) / 86400000));
};
