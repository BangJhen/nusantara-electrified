export interface BevSalesRecord {
  year: number;
  bev_wholesales_units: number;
  growth_yoy_pct: number | null;
  source: string;
  confidence: string;
  notes: string;
}

export interface SpkluLocation {
  id: number;
  name: string;
  operator: string;
  province: string;
  city: string;
  lat: number;
  lng: number;
  scheme: string;
}

export interface ProvinceStation {
  province: string;
  station_count: number;
}

export interface OperatorStation {
  operator: string;
  station_count: number;
}

export interface ConnectorType {
  connector_type: string;
  count: number;
}

export interface EmissionScenario {
  scenario: string;
  grid_factor_kgco2e_per_kwh: number;
  bev_efficiency_kwh_per_km: number;
  bev_use_phase_gco2e_per_km: number;
  ice_baseline_gco2e_per_km: number;
  bev_use_phase_reduction_vs_ice_pct: number;
  source: string;
  notes: string;
}

export interface LcaFactor {
  segment: string;
  vehicle_type: string;
  scenario: string;
  year: number;
  gco2e_per_km: number;
  reduction_vs_ice_pct: number | null;
  source: string;
  notes: string;
}

export interface GridMetric {
  metric: string;
  value: number;
  unit: string;
  year_or_period: string;
  source: string;
  credibility: string;
  notes: string;
}

export interface IndustryInvestment {
  category: string;
  project_or_company: string;
  location: string;
  value_usd_million: number | null;
  capacity: string;
  status: string;
  target_year: string;
  source: string;
  credibility: string;
  notes: string;
}

export interface IndustryTarget {
  theme: string;
  metric: string;
  value: number | string;
  year: string;
  source: string;
  credibility: string;
  story_use: string;
  notes: string;
}

export interface SentimentSource {
  source_name: string;
  source_url: string;
  source_type: string;
  data_domain: string;
  credibility: string;
  data_format: string;
  notes: string;
}

export interface SourceCatalogEntry {
  source_name: string;
  source_url: string;
  retrieved_at: string;
  source_type: string;
  data_domain: string;
  data_format: string;
  credibility: string;
  extraction_method: string;
  raw_artifact_path: string;
  processed_artifact_path: string;
  notes: string;
}

export interface MotorcycleSummary {
  year: number;
  domestic_units: number;
  export_units_or_cbu: number;
  source: string;
}
