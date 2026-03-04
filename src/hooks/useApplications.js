// ─────────────────────────────────────────────
// hooks/useApplications.js
// CRUD hook backed by IndexedDB — fully offline persistent
// ─────────────────────────────────────────────

import { useState, useEffect, useMemo } from "react";
import { today } from "../utils/dateHelpers";
import { getAll, addApp, updateApp, deleteApp } from "../utils/db";

export const EMPTY_FORM = {
  company:  "",
  role:     "",
  location: "",
  salary:   "",
  status:   "Applied",
  date:     today(),
  notes:    "",
};

export function useApplications() {
  const [apps,    setApps]   = useState([]);
  const [form,    setForm]   = useState(EMPTY_FORM);
  const [editId,  setEditId] = useState(null);
  const [loading, setLoading]= useState(true);

  // Hydrate from IndexedDB on mount
  useEffect(() => {
    getAll()
      .then((data) => { setApps(data); setLoading(false); })
      .catch((err) => { console.error("[DB] load failed:", err); setLoading(false); });
  }, []);

  const add = async () => {
    if (!form.company || !form.role) return false;
    const entry = { ...form, id: Date.now() };
    await addApp(entry);
    setApps((prev) => [entry, ...prev]);
    setForm(EMPTY_FORM);
    return true;
  };

  const update = async () => {
    if (!form.company || !form.role) return false;
    const entry = { ...form, id: editId };
    await updateApp(entry);
    setApps((prev) => prev.map((a) => (a.id === editId ? entry : a)));
    setEditId(null);
    setForm(EMPTY_FORM);
    return true;
  };

  const remove = async (id) => {
    await deleteApp(id);
    setApps((prev) => prev.filter((a) => a.id !== id));
  };

  const startEdit = (app) => {
    setForm({
      company:  app.company,
      role:     app.role,
      location: app.location,
      salary:   app.salary,
      status:   app.status,
      date:     app.date,
      notes:    app.notes,
    });
    setEditId(app.id);
  };

  const cancelEdit = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
  };

  const submit = () => (editId !== null ? update() : add());

  const stats = useMemo(() => {
    const counts = { Applied: 0, Interview: 0, Rejected: 0, Offer: 0 };
    apps.forEach((a) => { counts[a.status] = (counts[a.status] || 0) + 1; });
    return counts;
  }, [apps]);

  return {
    apps, form, setForm,
    editId, stats, loading,
    add, update, remove,
    startEdit, cancelEdit, submit,
  };
}
