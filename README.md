<div align="center">

# 🌍 GeoCinematic 3D — World Documentary Map Studio

**Create broadcast-quality 3D animated documentary maps, flight paths, and cinematic camera choreography directly in your browser.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18-cyan.svg)](https://reactjs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-black.svg)](https://threejs.org/)
[![Vite](https://img.shields.io/badge/Vite-Bundler-646CFF.svg)](https://vitejs.dev/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

</div>

---

## 📽️ Why GeoCinematic?

Documentary video creators (inspired by channels like *Vox, Johnny Harris, CaspianReport, RealLifeLore, and Kings and Generals*) often spend hours in After Effects creating animated map sequences.

**GeoCinematic 3D** provides a dedicated, browser-based studio that generates 3D photorealistic Earth animations with Great Circle flight arcs, animated traveling arrows, customizable documentary lower-thirds, and one-click 60FPS video recording.

---

## ✨ Key Features

- **🌐 Photorealistic 3D Globe**:
  - Genuine high-resolution NASA Blue Marble satellite photography.
  - NASA Black Marble nighttime metropolis lights across dark hemispheres.
  - Topographic elevation relief bump mapping for mountain ranges (Himalayas, Andes, Alps).
  - Physical water specular reflection (oceans reflect sunlight while land remains matte).
  - Floating atmospheric clouds with independent orbital drift.
  - Realistic Rayleigh atmospheric rim glow shader.
  - Deep space starfield with 2,000 multi-spectral stars.

- **🏛️ Geopolitical 3D Perspective (Extruded Plateaus)**:
  - 3D raised country plateaus with extruded vertical walls and glowing illuminated borders (inspired by *Vox* and *Johnny Harris*).
  - Floating neighboring country callout badges with national flag emojis.
  - Golden cinematic documentary title banners.
  - Interactive country search bar with instant auto-swoop camera framing.

- **🛡️ Multi-Country Alliances & Coalitions**:
  - Color-coded coalition visualization (e.g., *NATO vs. Russia*, *Middle East Geopolitical Alignment*, *BRICS+ vs. G7*, *Indo-Pacific*).
  - Simultaneous 3D extrusion of entire military/political treaties with team palette branding.
  - Interactive click-to-assign on the 3D globe to paint or draft countries into coalitions.
  - Collapsible Alliance Scorecard with country counts and national flag rosters.

- **✈️ Animated Flight Paths & Geodesic Arcs**:
  - True 3D Great Circle parabolic arc trajectories.
  - Animated glowing stroke with traveling light beacon and 3D directional arrow cones.
  - Pulsing radar circles at departure and destination coordinates.

- **📜 Pre-Configured Documentary Expeditions**:
  - *The Ancient Silk Road* (Chang'an → Samarkand → Baghdad → Constantinople → Rome)
  - *Magellan's Circumnavigation* (Sanlúcar → Rio de Janeiro → Lima → Pacific → Singapore → Cape Town)
  - *Global Air Corridors & Megahubs* (London Heathrow → JFK → Tokyo Haneda → Dubai → Sydney)

- **🛠️ Custom Route Builder**:
  - Connect any of 35+ major world cities and capitals.
  - Configurable trail colors (Golden Amber, Cyan Glow, Rose, Emerald, Violet).
  - Adjustable flight altitude arching.
  - Custom documentary lower-third notes.

- **🎥 Camera Director & Choreography**:
  - **Auto-Framing**: Smoothly sweeps and pitches to frame any country or multi-country alliance in 3D.
  - **Follow Leading Edge**: Cinematic auto-tracking locked onto the aircraft tip.
  - **Dramatic Low-Horizon**: Low-angle shot looking across planetary curvature.
  - **Tactical Top-Down**: High-altitude overview for geopolitical coverage.
  - **Free Orbit**: Smooth manual dragging, tilting, and zooming with inertial damping.

- **📺 Broadcast Documentary Overlays**:
  - Broadcast-quality lower-third cards with current leg, country flags, and coordinates.
  - Real-time spherical distance counter in **Kilometers** and **Nautical Miles** (Haversine formula).
  - 2.39:1 Cinema Letterbox anamorphic bar toggle.

- **🔴 Recording Studio & Clean Screen Mode**:
  - Direct 60FPS WebM video capture and download without third-party software.
  - Aspect ratio framing guides for **16:9 Cinema / YouTube 4K** and **9:16 YouTube Shorts / TikTok / Reels**.
  - **Clean Mode (`[H]` key)**: Hides all UI buttons so you can record 100% pristine footage with OBS or your favorite screen recorder.

---

## ⌨️ Director Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `[Space]` | Play / Pause animation |
| `[H]` | Toggle Clean Screen Mode (hide UI for recording) |
| `[Esc]` | Exit Clean Screen Mode |
| `[Left Drag]` | Orbit & tilt camera |
| `[Mouse Wheel]` | Zoom altitude in / out |

---

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/geocinematic.git
cd geocinematic
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the studio dev server
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 🗺️ Roadmap & Good First Issues

We welcome contributors! Check out [`CONTRIBUTING.md`](CONTRIBUTING.md) to get involved:

- [x] **3D Country Plateaus**: Extruded walls with glowing neon borders.
- [x] **Multi-Country Coalitions**: NATO, BRICS, and Middle East alliances with click-to-assign.
- [x] **60FPS WebM Recording**: Built-in canvas recorder with 16:9 / 9:16 guides.
- [ ] **Animated Military Arrows**: Thick curved invasion and supply arrows (Vox style).
- [ ] **Keyframe Sequencer**: Timeline director for multi-scene camera movements.
- [ ] **Strategic Maritime Chokepoints**: Strait of Hormuz, Suez Canal, Malacca Strait pins.
- [ ] **Custom Audio Player**: Synchronizing background documentary scores.

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).
Feel free to use it for personal projects, YouTube channels, educational videos, and documentaries!
