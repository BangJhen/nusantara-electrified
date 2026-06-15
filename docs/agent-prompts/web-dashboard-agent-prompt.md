# Agent Prompt: Build Nusantara Electrified Interactive Dashboard

You are a frontend/data-visualization agent. Build an interactive web dashboard/data story for **Nusantara Electrified**, a SIC SATRIA DATA 2026 project about EV transition in Indonesia.

## Your Mission

Create a compelling single-page scrollytelling web dashboard that uses the existing processed datasets to tell this thesis:

> **EV Indonesia melaju cepat, tapi keberhasilannya ditentukan oleh kesiapan industri dan kebersihan listrik.**

The dashboard must feel editorial, cinematic, modern, and credible — not like a generic admin panel.

## Read These First

1. `README.md`
2. `docs/prd/interactive-dashboard-prd.md`
3. `docs/design/dashboard-concept.md`
4. `data/dashboard-manifest.json`
5. `data/sources/source_catalog.md`
6. `data/reports/deep_ev_scraping_report.md`
7. `data/reports/industry_and_grid_research_addendum.md`

## Required Story Sections

Implement these sections in order:

1. **Hero — Nusantara Electrified**
   - Thesis, cinematic visual, headline metrics.

2. **EV Melaju Cepat**
   - Use `data/processed/indonesia_bev_annual_sales.csv`.
   - Show BEV growth 2020–2025.

3. **Infrastruktur Mengejar**
   - Use SPKLU datasets:
     - `data/processed/SPKLU-LOKASI_processed.csv`
     - `data/processed/spklu_station_counts_by_province.csv`
     - `data/processed/spklu_station_counts_by_operator.csv`
     - `data/processed/spklu_connector_type_counts.csv`
   - Build map or map fallback + ranking charts.

4. **Seberapa Hijau EV?**
   - Use:
     - `data/processed/ev_emission_scenario_indonesia.csv`
     - `data/processed/ev_lca_emission_factors_icct.csv`
     - `data/processed/indonesia_electricity_mix_and_grid.csv`
   - Build interactive grid-emission slider.

5. **Dari Nikel ke Mobil Listrik**
   - Use:
     - `data/processed/ev_industry_investment_and_capacity.csv`
     - `data/processed/ev_industry_targets_and_risks.csv`
   - Build value-chain diagram or cards.

6. **Nickel & Grid Paradox**
   - Show opportunity vs risk: nickel strength, LFP risk, stalled smelters, coal-heavy grid.

7. **Bukan Menolak, Masih Ragu**
   - Use `data/processed/sentiment_source_summary.json`.
   - Present consumer barrier cards. Do not overclaim raw sentiment if not available.

8. **Closing — Tiga Syarat Transformasi**
   - Infrastructure readiness, clean grid, local value capture.
   - Include methodology/source drawer.

## Design Direction

Use:

- Dark navy/black background.
- Electric blue accents.
- Nickel green for industrial opportunity.
- Amber/red for coal/grid risk.
- Glassmorphism metric cards.
- Smooth scroll transitions.
- Strong editorial typography.

Avoid:

- Generic dashboard templates.
- Too many filters.
- Unreadable 3D effects.
- Charts without source labels.

## Technical Direction

Recommended stack:

- Next.js / React / TypeScript.
- Tailwind CSS.
- Recharts or D3 for charts.
- MapLibre GL or Leaflet for map.
- Framer Motion for animations.

Data:

- Treat `data/processed/` as canonical.
- For frontend runtime, copy necessary datasets into `public/data/` or import them at build time.
- Do not scrape remote sites during runtime.
- Use typed data loader utilities.

## Required Behaviors

- Charts must load from real project datasets.
- Every chart must show source/caveat label.
- Medium-confidence figures must be visually flagged.
- Map section must have a fallback if map library fails.
- Emissions slider must recalculate BEV gCO2/km.
- Mobile layout must remain readable.
- Respect reduced-motion preference.

## Acceptance Criteria

Implementation is complete when:

1. All 8 sections exist.
2. At least 5 visualizations use real datasets.
3. SPKLU geography is shown via map or fallback ranking.
4. Emission slider works interactively.
5. Industry value-chain is clear and visually compelling.
6. Sources and methodology are visible.
7. Uncertainty/caveats are not hidden.
8. Mobile view is usable.
9. No runtime scraping is required.
10. The product feels like a competition-grade data story.
