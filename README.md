# Shiva Das — Creative Developer Portfolio

An accurate visual and functional replica of the futuristic, cyberpunk/HUD portfolio website for **Shiva Das** (CSIT Engineer, Creative Developer, and AI Enthusiast).

Built with HTML5, CSS3, Vanilla JavaScript, Three.js, and GSAP.

---

## 🚀 Live Demo & Structure

```
/
├── index.html            # Main semantic HTML5 structure matching design screenshots
├── style.css             # Cyberpunk HUD styling, CSS variables, scanlines, glow & responsive rules
├── script.js             # Root script loader (ES module)
├── js/
│   ├── config.js         # Central portfolio configuration & content data
│   ├── three-scene.js    # Three.js 3D Celestial Object, Skill Constellation, Particles & Project Orbs
│   ├── animations.js     # GSAP entrance sequences, counters, and timeline animations
│   ├── interactions.js   # Custom cyber cursor, 3D card tilt & form transmission protocol
│   └── main.js           # Core module orchestrator
├── assets/
│   └── images/
│       └── shiva_das_portrait.jpg   # Portrait asset for Defense HUD scanner
└── README.md
```

---

## 🎨 Design System & Visual Accuracy

The visual system replicates the uploaded design screenshots:
- **Palette**: Deep void navy-black (`#05080c`), electric cyan (`#00f0ff`), vibrant magenta (`#ff007f`), crisp white, and muted telemetry blue-gray (`#7e8c9f`).
- **Texture**: Dynamic background grid, CRT fine scanline overlay, and atmospheric depth radial glows.
- **Typography**: Display headlines with `Space Grotesk` / `Syne`, technical data in `IBM Plex Mono`, and prose in `Plus Jakarta Sans`.
- **Navigation**: Persistent top bar with brand badge `[SD]`, live `SYSTEM ONLINE v.2026.01` pulsing telemetry, and numbered section links `01 / ABOUT` through `05 / CONTACT`.

---

## ⚡ Interactive & 3D Features

1. **Hero Section (01)**
   - Massive hero typography with electric cyan `DAS` glow.
   - Interactive Three.js 3D celestial object with central `SD` monogram core, multi-axis orbital rings, and dynamic particle swarm responding to cursor movement.
   - Live telemetry coordinates (`LAT 27.7172° N`, `LONG 85.3240° E`, `MODE EXPLORATION`).

2. **About Section (02 — BEYOND THE CODE)**
   - 3D perspective scanner card with corner brackets, crosshair reticle, sweeping laser scanline, and defense grid telemetry.
   - Scroll-triggered animated counters for `04+ YEARS LEARNING` and `20+ TECHNOLOGIES`.

3. **Skills Section (03 — SKILL CONSTELLATION)**
   - Interactive Three.js radar constellation with sweeping radar beam, orbital elliptic tracks, central core (`∞ BUILD / LEARN / REPEAT`), and 8 orbital skill nodes.

4. **Projects Section (04 — FLOATING IN SPACE)**
   - 4 responsive project cards (`Breast Cancer Detection`, `AI-Based Applications`, `Web Development Projects`, `Creative 3D Experiments`).
   - Dedicated WebGL mini-canvases with orbiting celestial bodies, cursor 3D tilt, and active highlight.

5. **Journey Section (05 — THE JOURNEY)**
   - Vertical glowing timeline with sequential scroll markers and status nodes (`2025 — PRESENT`, `2025`, `NEXT`).

6. **Contact Section (06 — LET'S BUILD SOMETHING IMPOSSIBLE)**
   - Futuristic contact form with real-time validation and simulated quantum signal transmission.
   - Direct social links with icons (`GITHUB`, `LINKEDIN`, `INSTAGRAM`, `YOUTUBE`).

---

## 🛠️ Local Development

Open `index.html` directly in any modern browser, or run via local server:

```bash
# Vite Development Server
npm run dev

# Production Build
npm run build
```
