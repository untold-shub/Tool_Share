import { Link } from 'react-router-dom';
import { Wrench, ArrowDownUp, Inbox, Clock, TrendingUp, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatDate } from '../utils/storage';
import StatusBadge from '../components/StatusBadge';

export default function Dashboard() {
  const { currentUser, tools, requests, getTool, getUser } = useApp();

  const myTools = tools.filter((t) => t.ownerId === currentUser.id);
  const myBorrowing = requests.filter((r) => r.borrowerId === currentUser.id);
  const incomingRequests = requests.filter((r) => r.lenderId === currentUser.id);
  const pendingIncoming = incomingRequests.filter((r) => r.status === 'Pending');
  const availableTools = tools.filter((t) => t.availability);

  const recent = [...requests]
    .filter((r) => r.borrowerId === currentUser.id || r.lenderId === currentUser.id)
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 5);

  const stats = [
    { label: 'Available tools', value: availableTools.length, icon: Wrench, color: 'green' },
    { label: 'My listings', value: myTools.length, icon: TrendingUp, color: 'blue' },
    { label: 'My borrow requests', value: myBorrowing.length, icon: ArrowDownUp, color: 'teal' },
    { label: 'Pending lending', value: pendingIncoming.length, icon: Inbox, color: 'amber' },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Welcome back, {currentUser.name.split(' ')[0]}</h1>
          <p className="page-sub">Here's what's happening with your tools and requests.</p>
        </div>
        <Link to="/list-tool" className="btn btn-primary"><Plus size={18} /> List a Tool</Link>
      </div>

      <div className="stat-grid">
        {stats.map((s) => (
          <div key={s.label} className={`stat-card stat-${s.color}`}>
            <div className="stat-icon"><s.icon size={22} /></div>
            <div>
              <p className="stat-value">{s.value}</p>
              <p className="stat-label">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <h2>Recent activity</h2>
            <Clock size={18} className="muted" />
          </div>
          {recent.length === 0 ? (
            <p className="muted">No activity yet. Start by listing a tool or browsing what's available.</p>
          ) : (
            <div className="activity-list">
              {recent.map((r) => {
                const tool = getTool(r.toolId);
                const other = getUser(r.borrowerId === currentUser.id ? r.lenderId : r.borrowerId);
                const isBorrower = r.borrowerId === currentUser.id;
                return (
                  <div key={r.id} className="activity-item">
                    <div className="activity-info">
                      <p className="activity-title">
                        {isBorrower ? 'You requested' : `${other?.name?.split(' ')[0]} requested`}
                        {' '}<strong>{tool?.name || 'a tool'}</strong>
                      </p>
                      <p className="activity-meta">{formatDate(r.startDate)} → {formatDate(r.endDate)}</p>
                    </div>
                    <StatusBadge status={r.status} />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <h2>Pending lending requests</h2>
            <Link to="/lender" className="link">View all</Link>
          </div>
          {pendingIncoming.length === 0 ? (
            <p className="muted">No pending requests waiting for your approval.</p>
          ) : (
            <div className="activity-list">
              {pendingIncoming.slice(0, 4).map((r) => {
                const tool = getTool(r.toolId);
                const borrower = getUser(r.borrowerId);
                return (
                  <Link key={r.id} to="/lender" className="activity-item">
                    <div className="activity-info">
                      <p className="activity-title"><strong>{borrower?.name}</strong> wants {tool?.name}</p>
                      <p className="activity-meta">{formatDate(r.startDate)} → {formatDate(r.endDate)}</p>
                    </div>
                    <StatusBadge status={r.status} />
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
