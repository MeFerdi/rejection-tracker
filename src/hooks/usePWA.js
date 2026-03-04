// ─────────────────────────────────────────────
// hooks/usePWA.js
// Handles: SW registration, install prompt, online/offline status
// ─────────────────────────────────────────────

import { useState, useEffect } from "react";

export function usePWA() {
  const [isOnline,        setIsOnline]        = useState(navigator.onLine);
  const [installPrompt,   setInstallPrompt]   = useState(null);
  const [isInstalled,     setIsInstalled]     = useState(false);
  const [swReady,         setSwReady]         = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  // ── Online / offline detection ────────────────
  useEffect(() => {
    const online  = () => setIsOnline(true);
    const offline = () => setIsOnline(false);
    window.addEventListener("online",  online);
    window.addEventListener("offline", offline);
    return () => {
      window.removeEventListener("online",  online);
      window.removeEventListener("offline", offline);
    };
  }, []);

  // ── Detect if already installed (standalone) ──
  useEffect(() => {
    const mq = window.matchMedia("(display-mode: standalone)");
    setIsInstalled(mq.matches || window.navigator.standalone === true);
    const handler = (e) => setIsInstalled(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // ── Capture install prompt ────────────────────
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  // ── Register service worker ───────────────────
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((reg) => {
        setSwReady(true);

        // Listen for SW update
        reg.addEventListener("updatefound", () => {
          const newWorker = reg.installing;
          newWorker?.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              setUpdateAvailable(true);
            }
          });
        });
      })
      .catch((err) => console.error("[SW] registration failed:", err));
  }, []);

  // ── Trigger install ───────────────────────────
  const promptInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") {
      setInstallPrompt(null);
      setIsInstalled(true);
    }
  };

  // ── Apply SW update ───────────────────────────
  const applyUpdate = () => {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.getRegistration().then((reg) => {
      reg?.waiting?.postMessage({ type: "SKIP_WAITING" });
      window.location.reload();
    });
  };

  return {
    isOnline,
    isInstalled,
    canInstall: !!installPrompt && !isInstalled,
    swReady,
    updateAvailable,
    promptInstall,
    applyUpdate,
  };
}
