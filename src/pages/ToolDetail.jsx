import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, User, DollarSign, Calendar, MessageSquare, ArrowLeft, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatDate, todayISO, daysBetween } from '../utils/storage';
import StarRating from '../components/StarRating';
import Avatar from '../components/Avatar';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';

export default function ToolDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTool, getUser, currentUser, createRequest, getToolReviews, addReview, requests } = useApp();
  const tool = getTool(id);

  const [startDate, setStartDate] = useState(todayISO());
  const [endDate, setEndDate] = useState(todayISO());
  const [message, setMessage] = useState('');
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState(false);

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const reviews = useMemo(() => tool ? getToolReviews(tool.id) : [], [tool, getToolReviews]);
  const avgRating = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : null;

  const myActiveRequest = useMemo(() => {
    if (!tool || !currentUser) return null;
    return requests.find((r) => r.toolId === tool.id && r.borrowerId === currentUser.id && r.status !== 'Declined');
  }, [tool, currentUser, requests]);

  if (!tool) {
    return <EmptyState icon={MapPin} title="Tool not found" message="This listing may have been removed." action={<Link to="/explore" className="btn btn-primary">Back to Explore</Link>} />;
  }

  const owner = getUser(tool.ownerId);
  const isOwn = currentUser?.id === tool.ownerId;

  const submitRequest = (e) => {
    e.preventDefault();
    setFormError('');
    if (!startDate || !endDate) { setFormError('Please select borrowing dates.'); return; }
    if (new Date(startDate) < new Date(todayISO())) { setFormError('Start date cannot be in the past.'); return; }
    if (new Date(endDate) < new Date(startDate)) { setFormError('End date must be after the start date.'); return; }
    const res = createRequest({ toolId: tool.id, lenderId: tool.ownerId, startDate, endDate, message });
    if (!res.ok) { setFormError(res.error); return; }
    setSuccess(true);
  };

  const submitReview = (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    addReview({ toolId: tool.id, rating: reviewRating, comment: reviewComment.trim() });
    setReviewComment('');
    setReviewSubmitted(true);
  };

  const days = daysBetween(startDate, endDate);
  const totalCost = days * tool.fee;

  return (
    <div className="page">
      <button className="back-link" onClick={() => navigate(-1)}><ArrowLeft size={16} /> Back</button>

      <div className="detail-grid">
        <div className="detail-main">
          <div className="detail-img">
            {tool.image ? <img src={tool.image} alt={tool.name} /> : <div className="tool-card-img-placeholder" />}
          </div>
          <div className="detail-info">
            <span className="tool-category">{tool.category}</span>
            <h1>{tool.name}</h1>
            <div className="detail-meta">
              <span><MapPin size={16} /> {tool.location}</span>
              <span><DollarSign size={16} /> {tool.fee > 0 ? `$${tool.fee}/day` : 'Free'}</span>
              <span className={`avail-dot ${tool.availability ? 'avail' : 'unavail'}`}>
                {tool.availability ? 'Available' : 'Unavailable'}
              </span>
            </div>
            <h3>Description</h3>
            <p className="detail-desc">{tool.description}</p>

            <div className="owner-card">
              <Avatar name={owner?.name} size={44} />
              <div>
                <p className="owner-label">Listed by</p>
                <p className="owner-name">{owner?.name}</p>
                <p className="owner-loc">{owner?.location}</p>
              </div>
            </div>
          </div>

          <div className="reviews-section">
            <h2>Reviews ({reviews.length})</h2>
            {avgRating !== null && (
              <div className="reviews-avg">
                <span className="reviews-avg-num">{avgRating.toFixed(1)}</span>
                <StarRating value={avgRating} readOnly size={20} />
              </div>
            )}
            {reviews.length === 0 ? (
              <p className="muted">No reviews yet. Be the first to review this tool after borrowing it.</p>
            ) : (
              <div className="review-list">
                {reviews.map((r) => {
                  const reviewer = getUser(r.userId);
                  return (
                    <div key={r.id} className="review-item">
                      <Avatar name={reviewer?.name} size={36} />
                      <div className="review-body">
                        <div className="review-head">
                          <strong>{reviewer?.name}</strong>
                          <StarRating value={r.rating} readOnly size={14} />
                        </div>
                        <p>{r.comment}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {currentUser && !isOwn && (
              <div className="review-form">
                <h3>Leave a review</h3>
                {reviewSubmitted ? (
                  <p className="form-success"><Check size={16} /> Thanks for your review!</p>
                ) : (
                  <form onSubmit={submitReview}>
                    <StarRating value={reviewRating} onChange={setReviewRating} size={28} />
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share your experience with this tool..."
                      rows={3}
                    />
                    <button type="submit" className="btn btn-primary" disabled={!reviewComment.trim()}>Submit review</button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="detail-sidebar">
          {!currentUser ? (
            <div className="card sidebar-cta">
              <h3>Want to borrow this?</h3>
              <p className="muted">Log in to send a borrowing request.</p>
              <Link to="/login" className="btn btn-primary btn-block">Log in</Link>
              <Link to="/register" className="btn btn-outline btn-block">Sign up</Link>
            </div>
          ) : isOwn ? (
            <div className="card sidebar-cta">
              <h3>This is your tool</h3>
              <p className="muted">You can't borrow your own listing.</p>
              <Link to="/my-listings" className="btn btn-outline btn-block">Manage listings</Link>
            </div>
          ) : success ? (
            <div className="card sidebar-cta">
              <div className="success-icon"><Check size={32} /></div>
              <h3>Request sent!</h3>
              <p className="muted">{owner?.name} will review your request. You can track it in My Borrowing Requests.</p>
              <Link to="/borrowing" className="btn btn-primary btn-block">View my requests</Link>
            </div>
          ) : myActiveRequest ? (
            <div className="card sidebar-cta">
              <h3>Request already sent</h3>
              <p className="muted">You have an active request for this tool.</p>
              <div className="my-request-status">
                <StatusBadge status={myActiveRequest.status} />
                <p className="muted">{formatDate(myActiveRequest.startDate)} → {formatDate(myActiveRequest.endDate)}</p>
              </div>
              <Link to="/borrowing" className="btn btn-outline btn-block">View my requests</Link>
            </div>
          ) : !tool.availability ? (
            <div className="card sidebar-cta">
              <h3>Currently unavailable</h3>
              <p className="muted">This tool is not available for borrowing right now.</p>
            </div>
          ) : (
            <form className="card borrow-form" onSubmit={submitRequest}>
              <h3>Request to borrow</h3>
              <label className="form-label">
                <span><Calendar size={14} /> Start date</span>
                <input type="date" value={startDate} min={todayISO()} onChange={(e) => setStartDate(e.target.value)} />
              </label>
              <label className="form-label">
                <span><Calendar size={14} /> End date</span>
                <input type="date" value={endDate} min={startDate} onChange={(e) => setEndDate(e.target.value)} />
              </label>
              <label className="form-label">
                <span><MessageSquare size={14} /> Message <em>(optional)</em></span>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell the owner what you need it for..."
                  rows={3}
                />
              </label>
              {tool.fee > 0 && (
                <div className="cost-summary">
                  <span>{days} {days === 1 ? 'day' : 'days'} × ${tool.fee}/day</span>
                  <strong>${totalCost}</strong>
                </div>
              )}
              {formError && <p className="form-error">{formError}</p>}
              <button type="submit" className="btn btn-primary btn-block btn-lg">Send request</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
