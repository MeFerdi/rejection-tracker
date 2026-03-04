import { useState } from "react";
import { colors } from "./styles/theme";
import { useApplications } from "./hooks/useApplications";
import { usePWA }          from "./hooks/usePWA";
import { getAll }          from "./utils/db";

import Header         from "./components/Header";
import QuoteBar       from "./components/QuoteBar";
import InstallBanner  from "./components/InstallBanner";
import ImportModal    from "./components/ImportModal";
import { OfflineBar, UpdateBar } from "./components/StatusBars";

import Dashboard from "./views/Dashboard";
import Log       from "./views/Log";
import AddEdit   from "./views/AddEdit";

export default function App() {
  const [view,        setView]        = useState("dashboard");
  const [showInstall, setShowInstall] = useState(true);
  const [showImport,  setShowImport]  = useState(false);

  const {
    apps, form, setForm,
    editId, stats, loading,
    remove, startEdit, cancelEdit, submit,
    setApps,
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

  // Re-hydrate all state from IndexedDB after an import completes
  const handleImportComplete = async () => {
    const fresh = await getAll();
    setApps(fresh);
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
      {!isOnline       && <OfflineBar />}
      {updateAvailable && <UpdateBar onUpdate={applyUpdate} />}
      {canInstall && showInstall && (
        <InstallBanner
          onInstall={promptInstall}
          onDismiss={() => setShowInstall(false)}
        />
      )}

      <Header
        view={view}
        setView={handleSetView}
        apps={apps}
        onImport={() => setShowImport(true)}
      />

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

      {showImport && (
        <ImportModal
          existingApps={apps}
          onComplete={handleImportComplete}
          onClose={() => setShowImport(false)}
        />
      )}
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