import { fonts, colors } from "../styles/theme";

export function OfflineBar() {
  return (
    <div style={styles.offline}>
      <span style={styles.dot} />
      <span>You're offline — all your data is still here and saved locally.</span>
    </div>
  );
}

export function UpdateBar({ onUpdate }) {
  return (
    <div style={styles.update}>
      <span>A new version is available.</span>
      <button style={styles.updateBtn} onClick={onUpdate}>
        Refresh to update
      </button>
    </div>
  );
}

const styles = {
  offline: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "8px 40px",
    background: "#2a2a1a",
    fontFamily: fonts.body,
    fontSize: 12,
    color: "#c8c860",
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "#c8c860",
    flexShrink: 0,
  },
  update: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "8px 40px",
    background: colors.applied + "22",
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.applied,
    gap: 16,
  },
  updateBtn: {
    padding: "4px 14px",
    background: colors.applied,
    border: "none",
    borderRadius: 3,
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.paper,
    cursor: "pointer",
    fontWeight: 600,
  },
};
