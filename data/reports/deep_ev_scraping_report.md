# Deep EV Web Scraping Report — Nusantara Electrified

Date: 2026-06-16

## Summary of Sources Found

Accepted high-confidence or useful sources:

1. AISI official statistics page for motorcycle market baseline.
2. GAIKINDO official EV/automotive pages for BEV/PHEV/HEV adoption.
3. ICCT Indonesia EV market and LCA research for adoption context and emissions factors.
4. Local SPKLU CSV dataset for charging station geospatial/infrastructure data.
5. PwC Indonesia EV/eReadiness reporting for consumer sentiment and readiness context.
6. ESDM/PLN/Gatrik policy and RUPTL-related targets for charging infrastructure and KBLBB projections.

## Accepted / Rejected Sources

See `data/sources/source_catalog.md` and `data/sources/source_catalog.json` for full metadata.

Rejected or weak sources include low-citation blogs, unofficial reposts, private groups, personal social accounts, and any raw platform scraping that risks violating terms/privacy.

## Raw Artifacts

- `data/raw/aisi/statistic.html`
- `data/raw/aisi/statistic-fullpage.png`
- `data/raw/aisi/statistic-tables.json`
- `data/raw/gaikindo/indonesia-bev-whole-sales-market-performance-january-april-2026.html`
- `data/raw/gaikindo/indonesia-bev-whole-sales-market-performance-january-april-2026.png`
- `data/raw/gaikindo/indonesia-bev-page-images.json`
- `data/raw/pln/SPKLU-LOKASI.csv`
- `data/raw/pln/SPKLU-MESIN.csv`
- `data/raw/pln/SPKLU-KONEKTOR.csv`

## Processed Outputs

- `data/processed/aisi_motorcycle_annual_summary.csv`
- `data/processed/aisi_motorcycle_annual_summary.json`
- `data/processed/aisi_motorcycle_sales_tables.json`
- `data/processed/indonesia_bev_annual_sales.csv`
- `data/processed/indonesia_bev_annual_sales.json`
- `data/processed/SPKLU-LOKASI_processed.csv`
- `data/processed/SPKLU-MESIN_processed.csv`
- `data/processed/SPKLU-KONEKTOR_processed.csv`
- `data/processed/spklu_station_counts_by_province.csv`
- `data/processed/spklu_station_counts_by_operator.csv`
- `data/processed/spklu_connector_type_counts.csv`
- `data/processed/spklu_connector_status_counts.csv`
- `data/processed/spklu_dataset_summary.json`
- `data/processed/ev_lca_emission_factors_icct.csv`
- `data/processed/spklu_policy_targets_esdm.csv`
- `data/processed/sentiment_source_summary.json`

## Key Extracted Data

### AISI Motorcycle Market Baseline

Scraped from official HTML tables:

- 2026 Jan-May domestic motorcycle sales: 2,614,451 units.
- 2025 domestic motorcycle sales: 6,412,769 units.
- 2024 domestic motorcycle sales: 6,333,310 units.

### SPKLU Dataset Summary

Local CSVs processed:

- `SPKLU-LOKASI.csv`: 2,426 station rows.
- `SPKLU-MESIN.csv`: 2,423 charger machine rows.
- `SPKLU-KONEKTOR.csv`: 3,053 connector rows.
- Top provinces include DKI Jakarta, Jawa Barat, Jawa Timur, Jawa Tengah, Banten, and Bali.
- Top operator: PT PLN Persero.
- Main connector types: AC Type 2, CCS2, CHAdeMO, J1772.

### EV Adoption / BEV Annual Sales

Processed annual BEV wholesales dataset prepared for 2020-2025. Values should be final-verified against official GAIKINDO imagery/articles before final publication.

### Emissions / LCA

ICCT-derived emissions factor table prepared for EV vs ICE calculator across A-car, SUV, MPV, and scooter segments.

## Data Gaps and Follow-up

1. GAIKINDO images need OCR/manual validation for exact BEV/PHEV/HEV values.
2. SPKLU CSV upstream source URL must be recorded before final citation.
3. EV adoption by province remains unavailable publicly; SPKLU geography can be mapped, but EV stock geography may require proxy or public information request.
4. Electric motorcycle official time series remains incomplete; AISI provides total motorcycle market only.
5. ESDM/PLN policy target values should be verified against original PDF documents.
6. Sentiment analysis should avoid private scraping; use published survey/academic aggregates or anonymized public text only.

## Suggested Visualizations Enabled

1. BEV annual growth rocket chart, 2020-2025.
2. AISI motorcycle market baseline vs electric motorcycle opportunity narrative.
3. SPKLU point map using lat/lng from `SPKLU-LOKASI.csv`.
4. SPKLU choropleth by province.
5. Connector type breakdown: AC Type 2, CCS2, CHAdeMO, etc.
6. Operator breakdown: PLN vs private operators.
7. EV vs ICE lifecycle emissions calculator using ICCT gCO2e/km factors.
8. SPKLU target vs current infrastructure gap timeline.
9. Sentiment/barrier dashboard based on PwC/Kompas/academic aggregate sources.

## Acceptance Criteria Check

- At least 3 high-confidence sources cataloged: yes — AISI, GAIKINDO, ICCT, PwC.
- At least 1 processed dataset for adoption/sales: yes — AISI and BEV annual sales.
- At least 1 processed dataset for infrastructure: yes — SPKLU CSV summaries.
- At least 1 emissions/policy source cataloged: yes — ICCT emissions and ESDM/PLN targets.
- Source catalog complete and traceable: mostly yes; SPKLU upstream URL still pending.
- Uncertain/OCR-derived data flagged: yes.
- Next visualization agent can proceed without repeating discovery: yes, with noted validation follow-ups.
