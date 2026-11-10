import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { storage, uid } from '../utils/storage';
import { buildInitialData } from '../data/initialData';

const AppContext = createContext(null);

function loadState() {
  const seeded = storage.get('seeded');
  if (!seeded) {
    const initial = buildInitialData();
    storage.set('users', initial.users);
    storage.set('tools', initial.tools);
    storage.set('requests', initial.requests);
    storage.set('reviews', initial.reviews);
    storage.set('seeded', true);
  }
  return {
    users: storage.get('users') || [],
    tools: storage.get('tools') || [],
    requests: storage.get('requests') || [],
    reviews: storage.get('reviews') || [],
  };
}

export function AppProvider({ children }) {
  const [state, setState] = useState(loadState);
  const [currentUser, setCurrentUser] = useState(() => storage.get('session'));

  useEffect(() => { storage.set('users', state.users); }, [state.users]);
  useEffect(() => { storage.set('tools', state.tools); }, [state.tools]);
  useEffect(() => { storage.set('requests', state.requests); }, [state.requests]);
  useEffect(() => { storage.set('reviews', state.reviews); }, [state.reviews]);
  useEffect(() => {
    if (currentUser) storage.set('session', currentUser);
    else storage.remove('session');
  }, [currentUser]);

  const refresh = useCallback(() => setState(loadState()), []);

  // ---- Auth ----
  const register = useCallback((form) => {
    const exists = state.users.find((u) => u.email.toLowerCase() === form.email.toLowerCase());
    if (exists) return { ok: false, error: 'An account with this email already exists.' };
    const user = { id: uid(), name: form.name, email: form.email, password: form.password, location: form.location || '', bio: '' };
    setState((s) => ({ ...s, users: [...s.users, user] }));
    setCurrentUser(user);
    return { ok: true };
  }, [state.users]);

  const login = useCallback((email, password) => {
    const user = state.users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!user) return { ok: false, error: 'Invalid email or password.' };
    setCurrentUser(user);
    return { ok: true };
  }, [state.users]);

  const logout = useCallback(() => setCurrentUser(null), []);

  const updateProfile = useCallback((patch) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...patch };
    setState((s) => ({ ...s, users: s.users.map((u) => (u.id === currentUser.id ? updated : u)) }));
    setCurrentUser(updated);
  }, [currentUser]);

  // ---- Tools ----
  const addTool = useCallback((tool) => {
    if (!currentUser) return;
    const newTool = { id: uid(), ownerId: currentUser.id, ...tool };
    setState((s) => ({ ...s, tools: [newTool, ...s.tools] }));
    return newTool;
  }, [currentUser]);

  const updateTool = useCallback((toolId, patch) => {
    setState((s) => ({ ...s, tools: s.tools.map((t) => (t.id === toolId ? { ...t, ...patch } : t)) }));
  }, []);

  const deleteTool = useCallback((toolId) => {
    setState((s) => ({
      ...s,
      tools: s.tools.filter((t) => t.id !== toolId),
      requests: s.requests.filter((r) => r.toolId !== toolId),
    }));
  }, []);

  // ---- Requests ----
  const createRequest = useCallback((req) => {
    if (!currentUser) return { ok: false, error: 'You must be logged in.' };
    const newReq = { id: uid(), borrowerId: currentUser.id, createdAt: Date.now(), status: 'Pending', ...req };
    setState((s) => ({ ...s, requests: [newReq, ...s.requests] }));
    return { ok: true, request: newReq };
  }, [currentUser]);

  const updateRequestStatus = useCallback((requestId, status) => {
    setState((s) => ({ ...s, requests: s.requests.map((r) => (r.id === requestId ? { ...r, status } : r)) }));
  }, []);

  // ---- Reviews ----
  const addReview = useCallback((review) => {
    if (!currentUser) return;
    const newReview = { id: uid(), userId: currentUser.id, createdAt: Date.now(), ...review };
    setState((s) => ({ ...s, reviews: [newReview, ...s.reviews] }));
    return newReview;
  }, [currentUser]);

  // ---- Selectors ----
  const getUser = useCallback((id) => state.users.find((u) => u.id === id), [state.users]);
  const getTool = useCallback((id) => state.tools.find((t) => t.id === id), [state.tools]);
  const getToolReviews = useCallback((toolId) => state.reviews.filter((r) => r.toolId === toolId), [state.reviews]);
  const getAvgRating = useCallback((toolId) => {
    const revs = state.reviews.filter((r) => r.toolId === toolId);
    if (!revs.length) return null;
    return revs.reduce((sum, r) => sum + r.rating, 0) / revs.length;
  }, [state.reviews]);

  const value = {
    ...state,
    currentUser,
    register, login, logout, updateProfile,
    addTool, updateTool, deleteTool,
    createRequest, updateRequestStatus,
    addReview,
    getUser, getTool, getToolReviews, getAvgRating,
    refresh,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
