# QGIS Agronomic Workflow & Spatial Logic

This document outlines the specific raster math and SQL logic applied during the geospatial processing phases of the project. The calculations were performed using QGIS built-in tools (Raster Calculator, Field Calculator, and Zonal Statistics).

## 1. Spectral Index Computation (Phase 2)

The raw Sentinel-2 imagery was exported from Google Earth Engine as a 6-band stacked GeoTIFF. The band mapping in QGIS is as follows:

* `@1` = B2 (Blue)

* `@2` = B3 (Green)

* `@3` = B4 (Red)

* `@4` = B5 (Red Edge)

* `@5` = B8 (Near-Infrared / NIR)

* `@6` = B11 (Short-Wave Infrared / SWIR)

The following formulas were applied in the **QGIS Raster Calculator**:

### NDVI (Crop Health & Vigour)

Measures chlorophyll absorption and cellular structure reflectance.

```
( "Image@5" - "Image@3" ) / ( "Image@5" + "Image@3" )

```

*Thresholds:* `< 0.2` (Bare Soil), `0.2 - 0.4` (Sparse/Stressed), `0.4 - 0.6` (Moderate Health), `> 0.6` (High Vigour).

### NDWI (Moisture & Irrigation Stress)

Measures the liquid water molecules in vegetation canopies.

```
( "Image@5" - "Image@6" ) / ( "Image@5" + "Image@6" )

```

*Thresholds:* `< 0.1` (Critical Stress), `0.1 - 0.25` (Mild Stress), `> 0.25` (Adequate Moisture).

### NDRE (Late-Stage Canopy Nitrogen)

Utilizes the Red Edge band to prevent index saturation during peak growth.

```
( "Image@5" - "Image@4" ) / ( "Image@5" + "Image@4" )

```

*Thresholds:* `< 0.25` (N-Deficient), `0.25 - 0.38` (Adequate), `> 0.38` (Optimal Nitrogen/Dense Canopy).

## 2. Spatial Database Generation (Phase 4)

After generating farm plot boundaries via zero-shot segmentation, the exact physical area and automated agronomic advisories were calculated inside the polygon Attribute Table using the **QGIS Field Calculator**.

### Hectare Calculation

Since the project used a metric projection (`EPSG:32644 - UTM Zone 44N`), the native `$area` variable calculates square meters. This was converted to Hectares using:

```
$area / 10000

```

### Automated Irrigation Advisory Status

Following the extraction of pixel averages into the polygons via Zonal Statistics (stored as `"W_mean"` for average NDWI), an automated text classification was generated for each farm plot using the following SQL logic:

```
CASE 
  WHEN "W_mean" < 0.1 THEN 'CRITICAL: Irrigate Immediately'
  WHEN "W_mean" >= 0.1 AND "W_mean" < 0.25 THEN 'MONITOR: Mild Moisture Stress'
  ELSE 'HEALTHY: Adequate Moisture'
END

```