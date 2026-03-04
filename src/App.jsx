// ─────────────────────────────────────────────
// App.jsx — Root layout, view router, PWA state hub
// ─────────────────────────────────────────────

import { useState } from "react";
import { colors } from "./styles/theme";
import { useApplications } from "./hooks/useApplications";
import { usePWA }          from "./hooks/usePWA";

import Header         from "./components/Header";
import QuoteBar       from "./components/QuoteBar";
import InstallBanner  from "./components/InstallBanner";
import { OfflineBar, UpdateBar } from "./components/StatusBars";

import Dashboard from "./views/Dashboard";
import Log       from "./views/Log";
import AddEdit   from "./views/AddEdit";

export default function App() {
  const [view, setView]           = useState("dashboard");
  const [showInstall, setShowInstall] = useState(true);

  const {
    apps, form, setForm,
    editId, stats, loading,
    remove, startEdit, cancelEdit, submit,
  } = useApplications();

  const {
    isOnline, canInstall, updateAvailable,
    promptInstall, applyUpdate,
  } = usePWA();

  const handleEdit = (app) => {
    startEdit(app);
    setView("add");
  };

  const handleSubmit = async () => {
    const ok = await submit();
    if (ok) setView("log");
  };

  const handleCancel = () => {
    cancelEdit();
    setView("log");
  };

  const handleSetView = (v) => {
    if (v === "add" && editId !== null) cancelEdit();
    setView(v);
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.loadingText}>Loading your data…</div>
      </div>
    );
  }

  return (
    <div style={styles.shell}>
      {/* PWA status bars */}
      {!isOnline                          && <OfflineBar />}
      {updateAvailable                    && <UpdateBar onUpdate={applyUpdate} />}
      {canInstall && showInstall          && (
        <InstallBanner
          onInstall={promptInstall}
          onDismiss={() => setShowInstall(false)}
        />
      )}

      <Header view={view} setView={handleSetView} apps={apps} />

      <main style={styles.main}>
        {view === "dashboard" && <Dashboard apps={apps} stats={stats} />}
        {view === "log"       && <Log apps={apps} onEdit={handleEdit} onDelete={remove} />}
        {view === "add"       && (
          <AddEdit
            form={form}
            setForm={setForm}
            editId={editId}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        )}
      </main>

      <QuoteBar />
    </div>
  );
}

const styles = {
  shell: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    background: colors.offwhite,
  },
  main: {
    flex: 1,
    background: colors.offwhite,
  },
  loading: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: colors.offwhite,
  },
  loadingText: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14,
    color: colors.muted,
    letterSpacing: "0.06em",
  },
};
