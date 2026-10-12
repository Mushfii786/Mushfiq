import { SiteConfig, Project, Photo, VideoItem, TimelineItem, TechItem, Service, ProcessStep, PolaroidPhoto } from '../types';
import MushfiiImage from "../assets/images/Mushfii.jpg"
import Night from "../assets/images/Night.jpg";
import Dog from "../assets/images/Dog.jpg";
import FortKochi from "../assets/images/FortKochi.jpg";
import Horse from "../assets/images/Horse.jpg";
import RegeneratedImage from "../assets/images/regenerated_image_1786114032574.png";
import RegeneratedImage2 from "../assets/images/regenerated_image_1786192879031.jpg";
import RegeneratedImage4 from "../assets/images/regenerated_image_1787841813563.png";
import RegeneratedImage5 from "../assets/images/regenerated_image_1787807967477.jpg";


export const siteConfig: SiteConfig = {
  name: "Mushfiq",
  initials: "Mushfiq",
  handle: "@mushfiq_786",
  title: "Creative Designer & Frontend Developer",
  tagline: "Building digital experiences that combine cinematic aesthetic with functional precision.",
  aboutIntro: "Hi, I'm Mushfiq, a multidisciplinary creative specializing in photography, videography, video editing, photo editing, and visual design. For the past two years, I've been creating cinematic visuals, editing engaging photo and video content, and designing digital posters for college events and organizations. My work combines creativity, storytelling, and attention to detail to create visuals that leave a lasting impression.",
  aboutBio: "Alongside my creative journey, I have been pursuing Hudawi studies since 2019 at Al Hidaya Islamic Academy, Kalamassery, Ernakulam, an institution affiliated with Darul Huda Islamic University, Chemmad. I continue my Islamic studies while following a parallel path in creative design and visual media, balancing academic, religious, and creative growth.",
  email: "muhammedmushfiq178@gmail.com",
  whatsapp: "+918157868714",
  location: "Kottakkal, Malappuram, India",
  status: "Available for freelance projects & design roles",
  avatarUrl: MushfiiImage,
  resumeUrl: "#resume",
  roles: [
    "Creative Designer",
    "UI/UX Designer",
    "Graphic Designer",
    "Photographer",
    "Videographer",
    "Frontend Developer",
    "Content Creator"
  ],
  socials: {
    instagram: "https://instagram.com/mushfii_786",
    github: "https://github.com/Mushfii786",
    linkedin: "https://www.linkedin.com/in/mushfii786/",
    pinterest: "https://pin.it/1ONUTFjLl",
    behance: "https://www.behance.net/mushfiqpalappu",
    whatsapp: "https://wa.me/918157868714",
    email: "mailto:muhammedmushfiq178@gmail.com"
  },
  stats: [
    { label: "Years Experience", value: "5", suffix: "+" },
    { label: "Projects Delivered", value: "40", suffix: "+" },
    { label: "Content Impressions", value: "250", suffix: "K+" },
    { label: "Client Satisfaction", value: "100", suffix: "%" }
  ]
};

