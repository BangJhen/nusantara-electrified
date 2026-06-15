# PRD: Deep Web Scraping & Data Acquisition for “Nusantara Electrified”

## Problem Statement

Project “Nusantara Electrified” membutuhkan fondasi data yang kredibel, lengkap, dan dapat ditelusuri untuk membangun web data interaktif bertema perkembangan, tren, dan tantangan kendaraan listrik di Indonesia. Saat ini sumber data tersebar di banyak tempat: situs asosiasi industri, portal kementerian, laporan PDF, halaman berita, infografis berbasis gambar, dashboard/peta interaktif, dan komentar publik.

Tanpa proses scraping dan kurasi data yang sistematis, visualisasi berisiko menjadi tidak akurat, sulit dipertanggungjawabkan di kompetisi SIC SATRIA DATA 2026, dan tidak cukup kuat untuk mendukung fitur utama seperti scrollytelling, peta infrastruktur, kalkulator emisi, dan analisis sentimen.

## Solution

Bangun pipeline riset dan scraping data yang mengumpulkan, memvalidasi, membersihkan, dan mengekspor dataset EV Indonesia ke format siap pakai untuk frontend Next.js/React. Pipeline menggunakan kombinasi:

- `websearch` untuk menemukan sumber data dan referensi.
- Playwright untuk scraping halaman dinamis, screenshot infografis, dan network/API discovery.
- Fetch/HTML parser untuk halaman statis.
- Python untuk cleaning, EDA, ekstraksi PDF, OCR, NLP, dan predictive modeling.

Output utama berupa dataset `raw`, `processed`, dan katalog sumber yang menjelaskan asal data, tanggal akses, tingkat kepercayaan, dan catatan metodologi.

## User Stories

1. As a project researcher, I want to discover official EV-related data sources, so that the project is based on credible evidence.
2. As a data analyst, I want to scrape GAIKINDO EV data, so that I can visualize BEV/PHEV/HEV sales trends.
3. As a data analyst, I want to scrape AISI motorcycle market data, so that I can compare electric motorcycle adoption against the broader two-wheeler market.
4. As a data analyst, I want to collect SPKLU/SPBKLU infrastructure data, so that I can map charging readiness across regions.
5. As a data analyst, I want to collect EV population or registration data from official or high-confidence sources, so that adoption metrics are not based only on sales.
6. As a data analyst, I want to extract data from ESDM/PLN/KLHK/BPS PDFs, so that government-published statistics can be used in the story.
7. As a data analyst, I want to classify every source by credibility level, so that weak sources do not accidentally become primary evidence.
8. As a data analyst, I want to preserve raw downloaded pages, images, PDFs, and JSON responses, so that every processed dataset can be audited later.
9. As a data analyst, I want to convert scraped data into normalized CSV/JSON, so that frontend visualizations can consume it easily.
10. As a frontend developer, I want processed datasets with predictable schemas, so that I can build charts, maps, and calculators without additional data wrangling.
11. As a competition judge, I want to see clear data sources and methodology, so that I can trust the resulting infographic/storytelling web.
12. As an audience member, I want data visualizations that explain why EV adoption is growing, so that I understand the transition beyond headlines.
13. As an audience member, I want to see where EV adoption and charging infrastructure are mismatched, so that infrastructure bottlenecks become visible.
14. As an audience member, I want to use an emissions calculator, so that I can understand the environmental implication of EV adoption scenarios.
15. As an audience member, I want to see public concerns about EVs, so that I understand real adoption barriers such as price, range anxiety, battery, and charging access.
16. As a researcher, I want to scrape public comments and news text responsibly, so that the sentiment analysis has enough corpus while respecting legal/ethical boundaries.
17. As a data analyst, I want each scraped item to include source URL and retrieval timestamp, so that the dataset remains traceable.
18. As a developer, I want scraping scripts to fail gracefully, so that one broken source does not stop the whole research pipeline.
19. As a developer, I want scraping scripts to be modular per source, so that GAIKINDO, AISI, ESDM, PLN, BPS, news, and comments can be updated independently.
20. As a developer, I want Playwright-based scraping to support screenshots and API interception, so that image-heavy and JavaScript-heavy sites can still be mined.
21. As a data analyst, I want uncertain values flagged explicitly, so that estimates are not mixed with official figures.
22. As a frontend developer, I want final datasets to be small enough for static frontend delivery, so that the SPA remains fast.
23. As a project owner, I want a source catalog document, so that all team members know which sources are primary, supporting, or rejected.
24. As a project owner, I want a reproducible data pipeline, so that the team can refresh data before final submission.
25. As a future agent, I want a clear task plan and acceptance criteria, so that I can execute deeper scraping without asking for basic context again.

