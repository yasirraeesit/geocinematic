import * as THREE from 'three';
import { latLonToVector } from './globeUtils';

// Convert 3D Cartesian coordinates on sphere back to Latitude and Longitude
export function vector3ToLatLon(vec, radius = 5) {
  const norm = vec.clone().normalize();
  const phi = Math.acos(Math.max(-1, Math.min(1, norm.y)));
  const lat = 90 - (phi * 180 / Math.PI);
  const theta = Math.atan2(norm.z, -norm.x);
  let lon = (theta * 180 / Math.PI) - 180;
  if (lon < -180) lon += 360;
  if (lon > 180) lon -= 360;
  return { lat, lon };
}

// Point-in-polygon ray-casting test
export function isPointInPolygon(point, polygon) {
  const [x, y] = point; // [lon, lat]
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    const intersect = ((yi > y) !== (yj > y)) && (x < ((xj - xi) * (y - yi)) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

// Find country feature in GeoJSON by latitude and longitude
export function findCountryByLatLon(geoJsonData, lat, lon) {
  if (!geoJsonData || !geoJsonData.features) return null;
  const pt = [lon, lat];

  for (const feature of geoJsonData.features) {
    const { geometry } = feature;
    if (!geometry) continue;

    if (geometry.type === 'Polygon') {
      if (isPointInPolygon(pt, geometry.coordinates[0])) {
        return feature;
      }
    } else if (geometry.type === 'MultiPolygon') {
      for (const poly of geometry.coordinates) {
        if (isPointInPolygon(pt, poly[0])) {
          return feature;
        }
      }
    }
  }
  return null;
}

// Helper to convert ISO-2 code to country flag emoji
export function getFlagEmoji(countryCode) {
  if (!countryCode || countryCode.length !== 2) return '🌐';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

// Generate global political border lines on globe surface
export function createGlobalBordersMesh(geoJsonData, radius = 5.008) {
  const linePoints = [];

  geoJsonData.features.forEach((feature) => {
    const { geometry } = feature;
    if (!geometry) return;

    const extractRings = (coordinates) => {
      if (geometry.type === 'Polygon') {
        return coordinates;
      } else if (geometry.type === 'MultiPolygon') {
        return coordinates.flat();
      }
      return [];
    };

    const rings = extractRings(geometry.coordinates);
    rings.forEach((ring) => {
      for (let i = 0; i < ring.length - 1; i++) {
        const [lon1, lat1] = ring[i];
        const [lon2, lat2] = ring[i + 1];
        const v1 = latLonToVector(lat1, lon1, radius);
        const v2 = latLonToVector(lat2, lon2, radius);
        linePoints.push(v1.x, v1.y, v1.z);
        linePoints.push(v2.x, v2.y, v2.z);
      }
    });
  });

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePoints, 3));

  const material = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.45,
    linewidth: 1
  });

  return new THREE.LineSegments(geometry, material);
}

// Triangulate a 2D spherical polygon into 3D vertices using simple ear-clipping/projection
function triangulatePolygonOnSphere(coords, radius) {
  if (!coords || coords.length < 3) return [];

  // Project coords to 2D local plane for triangulation
  const [centerLon, centerLat] = coords[0];
  const pts2D = coords.map(([lon, lat]) => ({
    x: (lon - centerLon) * Math.cos((centerLat * Math.PI) / 180),
    y: lat - centerLat
  }));

  // Simple fan or ear triangulation
  const vertices = [];
  // Three.js built-in shape triangulation
  const flatCoords = [];
  pts2D.forEach((p) => flatCoords.push(p.x, p.y));

  let triangles = [];
  try {
    triangles = THREE.ShapeUtils.triangulateShape(pts2D, []);
  } catch (e) {
    // Fallback simple centroid fan
    for (let i = 1; i < coords.length - 1; i++) {
      triangles.push([0, i, i + 1]);
    }
  }

  triangles.forEach((tri) => {
    tri.forEach((index) => {
      const [lon, lat] = coords[index];
      const vec = latLonToVector(lat, lon, radius);
      vertices.push(vec.x, vec.y, vec.z);
    });
  });

  return vertices;
}

