import { Link } from 'react-router-dom';
import { MapPin, Wrench } from 'lucide-react';
import { useApp } from '../context/AppContext';
import StarRating from './StarRating';

export default function ToolCard({ tool }) {
  const { getUser, getAvgRating, currentUser } = useApp();
  const owner = getUser(tool.ownerId);
  const avg = getAvgRating(tool.id);
  const isOwn = currentUser?.id === tool.ownerId;

  return (
    <Link to={`/tools/${tool.id}`} className="tool-card">
      <div className="tool-card-img">
        {tool.image ? (
          <img src={tool.image} alt={tool.name} loading="lazy" />
        ) : (
          <div className="tool-card-img-placeholder"><Wrench size={32} /></div>
        )}
        {!tool.availability && <span className="badge badge-unavailable">Unavailable</span>}
        {isOwn && <span className="badge badge-own">Your tool</span>}
      </div>
      <div className="tool-card-body">
        <span className="tool-category">{tool.category}</span>
        <h3>{tool.name}</h3>
        <p className="tool-card-desc">{tool.description}</p>
        <div className="tool-card-meta">
          <span className="tool-location"><MapPin size={14} /> {tool.location}</span>
          {avg !== null && <StarRating value={avg} readOnly size={14} />}
        </div>
        <div className="tool-card-footer">
          <span className="tool-fee">{tool.fee > 0 ? `$${tool.fee}/day` : 'Free'}</span>
          <span className="tool-owner">By {owner?.name?.split(' ')[0] || 'Unknown'}</span>
        </div>
      </div>
    </Link>
  );
}
