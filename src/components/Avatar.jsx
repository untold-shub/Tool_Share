import { Wrench } from 'lucide-react';

export default function Avatar({ name, size = 40 }) {
  const initial = (name || '?').charAt(0).toUpperCase();
  return (
    <div className="avatar" style={{ width: size, height: size, fontSize: size * 0.4 }}>
      {initial}
    </div>
  );
}
