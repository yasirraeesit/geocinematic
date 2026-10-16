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

// Helper to get reliable 2-letter ISO country code from GeoJSON feature
export function getCountryIso2(feature) {
  if (!feature || !feature.properties) return null;
  const p = feature.properties;
  const candidates = [p.ISO_A2_EH, p.ISO_A2, p.WB_A2, p.POSTAL];
  for (const c of candidates) {
    if (typeof c === 'string' && c.length === 2 && c !== '-99') {
      return c.toUpperCase();
    }
  }
  const nameMap = {
    'iran': 'IR',
    'united states of america': 'US',
    'united states': 'US',
    'russia': 'RU',
    'china': 'CN',
    'france': 'FR',
    'norway': 'NO',
    'ukraine': 'UA',
    'israel': 'IL',
    'saudi arabia': 'SA',
    'taiwan': 'TW',
    'united kingdom': 'GB',
    'germany': 'DE',
    'japan': 'JP',
    'india': 'IN',
    'turkey': 'TR',
    'syria': 'SY',
    'iraq': 'IQ',
    'yemen': 'YE',
    'united arab emirates': 'AE',
    'egypt': 'EG'
  };
  const lowerName = (p.NAME || '').toLowerCase();
  return nameMap[lowerName] || null;
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

// Triangulate a 2D spherical polygon into 3D vertices + longitude/latitude points for UV mapping
function triangulatePolygonOnSphere(coords, radius) {
  if (!coords || coords.length < 3) return { vertices: [], lonLats: [] };

  // Project coords to 2D local plane for triangulation
  const [centerLon, centerLat] = coords[0];
  const pts2D = coords.map(([lon, lat]) => ({
    x: (lon - centerLon) * Math.cos((centerLat * Math.PI) / 180),
    y: lat - centerLat
  }));

  const flatCoords = [];
  pts2D.forEach((p) => flatCoords.push(p.x, p.y));

  let triangles = [];
  try {
    triangles = THREE.ShapeUtils.triangulateShape(pts2D, []);
  } catch (e) {
    for (let i = 1; i < coords.length - 1; i++) {
      triangles.push([0, i, i + 1]);
    }
  }

  const vertices = [];
  const lonLats = [];
  triangles.forEach((tri) => {
    tri.forEach((index) => {
      const [lon, lat] = coords[index];
      const vec = latLonToVector(lat, lon, radius);
      vertices.push(vec.x, vec.y, vec.z);
      lonLats.push([lon, lat]);
    });
  });

  return { vertices, lonLats };
}

// Create Instant Procedural + HD Vector National Flag Texture
export function createCountryFlagTexture(iso2, countryName) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 640;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const w = canvas.width;
  const h = canvas.height;
  const code = (iso2 || '').toUpperCase();

  // Instant official procedural flags for popular countries (0ms render time, no lag, no blank flash)
  if (code === 'IR') {
    // Official Flag of Iran: Green (#239f40), White (#ffffff), Red (#da0000)
    ctx.fillStyle = '#239f40';
    ctx.fillRect(0, 0, w, h / 3);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, h / 3, w, h / 3);

    ctx.fillStyle = '#da0000';
    ctx.fillRect(0, (h / 3) * 2, w, h / 3);

    // Official Central Emblem of Iran in vivid red
    const cx = w / 2;
    const cy = h / 2;
    ctx.fillStyle = '#da0000';
    ctx.beginPath();
    ctx.arc(cx, cy, 60, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx - 18, cy - 8, 42, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#da0000';
    ctx.beginPath();
    ctx.arc(cx, cy, 28, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#da0000';
    ctx.fillRect(cx - 5, cy - 65, 10, 130);

  } else if (code === 'UA') {
    // Ukraine: Vivid Azure Blue & Golden Yellow
    ctx.fillStyle = '#0057b7';
    ctx.fillRect(0, 0, w, h / 2);
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(0, h / 2, w, h / 2);

  } else if (code === 'US') {
    // United States: 13 Red & White stripes + Blue canton
    const stripeH = h / 13;
    for (let i = 0; i < 13; i++) {
      ctx.fillStyle = i % 2 === 0 ? '#b22234' : '#ffffff';
      ctx.fillRect(0, i * stripeH, w, stripeH);
    }
    ctx.fillStyle = '#3c3b6e';
    ctx.fillRect(0, 0, w * 0.42, stripeH * 7);
    ctx.fillStyle = '#ffffff';
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 6; c++) {
        ctx.beginPath();
        ctx.arc(35 + c * 65, 25 + r * 35, 7, 0, Math.PI * 2);
        ctx.fill();
      }
    }

  } else if (code === 'RU') {
    // Russia: White, Blue, Red
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h / 3);
    ctx.fillStyle = '#0039a6';
    ctx.fillRect(0, h / 3, w, h / 3);
    ctx.fillStyle = '#d52b1e';
    ctx.fillRect(0, (h / 3) * 2, w, h / 3);

  } else if (code === 'CN') {
    // China: Vivid Red with Golden Star
    ctx.fillStyle = '#de2910';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#ffde00';
    ctx.beginPath();
    ctx.arc(140, 140, 52, 0, Math.PI * 2);
    ctx.fill();

  } else if (code === 'SA') {
    // Saudi Arabia: Emerald Green
    ctx.fillStyle = '#006c35';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(w * 0.35, h * 0.58, w * 0.3, 14);

  } else if (code === 'FR') {
    // France: Blue, White, Red
    ctx.fillStyle = '#002654';
    ctx.fillRect(0, 0, w / 3, h);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(w / 3, 0, w / 3, h);
    ctx.fillStyle = '#ed2939';
    ctx.fillRect((w / 3) * 2, 0, w / 3, h);

  } else if (code === 'DE') {
    // Germany: Black, Red, Gold
    ctx.fillStyle = '#111111';
    ctx.fillRect(0, 0, w, h / 3);
    ctx.fillStyle = '#dd0000';
    ctx.fillRect(0, h / 3, w, h / 3);
    ctx.fillStyle = '#ffce00';
    ctx.fillRect(0, (h / 3) * 2, w, h / 3);

  } else if (code === 'IL') {
    // Israel: White with Blue stripes
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#0038b8';
    ctx.fillRect(0, h * 0.12, w, h * 0.12);
    ctx.fillRect(0, h * 0.76, w, h * 0.12);

  } else {
    // Generic high-contrast tricolor field
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(0, h * 0.4, w, h * 0.2);
  }

  // Create standard sRGB Texture
  const canvasTexture = new THREE.CanvasTexture(canvas);
  canvasTexture.colorSpace = THREE.SRGBColorSpace;
  canvasTexture.wrapS = THREE.ClampToEdgeWrapping;
  canvasTexture.wrapT = THREE.ClampToEdgeWrapping;
  canvasTexture.generateMipmaps = true;

  // Asynchronously load real FlagCDN vector-rendered asset to refine official details
  if (code) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      canvasTexture.needsUpdate = true;
    };
    img.src = `https://flagcdn.com/w1280/${code.toLowerCase()}.png`;
  }

  return canvasTexture;
}