## Implementation Decisions

### Data Domains to Cover

The scraping and research pipeline must prioritize five data domains:

1. **EV adoption and sales**
   - Roda 4: BEV, PHEV, HEV, total car market, brand/model share where available.
   - Roda 2: electric motorcycle adoption and broader motorcycle market baseline.
   - Candidate sources: GAIKINDO, AISI, Korlantas/ERI, Kemenperin, ICCT, credible automotive reporting.

2. **Charging and battery-swap infrastructure**
   - SPKLU, SPBKLU, location, operator, province/city, growth over time if available.
   - Candidate sources: PLN, ESDM, Ditjen Gatrik, Charge.IN, official dashboards/maps, credible press releases.

3. **Environmental impact and emissions**
   - Transport emissions, vehicle emission factors, electricity grid emission factor, air quality indicators.
   - Candidate sources: KLHK, ESDM, PLN, OpenAQ, ICCT, IEA/Our World in Data where relevant.

4. **Public sentiment and consumer barriers**
   - News articles, public comments, YouTube comments, and accessible social media/forum data.
   - Topics: price, subsidy, battery, range anxiety, resale value, charging access, safety, electricity source, maintenance.

5. **Policy and target context**
   - EV incentives, industrial policy, transition targets, production targets, charging infrastructure targets.
   - Candidate sources: government regulations, ESDM/Kemenperin releases, PLN reports, official speeches, ICCT reports.

### Tooling Decisions

- Use **Playwright as the primary browser automation tool** because it is modern, supports Chromium/Firefox/WebKit, and is suitable for dynamic pages, screenshots, and API discovery.
- Use **Chromium as the default browser** for consistency and speed.
- Use **Firefox/WebKit fallback** only when Chromium is blocked or renders differently.
- Use lightweight HTTP fetching and HTML parsing for static pages where browser rendering is unnecessary.
- Use Python for downstream data cleaning, OCR/PDF extraction, NLP, EDA, and model preparation.
- Maintain source-level modularity: each source should have its own scraper/extractor module or script.

### Data Storage Decisions

The data directory should follow this conceptual structure:

```txt
data/
  raw/
    gaikindo/
    aisi/
    esdm/
    pln/
    bps/
    klhk/
    icct/
    news/
    sentiment/
  processed/
    ev_sales_by_year.csv
    ev_sales_by_quarter.csv
    motorcycle_market_by_year.csv
    charging_infrastructure_by_region.csv
    emissions_scenarios.json
    sentiment_topics.json
  sources/
    source_catalog.md
    source_catalog.json
```

### Source Metadata Contract

Every dataset or scraped artifact must include metadata:

```json
{
  "source_name": "AISI",
  "source_url": "https://www.aisi.or.id/statistic/",
  "retrieved_at": "YYYY-MM-DD",
  "source_type": "official association website",
  "data_format": "html_table",
  "credibility": "high",
  "extraction_method": "playwright_table_parse",
  "notes": "Motorcycle market baseline, not EV-specific."
}
```

### Credibility Levels

