# Nusantara Electrified — Interactive EV Data Story

Project ini menyiapkan fondasi data dan dokumen produk untuk membangun web data interaktif bertema **perkembangan, tren, dan tantangan kendaraan listrik (EV) di Indonesia** untuk konteks SIC SATRIA DATA 2026.

## Quick Start for Agents

Mulai dari dokumen ini:

1. `docs/prd/interactive-dashboard-prd.md` — PRD utama dashboard web interaktif.
2. `docs/agent-prompts/web-dashboard-agent-prompt.md` — prompt siap pakai untuk agent implementasi dashboard.
3. `data/dashboard-manifest.json` — daftar dataset yang harus diprioritaskan.
4. `data/sources/source_catalog.md` — katalog sumber dan kredibilitas data.
5. `data/reports/deep_ev_scraping_report.md` dan `data/reports/industry_and_grid_research_addendum.md` — insight riset.

## Directory Map

```txt
data/
  raw/          # artifact sumber: HTML, screenshot, CSV mentah
  processed/    # dataset siap visualisasi
  reports/      # laporan riset dan insight
  sources/      # source catalog dan metadata
docs/
  prd/          # product requirements
  agent-prompts/# prompt untuk agent lanjutan
  design/       # konsep storyline dan visual direction
archive/
  root-inputs/  # file lama dari root, dipindahkan agar root bersih
```

## Recommended Build Direction

Bangun sebagai **single-page scrollytelling dashboard**: pengguna scroll dari ledakan adopsi EV, ketimpangan SPKLU, dilema emisi listrik, sampai peluang/risko industri nasional.

Narasi utama:

> **EV Indonesia melaju cepat, tapi keberhasilannya ditentukan oleh kesiapan industri dan kebersihan listrik.**

## Data Caveats

- Data GAIKINDO banyak berbentuk gambar/infografis; angka final perlu OCR/manual verification.
- Dataset SPKLU sudah ada dan siap dipakai, tetapi upstream URL asli perlu dicatat untuk sitasi final.
- Beberapa angka investasi industri adalah komitmen/announcement; bedakan dari kapasitas yang sudah operational.
- Grid emission factor 0.680 kgCO2e/kWh adalah estimasi terbuka berbasis Ember/GreenCalculus, bukan angka resmi KLHK/ESDM terbaru.
