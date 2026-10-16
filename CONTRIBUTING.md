# Contributing to GeoCinematic 3D

Thank you for your interest in contributing to **GeoCinematic 3D**! This project aims to empower creators, documentarians, teachers, and developers to create breathtaking cinematic world map animations directly in the browser.

Whether you are fixing a typo, adding historical trade routes, introducing new 3D shaders, or translating city names, your contributions are welcome!

---

## 🗺️ Ways You Can Contribute

You don't need to be a 3D WebGL expert to make meaningful contributions! Here are great areas to get started:

### 1. Add New Historical Stories & Expeditions (Beginner Friendly)
Help document world history! You can create pre-configured documentary journeys in [`src/data/sampleRoutes.js`](src/data/sampleRoutes.js):
- Alexander the Great's Asian Conquest
- The Apollo Moonshot Global Tracking Stations
- The Trans-Siberian Railway Route
- The Panama & Suez Canal Global Shipping Arteries
- The Voyages of Ibn Battuta or Zheng He

### 2. Expand the World Cities Catalog
Add missing historical capitals, ancient trading hubs, or archaeological sites to [`src/data/cities.js`](src/data/cities.js) with accurate latitude and longitude.

### 3. Enhance 3D Graphics & Visual Shaders
- Country border glow & territory polygons (GeoJSON rendering).
- Realistic sun/moon planetary orbits and realistic terminator shadow lines.
- Particle effects along flight corridors (jet vapor contrails, wake waves for naval ships).

### 4. Video Producer Features
- Export to MP4/WebM with custom resolution presets (4K UHD, 1440p, 1080p).
- Keyframe camera sequencer (custom panning and zoom choreography).
- Audio and cinematic SFX player support.

---

## 🛠️ Local Development Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or newer recommended)
- `npm`, `yarn`, or `pnpm`

### Step-by-Step Setup

1. **Fork the Repository**:
   Click the **Fork** button at the top-right of the GitHub repository page.

2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/geocinematic-3d.git
   cd geocinematic-3d
   ```

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📂 Project Structure

```
├── public/
│   └── textures/          # Photorealistic NASA satellite, night, bump & cloud maps
├── src/
│   ├── components/
│   │   ├── Globe/         # Three.js 3D WebGL Canvas, materials & camera tracking
│   │   └── UI/            # Studio panels, timeline scrubber, overlay & recorder
│   ├── data/
│   │   ├── cities.js      # Global database of coordinates and capitals
│   │   └── sampleRoutes.js# Pre-built documentary expedition storylines
│   ├── utils/
│   │   └── globeUtils.js  # Spherical math, arc geodesics, and atmosphere shaders
│   ├── App.jsx            # Main state controller
│   └── index.css          # Design system and typography
```

---

## 🌿 Pull Request Guidelines

1. **Create a descriptive feature branch**:
   ```bash
   git checkout -b feature/apollo-mission-story
   ```
2. **Make your changes**: Keep commits clear and descriptive.
3. **Test locally**: Ensure the app builds without errors (`npm run build`).
4. **Submit a Pull Request**:
   - Provide a clear summary of what you added or fixed.
   - Include a screenshot or short screen recording demonstrating visual changes.
   - Link any related issues if applicable.

---

## 💬 Community & Questions

Have an idea or question? Open a GitHub Discussion or submit an Issue. We are happy to help you get your PR merged!