export const projects: Project[] = [
  {
    id: "loom-ai",
    title: "Loom Studio",
    subtitle: "AI Writing & Editorial Canvas",
    description: "An AI writing companion that thinks alongside you, allowing you to capture ideas, edits, and drafts in one focused, distraction-free space.",
    longDescription: "Loom Studio reimagines document editing by placing generative suggestions in an ambient sidebar. Built with Next.js 16, Tailwind CSS v4, and real-time WebGL canvas overlays.",
    role: "Lead UI/UX & Frontend Developer",
    year: "2025",
    category: "UI/UX",
    image: "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&q=80&w=1200&h=800",
    gallery: [
      "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&q=80&w=1200&h=800",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200&h=800"
    ],
    tags: ["Next.js 16", "Tailwind v4", "TypeScript", "Framer Motion", "Design System"],
    link: "https://loom-studio.example.com",
    github: "https://github.com/mushfiq786/loom-studio",
    featured: true,
    metrics: [
      { label: "User Retention", value: "+42%" },
      { label: "Speed Score", value: "99/100" }
    ]
  },
  {
    id: "rhythm-analytics",
    title: "Rhythm OS",
    subtitle: "Calm Analytics for Indie Creators",
    description: "A weekly analytics digest that transforms raw product telemetry into readable narrative stories for independent builders.",
    longDescription: "Designed to remove dashboard anxiety. Rhythm aggregates metrics from Stripe, PostHog, and Vercel into a beautifully formatted Sunday morning digest.",
    role: "Founder & Creative Director",
    year: "2025",
    category: "Development",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200&h=800",
    gallery: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200&h=800"
    ],
    tags: ["React 19", "Three.js", "GSAP", "Chart.js", "Tailwind CSS"],
    link: "https://rhythm-analytics.example.com",
    github: "https://github.com/mushfiq786/rhythm-os",
    featured: true,
    metrics: [
      { label: "Monthly Digest Read Rate", value: "88%" }
    ]
  },
  {
    id: "atlas-studio",
    title: "Atlas Design Lab",
    subtitle: "Two-Week Brand & Digital Sprint",
    description: "Complete visual identity, editorial website, and interactive product surface for a modern architectural studio.",
    longDescription: "Created a bespoke design language with custom typography, 3D architectural mockups in WebGL, and ultra-smooth Lenis scroll transitions.",
    role: "Brand & Motion Designer",
    year: "2024",
    category: "Branding",
    image: "https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&q=80&w=1200&h=800",
    gallery: [
      "https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&q=80&w=1200&h=800"
    ],
    tags: ["Branding", "3D WebGL", "GSAP", "Lenis Scroll", "Figma"],
    link: "https://atlas-lab.example.com",
    featured: true
  },
  {
    id: "groove-music",
    title: "Groove Platform",
    subtitle: "Reimagining Music Education",
    description: "An intuitive booking and curriculum management platform assisting thousands of students in discovering music mentors.",
    longDescription: "Led the end-to-end redesign of the scheduling flow, reducing drop-off by 54% and introducing real-time video preview rooms.",
    role: "Lead UI/UX Designer",
    year: "2024",
    category: "UI/UX",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&q=80&w=1200&h=800",
    gallery: [
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&q=80&w=1200&h=800"
    ],
    tags: ["UI/UX Design", "User Testing", "Figma", "Design Systems"],
    link: "https://groove-app.example.com",
    featured: true
  },
  {
    id: "aurora-3d",
    title: "Aurora Spatial Shader",
    subtitle: "Interactive WebGL Audio Visualizer",
    description: "A GPU-accelerated interactive 3D particle canvas reacting dynamically to ambient web audio and mouse movement.",
    longDescription: "Built with Three.js, React Three Fiber, GLSL shaders, and Web Audio API. Used as hero backdrop for high-end digital agency portfolios.",
    role: "3D & Shader Developer",
    year: "2024",
    category: "3D & Motion",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200&h=800",
    tags: ["Three.js", "GLSL Shaders", "React Three Fiber", "Web Audio"],
    link: "https://aurora-visualizer.example.com",
    github: "https://github.com/mushfiq786/aurora-shader"
  },
  {
    id: "zenith-app",
    title: "Zenith Workspace",
    subtitle: "Minimalist Focus & Time Tracking",
    description: "A dark-mode first productivity app with integrated soundscapes, pomodoro timers, and visual task flows.",
    longDescription: "Features custom audio synthesis using Web Audio API, local storage persistence, and sleek micro-interactions built with Framer Motion.",
    role: "Product Designer & Developer",
    year: "2023",
    category: "Development",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=1200&h=800",
    tags: ["React", "TypeScript", "Tailwind CSS", "PWA"],
    link: "https://zenith-app.example.com"
  }
];

