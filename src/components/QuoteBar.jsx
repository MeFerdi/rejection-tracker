import { fonts, colors, QUOTES } from "../styles/theme";
import { useMemo } from "react";

export default function QuoteBar() {
  const quote = useMemo(
    () => QUOTES[Math.floor(Math.random() * QUOTES.length)],
    []
  );

  return (
    <footer style={styles.bar}>
      <span style={styles.mark}>"</span>
      <span style={styles.text}>{quote}</span>
    </footer>
  );
}

const styles = {
  bar: {
    padding: "14px 40px",
    borderTop: `1px solid ${colors.rule}`,
    background: colors.paper,
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  mark: {
    fontFamily: fonts.display,
    fontSize: 24,
    color: colors.ghost,
    lineHeight: 1,
    marginTop: -4,
  },
  text: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.muted,
    fontStyle: "italic",
    letterSpacing: "0.02em",
  },
};
