import { Link } from 'react-router-dom';
import { ArrowDownUp, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatDate, daysBetween } from '../utils/storage';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';

export default function BorrowingRequests() {
  const { currentUser, requests, getTool, getUser } = useApp();
  const myRequests = requests
    .filter((r) => r.borrowerId === currentUser.id)
    .sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="page">
      <div className="page-header">
        <h1>My Borrowing Requests</h1>
        <p className="page-sub">Track the status of tools you've asked to borrow.</p>
      </div>

      {myRequests.length === 0 ? (
        <EmptyState
          icon={ArrowDownUp}
          title="No borrowing requests yet"
          message="Find a tool you need and send a request to the owner."
          action={<Link to="/explore" className="btn btn-primary">Explore tools <ArrowRight size={16} /></Link>}
        />
      ) : (
        <div className="request-list">
          {myRequests.map((r) => {
            const tool = getTool(r.toolId);
            const lender = getUser(r.lenderId);
            const days = daysBetween(r.startDate, r.endDate);
            if (!tool) return null;
            return (
              <Link to={`/tools/${tool.id}`} key={r.id} className="request-row">
                <div className="request-row-img">
                  {tool.image ? <img src={tool.image} alt={tool.name} /> : <div className="tool-card-img-placeholder" />}
                </div>
                <div className="request-row-main">
                  <div className="request-row-top">
                    <h3>{tool.name}</h3>
                    <StatusBadge status={r.status} />
                  </div>
                  <p className="request-row-owner">From {lender?.name} · {tool.location}</p>
                  <div className="request-row-dates">
                    <span>{formatDate(r.startDate)} → {formatDate(r.endDate)}</span>
                    <span className="muted">{days} {days === 1 ? 'day' : 'days'}</span>
                  </div>
                  {r.message && <p className="request-row-msg">"{r.message}"</p>}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
