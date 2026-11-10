import { useState } from 'react';
import { User, Mail, MapPin, Edit2, Save, X, Wrench, ArrowDownUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Avatar from '../components/Avatar';

export default function Profile() {
  const { currentUser, updateProfile, tools, requests } = useApp();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: currentUser.name,
    email: currentUser.email,
    location: currentUser.location || '',
    bio: currentUser.bio || '',
  });
  const [error, setError] = useState('');

  const myTools = tools.filter((t) => t.ownerId === currentUser.id);
  const myBorrowing = requests.filter((r) => r.borrowerId === currentUser.id);
  const myLending = requests.filter((r) => r.lenderId === currentUser.id);

  const save = (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) { setError('Name is required.'); return; }
    if (!form.email.trim()) { setError('Email is required.'); return; }
    updateProfile({
      name: form.name.trim(),
      email: form.email.trim(),
      location: form.location.trim(),
      bio: form.bio.trim(),
    });
    setEditing(false);
  };

  const cancel = () => {
    setForm({ name: currentUser.name, email: currentUser.email, location: currentUser.location || '', bio: currentUser.bio || '' });
    setEditing(false);
    setError('');
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Profile</h1>
        <p className="page-sub">Manage your personal information.</p>
      </div>

      <div className="profile-grid">
        <div className="card profile-card">
          <div className="profile-header">
            <Avatar name={currentUser.name} size={72} />
            <h2>{currentUser.name}</h2>
            <p className="muted">{currentUser.email}</p>
          </div>
          <div className="profile-stats">
            <div><strong>{myTools.length}</strong><span>Listed tools</span></div>
            <div><strong>{myBorrowing.length}</strong><span>Borrowing</span></div>
            <div><strong>{myLending.length}</strong><span>Lending</span></div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2>Details</h2>
            {!editing ? (
              <button className="btn btn-outline btn-sm" onClick={() => setEditing(true)}><Edit2 size={14} /> Edit</button>
            ) : (
              <div className="card-header-actions">
                <button className="btn btn-outline btn-sm" onClick={cancel}><X size={14} /> Cancel</button>
                <button className="btn btn-primary btn-sm" onClick={save}><Save size={14} /> Save</button>
              </div>
            )}
          </div>

          {!editing ? (
            <div className="profile-details">
              <div className="profile-detail-row"><User size={18} /><div><span>Name</span><p>{currentUser.name}</p></div></div>
              <div className="profile-detail-row"><Mail size={18} /><div><span>Email</span><p>{currentUser.email}</p></div></div>
              <div className="profile-detail-row"><MapPin size={18} /><div><span>Location</span><p>{currentUser.location || 'Not set'}</p></div></div>
              <div className="profile-detail-row"><Wrench size={18} /><div><span>Bio</span><p>{currentUser.bio || 'No bio yet.'}</p></div></div>
            </div>
          ) : (
            <form onSubmit={save} className="modal-form">
              <label className="form-label">
                <span>Name</span>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </label>
              <label className="form-label">
                <span>Email</span>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </label>
              <label className="form-label">
                <span>Location</span>
                <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="City, State" />
              </label>
              <label className="form-label">
                <span>Bio</span>
                <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} placeholder="Tell the community a bit about yourself." />
              </label>
              {error && <p className="form-error">{error}</p>}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
