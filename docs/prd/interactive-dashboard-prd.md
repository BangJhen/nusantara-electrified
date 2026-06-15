# PRD: Nusantara Electrified Interactive Dashboard

## Problem Statement

Indonesia sedang mendorong kendaraan listrik sebagai bagian dari transisi energi dan strategi industri nasional. Namun bagi masyarakat umum, isu EV sering terpecah menjadi potongan terpisah: penjualan mobil listrik, subsidi, SPKLU, nikel, baterai, emisi listrik, dan harga kendaraan.

Project ini perlu mengubah data kompleks tersebut menjadi web interaktif yang informatif, aplikatif, dan menarik secara visual untuk konteks SIC SATRIA DATA 2026. Tantangannya adalah membangun dashboard yang tidak hanya menampilkan grafik, tetapi juga menjawab pertanyaan besar:

> Apakah EV Indonesia benar-benar siap menjadi transformasi nasional, atau baru sekadar tren pasar?

## Solution

Bangun **single-page interactive scrollytelling dashboard** bernama **“Nusantara Electrified”**.

Dashboard menggabungkan data adoption, SPKLU, emisi, industri EV, dan sentimen publik menjadi narasi visual:

> **EV Indonesia melaju cepat, tapi keberhasilannya ditentukan oleh kesiapan industri dan kebersihan listrik.**

Produk akhir harus terasa seperti editorial data story modern: kuat secara data, mudah dipahami masyarakat, dan cukup menarik untuk kompetisi visualisasi.

## Primary Audience

1. Juri SIC SATRIA DATA 2026.
2. Masyarakat umum yang ingin memahami EV tanpa membaca laporan teknis.
3. Mahasiswa/peneliti yang tertarik pada transisi energi.
4. Pembuat kebijakan/industri sebagai pembaca sekunder.

## Success Criteria

1. Pengguna memahami bahwa EV bukan hanya isu kendaraan, tetapi juga isu listrik, industri, dan infrastruktur.
2. Dashboard memiliki minimal 5 visualisasi data utama yang interaktif atau responsive.
3. Setiap angka penting memiliki sumber/caveat yang jelas.
4. Dashboard dapat berjalan sebagai SPA tanpa backend runtime.
5. Dataset dipakai dari `data/processed/` atau salinan static public data.
6. Visual design terasa kompetitif: cinematic, modern, dan tidak seperti dashboard admin generik.

## Core User Stories

1. As a general audience member, I want to see how fast EV adoption is growing, so that I understand why this topic matters now.
2. As a general audience member, I want to explore SPKLU distribution on a map, so that I can see whether infrastructure is evenly distributed.
3. As a user, I want to adjust grid emission assumptions, so that I can understand how electricity mix affects EV climate benefits.
4. As a competition judge, I want source and methodology notes, so that I can trust the analysis.
5. As a policymaker/industry reader, I want to see the EV industrial value chain, so that I understand national development implications.
6. As a student, I want complex topics such as TKDN, nickel, LFP, and grid emissions explained visually, so that I can follow without prior expertise.
7. As a mobile user, I want the story to remain readable and performant, so that I can experience it on a phone.

## Product Scope

### Section 1 — Hero: “Nusantara Electrified”

Purpose: establish the thesis and hook.

Content:

- Short headline and subtitle.
- 3–4 metric cards:
  - BEV growth 2020–2025.
  - SPKLU station count from dataset.
  - Grid emission factor.
  - RUPTL/EV target toward 2030.

Interaction:

- Subtle animated energy lines or glowing map background.
- Scroll cue.

### Section 2 — EV Melaju Cepat

Purpose: show adoption growth.

Datasets:

- `data/processed/indonesia_bev_annual_sales.csv`
- `data/processed/aisi_motorcycle_annual_summary.csv`

Visuals:

- Bar/line hybrid for BEV wholesales.
- Optional comparison card: market motor nasional is huge, showing two-wheeler opportunity.

Key message:

- EV adoption is accelerating, but car EV is only one part of the mobility transition.

### Section 3 — Infrastruktur Mengejar

Purpose: map and quantify SPKLU readiness.

Datasets:

- `data/processed/SPKLU-LOKASI_processed.csv`
- `data/processed/spklu_station_counts_by_province.csv`
- `data/processed/spklu_station_counts_by_operator.csv`
- `data/processed/spklu_connector_type_counts.csv`

Visuals:

- Interactive point map.
- Province ranking bar chart.
- Connector type donut/bar.
- Operator concentration card.

Interactions:

- Hover station points.
- Filter by province/operator/connector type if feasible.

Key message:

- Infrastructure exists and is growing, but distribution is uneven.

### Section 4 — Seberapa Hijau EV?

Purpose: explain grid-emission dependency.

Datasets:

- `data/processed/ev_emission_scenario_indonesia.csv`
- `data/processed/ev_lca_emission_factors_icct.csv`
- `data/processed/indonesia_electricity_mix_and_grid.csv`

Visuals:

