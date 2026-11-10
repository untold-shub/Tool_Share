export default function StatusBadge({ status }) {
  const cls = status === 'Approved' ? 'status-approved' : status === 'Declined' ? 'status-declined' : 'status-pending';
  return <span className={`status-badge ${cls}`}>{status}</span>;
}