export const photography: Photo[] = [
  {
    id: "photo-1",
    title: "Monsoon Mood",
    category: "Photography",
    url: RegeneratedImage2,
    caption: "Atmospheric monsoon tones and rainy textures in Malappuram.",
    location: "Malappuram, Kerala",
    camera: "Sony A7IV",
    lens: "85mm f/1.4 GM",
    settings: "f/1.8 • 1/500s • ISO 400",
    year: "2026 Archive"
  },
  {
    id: "photo-2",
    title: "Kochi Metro",
    category: "Photography",
    url: RegeneratedImage4,
    caption: "Transit perspectives and urban architecture along the Kochi Metro line.",
    location: "Kochi, Kerala",
    camera: "Fujifilm X-T5",
    lens: "35mm f/2.0",
    settings: "f/2.8 • 1/1000s • ISO 160",
    year: "2025 Archive"
  },
  {
    id: "photo-3",
    title: "Captured Moments",
    category: "Photography",
    url: RegeneratedImage,
    caption: "Frames by Mushfii - Gothic architecture emerging through dramatic fog and atmospheric lighting.",
    location: "Old Town Square",
    camera: "Sony A7IV",
    lens: "35mm f/1.4 GM",
    settings: "f/1.4 • 1/160s • ISO 800",
    year: "2025 Archive"
  },
  {
    id: "photo-4",
    title: "The Ship",
    category: "Photography",
    url: FortKochi,
    caption: "Vessel anchored along the historic coastline of Fort Kochi.",
    location: "Captured in Fort Kochi",
    camera: "Sony A7IV",
    lens: "24-70mm f/2.8 GM",
    settings: "f/4.0 • 1/640s • ISO 100",
    year: "2026 Archive"
  },
  {
    id: "photo-5",
    title: "Wild Horse",
    category: "Photography",
    url: Horse,
    caption: "Wild horse grazing in the misty landscapes of Kodaikanal.",
    location: "Captured in Kodaikanal",
    camera: "Sony A7IV",
    lens: "70-200mm f/2.8 GM",
    settings: "f/2.8 • 1/1000s • ISO 200",
    year: "2026 Archive"
  },
  {
    id: "photo-6",
    title: "Wheel of Lights",
    category: "Night Photography",
    url: Night,
    caption: "Night perspectives and festival lights in Kozhikode.",
    location: "Kozhikode, Kerala",
    camera: "Sony A7IV",
    lens: "50mm f/1.2 GM",
    settings: "f/2.0 • 1/80s • ISO 1600",
    year: "2026 Archive"
  }
];

export const videography: VideoItem[] = [
  {
    id: "video-drive-1",
    title: "Cinematic Horizons Reel (Google Drive)",
    category: "Drive Stream Reel",
    posterUrl: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1200&h=1600",
    videoUrl: "https://drive.google.com/file/d/1wN-76uOqA9mB5YxX3_7C3U2cZ4j9L1vP/preview",
    caption: "Cinematic drone sweep and horizon perspective streamed live via Google Drive integration.",
    location: "Kerala Coastline",
    duration: "0:45",
    camera: "Sony FX3",
    lens: "35mm T1.5 Anamorphic",
    settings: "4K 60fps • S-Log3",
    year: "2026 Film",
    views: 18400,
    likes: 2150
  },
  {
    id: "video-1",
    title: "Tokyo Neon Streets & Midnight Drift",
    category: "Cinematic Reel",
    posterUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=1200&h=1600",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-tokyo-street-with-neon-lights-at-night-41541-large.mp4",
    caption: "Night walkthrough through Shinjuku neon lanes featuring anamorphic lens flares and deep teal-orange color balance.",
    location: "Tokyo, Japan",
    duration: "0:45",
    camera: "Sony A7S III",
    lens: "35mm T1.5 Anamorphic",
    settings: "4K 60fps • S-Log3",
    year: "2026 Film",
    views: 14200,
    likes: 1850
  },
  {
    id: "video-2",
    title: "Aerial Coastal Horizons & Wave Rhythms",
    category: "Drone Reel",
    posterUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200&h=1600",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-beach-and-the-ocean-41550-large.mp4",
    caption: "Cinematic FPV drone sweeping over rugged coastal cliffs at golden hour.",
    location: "Varkala & Wayanad",
    duration: "1:12",
    camera: "DJI Mavic 3 Pro",
    lens: "24mm Hasselblad Prime",
    settings: "5.1K 50fps • D-Log",
    year: "2025 Film",
    views: 22800,
    likes: 2410
  },
  {
    id: "video-3",
    title: "Futuristic Urban Transit & Night Motion",
    category: "Motion & VFX",
    posterUrl: "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&q=80&w=1200&h=1600",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-night-11-large.mp4",
    caption: "Long-exposure time-lapse and speed ramping of city traffic light trails.",
    location: "Metropolis Hub",
    duration: "0:38",
    camera: "RED Komodo 6K",
    lens: "50mm Cine Lens",
    settings: "6K 120fps • REDCODE RAW",
    year: "2026 Film",
    views: 18900,
    likes: 1980
  },
  {
    id: "video-4",
    title: "Fluid Liquid Motion & Ambient Waves",
    category: "Creative Direction",
    posterUrl: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&q=80&w=1200&h=1600",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4",
    caption: "Macro liquid optics exploring light refraction, caustics, and organic wave physics.",
    location: "Studio Lab",
    duration: "0:50",
    camera: "Phantom Flex 4K",
    lens: "100mm Macro Lens",
    settings: "4K 1000fps • RAW",
    year: "2026 Film",
    views: 31200,
    likes: 3400
  },
  {
    id: "video-5",
    title: "Golden Hour Ocean Sunset & Reflection",
    category: "Commercial Film",
    posterUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1200&h=1600",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-sunset-over-the-ocean-with-waves-41548-large.mp4",
    caption: "Atmospheric brand promo highlighting natural sunlight, gentle ocean swells, and peaceful mood.",
    location: "Kozhikode Beach",
    duration: "1:05",
    camera: "Sony FX6",
    lens: "85mm F1.4 GM",
    settings: "4K 120fps • S-Cinetone",
    year: "2025 Film",
    views: 15400,
    likes: 1620
  }
];

