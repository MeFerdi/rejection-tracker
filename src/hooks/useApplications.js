import { useState, useEffect, useMemo } from "react";
import { today } from "../utils/dateHelpers";
import { getAll, addApp, updateApp, deleteApp } from "../utils/db";
import { STATUS_CONFIG } from "../styles/theme";
import { normalizeApplication, addStatusHistoryEntry, DEFAULT_CATEGORY, DEFAULT_PRIORITY } from "../utils/applicationHelpers";

export const EMPTY_FORM = {
  company:  "",
  role:     "",
  location: "",
  salary:   "",
  category: DEFAULT_CATEGORY,
  priority: DEFAULT_PRIORITY,
  status:   "Applied",
  date:     today(),
  statusDate: today(),
  followUpDate: "",
  notes:    "",
  statusHistory: [{ status: "Applied", date: today(), note: "" }],
};

export function useApplications() {
  const [apps,    setApps]   = useState([]);
  const [form,    setForm]   = useState(EMPTY_FORM);
  const [editId,  setEditId] = useState(null);
  const [loading, setLoading]= useState(true);

  // Hydrate from IndexedDB on mount
  useEffect(() => {
    getAll()
      .then((data) => { setApps(data.map(normalizeApplication)); setLoading(false); })
      .catch((err) => { console.error("[DB] load failed:", err); setLoading(false); });
  }, []);

  const add = async () => {
    if (!form.company || !form.role) return false;
    const statusDate = form.statusDate || form.date || today();
    const entry = normalizeApplication({
      ...form,
      id: Date.now(),
      statusDate,
      updatedAt: statusDate,
      statusHistory: form.statusHistory?.length
        ? form.statusHistory
        : [{ status: form.status, date: statusDate, note: "" }],
    });
    await addApp(entry);
    setApps((prev) => [entry, ...prev]);
    setForm(EMPTY_FORM);
    return true;
  };

  const update = async () => {
    if (!form.company || !form.role) return false;
    const existing = apps.find((a) => a.id === editId);
    const statusDate = form.statusDate || form.date || today();
    const entry = normalizeApplication({
      ...(existing || {}),
      ...form,
      id: editId,
      statusHistory: form.statusHistory?.length
        ? form.statusHistory
        : existing
          ? addStatusHistoryEntry(existing, form.status, statusDate).statusHistory
          : [{ status: form.status, date: statusDate, note: "" }],
      statusDate,
      updatedAt: statusDate,
    });
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
    const normalized = normalizeApplication(app);
    setForm({
      company:  normalized.company,
      role:     normalized.role,
      location: normalized.location,
      salary:   normalized.salary,
      category: normalized.category,
      priority: normalized.priority,
      status:   normalized.status,
      date:     normalized.date,
      statusDate: normalized.statusDate || today(),
      followUpDate: normalized.followUpDate || "",
      notes:    normalized.notes,
      statusHistory: normalized.statusHistory,
    });
    setEditId(normalized.id);
  };

  const cancelEdit = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
  };

  const submit = () => (editId !== null ? update() : add());

  const stats = useMemo(() => {
    const counts = { Applied: 0, Interview: 0, Rejected: 0, Offer: 0 };
    apps.forEach((a) => {
      const status = STATUS_CONFIG[a.status] ? a.status : "Applied";
      counts[status] = (counts[status] || 0) + 1;
    });
    return counts;
  }, [apps]);

  return {
    apps, setApps, form, setForm,
    editId, stats, loading,
    add, update, remove,
    startEdit, cancelEdit, submit,
  };
}