import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  latLonToVector,
  createArcCurve,
  createProceduralEarthTexture,
  createProceduralNightTexture,
  createAtmosphereMesh,
  createStarfield
} from '../../utils/globeUtils';
import {
  createGlobalBordersMesh,
  createExtrudedCountryMesh,
  getCountryCentroid,
  getNeighborCountries,
  getFlagEmoji,
  vector3ToLatLon,
  findCountryByLatLon
} from '../../utils/countryBorders';
import { getCityById } from '../../data/cities';

export default function GlobeCanvas({
  appMode = 'geopolitical', // 'geopolitical' | 'expeditions' | 'alliances'
  selectedCountry = 'Iran',
  alliances = [],
  activeAllianceId,
  onCountryAllianceClick,
  extrudeHeight = 0.28,
  countryColor = '#dc2626',
  onSelectCountry,
  onHoverCountry,
  onCountriesLoaded,
  onLabelsUpdate,
  activeStory,
  progress, // 0 to 1
  isPlaying,
  cameraMode, // 'free' | 'follow' | 'cinematic' | 'topdown' | 'horizon'
  globeStyle, // 'satellite' | 'night' | 'topo'
  onCitySelect,
  isRecording,
  onRecordingComplete
}) {
  const mountRef = useRef(null);
  const [geoJsonData, setGeoJsonData] = useState(null);
  const stateRef = useRef({
    scene: null,
    camera: null,
    renderer: null,
    globeMesh: null,
    cloudMesh: null,
    atmosphereMesh: null,
    starfield: null,
    routesGroup: null,
    markersGroup: null,
    mediaRecorder: null,
    recordedChunks: [],
    targetCamPos: new THREE.Vector3(0, 4, 14),
    targetLookAt: new THREE.Vector3(0, 0, 0),
    currentLookAt: new THREE.Vector3(0, 0, 0),
    isInteracting: false,
    prevPointer: { x: 0, y: 0 },
    spherical: { radius: 15, theta: 0.8, phi: 1.2 }
  });

  // Track recording state
  useEffect(() => {
    const s = stateRef.current;
    if (!s.renderer) return;

    if (isRecording) {
      s.recordedChunks = [];
      const canvas = s.renderer.domElement;
      const stream = canvas.captureStream(60); // 60 FPS
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : 'video/webm';

      try {
        const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 10000000 });
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) s.recordedChunks.push(e.data);
        };
        recorder.onstop = () => {
          const blob = new Blob(s.recordedChunks, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          if (onRecordingComplete) onRecordingComplete(url);
        };
        recorder.start();
        s.mediaRecorder = recorder;
      } catch (err) {
        console.error('MediaRecorder error:', err);
      }
    } else if (s.mediaRecorder && s.mediaRecorder.state !== 'inactive') {
      s.mediaRecorder.stop();
    }
  }, [isRecording, onRecordingComplete]);

  // Main Three.js Scene Setup
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05070f, 0.0015);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 4, 15);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x223355, 0.9);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff7ed, 2.4);
    sunLight.position.set(15, 10, 20);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    rimLight.position.set(-15, -5, -15);
    scene.add(rimLight);

    // Load Real NASA Satellite Textures
    const textureLoader = new THREE.TextureLoader();
    const bUrl = import.meta.env.BASE_URL || './';
    const cleanBase = bUrl.endsWith('/') ? bUrl : `${bUrl}/`;
    
    // Day Texture (NASA Blue Marble)
    const dayTexture = textureLoader.load(
      `${cleanBase}textures/earth_day.jpg`,
      () => renderer.render(scene, camera),
      undefined,
      () => createProceduralEarthTexture() // fallback
    );

    // Night Lights Texture (NASA Black Marble)
    const nightTexture = textureLoader.load(
      `${cleanBase}textures/earth_night.jpg`,
      () => renderer.render(scene, camera)
    );

    // Topographic Bump/Elevation Map
    const topoBumpMap = textureLoader.load(
      `${cleanBase}textures/earth_topo.png`,
      () => renderer.render(scene, camera)
    );

    // Specular Water Mask (makes oceans reflect light like real water)
    const waterSpecularMap = textureLoader.load(
      `${cleanBase}textures/earth_water.png`,
      () => renderer.render(scene, camera)
    );

    // Realistic Cloud Texture
    const cloudTexture = textureLoader.load(
      `${cleanBase}textures/earth_clouds.png`,
      () => renderer.render(scene, camera)
    );

    // Earth Sphere with Physical Documentary Material
    const globeRadius = 5;
    const globeGeo = new THREE.SphereGeometry(globeRadius, 64, 64);
    
    const globeMat = new THREE.MeshStandardMaterial({
      map: dayTexture,
      bumpMap: topoBumpMap,
      bumpScale: 0.08,
      roughness: 0.55,
      metalness: 0.1,
      roughnessMap: waterSpecularMap,
      emissiveMap: nightTexture,
      emissive: new THREE.Color(0xffe6a3),
      emissiveIntensity: 0.45
    });

    const globeMesh = new THREE.Mesh(globeGeo, globeMat);
    scene.add(globeMesh);

    // Photorealistic Cloud layer (elevated slightly above surface)
    const cloudGeo = new THREE.SphereGeometry(globeRadius + 0.045, 64, 64);
    const cloudMat = new THREE.MeshStandardMaterial({
      map: cloudTexture,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
    scene.add(cloudMesh);

    // Glowing Atmosphere
    const atmosphereMesh = createAtmosphereMesh(globeRadius);
    scene.add(atmosphereMesh);

    // Deep Space Starfield
    const starfield = createStarfield(2000, 300);
    scene.add(starfield);

    // Route, Marker, Borders, and Country Groups
    const routesGroup = new THREE.Group();
    const markersGroup = new THREE.Group();
    const bordersGroup = new THREE.Group();
    const countryGroup = new THREE.Group();
    scene.add(routesGroup);
    scene.add(markersGroup);
    scene.add(bordersGroup);
    scene.add(countryGroup);

    // Fetch World Countries GeoJSON for political borders and 3D extrusion
    const bUrlGeo = import.meta.env.BASE_URL || './';
    const cleanBaseGeo = bUrlGeo.endsWith('/') ? bUrlGeo : `${bUrlGeo}/`;
    fetch(`${cleanBaseGeo}data/countries.geojson`)
      .then((res) => res.json())
      .then((data) => {
        stateRef.current.geoJsonData = data;
        setGeoJsonData(data);
        const bordersMesh = createGlobalBordersMesh(data, globeRadius + 0.008);
        bordersGroup.add(bordersMesh);

        if (onCountriesLoaded) {
          const names = data.features
            .map((f) => f.properties.NAME)
            .filter(Boolean)
            .sort();
          onCountriesLoaded(names);
        }
      })
      .catch((err) => console.error('Failed to load countries GeoJSON:', err));

    // Precise Three.js OrbitControls with physical damping / inertia
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.rotateSpeed = 0.8;
    controls.zoomSpeed = 1.0;
    controls.minDistance = 6.0;
    controls.maxDistance = 25.0;
    controls.enablePan = false;

    // Raycasting for Direct Country Selection & Hover Tooltips
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let pointerDownPos = { x: 0, y: 0 };

    const onPointerDown = (e) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = (e) => {
      const dx = Math.abs(e.clientX - pointerDownPos.x);
      const dy = Math.abs(e.clientY - pointerDownPos.y);
      // Check if it was a click (not a drag)
      if (dx < 6 && dy < 6 && globeMesh && stateRef.current.geoJsonData) {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(globeMesh);
        if (intersects.length > 0) {
          const pt = intersects[0].point;
          const { lat, lon } = vector3ToLatLon(pt, globeRadius);
          const feature = findCountryByLatLon(stateRef.current.geoJsonData, lat, lon);
          if (feature) {
            if (appMode === 'alliances' && onCountryAllianceClick) {
              onCountryAllianceClick(feature.properties.NAME);
            } else if (onSelectCountry) {
              onSelectCountry(feature.properties.NAME);
            }
          }
        }
      }
    };

    const onPointerMove = (e) => {
      if (globeMesh && stateRef.current.geoJsonData && onHoverCountry) {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(globeMesh);
        if (intersects.length > 0) {
          const pt = intersects[0].point;
          const { lat, lon } = vector3ToLatLon(pt, globeRadius);
          const feature = findCountryByLatLon(stateRef.current.geoJsonData, lat, lon);
          if (feature) {
            onHoverCountry({
              name: feature.properties.NAME,
              iso2: feature.properties.ISO_A2,
              flag: getFlagEmoji(feature.properties.ISO_A2),
              x: e.clientX,
              y: e.clientY
            });
            renderer.domElement.style.cursor = 'pointer';
            return;
          }
        }
        renderer.domElement.style.cursor = 'grab';
        onHoverCountry(null);
      }
    };

    const canvasEl = renderer.domElement;
    canvasEl.addEventListener('pointerdown', onPointerDown);
    canvasEl.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointermove', onPointerMove);

    // Save references
    stateRef.current = {
      ...stateRef.current,
      scene,
      camera,
      renderer,
      controls,
      globeMesh,
      cloudMesh,
      atmosphereMesh,
      starfield,
      routesGroup,
      markersGroup,
      bordersGroup,
      countryGroup,
      textures: {
        day: dayTexture,
        night: nightTexture,
        topo: topoBumpMap,
        water: waterSpecularMap,
        clouds: cloudTexture
      }
    };

    // Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Atmospheric & cloud drift
      cloudMesh.rotation.y = elapsedTime * 0.015;
      starfield.rotation.y = elapsedTime * 0.001;

      // Pulse city markers radar rings
      markersGroup.children.forEach((marker) => {
        if (marker.userData.ring) {
          const ring = marker.userData.ring;
          ring.userData.pulse = (ring.userData.pulse || 0) + 0.04;
          const s = 1 + Math.sin(ring.userData.pulse) * 0.35;
          ring.scale.set(s, s, s);
          ring.material.opacity = 0.8 - (s - 1) * 1.5;
        }
      });

      // Smooth camera interpolation when flying to target
      const { camera, targetCamPos, targetLookAt, isFlying, activeLabelCoords } = stateRef.current;
      if (isFlying && targetCamPos && targetLookAt) {
        camera.position.lerp(targetCamPos, 0.06);
        controls.target.lerp(targetLookAt, 0.06);
        if (camera.position.distanceTo(targetCamPos) < 0.08) {
          stateRef.current.isFlying = false;
        }
      }

      controls.update();

      // Project geopolitical country labels to 2D screen positions with collision-avoidance
      if (activeLabelCoords && activeLabelCoords.length > 0 && onLabelsUpdate && container) {
        const w = container.clientWidth;
        const h = container.clientHeight;
        const projected = [];

        activeLabelCoords.forEach((item) => {
          const v = item.vec3.clone();
          // Check if facing the camera (not on back hemisphere of earth)
          const dot = v.clone().normalize().dot(camera.position.clone().normalize());
          if (dot > 0.12) {
            v.project(camera);
            const x = (v.x * 0.5 + 0.5) * w;
            const y = (-v.y * 0.5 + 0.5) * h;
            projected.push({
              name: item.name,
              x,
              y,
              isFeatured: item.isFeatured,
              flag: item.flag,
              iso2: item.iso2,
              color: item.color,
              allianceName: item.allianceName
            });
          }
        });

        // Collision-avoidance: Prevent overlapping label cards from stacking up
        const nonColliding = [];
        const sorted = [...projected].sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        sorted.forEach((item) => {
          const overlaps = nonColliding.some((existing) => {
            const dx = existing.x - item.x;
            const dy = existing.y - item.y;
            return Math.sqrt(dx * dx + dy * dy) < 65; // minimum 65px separation
          });
          if (!overlaps || item.isFeatured) {
            nonColliding.push(item);
          }
        });

        onLabelsUpdate(nonColliding);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle Resize
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      canvasEl.removeEventListener('pointerdown', onPointerDown);
      canvasEl.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointermove', onPointerMove);
      controls.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update Globe Material based on selected globeStyle and cloud toggle
  useEffect(() => {
    const { globeMesh, cloudMesh, textures } = stateRef.current;
    if (!globeMesh || !textures) return;

    if (cloudMesh) {
      cloudMesh.visible = globeStyle !== 'topo';
    }

    if (globeStyle === 'night') {
      globeMesh.material.map = textures.night;
      globeMesh.material.bumpMap = textures.topo;
      globeMesh.material.bumpScale = 0.05;
      globeMesh.material.roughness = 0.4;
      globeMesh.material.emissiveMap = textures.night;
      globeMesh.material.emissive = new THREE.Color(0xfff5cc);
      globeMesh.material.emissiveIntensity = 0.85;
    } else if (globeStyle === 'topo') {
      globeMesh.material.map = textures.day;
      globeMesh.material.bumpMap = textures.topo;
      globeMesh.material.bumpScale = 0.22; // High relief mountains
      globeMesh.material.roughness = 0.7;
      globeMesh.material.emissiveIntensity = 0.1;
    } else {
      // Default: Photorealistic NASA Blue Marble Satellite
      globeMesh.material.map = textures.day;
      globeMesh.material.bumpMap = textures.topo;
      globeMesh.material.bumpScale = 0.08;
      globeMesh.material.roughness = 0.55;
      globeMesh.material.roughnessMap = textures.water;
      globeMesh.material.emissiveMap = textures.night;
      globeMesh.material.emissive = new THREE.Color(0xffe6a3);
      globeMesh.material.emissiveIntensity = 0.45;
    }
  }, [globeStyle]);

  // Geopolitical & Alliances Mode: 3D Extruded Country Plateaus & Labels
  useEffect(() => {
    const { countryGroup, geoJsonData } = stateRef.current;
    if (!countryGroup || !geoJsonData) return;

    // Clear previous extruded country
    while (countryGroup.children.length > 0) {
      const obj = countryGroup.children[0];
      countryGroup.remove(obj);
      if (obj.traverse) {
        obj.traverse((child) => {
          if (child.geometry) child.geometry.dispose();
          if (child.material) child.material.dispose();
        });
      }
    }

    if (appMode === 'expeditions') {
      stateRef.current.activeLabelCoords = [];
      if (onLabelsUpdate) onLabelsUpdate([]);
      return;
    }

    // MODE A: MULTI-COUNTRY ALLIANCES & COALITIONS
    if (appMode === 'alliances') {
      const labelCoords = [];
      let sumLat = 0;
      let sumLon = 0;
      let memberCount = 0;

      alliances.forEach((alliance) => {
        alliance.countries.forEach((countryName) => {
          const feature = geoJsonData.features.find(
            (f) => f.properties.NAME.toLowerCase() === countryName.toLowerCase()
          );
          if (feature) {
            const mesh = createExtrudedCountryMesh(feature, 5.0, extrudeHeight, alliance.color);
            countryGroup.add(mesh);

            const centroid = getCountryCentroid(feature);
            sumLat += centroid.lat;
            sumLon += centroid.lon;
            memberCount++;

            const countryVec = latLonToVector(centroid.lat, centroid.lon, 5.0 + extrudeHeight);
            labelCoords.push({
              name: feature.properties.NAME,
              vec3: countryVec,
              isFeatured: false,
              flag: getFlagEmoji(feature.properties.ISO_A2),
              iso2: feature.properties.ISO_A2,
              color: alliance.color,
              allianceName: alliance.name
            });
          }
        });
      });

      // Fly camera to frame the entire alliance region dynamically!
      if (memberCount > 0) {
        const avgLat = sumLat / memberCount;
        const avgLon = sumLon / memberCount;
        const centerLookAt = latLonToVector(avgLat, avgLon, 5.0 + extrudeHeight * 0.4);
        // Position camera south of center at a 30° perspective angle
        const targetCam = latLonToVector(avgLat - 16, avgLon, 9.2);
        stateRef.current.targetCamPos = targetCam;
        stateRef.current.targetLookAt = centerLookAt;
        stateRef.current.isFlying = true;
      }

      stateRef.current.activeLabelCoords = labelCoords;
      return;
    }

    // MODE B: SINGLE GEOPOLITICAL 3D PERSPECTIVE (MATCHING USER IMAGE)
    if (appMode === 'geopolitical' && selectedCountry) {
      const feature = geoJsonData.features.find(
        (f) => f.properties.NAME.toLowerCase() === selectedCountry.toLowerCase()
      );
      if (!feature) return;

      // 1. Build 3D Extruded Country Mesh with walls and glowing top cap
      const extrudedMesh = createExtrudedCountryMesh(feature, 5.0, extrudeHeight, countryColor);
      countryGroup.add(extrudedMesh);

      // 2. Calculate Country Centroid
      const centroid = getCountryCentroid(feature);
      const countryVec = latLonToVector(centroid.lat, centroid.lon, 5.0 + extrudeHeight);

      // 3. Camera Positioning: Cinematic Low-Horizon 3D Perspective (matching attached image!)
      const targetCam = latLonToVector(centroid.lat - 14, centroid.lon, 9.6);
      stateRef.current.targetCamPos = targetCam;
      stateRef.current.targetLookAt = countryVec;
      stateRef.current.isFlying = true;

      // 4. Gather Neighboring Countries for Floating Labels & Flags
      const neighbors = getNeighborCountries(geoJsonData.features, feature, 7);
      const labelCoords = [
        {
          name: feature.properties.NAME,
          vec3: countryVec,
          isFeatured: true,
          flag: getFlagEmoji(feature.properties.ISO_A2),
          iso2: feature.properties.ISO_A2
        }
      ];

      neighbors.forEach(({ feature: nf, centroid: nc }) => {
        labelCoords.push({
          name: nf.properties.NAME,
          vec3: latLonToVector(nc.lat, nc.lon, 5.05),
          isFeatured: false,
          flag: getFlagEmoji(nf.properties.ISO_A2),
          iso2: nf.properties.ISO_A2
        });
      });

      stateRef.current.activeLabelCoords = labelCoords;
    }
  }, [geoJsonData, appMode, selectedCountry, extrudeHeight, countryColor, alliances]);

  // Update Routes and Markers whenever activeStory or progress changes
  useEffect(() => {
    const { routesGroup, markersGroup, globeMesh, camera, spherical, targetLookAt } = stateRef.current;
    if (!routesGroup || !markersGroup || !activeStory) return;

    // Clear previous
    while (routesGroup.children.length > 0) {
      const obj = routesGroup.children[0];
      routesGroup.remove(obj);
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) obj.material.dispose();
    }
    while (markersGroup.children.length > 0) {
      const obj = markersGroup.children[0];
      markersGroup.remove(obj);
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) obj.material.dispose();
    }

    // Only draw routes and beacons in 'expeditions' mode
    if (appMode !== 'expeditions') return;

    const globeRadius = 5;
    const routes = activeStory.routes || [];
    const totalRoutes = routes.length;
    if (totalRoutes === 0) return;

    // Calculate which route segment we are currently drawing based on global progress
    // Global progress 0..1 spans the entire story
    const scaledProg = progress * totalRoutes;
    let activeHeadVector = null;

    routes.forEach((route, index) => {
      const fromCity = getCityById(route.from);
      const toCity = getCityById(route.to);
      if (!fromCity || !toCity) return;

      const p1 = latLonToVector(fromCity.lat, fromCity.lon, globeRadius);
      const p2 = latLonToVector(toCity.lat, toCity.lon, globeRadius);

      // Create Route Curve
      const curve = createArcCurve(p1, p2, globeRadius, route.arcHeight || 0.25);
      const fullPoints = curve.getPoints(120);

      // Base background faint trail
      const baseGeometry = new THREE.BufferGeometry().setFromPoints(fullPoints);
      const baseMaterial = new THREE.LineBasicMaterial({
        color: new THREE.Color(route.color || '#38bdf8'),
        transparent: true,
        opacity: 0.22,
        linewidth: 1
      });
      const baseLine = new THREE.Line(baseGeometry, baseMaterial);
      routesGroup.add(baseLine);

      // Route Progress calculation
      let segmentProgress = 0;
      if (scaledProg >= index + 1) {
        segmentProgress = 1; // Completed
      } else if (scaledProg > index) {
        segmentProgress = scaledProg - index; // Actively animating
      }

      if (segmentProgress > 0) {
        // Active glowing animated line
        const drawnPointCount = Math.max(2, Math.floor(segmentProgress * fullPoints.length));
        const activePoints = fullPoints.slice(0, drawnPointCount);
        const activeGeo = new THREE.BufferGeometry().setFromPoints(activePoints);
        const activeMat = new THREE.LineBasicMaterial({
          color: new THREE.Color(route.color || '#f59e0b'),
          transparent: true,
          opacity: 0.95,
          linewidth: 3
        });
        const activeLine = new THREE.Line(activeGeo, activeMat);
        routesGroup.add(activeLine);

        // Current tip/arrow head
        const currentTip = activePoints[activePoints.length - 1];
        if (segmentProgress < 1 || index === Math.floor(scaledProg)) {
          activeHeadVector = currentTip;

          // Glowing Head Sphere / Light Beacon
          const beaconGeo = new THREE.SphereGeometry(0.12, 16, 16);
          const beaconMat = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            wireframe: false
          });
          const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat);
          beaconMesh.position.copy(currentTip);
          routesGroup.add(beaconMesh);

          // Outer halo around beacon
          const haloGeo = new THREE.SphereGeometry(0.24, 16, 16);
          const haloMat = new THREE.MeshBasicMaterial({
            color: new THREE.Color(route.color || '#f59e0b'),
            transparent: true,
            opacity: 0.5,
            wireframe: true
          });
          const haloMesh = new THREE.Mesh(haloGeo, haloMat);
          haloMesh.position.copy(currentTip);
          routesGroup.add(haloMesh);

          // Flight Direction Arrow Cone
          if (drawnPointCount >= 2) {
            const prevPoint = activePoints[activePoints.length - 2];
            const direction = new THREE.Vector3().subVectors(currentTip, prevPoint).normalize();
            const coneGeo = new THREE.ConeGeometry(0.14, 0.35, 12);
            coneGeo.rotateX(Math.PI / 2);
            const coneMat = new THREE.MeshBasicMaterial({
              color: 0xfff000
            });
            const cone = new THREE.Mesh(coneGeo, coneMat);
            cone.position.copy(currentTip);
            cone.lookAt(currentTip.clone().add(direction));
            routesGroup.add(cone);
          }
        }
      }

      // Origin Marker Pin
      addCityMarker(markersGroup, p1, fromCity, route.color || '#38bdf8');

      // Destination Marker Pin
      if (segmentProgress > 0.05) {
        addCityMarker(markersGroup, p2, toCity, route.color || '#38bdf8');
      }
    });

    // Camera follow behavior
    const { controls } = stateRef.current;
    if (controls) {
      if (cameraMode === 'follow' && activeHeadVector) {
        controls.target.lerp(activeHeadVector, 0.08);
      } else if (cameraMode === 'topdown') {
        controls.target.set(0, 0, 0);
      } else if (cameraMode === 'horizon') {
        controls.target.set(0, 0, 0);
      }
    }
  }, [appMode, activeStory, progress, cameraMode]);

  // Helper to add pulsing marker pin
  const addCityMarker = (group, position, city, colorHex) => {
    const markerRoot = new THREE.Group();
    markerRoot.position.copy(position);

    // Orient marker outward from center
    markerRoot.lookAt(position.clone().multiplyScalar(2));

    // Center dot
    const dotGeo = new THREE.SphereGeometry(0.08, 12, 12);
    const dotMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const dotMesh = new THREE.Mesh(dotGeo, dotMat);
    markerRoot.add(dotMesh);

    // Pulsing radar ring
    const ringGeo = new THREE.RingGeometry(0.12, 0.18, 24);
    const ringMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(colorHex),
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.userData.pulse = Math.random() * Math.PI;
    markerRoot.userData.ring = ringMesh;
    markerRoot.add(ringMesh);

    group.add(markerRoot);
  };

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing select-none"
      id="globe-canvas-container"
    />
  );
}