export const polaroids: PolaroidPhoto[] = [
  {
    id: "pol-1",
    imageUrl: Night,
    caption: "Riding into neon nights",
    rotation: -4,
  },
  {
    id: "pol-2",
    imageUrl: Dog,
    caption: "Exploring one paw at a time",
    rotation: 3,
  },
  {
    id: "pol-3",
    imageUrl: FortKochi,
    caption: "Where the clouds gather",
    rotation: -2,
  },
  {
    id: "pol-4",
    imageUrl: Horse,
    caption: "Ready for the next adventure",
    rotation: 5,
  },
];

export const timelineItems: TimelineItem[] = [
  {
    id: "exp-1",
    type: "experience",
    roleOrDegree: "Videographer & Visual Designer",
    organization: "Freelance",
    location: "Kottakkal / Remote",
    period: "2024 — Present",
    description: [
      "Directing visual strategy and frontend architecture for high-growth tech startups and creative agencies.",
      "Building high-conversion websites, WebGL experiences, and design systems using Next.js 16, React 19, and Tailwind CSS v4.",
      "Producing brand identity assets, video campaigns, and high-impact social media content reaching 250K+ combined viewers."
    ],
    skills: ["Next.js 16", "Tailwind CSS v4", "Framer Motion", "GSAP", "Three.js", "Brand Strategy"]
  },
  {
    id: "exp-2",
    type: "experience",
    roleOrDegree: "Digital Poster Designer",
    organization: "College Media & Student Organizations",
    location: "Kalamassery / Ernakulam",
    period: "2024 — Present",
    description: [
      "Designing creative digital posters, event branding, and promotional visual media for college events and student organizations.",
      "Crafting engaging social media banners, announcements, and print collaterals combining typography, color, and visual storytelling."
    ],
    skills: ["Poster Design", "Photoshop", "Illustrator", "Typography", "Visual Branding"]
  },
  {
    id: "exp-3",
    type: "experience",
    roleOrDegree: "Creative Video Editor",
    organization: "Freelance",
    location: "Kottakkal / Remote",
    period: "2024 — Present",
    description: [
      "Editing short-form and long-form video content, event highlights, promotional videos, and cinematic reels.",
      "Applying advanced pacing, sound design, color grading, and motion graphics to produce engaging visual stories."
    ],
    skills: ["Video Editing", "Premiere Pro", "DaVinci Resolve", "Sound Design", "Color Grading"]
  },
  {
    id: "edu-1",
    type: "education",
    roleOrDegree: "Hudawi Course (Islamic Studies)",
    organization: "Al Hidaya Islamic Academy, Kalamassery, Ernakulam",
    location: "Kalamassery / Chemmad",
    period: "2019 — Present",
    description: [
      "Pursuing Hudawi studies at Al Hidaya Islamic Academy, Kalamassery, Ernakulam.",
      "Affiliated with Darul Huda Islamic University, Chemmad."
    ],
    skills: ["Islamic Studies", "Hudawi Curriculum", "Arabic Literature", "Islamic Jurisprudence"]
  }
];

