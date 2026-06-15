# Source Catalog — Nusantara Electrified EV Data

Retrieved/compiled: 2026-06-16

## Accepted Sources

### 1. AISI Statistic Distribution

- URL: https://www.aisi.or.id/statistic/
- Type: official association
- Domain: adoption
- Format: HTML tables
- Credibility: high
- Raw artifacts:
  - `data/raw/aisi/statistic.html`
  - `data/raw/aisi/statistic-fullpage.png`
  - `data/raw/aisi/statistic-tables.json`
- Processed artifacts:
  - `data/processed/aisi_motorcycle_annual_summary.csv`
  - `data/processed/aisi_motorcycle_annual_summary.json`
  - `data/processed/aisi_motorcycle_sales_tables.json`
- Notes: Official motorcycle market baseline; does not separate electric vs ICE motorcycles.

### 2. GAIKINDO BEV Whole Sales Market Performance

- URL: https://www.gaikindo.or.id/indonesia-bev-whole-sales-market-performance-january-april-2026/
- Type: official association
- Domain: adoption
- Format: image-heavy article
- Credibility: high
- Raw artifacts:
  - `data/raw/gaikindo/indonesia-bev-whole-sales-market-performance-january-april-2026.html`
  - `data/raw/gaikindo/indonesia-bev-whole-sales-market-performance-january-april-2026.png`
  - `data/raw/gaikindo/indonesia-bev-page-images.json`
- Processed artifacts:
  - `data/processed/indonesia_bev_annual_sales.csv`
  - `data/processed/indonesia_bev_annual_sales.json`
- Notes: Official numeric data is likely embedded in images; OCR/manual validation required.

### 3. ICCT Electric Vehicle Market in Indonesia

- URL: https://theicct.org/publication/electric-vehicle-market-in-indonesia-dec25
- Type: research institution
- Domain: adoption/emissions
- Format: article/PDF
- Credibility: high
- Processed artifacts:
  - `data/processed/ev_lca_emission_factors_icct.csv`
- Notes: Useful for quarterly adoption narrative and emissions calculator factors. Exact chart series need PDF/chart extraction.

### 4. SPKLU CSV Dataset

- Local source files:
  - `SPKLU-LOKASI.csv`
  - `SPKLU-MESIN.csv`
  - `SPKLU-KONEKTOR.csv`
- Type: local CSV dataset; upstream citation still needed
- Domain: infrastructure
- Format: CSV
- Credibility: medium until upstream URL is recorded
- Raw artifacts:
  - `data/raw/pln/SPKLU-LOKASI.csv`
  - `data/raw/pln/SPKLU-MESIN.csv`
  - `data/raw/pln/SPKLU-KONEKTOR.csv`
- Processed artifacts:
  - `data/processed/spklu_station_counts_by_province.csv`
  - `data/processed/spklu_station_counts_by_operator.csv`
  - `data/processed/spklu_connector_type_counts.csv`
  - `data/processed/spklu_dataset_summary.json`
- Notes: Enables point map and province-level SPKLU analysis.

### 5. PwC Indonesia EV Market / eReadiness

- URL: https://www.pwc.com/id/en/media-centre/press-release/2025/english/indonesia-ev-market-grew-by-49.html
- Type: research institution / consultancy
- Domain: sentiment
- Format: press release/report
- Credibility: high
- Processed artifacts:
  - `data/processed/sentiment_source_summary.json`
- Notes: Useful for readiness, owner/prospect/sceptic segments, and survey context.

### 6. ESDM/PLN SPKLU Targets and RUPTL-Derived Projections

- URLs: https://www.esdm.go.id/ and https://gatrik.esdm.go.id/
- Type: government/company report
- Domain: policy/infrastructure
- Format: PDF/article
- Credibility: medium-high pending final PDF verification
- Processed artifacts:
  - `data/processed/spklu_policy_targets_esdm.csv`
- Notes: Target values should be cross-checked against official Kepmen/RUPTL PDFs before final submission.

### 7. PLN/ESDM RUPTL 2025-2034

- URL: https://gatrik.esdm.go.id/ and official RUPTL 2025-2034 PDF
- Type: government
- Domain: policy / electricity mix
- Format: PDF
- Credibility: high
- Processed artifacts:
  - `data/processed/indonesia_electricity_mix_and_grid.csv`
  - `data/processed/spklu_policy_targets_esdm.csv`
- Notes: Official electricity planning roadmap. Final project should download and cite exact PDF pages.

### 8. Ember-Derived Indonesia Grid Emission Factor

- URL: https://ember-energy.org/ and GreenCalculus grid electricity emission factor table
- Type: research institution / open energy data
- Domain: emissions
- Format: dataset/table
- Credibility: high
- Processed artifacts:
  - `data/processed/indonesia_electricity_mix_and_grid.csv`
  - `data/processed/ev_emission_scenario_indonesia.csv`
- Notes: Uses 0.680 kgCO2e/kWh as accessible open estimate. No current official KLHK/ESDM grid factor was found during this research pass.

### 9. Indonesia EV Industry Investment and Capacity Sources

- URLs: Kemenperin, BKPM/Ministry of Investment, Antara, Reuters, official company releases; see addendum notes.
- Type: government and reputable media/company releases
- Domain: industry / policy
- Format: articles/reports
- Credibility: medium-high
- Processed artifacts:
  - `data/processed/ev_industry_investment_and_capacity.csv`
  - `data/processed/ev_industry_targets_and_risks.csv`
- Notes: Investment figures must be classified as announced, committed, under construction, or operational.

### 10. Center for Global Sustainability Nickel Smelter Dataset

- URL: University of Maryland Center for Global Sustainability reports/datasets
- Type: research institution
- Domain: industry / nickel downstreaming
- Format: dataset/report
- Credibility: high
- Processed artifacts:
  - `data/processed/ev_industry_targets_and_risks.csv`
- Notes: Useful for showing operational, stalled, and stopped nickel smelter projects.

## Rejected / Weak Sources

- AISMOLI public statistics page: reported as data-poor/non-machine-readable in current discovery.
- Unofficial reposts/Scribd/low-citation blogs: use only for discovery, not primary citation.
- Private/login-protected social media groups: out of scope for ethical and legal reasons.
- Raw direct scraping of personal social handles/comments: avoid; prefer published aggregate research or anonymized public data.

## Data Quality Notes

- Values derived from OCR/images or secondary media must be flagged before final visualization.
- The SPKLU local CSVs are useful but need upstream source URL/citation before competition submission.
- GAIKINDO official pages should be preferred, but images require OCR/manual validation.
