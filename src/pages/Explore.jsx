import { useState, useMemo } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/initialData';
import ToolCard from '../components/ToolCard';
import EmptyState from '../components/EmptyState';

export default function Explore() {
  const { tools } = useApp();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  const filtered = useMemo(() => {
    return tools.filter((t) => {
      const matchQuery = t.name.toLowerCase().includes(query.toLowerCase()) ||
        t.description.toLowerCase().includes(query.toLowerCase());
      const matchCat = category === 'All' || t.category === category;
      return matchQuery && matchCat;
    });
  }, [tools, query, category]);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Explore Tools</h1>
        <p className="page-sub">Browse {tools.length} tools shared by the community.</p>
      </div>

      <div className="explore-controls">
        <div className="search-wrap">
          <Search size={18} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by tool name..."
          />
          {query && <button className="search-clear" onClick={() => setQuery('')}><X size={16} /></button>}
        </div>
        <div className="filter-wrap">
          <Filter size={16} />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="All">All categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No tools found"
          message="Try a different search term or category filter."
        />
      ) : (
        <div className="tool-grid">
          {filtered.map((tool) => <ToolCard key={tool.id} tool={tool} />)}
        </div>
      )}
    </div>
  );
}
