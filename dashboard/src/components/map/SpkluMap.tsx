"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const PROVINCE_COORDS: Record<string, [number, number]> = {
  "DKI Jakarta": [106.8229, -6.1944],
  "Jawa Barat": [107.6098, -6.9147],
  "Jawa Timur": [112.7521, -7.2504],
  "Jawa Tengah": [110.4227, -6.9666],
  "Banten": [106.1503, -6.1200],
  "Bali": [115.1889, -8.4095],
  "Sumatera Utara": [99.0607, 2.1154],
  "Kalimantan Timur": [116.4162, 0.5387],
  "Sulawesi Selatan": [119.9740, -3.6687],
  "Riau": [101.6841, 0.5004],
  "DI Yogyakarta": [110.3695, -7.7956],
  "Nusa Tenggara Barat": [117.3616, -8.6529],
  "Sumatera Selatan": [104.7458, -2.9909],
};

export default function SpkluMap({ selectedProvince }: { selectedProvince?: string | null }) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          "carto-light": {
            type: "raster",
            tiles: [
              "https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png",
              "https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png",
            ],
            tileSize: 256,
            attribution: "&copy; OpenStreetMap &copy; CARTO",
          },
        },
        layers: [
          {
            id: "carto-light-layer",
            type: "raster",
            source: "carto-light",
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      },
      center: [118, -2.5],
      zoom: 4.2,
      maxZoom: 14,
    });

    map.current.addControl(new maplibregl.NavigationControl(), "top-right");

    map.current.on("load", () => {
      setLoaded(true);

      fetch("/data/spklu-locations.geojson")
        .then((r) => r.json())
        .then((geojson) => {
          if (!map.current) return;

          map.current.addSource("spklu", {
            type: "geojson",
            data: geojson,
            cluster: true,
            clusterMaxZoom: 10,
            clusterRadius: 50,
          });

          // Cluster circles
          map.current.addLayer({
            id: "clusters",
            type: "circle",
            source: "spklu",
            filter: ["has", "point_count"],
            paint: {
              "circle-color": [
                "step",
                ["get", "point_count"],
                "#12B6C8", // teal for small
                50,
                "#FF6B00", // orange for medium
                200,
                "#1267D8", // blue for large
              ],
              "circle-radius": [
                "step",
                ["get", "point_count"],
                18,
                50,
                24,
                200,
                32,
              ],
              "circle-opacity": 0.85,
            },
          });

          // Individual points
          map.current.addLayer({
            id: "unclustered-point",
            type: "circle",
            source: "spklu",
            filter: ["!", ["has", "point_count"]],
            paint: {
              "circle-color": "#FF6B00",
              "circle-radius": 6,
              "circle-stroke-width": 1,
              "circle-stroke-color": "#FFFFFF",
              "circle-opacity": 0.9,
            },
          });

          // Popup on hover
          const popup = new maplibregl.Popup({
            closeButton: false,
            closeOnClick: false,
          });

          map.current.on("mouseenter", "unclustered-point", (e) => {
            if (!map.current || !e.features?.[0]) return;
            map.current.getCanvas().style.cursor = "pointer";

            const feature = e.features[0];
            const coords = (feature.geometry as GeoJSON.Point).coordinates.slice() as [number, number];
            const props = feature.properties;

            popup
              .setLngLat(coords)
              .setHTML(
                `<div style="color:#0a0f1c;font-size:13px;max-width:220px">
                  <strong>${props?.name || "SPKLU"}</strong><br/>
                  <span style="color:#64748b">${props?.city}, ${props?.province}</span><br/>
                  <span style="color:#3b82f6">${props?.operator?.replace("PERUSAHAAN PERSEROAN (PERSERO) PT. PERUSAHAAN LISTRIK NEGARA", "PLN")}</span>
                </div>`
              )
              .addTo(map.current);
          });

          map.current.on("mouseleave", "unclustered-point", () => {
            if (!map.current) return;
            map.current.getCanvas().style.cursor = "";
            popup.remove();
          });

          // Zoom into cluster on click
          map.current.on("click", "clusters", async (e) => {
            if (!map.current || !e.features?.[0]) return;
            const clusterId = e.features[0].properties?.cluster_id;
            const source = map.current.getSource("spklu") as maplibregl.GeoJSONSource;
            try {
              const zoom = await source.getClusterExpansionZoom(clusterId);
              if (!map.current) return;
              map.current.easeTo({
                center: (e.features![0].geometry as GeoJSON.Point).coordinates as [number, number],
                zoom,
              });
            } catch {
              // Ignore cluster expansion errors; the map remains usable.
            }
          });
        });
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    if (!map.current || !loaded) return;

    if (selectedProvince && PROVINCE_COORDS[selectedProvince]) {
      map.current.flyTo({
        center: PROVINCE_COORDS[selectedProvince],
        zoom: 7,
        essential: true,
        duration: 1500,
      });
    } else {
      map.current.flyTo({
        center: [118, -2.5],
        zoom: 4.2,
        essential: true,
        duration: 1500,
      });
    }
  }, [selectedProvince, loaded]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-brand-dark font-bold text-sm">Memuat peta...</div>
        </div>
      )}
    </div>
  );
}
