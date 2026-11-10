export default function EmptyState({ icon: Icon, title, message, action }) {
  return (
    <div className="empty-state">
      {Icon && <Icon size={48} className="empty-icon" />}
      <h3>{title}</h3>
      {message && <p>{message}</p>}
      {action}
    </div>
  );
}