// In-Scene 3D Surface Country Name Plaque (lies flat on top of the extruded plateau)
export function createCountrySurfaceNameMesh(countryName, iso2, centroid, topRadius, bbox) {
  if (!countryName) return null;

  // 1. Calculate physical sizing based on country geography span
  const spanLon = Math.max(1.5, (bbox?.maxLon ?? centroid.lon + 5) - (bbox?.minLon ?? centroid.lon - 5));
  const spanLat = Math.max(1.5, (bbox?.maxLat ?? centroid.lat + 5) - (bbox?.minLat ?? centroid.lat - 5));
  const countrySpan = Math.max(spanLon, spanLat) * 0.087;

  // Plaque dimensions clamped for elegance
  const plaqueWidth = Math.max(0.75, Math.min(2.2, countrySpan * 0.42));
  const plaqueHeight = plaqueWidth * 0.32;

  // 2. High-DPI 2D Canvas for crisp typography
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 328;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const pad = 12;
  const w = canvas.width - pad * 2;
  const h = canvas.height - pad * 2;
  const r = 36;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Transparent / ultra-subtle translucent backing so 100% of the flag colors remain visible!
  ctx.fillStyle = 'rgba(2, 6, 17, 0.42)';
  ctx.beginPath();
  ctx.roundRect(pad, pad, w, h, r);
  ctx.fill();

  // Crisp golden border
  ctx.lineWidth = 3.5;
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.85)';
  ctx.stroke();

  // Flag Emoji or ISO Badge
  const flagText = getFlagEmoji(iso2) || '🌐';
  ctx.font = '84px sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(flagText, pad + 38, pad + h * 0.46);

  // Country Name in bold, modern, cinematic typography
  const textX = pad + 155;
  ctx.font = '900 64px "Cinzel", "Inter", -apple-system, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
  ctx.shadowBlur = 12;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 4;

  // Fit text if name is long
  const maxTextWidth = w - 180;
  let fontSize = 64;
  while (ctx.measureText(countryName.toUpperCase()).width > maxTextWidth && fontSize > 28) {
    fontSize -= 4;
    ctx.font = `900 ${fontSize}px "Cinzel", "Inter", sans-serif`;
  }
  ctx.fillText(countryName.toUpperCase(), textX, pad + h * 0.42);

  // Subtitle / Territory Badge
  ctx.shadowColor = 'transparent';
  ctx.font = '700 24px "JetBrains Mono", monospace';
  ctx.fillStyle = '#fbbf24';
  const subText = iso2 ? `SOVEREIGN TERRITORY [${iso2}]` : 'SOVEREIGN TERRITORY';
  ctx.fillText(subText, textX, pad + h * 0.76);

  // 3. Create Canvas Texture
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = true;

  // 4. Create 3D Mesh
  const geo = new THREE.PlaneGeometry(plaqueWidth, plaqueHeight);
  const mat = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(geo, mat);

  // 5. Position and Orient Mesh flat against the globe plateau surface
  const pos = latLonToVector(centroid.lat, centroid.lon, topRadius + 0.016);
  const normal = pos.clone().normalize();

  const northPole = new THREE.Vector3(0, 1, 0);
  let tangentNorth = new THREE.Vector3().subVectors(
    northPole,
    normal.clone().multiplyScalar(normal.dot(northPole))
  );
  if (tangentNorth.lengthSq() < 0.0001) {
    tangentNorth = new THREE.Vector3(1, 0, 0);
  } else {
    tangentNorth.normalize();
  }
  const tangentEast = new THREE.Vector3().crossVectors(tangentNorth, normal).normalize();

  const rotMatrix = new THREE.Matrix4().makeBasis(tangentEast, tangentNorth, normal);
  mesh.setRotationFromMatrix(rotMatrix);
  mesh.position.copy(pos);

  return mesh;
}

