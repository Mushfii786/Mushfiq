import React from 'react';

export interface Project {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  longDescription?: string;
  role: string;
  year: string;
  category?: 'UI/UX' | 'Branding' | 'Development' | '3D & Motion' | string;
  image: string;
  gallery?: string[];
  tags?: string[];
  link?: string;
  github?: string;
  featured?: boolean;
  metrics?: { label: string; value: string }[];
}

export interface Photo {
  id: string;
  title: string;
  category: string;
  url: string;
  caption: string;
  location: string;
  camera?: string;
  lens?: string;
  settings?: string;
  year: string;
  published?: boolean;
}

export interface VideoItem {
  id: string;
  title: string;
  category: string;
  posterUrl: string;
  videoUrl: string;
  caption: string;
  location: string;
  duration: string;
  camera?: string;
  lens?: string;
  settings?: string;
  year: string;
  views: number;
  likes: number;
}

export interface TimelineItem {
  id: string;
  type: 'experience' | 'education';
  roleOrDegree: string;
  organization: string;
  location: string;
  period: string;
  description: string[];
  skills: string[];
  logoUrl?: string;
}

export interface TechItem {
  id: string;
  name: string;
  category: 'Design' | 'Frontend' | 'Media' | 'Tools' | string;
  icon: string; // Lucide icon name or SVG path
  level: number; // 0-100
  physicsRadius?: number;
  featured?: boolean;
}

export interface Service {
  id: string;
  title: string;
  tagline: string;
  description: string;
  deliverables: string[];
  icon: string;
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
  details: string[];
}

export interface PolaroidPhoto {
  id: string;
  imageUrl: string;
  caption: string;
  rotation: number; // degrees e.g. -6, 4, -2
}

export interface SiteConfig {
  name: string;
  initials: string;
  handle: string;
  title: string;
  tagline: string;
  aboutIntro: string;
  aboutBio: string;
  email: string;
  whatsapp: string;
  location: string;
  status: string;
  avatarUrl: string;
  resumeUrl: string;
  roles: string[];
  socials: {
    instagram: string;
    github: string;
    linkedin: string;
    pinterest: string;
    behance: string;
    whatsapp: string;
    email: string;
  };
  stats: {
    label: string;
    value: string;
    suffix?: string;
  }[];
  hero?: any;
  footer?: any;
}
