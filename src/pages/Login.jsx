import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wrench, Mail, Lock, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Login() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) {
      setError('Please fill in both fields.');
      return;
    }
    const res = login(form.email, form.password);
    if (!res.ok) { setError(res.error); return; }
    navigate('/dashboard');
  };

  const fillDemo = () => {
    setForm({ email: 'alex@demo.com', password: 'demo123' });
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-brand"><Wrench size={26} className="brand-icon" /> ToolShare</Link>
        <h1>Welcome back</h1>
        <p className="auth-sub">Log in to manage your tools and requests.</p>

        <button className="demo-fill" onClick={fillDemo} type="button">
          Use demo account (alex@demo.com / demo123)
        </button>

        <form onSubmit={submit} className="auth-form">
          <label className="form-label">
            <span>Email</span>
            <div className="input-wrap"><Mail size={16} />
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
            </div>
          </label>
          <label className="form-label">
            <span>Password</span>
            <div className="input-wrap"><Lock size={16} />
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
            </div>
          </label>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn btn-primary btn-block btn-lg">
            Log in <ArrowRight size={18} />
          </button>
        </form>
        <p className="auth-switch">Don't have an account? <Link to="/register">Sign up</Link></p>
      </div>
    </div>
  );
}
