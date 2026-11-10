import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wrench, User, Mail, Lock, MapPin, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Register() {
  const { register } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', location: '' });
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.password) { setError('Please fill in all required fields.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    const res = register({ name: form.name, email: form.email, password: form.password, location: form.location });
    if (!res.ok) { setError(res.error); return; }
    navigate('/dashboard');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-brand"><Wrench size={26} className="brand-icon" /> ToolShare</Link>
        <h1>Create your account</h1>
        <p className="auth-sub">Join the community. Share and borrow tools.</p>

        <form onSubmit={submit} className="auth-form">
          <label className="form-label">
            <span>Full name</span>
            <div className="input-wrap"><User size={16} />
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jane Doe" />
            </div>
          </label>
          <label className="form-label">
            <span>Email</span>
            <div className="input-wrap"><Mail size={16} />
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
            </div>
          </label>
          <label className="form-label">
            <span>Location <em>(optional)</em></span>
            <div className="input-wrap"><MapPin size={16} />
              <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="City, State" />
            </div>
          </label>
          <div className="form-row">
            <label className="form-label">
              <span>Password</span>
              <div className="input-wrap"><Lock size={16} />
                <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Min 6 chars" />
              </div>
            </label>
            <label className="form-label">
              <span>Confirm</span>
              <div className="input-wrap"><Lock size={16} />
                <input type="password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} placeholder="Repeat" />
              </div>
            </label>
          </div>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn btn-primary btn-block btn-lg">
            Create account <ArrowRight size={18} />
          </button>
        </form>
        <p className="auth-switch">Already have an account? <Link to="/login">Log in</Link></p>
      </div>
    </div>
  );
}
