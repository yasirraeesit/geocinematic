import * as THREE from 'three';

// Convert latitude and longitude to 3D Cartesian coordinates
export function latLonToVector(lat, lon, radius = 5) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

// Generate an arching 3D trajectory between two points on the sphere
export function createArcCurve(startVec, endVec, radius = 5, arcHeight = 0.25) {
  const dist = startVec.distanceTo(endVec);
  const mid = new THREE.Vector3().addVectors(startVec, endVec).multiplyScalar(0.5);
  const midLength = mid.length();

  if (midLength === 0) {
    mid.copy(startVec);
  } else {
    // Elevate the midpoint proportional to distance
    const elevation = radius + Math.max(0.4, dist * arcHeight);
    mid.normalize().multiplyScalar(elevation);
  }

  // Use Quadratic Bezier for clean natural arc
  return new THREE.QuadraticBezierCurve3(startVec, mid, endVec);
}

// Create procedural high-detail world map canvas texture
export function createProceduralEarthTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Deep ocean gradient
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  oceanGrad.addColorStop(0, '#0c1b33');
  oceanGrad.addColorStop(0.5, '#081426');
  oceanGrad.addColorStop(1, '#0c1b33');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle ocean bathymetry / trench contour lines
  ctx.strokeStyle = 'rgba(20, 45, 80, 0.4)';
  ctx.lineWidth = 1;
  for (let y = 0; y < canvas.height; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
  for (let x = 0; x < canvas.width; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  // Draw stylized continent landmasses (Mercator/Equirectangular projection)
  ctx.fillStyle = '#1c3144'; // Continental dark slate
  ctx.strokeStyle = '#2d5a7b'; // Continental border glow
  ctx.lineWidth = 2;

  // Function to convert lat/lon to canvas coordinates
  const toCanvas = (lat, lon) => ({
    x: ((lon + 180) / 360) * canvas.width,
    y: ((90 - lat) / 180) * canvas.height
  });

  // Major continental landmass polygons approximation for guaranteed beautiful offline rendering
  const landmasses = [
    // North America
    [
      [70, -160], [72, -130], [60, -90], [55, -60], [45, -65], [25, -80],
      [15, -90], [10, -75], [20, -105], [30, -115], [50, -125], [60, -140], [65, -165]
    ],
    // South America
    [
      [10, -75], [0, -50], [-10, -35], [-25, -45], [-40, -60], [-55, -68],
      [-50, -75], [-20, -70], [-5, -80], [5, -77]
    ],
    // Eurasia (Europe + Asia)
    [
      [70, 30], [75, 80], [70, 140], [60, 170], [40, 130], [25, 120], [15, 105],
      [10, 80], [25, 65], [30, 35], [35, -5], [45, -10], [55, 5], [60, 20], [70, 25]
    ],
    // Africa
    [
      [35, -5], [30, 32], [12, 45], [0, 42], [-20, 35], [-35, 20],
      [-34, 18], [-15, 12], [5, 2], [15, -15], [30, -10]
    ],
    // Australia
    [
      [-12, 130], [-15, 145], [-25, 152], [-38, 145], [-35, 115], [-20, 115]
    ],
    // Greenland
    [
      [82, -30], [70, -20], [60, -45], [75, -55], [82, -30]
    ]
  ];

  landmasses.forEach(coords => {
    ctx.beginPath();
    coords.forEach((coord, i) => {
      const pt = toCanvas(coord[0], coord[1]);
      if (i === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  });

  // Add terrain relief spots and mountain ridge highlights
  ctx.fillStyle = '#264653';
  for (let i = 0; i < 400; i++) {
    const lat = (Math.random() * 140) - 70;
    const lon = (Math.random() * 360) - 180;
    const pt = toCanvas(lat, lon);
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, Math.random() * 4 + 1, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// Create procedural night lights canvas texture
export function createProceduralNightTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#020408';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const toCanvas = (lat, lon) => ({
    x: ((lon + 180) / 360) * canvas.width,
    y: ((90 - lat) / 180) * canvas.height
  });

  // City cluster densities
  const clusters = [
    { lat: 40.7, lon: -74.0, radius: 25, density: 50 }, // US East
    { lat: 34.0, lon: -118.2, radius: 20, density: 40 }, // US West
    { lat: 48.8, lon: 2.3, radius: 30, density: 70 }, // Western Europe
    { lat: 35.6, lon: 139.6, radius: 25, density: 65 }, // Japan
    { lat: 31.2, lon: 121.4, radius: 35, density: 80 }, // East China
    { lat: 28.6, lon: 77.2, radius: 28, density: 60 }, // India
    { lat: 25.2, lon: 55.2, radius: 15, density: 35 }, // Persian Gulf
    { lat: -23.5, lon: -46.6, radius: 20, density: 40 }, // Brazil coast
    { lat: -33.8, lon: 151.2, radius: 15, density: 25 }, // Australia East
    { lat: 30.0, lon: 31.2, radius: 15, density: 35 } // Nile delta
  ];

  clusters.forEach(({ lat, lon, radius, density }) => {
    const center = toCanvas(lat, lon);
    const grad = ctx.createRadialGradient(center.x, center.y, 2, center.x, center.y, radius * 2);
    grad.addColorStop(0, 'rgba(255, 214, 110, 0.9)');
    grad.addColorStop(0.3, 'rgba(255, 170, 50, 0.5)');
    grad.addColorStop(0.7, 'rgba(255, 140, 20, 0.15)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius * 2, 0, Math.PI * 2);
    ctx.fill();

    // Individual light dots
    ctx.fillStyle = 'rgba(255, 240, 180, 0.85)';
    for (let i = 0; i < density; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.pow(Math.random(), 1.5) * radius;
      const px = center.x + Math.cos(angle) * r;
      const py = center.y + Math.sin(angle) * r;
      ctx.fillRect(px, py, 1.5, 1.5);
    }
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// Create photorealistic atmosphere glow mesh using orbital Rayleigh scattering shader
export function createAtmosphereMesh(radius = 5) {
  const vertexShader = `
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    varying vec3 vNormal;
    uniform vec3 glowColor;
    void main() {
      // Atmospheric limb falloff
      float intensity = pow(0.72 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.2);
      gl_FragColor = vec4(glowColor, 1.0) * intensity * 1.25;
    }
  `;

  const geometry = new THREE.SphereGeometry(radius * 1.18, 64, 64);
  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      glowColor: { value: new THREE.Color(0x38bdf8) }
    },
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false
  });

  return new THREE.Mesh(geometry, material);
}

// Create starry deep space background
export function createStarfield(count = 1800, distance = 400) {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  const starColors = [
    new THREE.Color('#ffffff'),
    new THREE.Color('#93c5fd'),
    new THREE.Color('#fef08a'),
    new THREE.Color('#fbcfe8')
  ];

  for (let i = 0; i < count; i++) {
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);
    const r = distance * (0.8 + Math.random() * 0.4);

    const sinPhi = Math.sin(phi);
    positions[i * 3] = r * sinPhi * Math.cos(theta);
    positions[i * 3 + 1] = r * sinPhi * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);

    const color = starColors[Math.floor(Math.random() * starColors.length)];
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 1.8,
    vertexColors: true,
    transparent: true,
    opacity: 0.85
  });

  return new THREE.Points(geometry, material);
}
