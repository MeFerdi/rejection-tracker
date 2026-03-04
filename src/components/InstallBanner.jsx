import { useState } from "react";
import { fonts, colors } from "../styles/theme";

export default function InstallBanner({ onInstall, onDismiss }) {
  return (
    <div style={styles.banner}>
      <div style={styles.left}>
        <span style={styles.icon}>📲</span>
        <div>
          <div style={styles.title}>Install the app</div>
          <div style={styles.sub}>
            Works offline · Lives on your home screen · No app store needed
          </div>
        </div>
      </div>
      <div style={styles.actions}>
        <button style={styles.install} onClick={onInstall}>
          Install
        </button>
        <button style={styles.dismiss} onClick={onDismiss}>
          Not now
        </button>
      </div>
    </div>
  );
}

const styles = {
  banner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 40px",
    background: colors.ink,
    color: colors.paper,
    gap: 16,
    flexWrap: "wrap",
  },
  left: {
    display: "flex",
    alignItems: "center",
    gap: 14,
  },
  icon: { fontSize: 22 },
  title: {
    fontFamily: fonts.body,
    fontSize: 14,
    fontWeight: 600,
    color: colors.paper,
  },
  sub: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: "#888880",
    marginTop: 2,
  },
  actions: { display: "flex", gap: 10 },
  install: {
    padding: "7px 20px",
    background: colors.paper,
    border: "none",
    borderRadius: 4,
    fontFamily: fonts.body,
    fontSize: 13,
    fontWeight: 600,
    color: colors.ink,
    cursor: "pointer",
  },
  dismiss: {
    padding: "7px 14px",
    background: "transparent",
    border: `1px solid #333330`,
    borderRadius: 4,
    fontFamily: fonts.body,
    fontSize: 13,
    color: "#888880",
    cursor: "pointer",
  },
};
