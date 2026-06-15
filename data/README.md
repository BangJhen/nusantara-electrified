# Data Guide

Folder ini berisi data untuk dashboard **Nusantara Electrified**.

## Folders

- `raw/`: data mentah dan artifact sumber. Jangan diedit langsung.
- `processed/`: dataset siap dipakai frontend.
- `sources/`: metadata sumber, kredibilitas, dan catatan metodologi.
- `reports/`: laporan riset naratif untuk membantu desain storyline.

## Most Important Processed Files

| File | Use |
|---|---|
| `processed/indonesia_bev_annual_sales.csv` | Grafik pertumbuhan BEV 2020–2025 |
| `processed/aisi_motorcycle_annual_summary.csv` | Baseline pasar motor nasional |
| `processed/spklu_station_counts_by_province.csv` | Choropleth/ranking SPKLU provinsi |
| `processed/SPKLU-LOKASI_processed.csv` | Point map lokasi SPKLU |
| `processed/spklu_connector_type_counts.csv` | Breakdown konektor charging |
| `processed/ev_lca_emission_factors_icct.csv` | Kalkulator emisi lifecycle EV vs ICE |
| `processed/ev_emission_scenario_indonesia.csv` | Slider skenario grid emission factor |
| `processed/indonesia_electricity_mix_and_grid.csv` | RUPTL, grid factor, coal/renewable context |
| `processed/ev_industry_investment_and_capacity.csv` | Narasi industri: pabrik, baterai, investasi |
| `processed/ev_industry_targets_and_risks.csv` | Target, TKDN, risiko nikel/LFP |
| `processed/sentiment_source_summary.json` | Sumber sentimen publik dan consumer barriers |

## Data Rules for Dashboard Agent

1. Prioritaskan `processed/` untuk visualisasi.
2. Tampilkan catatan kredibilitas untuk data `medium` atau `verification_needed`.
3. Jangan memakai data raw GAIKINDO gambar sebagai angka final tanpa validasi.
4. Sumber dan caveat harus tampil di bagian metodologi/footer.
5. Jangan menghapus artifact raw.
