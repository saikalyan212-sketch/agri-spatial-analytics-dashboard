# AI-Driven Crop Health & Water Stress Analytics Dashboard 🛰️🌾

**Live Interactive Dashboard:** [Insert Your ArcGIS StoryMap Link Here]

## Project Overview
This project demonstrates an end-to-end geospatial analytics pipeline for precision agriculture. Focused on the Rabi season in Mahbubnagar, Telangana, the workflow processes multi-temporal satellite imagery to extract plot-level agronomic intelligence without requiring heavy manual coding. The final output is an interactive Web GIS dashboard providing automated irrigation advisories and crop vigour assessments.

By combining field agronomy principles with spatial data science, this project mimics the foundational pipelines used by leading agri-tech platforms to monitor farm performance at scale.

## Core Methodology & Tools
* **Data Acquisition (Google Earth Engine):** Engineered a JavaScript pipeline in GEE to filter, cloud-mask, and export multi-temporal Sentinel-2 (L2A) surface reflectance imagery across three distinct crop phenological stages (Sowing, Peak Growth, Pre-Harvest).
* **Spectral Index Computation (QGIS):** Processed 10m resolution bands to calculate domain-specific agronomic indices:
  * **NDVI (Normalized Difference Vegetation Index):** Assessed total biomass and crop vigour.
  * **NDRE (Normalized Difference Red Edge):** Evaluated late-stage canopy chlorophyll and nitrogen uptake.
  * **NDWI (Normalized Difference Water Index):** Monitored plant leaf moisture and irrigation stress.
* **Boundary Extraction:** Utilized high-resolution (0.5m) satellite basemaps to delineate accurate, contiguous farm plot boundaries, enabling micro-level analysis.
* **Zonal Statistics & Spatial Database:** Aggregated pixel-level spectral data into individual farm polygons using QGIS spatial processing, generating automated real-world acreage (Hectares) and an SQL-based Irrigation Advisory status.
* **Web GIS Visualization (ArcGIS StoryMaps):** Published a zero-server GeoJSON spatial database into ArcGIS Online, utilizing Swipe UI components for intuitive side-by-side comparison of crop health versus water stress.

## Key Agronomic Insights
* **Targeted Irrigation:** The NDWI layer successfully isolated specific plots suffering from critical moisture deficit (values < 0.1) despite neighboring plots showing adequate irrigation, allowing for highly targeted water resource allocation.
* **Canopy Saturation Management:** Utilizing the Red Edge band (B5) for NDRE prevented index saturation during the peak vegetative stage, providing a more accurate representation of nitrogen levels in dense canopies compared to standard NDVI.

## Repository Contents
* `gee_multi_temporal_extraction.js`: The Google Earth Engine script used to process and export the Sentinel-2 image stack.
* `Smart_Farm_Analytics.geojson`: The final processed spatial dataset containing plot geometries, calculated area, mean index values, and advisory text.
* `qgis_agronomic_workflow.md`: Documentation of the raster calculator formulas and field calculator logic applied in QGIS.

---
*Created by [Juluru Sai Kalyan] - Connect with me on [LinkedIn Link]*
