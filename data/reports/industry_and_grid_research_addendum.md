# Research Addendum — EV Industry and Electricity Mix

Date: 2026-06-16

## Why this addendum matters

The original EV story already had adoption, SPKLU, emissions, and sentiment data. This addendum strengthens the connection to the SIC sub-theme: **Transisi Energi dan Tantangan Industri Nasional**.

The strongest narrative is no longer only “EV sales are rising.” It becomes:

> Indonesia is trying to turn nickel, manufacturing, batteries, electricity, and consumer mobility into one national industrial transition. EV adoption is accelerating, but the industrial and electricity systems behind it are not equally ready.

## Most useful findings for storytelling

### 1. Indonesia is building an EV industry, not just importing EVs

Key assets:

- HLI Green Power battery cell plant in Karawang: 10 GWh, operational.
- CATL/CBL-Antam-IBC integrated nickel-to-battery ecosystem: reported USD 6B commitment, North Maluku + Karawang.
- BYD Subang EV plant: reported USD 1B, 150,000 vehicles/year capacity.
- VinFast Subang plant: initial 50,000 vehicles/year capacity, expansion plans reported.
- Wuling and Hyundai already have local assembly footprints.

Story angle:

> EV is a new industrial stack: nickel → smelter → battery material → battery cell/pack → vehicle assembly → charging network.

### 2. TKDN/local content is the policy battleground

Indonesia wants EV localization through TKDN requirements and incentives. A 40% local-content threshold is central to EV incentives, but real localization depends on whether components, batteries, and R&D move onshore.

Story angle:

> “Made in Indonesia” EVs are not only about assembly; they are about how much value Indonesia captures inside the battery and component chain.

### 3. The nickel strategy has a battery-chemistry risk

Indonesia’s EV industrial strategy is strongly tied to nickel-rich battery chemistry. But global entry-level EV markets are increasingly using LFP batteries, which do not need nickel.

Story angle:

> Indonesia’s nickel advantage is powerful, but not guaranteed to dominate every EV segment.

### 4. The grid is the EV climate multiplier

Indonesia’s accessible grid emission factor estimate is around **0.680 kgCO2e/kWh**, above the global average. A simple use-phase scenario gives:

- Current Indonesia grid: ~129 gCO2e/km for BEV use-phase, assuming 0.19 kWh/km.
- Global average grid: ~83 gCO2e/km.
- Clean-grid scenario: ~38 gCO2e/km.

Story angle:

> EVs get cleaner as the grid gets cleaner. Without grid decarbonization, the climate benefit exists but is smaller.

### 5. RUPTL 2025-2034 is ambitious but conflicted

Key RUPTL numbers gathered:

- 69.5 GW total new capacity.
- 42.6 GW renewable capacity.
- 10.3 GW storage.
- 16.6 GW fossil capacity.
- 47,758 km transmission lines.
- Roughly USD 182.6B / IDR 2,967T investment requirement.

Story angle:

> The electricity transition is not only about adding renewables; it requires transmission, storage, private investment, and execution discipline.

## New processed datasets

- `data/processed/ev_industry_investment_and_capacity.csv`
- `data/processed/ev_industry_targets_and_risks.csv`
- `data/processed/indonesia_electricity_mix_and_grid.csv`
- `data/processed/ev_emission_scenario_indonesia.csv`

## Recommended visual additions

1. **EV Industrial Stack Diagram**
   - Nickel → smelter → cathode → cell → pack → EV → SPKLU.

2. **Announced vs Operational Capacity**
   - Show operational, construction, planned, stalled.

3. **EV Climate Slider**
   - User changes grid factor from 0.680 to 0.200 and sees BEV gCO2/km drop.

4. **RUPTL Capacity Mix Chart**
   - Renewable vs fossil vs storage additions.

5. **The Nickel Paradox Section**
   - Indonesia dominates nickel, but battery chemistry and coal-powered smelting create risk.

## Validation caveats

- Official RUPTL PDF should be downloaded and parsed for final citation.
- Grid emission factor 0.680 is an open Ember-derived estimate, not a current official KLHK/ESDM factor.
- Investment values must distinguish announced, committed, under construction, and operational.
- Battery chemistry risk should be framed as strategic risk, not a prediction of failure.
