export type ViewportMode = 'desktop' | 'laptop' | 'tablet' | 'mobile';

export type AdminModule = 
  | 'overview' 
  | 'editor' 
  | 'pages' 
  | 'projects' 
  | 'blog' 
  | 'gallery' 
  | 'media' 
  | 'analytics' 
  | 'inbox' 
  | 'design-system' 
  | 'settings';

export interface StyleOverride {
  text?: string;
  fontSize?: string; // e.g. "48px", "2.5rem"
  fontWeight?: string; // e.g. "400", "600", "700", "800"
  color?: string; // hex or rgb
  backgroundColor?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  lineHeight?: string;
  letterSpacing?: string;
  padding?: string; // e.g. "16px" or "12px 24px"
  margin?: string;
  borderRadius?: string;
  borderColor?: string;
  borderWidth?: string;
  opacity?: number;
  width?: string;
  maxWidth?: string;
  height?: string;
  display?: string;
  flexDirection?: 'row' | 'column';
  gap?: string;
  justifyContent?: string;
  alignItems?: string;
  boxShadow?: string;
  customCss?: string;
  href?: string;
  src?: string;
  alt?: string;
  hidden?: boolean;
}

export interface EditableElementConfig {
  id: string;
  label: string;
  section: string;
  type: 'section' | 'container' | 'heading' | 'paragraph' | 'button' | 'image' | 'badge' | 'card' | 'grid';
  parentId?: string;
  defaultText?: string;
  defaultStyles?: StyleOverride;
}

export interface PageCustomizationData {
  pageId: string;
  overrides: Record<string, StyleOverride>;
  responsiveOverrides?: {
    laptop?: Record<string, StyleOverride>;
    tablet?: Record<string, StyleOverride>;
    mobile?: Record<string, StyleOverride>;
  };
  customCss?: string;
  isPublished: boolean;
  version: number;
  updatedAt: string;
}

export interface SiteSettingsData {
  siteTitle: string;
  tagline: string;
  aboutIntro: string;
  aboutBio: string;
  email: string;
  whatsapp: string;
  location: string;
  status: string;
  avatarUrl: string;
  showAdminButton: boolean;
  adminButtonLabel?: string;
  primaryAccent: string; // e.g. "#8B5CF6"
  borderRadiusPreset: 'sharp' | 'subtle' | 'rounded' | 'pill';
  fontScale: 'compact' | 'normal' | 'relaxed';
  updatedAt: string;
}

export interface BlogPostItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  category: string;
  tags: string[];
  author: string;
  status: 'draft' | 'published' | 'archived';
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  views?: number;
}

export interface ContactMessageItem {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  read: boolean;
  archived: boolean;
  createdAt: string;
}

export interface AnalyticsEventItem {
  id: string;
  eventType: 'page_view' | 'contact_click' | 'project_click' | 'resume_download' | 'social_click';
  path: string;
  referrer?: string;
  device?: 'desktop' | 'tablet' | 'mobile';
  browser?: string;
  timestamp: string;
  targetId?: string;
}

export interface MediaAssetItem {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'document';
  size?: string;
  dimensions?: string;
  uploadedAt: string;
  category?: string;
}
