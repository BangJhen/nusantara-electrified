import * as fs from "fs";
import * as path from "path";
import Papa from "papaparse";

const DATA_DIR = path.resolve(__dirname, "../../data/processed");
const OUT_DIR = path.resolve(__dirname, "../public/data");

fs.mkdirSync(OUT_DIR, { recursive: true });

function readCsv<T>(filename: string): T[] {
  const content = fs.readFileSync(path.join(DATA_DIR, filename), "utf-8");
  const result = Papa.parse<T>(content, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
  });
  return result.data;
}

function readJson<T>(filename: string): T {
  const content = fs.readFileSync(path.join(DATA_DIR, filename), "utf-8");
  return JSON.parse(content);
}

function writeJson(filename: string, data: unknown) {
  fs.writeFileSync(path.join(OUT_DIR, filename), JSON.stringify(data, null, 0));
  console.log(`  ✓ ${filename}`);
}

console.log("Preparing data for dashboard...\n");

// 1. BEV Sales
const bevSales = readCsv("indonesia_bev_annual_sales.csv");
writeJson("bev-sales.json", bevSales);

// 2. SPKLU Locations → lightweight GeoJSON
const spkluRaw = readCsv<Record<string, unknown>>("SPKLU-LOKASI_processed.csv");
const spkluLocations = spkluRaw
  .filter(
    (r) =>
      r["Latitude"] != null &&
      r["Longitude"] != null &&
      !isNaN(Number(r["Latitude"])) &&
      !isNaN(Number(r["Longitude"]))
  )
  .map((r, i) => ({
    id: i + 1,
    name: r["Nama Stasiun"] || "",
    operator: r["Badan Usaha"] || "",
    province: r["Provinsi"] || "",
    city: r["Kabupaten / Kota"] || "",
    lat: Number(r["Latitude"]),
    lng: Number(r["Longitude"]),
    scheme: r["Skema SPKLU"] || "",
  }));

const geojson = {
  type: "FeatureCollection" as const,
  features: spkluLocations.map((s) => ({
    type: "Feature" as const,
    geometry: {
      type: "Point" as const,
      coordinates: [s.lng, s.lat],
    },
    properties: {
      id: s.id,
      name: s.name,
      operator: s.operator,
      province: s.province,
      city: s.city,
      scheme: s.scheme,
    },
  })),
};
writeJson("spklu-locations.geojson", geojson);

// 3. Province stations
const provinces = readCsv("spklu_station_counts_by_province.csv");
writeJson("spklu-provinces.json", provinces);

// 4. Operators
const operators = readCsv("spklu_station_counts_by_operator.csv");
writeJson("spklu-operators.json", operators);

// 5. Connectors
const connectors = readCsv("spklu_connector_type_counts.csv");
writeJson("spklu-connectors.json", connectors);

// 6. Emission scenarios
const emissions = readCsv("ev_emission_scenario_indonesia.csv");
writeJson("emission-scenarios.json", emissions);

// 7. LCA factors
const lca = readCsv("ev_lca_emission_factors_icct.csv");
writeJson("lca-factors.json", lca);

// 8. Electricity grid
const grid = readCsv("indonesia_electricity_mix_and_grid.csv");
writeJson("electricity-grid.json", grid);

// 9. Industry investments
const investments = readCsv("ev_industry_investment_and_capacity.csv");
writeJson("industry-investments.json", investments);

// 10. Industry targets
const targets = readCsv("ev_industry_targets_and_risks.csv");
writeJson("industry-targets.json", targets);

// 11. Sentiment sources
const sentiment = readJson("sentiment_source_summary.json");
writeJson("sentiment-sources.json", sentiment);

// 12. Source catalog
const sourceCatalogPath = path.resolve(__dirname, "../../data/sources/source_catalog.json");
const sourceCatalog = JSON.parse(fs.readFileSync(sourceCatalogPath, "utf-8"));
writeJson("source-catalog.json", sourceCatalog);

// 13. Motorcycle summary
const motorcycle = readCsv("aisi_motorcycle_annual_summary.csv");
writeJson("motorcycle-market.json", motorcycle);

console.log("\n✅ All data prepared successfully!");
console.log(`   Output: ${OUT_DIR}`);
