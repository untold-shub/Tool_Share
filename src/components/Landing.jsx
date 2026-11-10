import { Wrench, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Landing() {
  const { tools, users } = useApp();

  return (
    <div className="landing">
      <nav className="landing-nav">
        <div className="landing-brand"><Wrench size={24} className="brand-icon" /> ToolShare</div>
        <div className="landing-nav-links">
          <Link to="/login" className="btn btn-ghost">Login</Link>
          <Link to="/register" className="btn btn-primary">Get Started</Link>
        </div>
      </nav>

      <header className="hero">
        <div className="hero-content">
          <span className="hero-tag">Share more. Own less.</span>
          <h1>Borrow the tools you need.<br />Lend the ones you don't.</h1>
          <p className="hero-sub">
            ToolShare connects neighbors to share tools instead of buying them.
            Save money, reduce waste, and build community — one drill at a time.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary btn-lg">
              Create free account <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn btn-outline btn-lg">I have an account</Link>
          </div>
          <div className="hero-stats">
            <div><strong>{tools.length}</strong><span>Tools available</span></div>
            <div><strong>{users.length}</strong><span>Active members</span></div>
            <div><strong>5</strong><span>Categories</span></div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card-stack">
            <div className="hero-card-float">
              <span className="hero-card-tag">Power Tools</span>
              <p>Cordless Drill</p>
              <span className="hero-card-price">$5/day</span>
            </div>
            <div className="hero-card-float delay">
              <span className="hero-card-tag">Cleaning</span>
              <p>Pressure Washer</p>
              <span className="hero-card-price">$12/day</span>
            </div>
          </div>
        </div>
      </header>

      <section className="how-it-works">
        <h2>How it works</h2>
        <div className="steps">
          <div className="step">
            <span className="step-num">1</span>
            <h3>List your tools</h3>
            <p>Got tools gathering dust? List them in minutes and start sharing.</p>
          </div>
          <div className="step">
            <span className="step-num">2</span>
            <h3>Find what you need</h3>
            <p>Browse tools near you, filter by category, and send a borrow request.</p>
          </div>
          <div className="step">
            <span className="step-num">3</span>
            <h3>Connect & share</h3>
            <p>Lenders approve requests. Borrow, return, and leave a review.</p>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <p>ToolShare — A community tool lending platform. Demo credentials: <strong>alex@demo.com / demo123</strong></p>
      </footer>
    </div>
  );
}