- Interactive grid factor slider.
- EV use-phase gCO2/km compared with ICE baseline.
- RUPTL capacity mix stacked bar.

Interactions:

- User adjusts grid factor from dirty to clean.
- Display recalculated BEV use-phase gCO2/km.

Key message:

- EV is cleaner, but it becomes much more transformative when the grid gets cleaner.

### Section 5 — Dari Nikel ke Mobil Listrik

Purpose: connect EV to industry nasional.

Datasets:

- `data/processed/ev_industry_investment_and_capacity.csv`
- `data/processed/ev_industry_targets_and_risks.csv`

Visuals:

- Value chain diagram: nikel → smelter → battery material → cell → pack → EV → SPKLU.
- Cards for key projects: HLI, CATL/IBC, BYD, VinFast, Hyundai, Wuling.
- Status chips: operational, construction, planned, stalled.

Key message:

- Indonesia wants to move from raw material advantage to industrial value capture.

### Section 6 — Nickel & Grid Paradox

Purpose: show nuance and tension.

Visuals:

- Split cards:
  - Opportunity: nickel, battery plants, EV assembly.
  - Risk: LFP battery shift, stalled smelters, coal-heavy grid.

Key message:

- The EV transition is promising but not automatically green or locally value-capturing.

### Section 7 — Bukan Menolak, Masih Ragu

Purpose: summarize consumer barriers.

Datasets:

- `data/processed/sentiment_source_summary.json`

Visuals:

- Barrier cards: harga, charging, range anxiety, baterai, resale value, keamanan, sumber listrik.
- Use qualitative/sourced summary rather than pretending incomplete sentiment data is a complete survey.

Key message:

- Public hesitation is a design problem for policy and infrastructure, not simply a rejection of EV.

### Section 8 — Closing: Tiga Syarat Transformasi

Purpose: synthesize the story.

Conclusion:

1. SPKLU harus merata.
2. Grid harus makin bersih.
3. Industri lokal harus naik kelas dari assembly ke value capture.

Include methodology/source drawer.

## Visual Design Requirements

Style direction:

- Dark editorial scrollytelling.
- Electric blue as primary accent.
- Nickel green for industrial opportunity.
- Coal amber/red for risks and fossil/grid tension.
- Glassmorphism metric cards.
- Smooth scroll transitions.
- High-contrast typography.

Avoid:

- Generic admin dashboard look.
- Too many filters.
- Overloading the first screen with charts.
- 3D effects that reduce readability/performance.

## Technical Requirements

Recommended stack:

- Next.js / React / TypeScript.
- Tailwind CSS.
- Recharts or D3 for charts.
- MapLibre GL or Leaflet for map.
- Framer Motion for scroll/micro-interactions.
- Static data loading from JSON/CSV converted at build time or stored in `public/data`.

Data handling:

- Create a data loader layer that normalizes CSV/JSON into typed frontend models.
- Do not fetch remote sources at runtime.
- Treat `data/processed/` as canonical project data.
- Include caveat metadata for medium-confidence data.

## Data Contracts

Use `data/dashboard-manifest.json` as the implementation guide for dataset-to-section mapping.

Minimum datasets to implement:

1. `indonesia_bev_annual_sales.csv`
2. `SPKLU-LOKASI_processed.csv`
3. `spklu_station_counts_by_province.csv`
4. `ev_emission_scenario_indonesia.csv`
5. `indonesia_electricity_mix_and_grid.csv`
6. `ev_industry_investment_and_capacity.csv`
7. `ev_industry_targets_and_risks.csv`
8. `source_catalog.json`

## Error and Caveat Handling

- If map data fails to load, show a fallback province ranking chart.
- If a dataset is missing, show an inline “data unavailable” state with filename.
- Every chart should have a small source label.
- Medium-confidence/estimated data should have a caveat badge.
- Do not hide uncertainty; use it as part of the methodology section.

## Accessibility Requirements

- All charts need text summaries.
- Color cannot be the only encoding.
- Map points need keyboard-accessible fallback list or summary.
- Maintain high contrast in dark mode.
- Respect reduced-motion preference.

## Performance Requirements

- Initial load should prioritize hero and first chart.
- Lazy-load map and heavy visual sections.
- Avoid loading all SPKLU points before map section if not needed.
- Keep mobile layout readable with simplified charts.

## Out of Scope

- New scraping during dashboard runtime.
- Backend API.
- User authentication.
- Real-time data updates.
- Full predictive ML model.
- Unverified OCR extraction as final public number.

## Acceptance Criteria

The dashboard implementation is acceptable when:

1. All 8 storyline sections exist.
2. At least 5 real visualizations use project datasets.
3. SPKLU map or map fallback works.
4. Emissions slider recalculates values interactively.
5. Industry value-chain section explains opportunity and risk.
6. Source/methodology section is visible.
7. Mobile layout is usable.
8. No chart displays uncited numbers.
9. Medium-confidence figures are visually flagged.
10. The final output feels like a data story, not an admin dashboard.
