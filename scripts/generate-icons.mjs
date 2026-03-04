// ─────────────────────────────────────────────
// scripts/generate-icons.mjs
// Generates all required PWA icon sizes from a base SVG
// Run: node scripts/generate-icons.mjs
//
// Requires: npm install --save-dev sharp
// ─────────────────────────────────────────────

import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ICONS_DIR = join(__dirname, "../public/icons");
mkdirSync(ICONS_DIR, { recursive: true });

// SVG source — ✕ mark on paper background
const makeSVG = (size) => {
  const pad   = Math.round(size * 0.15);
  const fs    = Math.round(size * 0.55);
  const cx    = size / 2;
  const cy    = size / 2 + Math.round(size * 0.06);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="#F7F5F2" rx="${Math.round(size * 0.18)}"/>
  <text
    x="${cx}" y="${cy}"
    font-family="Georgia, serif"
    font-size="${fs}"
    font-weight="900"
    fill="#111010"
    text-anchor="middle"
    dominant-baseline="middle"
  >✕</text>
</svg>`;
};

const SIZES = [72, 96, 128, 144, 192, 512];

// Try to use sharp if available, otherwise write SVG stubs
async function generate() {
  let sharp;
  try {
    sharp = (await import("sharp")).default;
  } catch {
    console.warn("⚠  sharp not installed — writing SVG stubs instead.");
    console.warn("   Run: npm install --save-dev sharp");
    console.warn("   Then re-run: node scripts/generate-icons.mjs");

    SIZES.forEach((size) => {
      const svg  = makeSVG(size);
      const path = join(ICONS_DIR, `icon-${size}.svg`);
      writeFileSync(path, svg);
      console.log(`   ✓ ${path} (SVG stub)`);
    });
    return;
  }

  for (const size of SIZES) {
    const svg  = Buffer.from(makeSVG(size));
    const path = join(ICONS_DIR, `icon-${size}.png`);
    await sharp(svg).resize(size, size).png().toFile(path);
    console.log(`   ✓ ${path}`);
  }

  console.log("\n✅ All icons generated successfully.\n");
}

generate().catch(console.error);