// Create 3D Extruded Country Prism (Plateau) with vertical walls and glowing top cap
export function createExtrudedCountryMesh(countryFeature, baseRadius = 5.0, extrudeHeight = 0.28, colorHex = '#dc2626') {
  const group = new THREE.Group();
  const topRadius = baseRadius + extrudeHeight;

  const { geometry } = countryFeature;
  if (!geometry) return group;

  const ringsList = [];
  if (geometry.type === 'Polygon') {
    ringsList.push(...geometry.coordinates);
  } else if (geometry.type === 'MultiPolygon') {
    geometry.coordinates.forEach((poly) => ringsList.push(...poly));
  }

  const wallVertices = [];
  const topOutlinePoints = [];
  const topCapVertices = [];

  ringsList.forEach((ring) => {
    // Top border outline
    const outlinePoints = [];

    for (let i = 0; i < ring.length - 1; i++) {
      const [lon1, lat1] = ring[i];
      const [lon2, lat2] = ring[i + 1];

      const b1 = latLonToVector(lat1, lon1, baseRadius);
      const b2 = latLonToVector(lat2, lon2, baseRadius);
      const t1 = latLonToVector(lat1, lon1, topRadius);
      const t2 = latLonToVector(lat2, lon2, topRadius);

      // Side wall quad (2 triangles)
      // Triangle 1: b1, b2, t2
      wallVertices.push(b1.x, b1.y, b1.z);
      wallVertices.push(b2.x, b2.y, b2.z);
      wallVertices.push(t2.x, t2.y, t2.z);

      // Triangle 2: b1, t2, t1
      wallVertices.push(b1.x, b1.y, b1.z);
      wallVertices.push(t2.x, t2.y, t2.z);
      wallVertices.push(t1.x, t1.y, t1.z);

      outlinePoints.push(t1);
    }

    if (outlinePoints.length > 0) {
      outlinePoints.push(outlinePoints[0]); // close loop
      topOutlinePoints.push(outlinePoints);
    }

    // Top Cap Triangulation
    const capVerts = triangulatePolygonOnSphere(ring, topRadius);
    topCapVertices.push(...capVerts);
  });

  // 1. Extruded Side Walls Mesh (rich illuminated extrusion color)
  if (wallVertices.length > 0) {
    const wallGeo = new THREE.BufferGeometry();
    wallGeo.setAttribute('position', new THREE.Float32BufferAttribute(wallVertices, 3));
    wallGeo.computeVertexNormals();

    const baseColor = new THREE.Color(colorHex);
    const wallMat = new THREE.MeshStandardMaterial({
      color: baseColor.clone().multiplyScalar(0.75),
      emissive: baseColor.clone().multiplyScalar(0.22),
      roughness: 0.35,
      metalness: 0.1,
      side: THREE.DoubleSide
    });
    const wallMesh = new THREE.Mesh(wallGeo, wallMat);
    group.add(wallMesh);
  }

  // 2. Top Cap Surface Mesh (vibrant luminous plateau matching reference image)
  if (topCapVertices.length > 0) {
    const capGeo = new THREE.BufferGeometry();
    capGeo.setAttribute('position', new THREE.Float32BufferAttribute(topCapVertices, 3));
    capGeo.computeVertexNormals();

    const baseColor = new THREE.Color(colorHex);
    const capMat = new THREE.MeshStandardMaterial({
      color: baseColor,
      emissive: baseColor.clone().multiplyScalar(0.52),
      roughness: 0.25,
      metalness: 0.1,
      side: THREE.DoubleSide
    });
    const capMesh = new THREE.Mesh(capGeo, capMat);
    group.add(capMesh);
  }

  // 3. Crisp Glowing Top Outline Border
  topOutlinePoints.forEach((pts) => {
    const outlineGeo = new THREE.BufferGeometry().setFromPoints(pts);
    const outlineMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      linewidth: 3,
      transparent: true,
      opacity: 1.0
    });
    const outlineLine = new THREE.Line(outlineGeo, outlineMat);
    group.add(outlineLine);
  });

  return group;
}

// Compute geographic centroid [lat, lon] of a country feature
export function getCountryCentroid(feature) {
  let totalLat = 0;
  let totalLon = 0;
  let count = 0;

  const processCoords = (coords) => {
    coords.forEach(([lon, lat]) => {
      totalLat += lat;
      totalLon += lon;
      count++;
    });
  };

  const { geometry } = feature;
  if (!geometry) return { lat: 0, lon: 0 };

  if (geometry.type === 'Polygon') {
    geometry.coordinates.forEach(processCoords);
  } else if (geometry.type === 'MultiPolygon') {
    geometry.coordinates.forEach((poly) => poly.forEach(processCoords));
  }

  if (count === 0) return { lat: 0, lon: 0 };
  return { lat: totalLat / count, lon: totalLon / count };
}

// Find surrounding neighbor countries based on distance from centroid
export function getNeighborCountries(allFeatures, targetFeature, limit = 7) {
  const targetCentroid = getCountryCentroid(targetFeature);

  const scored = allFeatures
    .filter((f) => f.properties.NAME !== targetFeature.properties.NAME)
    .map((f) => {
      const c = getCountryCentroid(f);
      const dist = Math.hypot(c.lat - targetCentroid.lat, c.lon - targetCentroid.lon);
      return { feature: f, dist, centroid: c };
    })
    .sort((a, b) => a.dist - b.dist);

  return scored.slice(0, limit);
}
