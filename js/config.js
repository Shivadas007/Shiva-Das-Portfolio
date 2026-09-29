/**
 * Portfolio Configuration & Content Data
 * Shiva Das — Creative Developer Portfolio
 */

export const portfolioConfig = {
  name: "Shiva Das",
  role: "Creative Developer",
  subroles: "CSIT ENGINEER  •  CREATIVE DEVELOPER  •  AI ENTHUSIAST",
  tagline: "I build immersive digital experiences where technology, artificial intelligence and creativity collide.",
  
  // Coordinates & Telemetry
  telemetry: {
    systemStatus: "SYSTEM ONLINE",
    version: "v.2026.01",
    lat: "27.7172° N",
    long: "85.3240° E",
    mode: "EXPLORATION",
    signalStatus: "01 CREATIVE / SIGNAL DETECTED"
  },
  
  // Social Profiles
  socials: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    instagram: "https://instagram.com",
    youtube: "https://youtube.com"
  },

  // About Section Data
  about: {
    titleTop: "BEYOND",
    titleBottom: "THE CODE.",
    bio: "I’m Shiva Das, a Computer Science & Information Technology student exploring the edge where ideas become interactive reality — Artificial Intelligence, Web Development, Cybersecurity, 3D Web Experiences and Creative Technology.",
    stats: [
      { value: "04+", label: "YEARS LEARNING", countTo: 4, suffix: "+" },
      { value: "20+", label: "TECHNOLOGIES", countTo: 20, suffix: "+" },
      { value: "∞", label: "CURIOSITY", isInfinity: true }
    ],
    hud: {
      threatLevel: "ZERO",
      confidence: "99.8%",
      depthMap: "DEPTH MAP READY",
      name: "SHIVA.DAS",
      defenseGrid: "DEFENSE GRID // ACTIVE"
    }
  },

  // Skills Data (8 Nodes matching Screenshot)
  skills: [
    { id: "01", name: "Artificial Intelligence", angle: 2.35, radius: 210, zOffset: 15 },
    { id: "02", name: "Machine Learning", angle: 1.55, radius: 105, zOffset: 30 },
    { id: "03", name: "Three.js / WebGL", angle: 0.65, radius: 230, zOffset: -10 },
    { id: "04", name: "Creative Coding", angle: 3.45, radius: 240, zOffset: -20 },
    { id: "05", name: "Cybersecurity", angle: 4.25, radius: 140, zOffset: 25 },
    { id: "06", name: "React + JavaScript", angle: 5.45, radius: 235, zOffset: 10 },
    { id: "07", name: "Python", angle: 5.05, radius: 95, zOffset: -15 },
    { id: "08", name: "Motion Systems", angle: 0.05, radius: 195, zOffset: 15 }
  ],

  // Projects Data (4 Cards matching Screenshot)
  projects: [
    {
      id: "01",
      title: "Breast Cancer Detection",
      category: "AI / ML",
      year: "2025–26",
      description: "A machine-learning classifier turning complex health data into an earlier, clearer signal.",
      tags: ["Python", "TensorFlow"],
      theme: {
        primary: "#ff007f",
        secondary: "#00f0ff",
        type: "dual-orb"
      }
    },
    {
      id: "02",
      title: "AI-Based Applications",
      category: "INTELLIGENT TOOLS",
      year: "2025–26",
      description: "Human-first tools that blend model intelligence with clean, expressive user experiences.",
      tags: ["Python", "Node.js"],
      theme: {
        primary: "#ff006e",
        secondary: "#00f0ff",
        type: "magenta-core"
      }
    },
    {
      id: "03",
      title: "Web Development Projects",
      category: "INTERFACE SYSTEMS",
      year: "2025–26",
      description: "Responsive, fast and accessible web worlds built to feel as good as they perform.",
      tags: ["React", "JavaScript"],
      highlight: true,
      theme: {
        primary: "#8a2be2",
        secondary: "#00f0ff",
        type: "cyan-active"
      }
    },
    {
      id: "04",
      title: "Creative 3D Experiments",
      category: "IMMERSIVE WEB",
      year: "2025–26",
      description: "WebGL playgrounds, shaders and particles that make the browser feel alive.",
      tags: ["Three.js", "GSAP"],
      theme: {
        primary: "#00f0ff",
        secondary: "#ff007f",
        type: "three-orbit"
      }
    }
  ],

  // Journey Timeline Data matching Screenshot
  journey: [
    {
      period: "2025 — PRESENT",
      markerType: "filled",
      title: "B.Tech CSIT · Building in public",
      body: "Building projects in AI, web & security while learning how to turn ambitious ideas into useful experiences."
    },
    {
      period: "2025",
      markerType: "outline",
      title: "3D web experiments · First orbit",
      body: "Started exploring Three.js, GSAP, shaders and the beautiful tension between code and movement."
    },
    {
      period: "NEXT",
      markerType: "muted",
      title: "Open to new signals",
      body: "Internships, collaborations, hackathons and the next impossible thing."
    }
  ]
};
