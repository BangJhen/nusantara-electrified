const fs = require("fs");
const path = require("path");
const sharp = require("../dashboard/node_modules/sharp");

const W = 1080;
const H = 1920;
const OUT_DIR = path.join(__dirname, "..", "outputs", "poster");
const SVG_PATH = path.join(OUT_DIR, "nusantara-industrial-pulse.svg");
const PNG_PATH = path.join(OUT_DIR, "nusantara-industrial-pulse.png");

const colors = {
  paper: "#F4EFE4",
  paper2: "#E9E1D2",
  graphite: "#202A2A",
  muted: "#586262",
  line: "#C8BFAE",
  teal: "#008E8B",
  tealDark: "#006D70",
  yellow: "#E5B93C",
  brick: "#B5533B",
  nickel: "#8C9998",
  white: "#FFFDF6",
};

function esc(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function tspanLines(text, maxChars) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function textBlock({ x, y, width, text, size = 24, color = colors.graphite, weight = 400, leading = 1.22, anchor = "start", opacity = 1, transform = "" }) {
  const maxChars = Math.max(12, Math.floor(width / (size * 0.54)));
  const lines = tspanLines(text, maxChars);
  const tspans = lines
    .map((line, i) => `<tspan x="${x}" dy="${i === 0 ? 0 : size * leading}">${esc(line)}</tspan>`)
    .join("");
  return `<text x="${x}" y="${y}" text-anchor="${anchor}" font-size="${size}" font-weight="${weight}" fill="${color}" opacity="${opacity}" transform="${transform}">${tspans}</text>`;
}

function statCard({ x, y, w, h, eyebrow, value, label, accent = colors.teal, note }) {
  return `
    <g>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${colors.white}" stroke="${colors.line}" stroke-width="1.4"/>
      <rect x="${x}" y="${y}" width="7" height="${h}" rx="3.5" fill="${accent}"/>
      <text x="${x + 24}" y="${y + 30}" font-size="18" font-weight="700" fill="${colors.muted}" letter-spacing="1.2">${esc(eyebrow)}</text>
      <text x="${x + 24}" y="${y + 82}" font-size="44" font-weight="800" fill="${colors.graphite}">${esc(value)}</text>
      ${textBlock({ x: x + 24, y: y + 116, width: w - 48, text: label, size: 19, color: colors.graphite, weight: 650 })}
      ${note ? textBlock({ x: x + 24, y: y + h - 32, width: w - 48, text: note, size: 14, color: colors.muted, weight: 500 }) : ""}
    </g>`;
}

function miniBar({ x, y, w, label, value, max, color = colors.teal }) {
  const bw = Math.max(2, (value / max) * w);
  return `
    <g>
      <text x="${x}" y="${y}" font-size="16" font-weight="650" fill="${colors.graphite}">${esc(label)}</text>
      <text x="${x + w}" y="${y}" text-anchor="end" font-size="16" font-weight="750" fill="${colors.graphite}">${value}</text>
      <rect x="${x}" y="${y + 10}" width="${w}" height="8" rx="4" fill="${colors.paper2}"/>
      <rect x="${x}" y="${y + 10}" width="${bw}" height="8" rx="4" fill="${color}"/>
    </g>`;
}

function chainNode({ cx, cy, r, title, value, color, small }) {
  return `
    <g>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="${colors.white}" stroke="${color}" stroke-width="5"/>
      <circle cx="${cx}" cy="${cy}" r="${r - 13}" fill="${color}" opacity="0.12"/>
      <text x="${cx}" y="${cy - 7}" text-anchor="middle" font-size="${small ? 17 : 20}" font-weight="800" fill="${colors.graphite}">${esc(title)}</text>
      <text x="${cx}" y="${cy + 21}" text-anchor="middle" font-size="${small ? 16 : 19}" font-weight="700" fill="${color}">${esc(value)}</text>
    </g>`;
}

function sourceLine() {
  return `GAIKINDO/ICCT; PLN SPKLU dataset; PLN/ESDM RUPTL 2025-2034; ICCT LCA; industry research datasets.`;
}

const backgroundGrid = (() => {
  const lines = [];
  for (let x = 60; x <= W - 60; x += 40) {
    lines.push(`<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="${colors.line}" stroke-width="0.6" opacity="0.32"/>`);
  }
  for (let y = 70; y <= H - 70; y += 40) {
    lines.push(`<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="${colors.line}" stroke-width="0.6" opacity="0.32"/>`);
  }
  return lines.join("");
})();

const bevBars = [
  ["2020", 125],
  ["2021", 687],
  ["2022", 10327],
  ["2023", 17051],
  ["2024", 43188],
  ["2025", 103931],
].map(([year, value], i) => {
  const x = 86 + i * 70;
  const maxH = 182;
  const h = Math.max(3, (value / 103931) * maxH);
  const y = 575 - h;
  const color = i === 5 ? colors.teal : i >= 4 ? colors.yellow : colors.nickel;
  return `
    <g>
      <rect x="${x}" y="${y}" width="36" height="${h}" rx="5" fill="${color}"/>
      <text x="${x + 18}" y="604" text-anchor="middle" font-size="15" font-weight="700" fill="${colors.graphite}">${year}</text>
    </g>`;
}).join("");

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="paperWash" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${colors.paper}"/>
      <stop offset="0.52" stop-color="#F8F4EA"/>
      <stop offset="1" stop-color="${colors.paper2}"/>
    </linearGradient>
    <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.1" fill="${colors.line}" opacity="0.5"/>
    </pattern>
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#514A3F" flood-opacity="0.12"/>
    </filter>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#paperWash)"/>
  <rect width="${W}" height="${H}" fill="url(#dots)" opacity="0.5"/>
  ${backgroundGrid}
  <path d="M-40 375 C190 330 270 430 470 374 C650 324 778 230 1120 292" fill="none" stroke="${colors.yellow}" stroke-width="76" opacity="0.12"/>
  <path d="M-30 1350 C180 1280 320 1420 520 1365 C740 1305 835 1170 1120 1245" fill="none" stroke="${colors.teal}" stroke-width="92" opacity="0.10"/>

  <g transform="translate(64 58)">
    <text x="0" y="0" font-size="18" font-weight="800" fill="${colors.brick}" letter-spacing="3">POSTER STATISTIK / INDONESIA EV TRANSITION</text>
    <text x="0" y="86" font-size="78" font-weight="900" fill="${colors.graphite}" letter-spacing="0">Nusantara</text>
    <text x="0" y="158" font-size="78" font-weight="900" fill="${colors.graphite}" letter-spacing="0">Electrified</text>
    <rect x="0" y="186" width="460" height="8" fill="${colors.teal}"/>
    <rect x="470" y="186" width="128" height="8" fill="${colors.yellow}"/>
    ${textBlock({ x: 0, y: 236, width: 620, text: "Transisi Energi dan Tantangan Industri Nasional", size: 30, color: colors.graphite, weight: 760 })}
    ${textBlock({ x: 682, y: 34, width: 270, text: "EV melaju cepat. Transformasi nasional baru terjadi saat listrik, infrastruktur, dan industri lokal ikut siap.", size: 20, color: colors.muted, weight: 560 })}
  </g>

  <g filter="url(#softShadow)">
    <rect x="60" y="350" width="960" height="310" rx="8" fill="${colors.white}" stroke="${colors.line}" stroke-width="1.5"/>
    <rect x="60" y="350" width="960" height="16" rx="7" fill="${colors.graphite}"/>
    <rect x="60" y="350" width="640" height="16" rx="7" fill="${colors.teal}"/>
    <text x="86" y="412" font-size="18" font-weight="800" fill="${colors.brick}" letter-spacing="2">AKSELERASI PASAR</text>
    <text x="82" y="493" font-size="82" font-weight="900" fill="${colors.graphite}">103.931</text>
    <text x="86" y="535" font-size="29" font-weight="760" fill="${colors.graphite}">BEV wholesales pada 2025</text>
    ${textBlock({ x: 86, y: 636, width: 410, text: "Dari 125 unit pada 2020 menjadi 103.931 unit pada 2025: pasar berubah dari niche menuju akselerasi.", size: 18, color: colors.muted, weight: 550 })}
    <g transform="translate(500 0)">
      <line x1="0" y1="397" x2="0" y2="612" stroke="${colors.line}" stroke-width="1.5"/>
      <text x="38" y="412" font-size="17" font-weight="750" fill="${colors.muted}" letter-spacing="1.6">2020-2025 SALES CURVE</text>
      ${bevBars}
      <text x="450" y="493" text-anchor="end" font-size="50" font-weight="900" fill="${colors.teal}">+140,6%</text>
      <text x="450" y="524" text-anchor="end" font-size="18" font-weight="650" fill="${colors.muted}">YoY 2025</text>
    </g>
  </g>

  <g>
    <text x="64" y="724" font-size="21" font-weight="850" fill="${colors.graphite}" letter-spacing="2">RANTAI INDUSTRI NASIONAL</text>
    <text x="1016" y="724" text-anchor="end" font-size="16" font-weight="700" fill="${colors.muted}">NIKEL -> BATERAI -> EV -> SPKLU -> GRID</text>
    <line x1="146" y1="838" x2="934" y2="838" stroke="${colors.graphite}" stroke-width="3" opacity="0.8"/>
    <line x1="146" y1="838" x2="934" y2="838" stroke="${colors.yellow}" stroke-width="10" opacity="0.22"/>
    ${chainNode({ cx: 146, cy: 838, r: 62, title: "NIKEL", value: "106 proyek", color: colors.brick })}
    ${chainNode({ cx: 344, cy: 838, r: 62, title: "SEL", value: "140 GWh", color: colors.teal })}
    ${chainNode({ cx: 542, cy: 838, r: 62, title: "PABRIK", value: "Subang", color: colors.yellow })}
    ${chainNode({ cx: 740, cy: 838, r: 62, title: "PASAR", value: "2M mobil", color: colors.tealDark })}
    ${chainNode({ cx: 934, cy: 838, r: 62, title: "GRID", value: "69,5 GW", color: colors.nickel })}
    ${textBlock({ x: 72, y: 944, width: 936, text: "Indonesia tidak hanya menjadi pasar EV. Ambisinya masuk ke manufaktur kendaraan, baterai, dan mineral kritis; namun strategi berbasis nikel perlu membaca risiko baterai LFP yang tidak membutuhkan nikel.", size: 22, color: colors.graphite, weight: 620 })}
  </g>

  <g>
    ${statCard({ x: 60, y: 1020, w: 300, h: 190, eyebrow: "INFRASTRUKTUR", value: "2.426", label: "lokasi SPKLU tercatat", accent: colors.teal, note: "423 DKI Jakarta; 388 Jawa Barat; konsentrasi masih urban." })}
    ${statCard({ x: 390, y: 1020, w: 300, h: 190, eyebrow: "LISTRIK", value: "0,680", label: "kgCO2e/kWh faktor emisi grid", accent: colors.brick, note: "1,56x rata-rata global; manfaat EV naik saat listrik bersih." })}
    ${statCard({ x: 720, y: 1020, w: 300, h: 190, eyebrow: "INDUSTRI", value: "40%", label: "minimum TKDN untuk insentif EV", accent: colors.yellow, note: "Lokalisasi menjadi syarat daya saing industri." })}
  </g>

  <g transform="translate(60 1250)" filter="url(#softShadow)">
    <rect x="0" y="0" width="452" height="312" rx="8" fill="${colors.white}" stroke="${colors.line}" stroke-width="1.4"/>
    <text x="28" y="43" font-size="18" font-weight="800" fill="${colors.muted}" letter-spacing="1.7">PETA KETIMPANGAN SPKLU</text>
    ${miniBar({ x: 28, y: 82, w: 370, label: "DKI Jakarta", value: 423, max: 423, color: colors.teal })}
    ${miniBar({ x: 28, y: 128, w: 370, label: "Jawa Barat", value: 388, max: 423, color: colors.teal })}
    ${miniBar({ x: 28, y: 174, w: 370, label: "Jawa Timur", value: 231, max: 423, color: colors.nickel })}
    ${miniBar({ x: 28, y: 220, w: 370, label: "Jawa Tengah", value: 228, max: 423, color: colors.nickel })}
    ${miniBar({ x: 28, y: 266, w: 370, label: "Banten", value: 195, max: 423, color: colors.yellow })}
  </g>

  <g transform="translate(568 1250)" filter="url(#softShadow)">
    <rect x="0" y="0" width="452" height="312" rx="8" fill="${colors.white}" stroke="${colors.line}" stroke-width="1.4"/>
    <text x="28" y="43" font-size="18" font-weight="800" fill="${colors.muted}" letter-spacing="1.7">TANTANGAN INDUSTRI</text>
    <g transform="translate(28 76)">
      <text x="0" y="0" font-size="42" font-weight="900" fill="${colors.brick}">21 stalled</text>
      <text x="0" y="31" font-size="18" font-weight="650" fill="${colors.graphite}">dari 106 proyek smelter terlacak</text>
      <text x="0" y="84" font-size="42" font-weight="900" fill="${colors.teal}">10 GWh</text>
      <text x="0" y="115" font-size="18" font-weight="650" fill="${colors.graphite}">HLI Green Power, Karawang</text>
      <text x="0" y="168" font-size="42" font-weight="900" fill="${colors.yellow}">150k/tahun</text>
      <text x="0" y="199" font-size="18" font-weight="650" fill="${colors.graphite}">target kapasitas pabrik BYD Subang</text>
    </g>
  </g>

  <g transform="translate(60 1602)">
    <rect x="0" y="0" width="960" height="188" rx="8" fill="${colors.graphite}"/>
    <rect x="0" y="0" width="960" height="188" rx="8" fill="${colors.teal}" opacity="0.12"/>
    <text x="32" y="48" font-size="18" font-weight="800" fill="${colors.yellow}" letter-spacing="2">ENERGI BERSIH MENENTUKAN DAMPAK</text>
    <text x="32" y="104" font-size="38" font-weight="900" fill="${colors.white}">A-car ICE 246 -> BEV 127 gCO2e/km</text>
    <text x="32" y="140" font-size="21" font-weight="650" fill="#DDE9E4">EV lebih rendah emisi siklus hidup, tetapi pengurangannya membesar ketika grid nasional makin bersih.</text>
    <g transform="translate(752 34)">
      <circle cx="62" cy="62" r="58" fill="none" stroke="${colors.line}" stroke-width="10" opacity="0.3"/>
      <path d="M62 4 A58 58 0 1 1 14 95" fill="none" stroke="${colors.yellow}" stroke-width="10" stroke-linecap="round"/>
      <text x="62" y="58" text-anchor="middle" font-size="32" font-weight="900" fill="${colors.white}">42,6</text>
      <text x="62" y="84" text-anchor="middle" font-size="16" font-weight="750" fill="${colors.yellow}">GW EBT</text>
    </g>
  </g>

  <g transform="translate(60 1818)">
    <text x="0" y="0" font-size="26" font-weight="900" fill="${colors.graphite}">EV melaju cepat; transformasi nasional menuntut listrik bersih, infrastruktur merata, dan industri lokal yang tangguh.</text>
    <text x="0" y="40" font-size="13" font-weight="600" fill="${colors.muted}">${esc(sourceLine())}</text>
  </g>
</svg>`;

fs.writeFileSync(SVG_PATH, svg);

sharp(Buffer.from(svg))
  .png()
  .resize(W, H, { fit: "contain" })
  .toFile(PNG_PATH)
  .then(() => {
    console.log(`Wrote ${PNG_PATH}`);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