// Create 3D Extruded Country Prism (Plateau) with National Flag texture and 3D surface name
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

  // Calculate country geographic bounding box for UV mapping
  let minLon = Infinity, maxLon = -Infinity, minLat = Infinity, maxLat = -Infinity;
  ringsList.forEach((ring) => {
    ring.forEach(([lon, lat]) => {
      if (lon < minLon) minLon = lon;
      if (lon > maxLon) maxLon = lon;
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
    });
  });
  const bbox = { minLon, maxLon, minLat, maxLat };

  const wallVertices = [];
  const topOutlinePoints = [];
  const topCapVertices = [];
  const topCapUvs = [];

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
      wallVertices.push(b1.x, b1.y, b1.z);
      wallVertices.push(b2.x, b2.y, b2.z);
      wallVertices.push(t2.x, t2.y, t2.z);

      wallVertices.push(b1.x, b1.y, b1.z);
      wallVertices.push(t2.x, t2.y, t2.z);
      wallVertices.push(t1.x, t1.y, t1.z);

      outlinePoints.push(t1);
    }

    if (outlinePoints.length > 0) {
      outlinePoints.push(outlinePoints[0]); // close loop
      topOutlinePoints.push(outlinePoints);
    }

    // Top Cap Triangulation with UV mapping for National Flag
    const { vertices: capVerts, lonLats } = triangulatePolygonOnSphere(ring, topRadius);
    topCapVertices.push(...capVerts);

    lonLats.forEach(([lon, lat]) => {
      const u = Math.max(0, Math.min(1, (lon - minLon) / (maxLon - minLon || 1)));
      const v = Math.max(0, Math.min(1, (lat - minLat) / (maxLat - minLat || 1)));
      topCapUvs.push(u, v);
    });
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

  // 2. Top Cap Surface Mesh with National Flag Texture!
  if (topCapVertices.length > 0) {
    const capGeo = new THREE.BufferGeometry();
    capGeo.setAttribute('position', new THREE.Float32BufferAttribute(topCapVertices, 3));
    capGeo.setAttribute('uv', new THREE.Float32BufferAttribute(topCapUvs, 2));
    capGeo.computeVertexNormals();

    const iso2 = getCountryIso2(countryFeature);
    const countryName = countryFeature.properties.NAME || 'Country';
    const baseColor = new THREE.Color(colorHex);

    // Instant official flag texture + HD vector refinement
    const flagTexture = createCountryFlagTexture(iso2, countryName);

    const capMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: flagTexture,
      emissiveMap: flagTexture,
      emissive: new THREE.Color(0xffffff),
      emissiveIntensity: 0.98, // Self-luminous: 100% visible, bright, and vibrant from any angle or lighting
      roughness: 0.15,
      metalness: 0.0,
      side: THREE.DoubleSide
    });

    const capMesh = new THREE.Mesh(capGeo, capMat);
    group.add(capMesh);

    // 3. Inscribed 3D Country Name on Plateau Surface!
    const centroid = getCountryCentroid(countryFeature);
    const surfaceNameMesh = createCountrySurfaceNameMesh(countryName, iso2, centroid, topRadius, bbox);
    if (surfaceNameMesh) {
      group.add(surfaceNameMesh);
    }
  }

  // 4. Crisp Glowing Top Outline Border
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