export const techCategories = [
  {
    title: "Design & Systems",
    skills: [
      { name: "Figma & UI Kits", level: 96 },
      { name: "Framer Motion", level: 94 },
      { name: "Brand Systems", level: 90 },
      { name: "Photoshop & Illustrator", level: 88 }
    ]
  },
  {
    title: "Frontend Engineering",
    skills: [
      { name: "React 19 & Next.js 16", level: 95 },
      { name: "TypeScript", level: 92 },
      { name: "Tailwind CSS v4", level: 98 },
      { name: "Three.js & Shaders", level: 85 }
    ]
  },
  {
    title: "Media & Motion",
    skills: [
      { name: "Lightroom Classic", level: 92 },
      { name: "DaVinci Resolve", level: 88 },
      { name: "After Effects", level: 85 },
      { name: "Cinematography", level: 90 }
    ]
  },
  {
    title: "Deployment & Tools",
    skills: [
      { name: "Git & GitHub", level: 92 },
      { name: "Vercel / Cloud Run", level: 90 },
      { name: "Lenis & GSAP", level: 94 },
      { name: "Web Audio API", level: 86 }
    ]
  }
];

export const techStack: TechItem[] = [
  { id: "figma", name: "Figma", category: "Design", icon: "Figma", level: 95, featured: true },
  { id: "photoshop", name: "Photoshop", category: "Design", icon: "Image", level: 90, featured: true },
  { id: "illustrator", name: "Illustrator", category: "Design", icon: "PenTool", level: 88, featured: true },
  { id: "react", name: "React 19", category: "Frontend", icon: "Code2", level: 95, featured: true },
  { id: "nextjs", name: "Next.js 16", category: "Frontend", icon: "Globe", level: 92, featured: true },
  { id: "typescript", name: "TypeScript", category: "Frontend", icon: "FileCode", level: 90, featured: true },
  { id: "tailwind", name: "Tailwind v4", category: "Frontend", icon: "Palette", level: 96, featured: true }
];

export const services: Service[] = [
  {
    id: "ui-ux",
    title: "UI/UX & Product Design",
    tagline: "Crafting intuitive interfaces that turn complex problems into seamless experiences.",
    description: "End-to-end product design from user research and wireframing to high-fidelity design systems and interactive prototypes.",
    deliverables: ["User Research & Journeys", "Wireframing & Prototyping", "Design Systems & UI Kits", "SaaS & Mobile App Design"],
    icon: "Layout"
  },
  {
    id: "frontend-dev",
    title: "Frontend Development",
    tagline: "High-performance, pixel-perfect websites built with modern web technologies.",
    description: "Clean, responsive, accessible React/Next.js codebases infused with smooth Framer Motion, GSAP, and WebGL animations.",
    deliverables: ["Next.js 16 & React 19", "Tailwind CSS v4", "WebGL & 120 FPS Performance", "Lighthouse 100/100 Speed"],
    icon: "Code"
  },
  {
    id: "branding",
    title: "Brand Identity & Art Direction",
    tagline: "Building distinct visual identities that captivate and stand out in crowded markets.",
    description: "Developing complete brand design systems including logo design, color palettes, typography, guidelines, and marketing collaterals.",
    deliverables: ["Logo & Visual Identity", "Brand Strategy & Guidelines", "Typography & Color Systems", "Marketing Assets"],
    icon: "Palette"
  }
];

export const processSteps: ProcessStep[] = [
  {
    step: "01",
    title: "Discovery & Strategy",
    description: "Diving deep into your brand, target audience, technical goals, and competitive landscape to define a clear roadmap.",
    details: ["Stakeholder Interviews", "Competitor Benchmarking", "Target Persona Mapping", "Project Scope & Timeline"]
  }
];
