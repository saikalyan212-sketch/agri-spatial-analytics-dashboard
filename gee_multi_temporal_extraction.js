// =========================================================================
// PHASE 1: MULTI-TEMPORAL SENTINEL-2 EXTRACTION FOR CROP ANALYTICS (RABI)
// Prerequisite: Draw a rectangle on the map named 'geometry'
// =========================================================================

// 1. Center the map on your drawn rectangle
Map.centerObject(geometry, 13);

// 2. Select only the bands needed for True Color, NDVI, NDWI, and NDRE
var targetBands = ['B2', 'B3', 'B4', 'B5', 'B8', 'B11'];

// 3. Helper function to grab the clearest image in a date window and clip it
function getStageImage(startDate, endDate) {
  var collection = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
    .filterBounds(geometry)
    .filterDate(startDate, endDate)
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 5)) // Less than 5% clouds
    .sort('CLOUDY_PIXEL_PERCENTAGE'); // Put the cleanest image first
  
  // Grab the cleanest image, select bands, clip to box, and convert to UInt16
  return collection.first().select(targetBands).clip(geometry).toUint16();
}

// 4. Extract the 3 Phenological Stages (Rabi Season 2025-2026)
var stage1_sowing     = getStageImage('2025-11-15', '2025-12-20');
var stage2_peak       = getStageImage('2026-01-20', '2026-02-25');
var stage3_preharvest = getStageImage('2026-03-15', '2026-04-20');

// 5. Preview on the Map (False Color: NIR, Red, Green -> Healthy crops look bright red)
var visParams = {bands: ['B8', 'B4', 'B3'], min: 0, max: 3500};
Map.addLayer(stage1_sowing, visParams, '1. Sowing Stage (Nov-Dec)');
Map.addLayer(stage2_peak, visParams, '2. Peak Growth Stage (Jan-Feb)');
Map.addLayer(stage3_preharvest, visParams, '3. Pre-Harvest Stage (Mar-Apr)');

// 6. Export all 3 stacked GeoTIFFs to Google Drive at uniform 10m resolution
// Using EPSG:32644 (WGS 84 / UTM Zone 44N - Meters) for accurate area calculation in QGIS

Export.image.toDrive({
  image: stage1_sowing,
  description: 'S2_Stage1_Sowing_10m',
  folder: 'Agri_Portfolio_Project',
  region: geometry,
  scale: 10,
  crs: 'EPSG:32644',
  maxPixels: 1e10
});

Export.image.toDrive({
  image: stage2_peak,
  description: 'S2_Stage2_Peak_Growth_10m',
  folder: 'Agri_Portfolio_Project',
  region: geometry,
  scale: 10,
  crs: 'EPSG:32644',
  maxPixels: 1e10
});

Export.image.toDrive({
  image: stage3_preharvest,
  description: 'S2_Stage3_PreHarvest_10m',
  folder: 'Agri_Portfolio_Project',
  region: geometry,
  scale: 10,
  crs: 'EPSG:32644',
  maxPixels: 1e10
});