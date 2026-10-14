export interface FirestorePhotoItem {
  id: string;
  title: string;
  caption: string;
  description?: string;
  category: string;
  url: string;
  storagePath?: string;
  altText?: string;
  location?: string;
  camera?: string;
  lens?: string;
  settings?: string;
  year?: string;
  featured?: boolean;
  published: boolean;
  sortOrder: number;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface FirestoreVideoItem {
  id: string;
  title: string;
  caption: string;
  description?: string;
  category: string;
  videoUrl: string;
  videoStoragePath?: string;
  thumbnailUrl: string;
  thumbnailStoragePath?: string;
  duration?: string;
  aspectRatioClass?: string;
  location?: string;
  camera?: string;
  lens?: string;
  settings?: string;
  year?: string;
  views?: number;
  likes?: number;
  column?: 1 | 2 | 3 | 4;
  featured?: boolean;
  published: boolean;
  sortOrder: number;
  isCustom?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface FirestoreProjectItem {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  longDescription?: string;
  role: string;
  year: string;
  category: string;
  image: string;
  imageStoragePath?: string;
  gallery?: string[];
  tags: string[];
  link?: string;
  github?: string;
  featured: boolean;
  published: boolean;
  sortOrder: number;
  metrics?: { label: string; value: string }[];
  createdAt?: string;
  updatedAt?: string;
}

export interface FirestoreServiceItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  deliverables: string[];
  icon: string;
  sortOrder: number;
}

export interface FirestoreTimelineItem {
  id: string;
  type: 'experience' | 'education';
  roleOrDegree: string;
  organization: string;
  location: string;
  period: string;
  description: string[];
  skills: string[];
  sortOrder: number;
}

export interface FirestoreTechItem {
  title: string;
  skills: { name: string; level: number }[];
}

export interface FirestoreSiteContent {
  hero: {
    headingPart1: string;
    headingPart2: string;
    gradientHeading: string;
    intro: string;
    availabilityBadge: string;
    ctaLabel: string;
    ctaLink: string;
    secondaryCtaLabel?: string;
    secondaryCtaLink?: string;
  };
  about: {
    heading: string;
    intro: string;
    bio: string;
    avatarUrl: string;
    avatarStoragePath?: string;
    location: string;
    status: string;
    email: string;
    whatsapp: string;
    roles: string[];
    stats: { label: string; value: string; suffix?: string }[];
  };
  socials: {
    instagram: string;
    github: string;
    linkedin: string;
    pinterest?: string;
    behance?: string;
    whatsapp: string;
    email: string;
  };
  contact: {
    heading: string;
    subheading: string;
    email: string;
    phone: string;
    location: string;
    webhookUrl?: string;
  };
  footer: {
    tagline: string;
    copyrightText: string;
  };
}

export interface FirestoreSiteSettings {
  siteName: string;
  siteTitle: string;
  handle: string;
  metaDescription: string;
  accentColor: string;
  enableAnimations: boolean;
  maintenanceMode: boolean;
  allowPublicComments?: boolean;
}

export interface StoredMediaFile {
  id: string;
  name: string;
  url: string;
  storagePath: string;
  size?: number;
  contentType?: string;
  type: 'photo' | 'video' | 'thumbnail' | 'other';
  createdAt: string;
}