- **High**: official government, official association, official company report, peer-reviewed or reputable research institution.
- **Medium**: reputable media quoting official data, industry analysis with source references, official press coverage without raw data.
- **Low**: blogs, forums, uncited articles, estimates without transparent methodology.
- **Rejected**: inaccessible source, unclear origin, contradictory claims without support, prohibited scraping target.

### Known Initial Findings

- Playwright is installed and working with Chromium, Firefox, and WebKit.
- AISI statistics page is scrapeable as HTML tables.
- Initial AISI extracted data:
  - 2026 Jan-May domestic motorcycle sales: 2,614,451 units.
  - 2025 domestic motorcycle sales: 6,412,769 units.
  - 2024 domestic motorcycle sales: 6,333,310 units.
- GAIKINDO BEV page is accessible but data appears image/infographic-heavy, likely requiring screenshot + OCR or manual validation.
- ICCT has a useful EV market spotlight for Indonesia, including passenger EV growth, Q2 2025 sales, EV stock, motorcycle EV share, and policy sensitivity.

### Ethical and Legal Scraping Rules

- Prefer official APIs, CSVs, PDFs, and downloadable reports over scraping rendered pages.
- Respect robots.txt and site terms where applicable.
- Use low request rates and caching.
- Do not scrape private, login-protected, or personal data.
- For social/comment data, collect only public text needed for aggregate analysis and avoid exposing individual identities in final visualizations.
- Store source URLs and timestamps for traceability.

## Testing Decisions

Good tests should verify external behavior and data quality, not internal implementation details.

### Modules to Test

1. **Source discovery and cataloging**
   - Test that every accepted source has URL, retrieved date, source type, credibility, and notes.

2. **HTML table extraction**
   - Test that AISI extraction returns expected columns and non-empty annual totals.
   - Test numeric normalization from Indonesian thousands separators.

3. **Playwright scraping utilities**
   - Test page navigation, timeout handling, screenshot creation, and fallback behavior.

4. **Image/OCR extraction workflow**
   - Test that screenshot files are saved and linked to metadata.
   - OCR outputs should be manually verified before being promoted to high-confidence data.

5. **Data normalization**
   - Test final CSV/JSON schema consistency.
   - Test that numeric fields are numeric and date fields are normalized.

6. **Source credibility validation**
   - Test that low-confidence data cannot overwrite high-confidence data without explicit decision.

7. **Frontend-readiness**
   - Test that processed JSON files are small, valid, and directly loadable by the web app.

## Out of Scope

- Building the final Next.js/React interactive web app.
- Final UI/UX design, 3D scenes, animation, and scrollytelling implementation.
- Building the final predictive model beyond preparing raw/processed datasets.
- Real-time scraping during user visits.
- Scraping private social media data or login-protected platforms.
- Guaranteeing that every target source has machine-readable data.
- Treating OCR-extracted numbers as final without manual validation.

## Further Notes

### Recommended Execution Order

1. Create source catalog schema and data folders.
2. Scrape and normalize AISI motorcycle baseline data.
3. Scrape/fetch GAIKINDO EV pages and preserve screenshots/images.
4. Search and collect official SPKLU/SPBKLU infrastructure data.
5. Collect ICCT and government reports for EV market and policy context.
6. Extract relevant PDF tables from ESDM/PLN/KLHK/BPS if available.
7. Build sentiment corpus from public news/articles/comments.
8. Normalize all datasets into frontend-ready CSV/JSON.
9. Produce a data methodology note for competition submission.

### Agent Completion Criteria

The scraping agent is done when:

- At least one high-confidence source exists for each critical domain: adoption, infrastructure, emissions, policy.
- All accepted sources are documented in `source_catalog`.
- Raw artifacts are preserved.
- Processed datasets are exported to CSV/JSON.
- Data gaps and uncertainty are explicitly documented.
- The next frontend/design agent can build visualizations without doing additional scraping research.
