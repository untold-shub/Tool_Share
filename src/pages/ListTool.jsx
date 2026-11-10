import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/initialData';
import EmptyState from '../components/EmptyState';

const emptyForm = { name: '', category: 'Power Tools', description: '', location: '', fee: '', availability: true, image: '' };

export default function ListTool() {
  const { currentUser, addTool } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ ...emptyForm, location: currentUser?.location || '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Tool name is required.';
    if (!form.description.trim()) e.description = 'Description is required.';
    if (!form.location.trim()) e.location = 'Location is required.';
    if (form.fee !== '' && (isNaN(Number(form.fee)) || Number(form.fee) < 0)) e.fee = 'Fee must be a non-negative number.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const tool = addTool({
      name: form.name.trim(),
      category: form.category,
      description: form.description.trim(),
      location: form.location.trim(),
      fee: form.fee === '' ? 0 : Number(form.fee),
      availability: form.availability,
      image: form.image.trim(),
    });
    navigate(`/tools/${tool.id}`);
  };

  if (!currentUser) {
    return <EmptyState icon={Wrench} title="Log in to list a tool" message="You need an account to share tools with the community." />;
  }

  return (
    <div className="page page-narrow">
      <button className="back-link" onClick={() => navigate(-1)}><ArrowLeft size={16} /> Back</button>
      <div className="page-header">
        <h1>List a Tool</h1>
        <p className="page-sub">Share something from your toolbox with the community.</p>
      </div>

      <form onSubmit={submit} className="card form-page">
        <label className="form-label">
          <span>Tool name</span>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Cordless Drill Driver" />
        </label>
        {errors.name && <p className="form-error">{errors.name}</p>}

        <label className="form-label">
          <span>Category</span>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>

        <label className="form-label">
          <span>Description</span>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4}
            placeholder="Describe the tool, its condition, and any accessories included." />
        </label>
        {errors.description && <p className="form-error">{errors.description}</p>}

        <div className="form-row">
          <label className="form-label">
            <span>Location</span>
            <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="City, State" />
          </label>
          <label className="form-label">
            <span>Daily fee ($)</span>
            <input type="number" min="0" step="1" value={form.fee} onChange={(e) => setForm({ ...form, fee: e.target.value })} placeholder="0 = free" />
          </label>
        </div>
        {errors.location && <p className="form-error">{errors.location}</p>}
        {errors.fee && <p className="form-error">{errors.fee}</p>}

        <label className="form-label">
          <span>Image URL <em>(optional)</em></span>
          <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
        </label>

        <label className="form-check">
          <input type="checkbox" checked={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.checked })} />
          <span>Available for borrowing</span>
        </label>

        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>Cancel</button>
          <button type="submit" className="btn btn-primary btn-lg">Publish listing</button>
        </div>
      </form>
    </div>
  );
}
