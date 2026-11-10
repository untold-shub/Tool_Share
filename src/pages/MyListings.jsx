import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Wrench } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/initialData';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';

const emptyForm = { name: '', category: 'Power Tools', description: '', location: '', fee: '', availability: true, image: '' };

export default function MyListings() {
  const { currentUser, tools, addTool, updateTool, deleteTool, getAvgRating, getToolReviews } = useApp();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(null);

  const myTools = tools.filter((t) => t.ownerId === currentUser.id);

  const openAdd = () => { setForm({ ...emptyForm, location: currentUser.location || '' }); setEditing('new'); setErrors({}); };
  const openEdit = (tool) => { setForm({ ...tool, fee: String(tool.fee) }); setEditing(tool.id); setErrors({}); };
  const closeModal = () => { setEditing(null); setErrors({}); };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Tool name is required.';
    if (!form.description.trim()) e.description = 'Description is required.';
    if (!form.location.trim()) e.location = 'Location is required.';
    if (form.fee !== '' && (isNaN(Number(form.fee)) || Number(form.fee) < 0)) e.fee = 'Fee must be a non-negative number.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = {
      name: form.name.trim(),
      category: form.category,
      description: form.description.trim(),
      location: form.location.trim(),
      fee: form.fee === '' ? 0 : Number(form.fee),
      availability: form.availability,
      image: form.image.trim(),
    };
    if (editing === 'new') addTool(payload);
    else updateTool(editing, payload);
    closeModal();
  };

  const doDelete = () => {
    deleteTool(confirmDelete);
    setConfirmDelete(null);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>My Listings</h1>
          <p className="page-sub">{myTools.length} {myTools.length === 1 ? 'tool' : 'tools'} you're sharing.</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={18} /> Add Tool</button>
      </div>

      {myTools.length === 0 ? (
        <EmptyState
          icon={Wrench}
          title="No tools listed yet"
          message="List your first tool to start sharing with the community."
          action={<button className="btn btn-primary" onClick={openAdd}><Plus size={18} /> List a tool</button>}
        />
      ) : (
        <div className="listing-list">
          {myTools.map((tool) => {
            const reviews = getToolReviews(tool.id);
            const avg = getAvgRating(tool.id);
            return (
              <div key={tool.id} className="listing-row">
                <div className="listing-row-img">
                  {tool.image ? <img src={tool.image} alt={tool.name} /> : <div className="tool-card-img-placeholder"><Wrench size={24} /></div>}
                </div>
                <div className="listing-row-info">
                  <div className="listing-row-top">
                    <span className="tool-category">{tool.category}</span>
                    {!tool.availability && <span className="badge badge-unavailable">Unavailable</span>}
                  </div>
                  <h3><Link to={`/tools/${tool.id}`}>{tool.name}</Link></h3>
                  <p className="listing-row-desc">{tool.description}</p>
                  <div className="listing-row-meta">
                    <span>{tool.location}</span>
                    <span>{tool.fee > 0 ? `$${tool.fee}/day` : 'Free'}</span>
                    <span>{reviews.length} review{reviews.length !== 1 ? 's' : ''}{avg !== null ? ` · ${avg.toFixed(1)}★` : ''}</span>
                  </div>
                </div>
                <div className="listing-row-actions">
                  <button className="btn-icon" onClick={() => openEdit(tool)} aria-label="Edit"><Edit2 size={18} /></button>
                  <button className="btn-icon btn-icon-danger" onClick={() => setConfirmDelete(tool)} aria-label="Delete"><Trash2 size={18} /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        open={editing !== null}
        onClose={closeModal}
        title={editing === 'new' ? 'Add a Tool' : 'Edit Tool'}
        footer={<><button className="btn btn-outline" onClick={closeModal}>Cancel</button><button className="btn btn-primary" onClick={save} form="tool-form">Save</button></>}
      >
        <form id="tool-form" onSubmit={save} className="modal-form">
          <label className="form-label">
            <span>Tool name</span>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Cordless Drill" />
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
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Describe the tool, condition, and any accessories included." />
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
        </form>
      </Modal>

      <Modal
        open={confirmDelete !== null}
        onClose={() => setConfirmDelete(null)}
        title="Delete tool?"
        footer={<><button className="btn btn-outline" onClick={() => setConfirmDelete(null)}>Cancel</button><button className="btn btn-danger" onClick={doDelete}>Delete</button></>}
      >
        <p>Are you sure you want to delete <strong>{confirmDelete?.name}</strong>? This will also remove any borrowing requests for this tool. This cannot be undone.</p>
      </Modal>
    </div>
  );
}
