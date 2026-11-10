import { Link } from 'react-router-dom';
import { Inbox, Check, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatDate, daysBetween } from '../utils/storage';
import StatusBadge from '../components/StatusBadge';
import Avatar from '../components/Avatar';
import EmptyState from '../components/EmptyState';

export default function LenderRequests() {
  const { currentUser, requests, getTool, getUser, updateRequestStatus } = useApp();
  const incoming = requests
    .filter((r) => r.lenderId === currentUser.id)
    .sort((a, b) => b.createdAt - a.createdAt);

  const pending = incoming.filter((r) => r.status === 'Pending');
  const resolved = incoming.filter((r) => r.status !== 'Pending');

  const renderRow = (r) => {
    const tool = getTool(r.toolId);
    const borrower = getUser(r.borrowerId);
    const days = daysBetween(r.startDate, r.endDate);
    if (!tool) return null;
    return (
      <div key={r.id} className="lender-row">
        <div className="lender-row-img">
          {tool.image ? <img src={tool.image} alt={tool.name} /> : <div className="tool-card-img-placeholder" />}
        </div>
        <div className="lender-row-main">
          <div className="lender-row-top">
            <div className="lender-borrower">
              <Avatar name={borrower?.name} size={36} />
              <div>
                <p className="lender-borrower-name">{borrower?.name}</p>
                <p className="lender-borrower-loc">{borrower?.location}</p>
              </div>
            </div>
            <StatusBadge status={r.status} />
          </div>
          <h3><Link to={`/tools/${tool.id}`}>{tool.name}</Link></h3>
          <div className="lender-row-dates">
            <span>{formatDate(r.startDate)} → {formatDate(r.endDate)}</span>
            <span className="muted">{days} {days === 1 ? 'day' : 'days'}</span>
            {tool.fee > 0 && <span className="lender-cost">${days * tool.fee} total</span>}
          </div>
          {r.message && <p className="lender-row-msg">"{r.message}"</p>}
          {r.status === 'Pending' && (
            <div className="lender-actions">
              <button className="btn btn-primary btn-sm" onClick={() => updateRequestStatus(r.id, 'Approved')}>
                <Check size={16} /> Approve
              </button>
              <button className="btn btn-outline btn-sm" onClick={() => updateRequestStatus(r.id, 'Declined')}>
                <X size={16} /> Decline
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Lender Requests</h1>
        <p className="page-sub">Manage borrowing requests for your tools.</p>
      </div>

      {incoming.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No requests yet"
          message="When someone asks to borrow one of your tools, their request will appear here."
        />
      ) : (
        <>
          {pending.length > 0 && (
            <div className="section-block">
              <h2 className="section-title">Pending ({pending.length})</h2>
              <div className="request-list">{pending.map(renderRow)}</div>
            </div>
          )}
          {resolved.length > 0 && (
            <div className="section-block">
              <h2 className="section-title">Resolved ({resolved.length})</h2>
              <div className="request-list">{resolved.map(renderRow)}</div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
