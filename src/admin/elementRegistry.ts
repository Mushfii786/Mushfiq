import { EditableElementConfig } from './types';

export const EDITABLE_ELEMENTS: EditableElementConfig[] = [
  // Hero Section Elements
  {
    id: 'hero.section',
    label: 'Hero Section',
    section: 'Hero',
    type: 'section',
    defaultStyles: {
      backgroundColor: '#050505',
      padding: '80px 16px',
    }
  },
  {
    id: 'hero.badge',
    label: 'Status Glass Badge',
    section: 'Hero',
    type: 'badge',
    parentId: 'hero.section',
    defaultText: 'Available for Freelance Projects',
    defaultStyles: {
      color: '#A1A1AA',
      fontSize: '12px',
      padding: '6px 14px',
      borderRadius: '9999px',
    }
  },
  {
    id: 'hero.heading1',
    label: 'Headline Part 1',
    section: 'Hero',
    type: 'heading',
    parentId: 'hero.section',
    defaultText: 'Crafting Unforgettable',
    defaultStyles: {
      fontSize: '56px',
      fontWeight: '800',
      color: '#FFFFFF',
      textAlign: 'center',
      lineHeight: '1.08',
      letterSpacing: '-0.02em',
    }
  },
  {
    id: 'hero.heading2',
    label: 'Headline Part 2',
    section: 'Hero',
    type: 'heading',
    parentId: 'hero.section',
    defaultText: 'Visuals Through',
    defaultStyles: {
      fontSize: '56px',
      fontWeight: '800',
      color: '#FFFFFF',
      textAlign: 'center',
      lineHeight: '1.08',
      letterSpacing: '-0.02em',
    }
  },
  {
    id: 'hero.gradientText',
    label: 'Headline Accent Line',
    section: 'Hero',
    type: 'heading',
    parentId: 'hero.section',
    defaultText: 'Photography, Videography & Editing',
    defaultStyles: {
      fontSize: '48px',
      fontWeight: '800',
      color: '#8B5CF6',
      textAlign: 'center',
      lineHeight: '1.1',
    }
  },
  {
    id: 'hero.description',
    label: 'Hero Intro Paragraph',
    section: 'Hero',
    type: 'paragraph',
    parentId: 'hero.section',
    defaultText: "Hi, I'm Mushfiq. I transform ideas into cinematic visuals through video editing, photography, videography, photo editing, and creative design.",
    defaultStyles: {
      fontSize: '16px',
      fontWeight: '300',
      color: '#A1A1AA',
      textAlign: 'center',
      lineHeight: '1.6',
    }
  },
  {
    id: 'hero.ctaPrimary',
    label: 'Explore Works Button',
    section: 'Hero',
    type: 'button',
    parentId: 'hero.section',
    defaultText: 'Explore Works',
    defaultStyles: {
      backgroundColor: '#8B5CF6',
      color: '#FFFFFF',
      borderRadius: '9999px',
      padding: '12px 28px',
      fontSize: '14px',
      fontWeight: '600',
    }
  },
  {
    id: 'hero.ctaSecondary',
    label: 'Contact Me Button',
    section: 'Hero',
    type: 'button',
    parentId: 'hero.section',
    defaultText: 'Get in Touch',
    defaultStyles: {
      backgroundColor: 'rgba(255,255,255,0.06)',
      color: '#FFFFFF',
      borderRadius: '9999px',
      padding: '12px 28px',
      fontSize: '14px',
      fontWeight: '600',
    }
  },

  // About Section Elements
  {
    id: 'about.section',
    label: 'About Section',
    section: 'About',
    type: 'section',
    defaultStyles: {
      backgroundColor: '#0a0a0a',
      padding: '96px 16px',
    }
  },
  {
    id: 'about.heading',
    label: 'About Section Heading',
    section: 'About',
    type: 'heading',
    parentId: 'about.section',
    defaultText: 'Beyond The Lens',
    defaultStyles: {
      fontSize: '42px',
      fontWeight: '700',
      color: '#FFFFFF',
      textAlign: 'center',
    }
  },
  {
    id: 'about.intro',
    label: 'About Intro Paragraph',
    section: 'About',
    type: 'paragraph',
    parentId: 'about.section',
    defaultText: "Hi, I'm Mushfiq, a multidisciplinary creative specializing in photography, videography, video editing, photo editing, and visual design.",
    defaultStyles: {
      fontSize: '16px',
      color: '#D4D4D8',
      lineHeight: '1.7',
    }
  },
  {
    id: 'about.bio',
    label: 'About Academic & Journey Bio',
    section: 'About',
    type: 'paragraph',
    parentId: 'about.section',
    defaultText: "Alongside my creative journey, I have been pursuing Hudawi studies since 2019 at Al Hidaya Islamic Academy, Kalamassery, Ernakulam.",
    defaultStyles: {
      fontSize: '15px',
      color: '#A1A1AA',
      lineHeight: '1.7',
    }
  },

  // Projects Section Elements
  {
    id: 'projects.section',
    label: 'Selected Works Section',
    section: 'Projects',
    type: 'section',
    defaultStyles: {
      backgroundColor: '#050505',
      padding: '96px 16px',
    }
  },
  {
    id: 'projects.heading',
    label: 'Projects Heading',
    section: 'Projects',
    type: 'heading',
    parentId: 'projects.section',
    defaultText: 'Selected Works & Case Studies',
    defaultStyles: {
      fontSize: '44px',
      fontWeight: '800',
      color: '#FFFFFF',
    }
  },
  {
    id: 'projects.subheading',
    label: 'Projects Subtitle',
    section: 'Projects',
    type: 'paragraph',
    parentId: 'projects.section',
    defaultText: 'A curation of digital products, editorial platforms, WebGL canvases, and design systems.',
    defaultStyles: {
      fontSize: '15px',
      color: '#A1A1AA',
    }
  },

  // Videography Section
  {
    id: 'videography.section',
    label: 'Videography & Reels Section',
    section: 'Videography',
    type: 'section',
    defaultStyles: {
      backgroundColor: '#080808',
      padding: '96px 16px',
    }
  },
  {
    id: 'videography.heading',
    label: 'Videography Heading',
    section: 'Videography',
    type: 'heading',
    parentId: 'videography.section',
    defaultText: 'Cinematic Motion & Reels',
    defaultStyles: {
      fontSize: '40px',
      fontWeight: '800',
      color: '#FFFFFF',
    }
  },

  // Contact Section
  {
    id: 'contact.section',
    label: 'Contact Section',
    section: 'Contact',
    type: 'section',
    defaultStyles: {
      backgroundColor: '#050505',
      padding: '96px 16px',
    }
  },
  {
    id: 'contact.heading',
    label: 'Contact Title',
    section: 'Contact',
    type: 'heading',
    parentId: 'contact.section',
    defaultText: "Let's Build Something Exceptional",
    defaultStyles: {
      fontSize: '44px',
      fontWeight: '800',
      color: '#FFFFFF',
    }
  },
  {
    id: 'contact.subheading',
    label: 'Contact Subtitle',
    section: 'Contact',
    type: 'paragraph',
    parentId: 'contact.section',
    defaultText: 'Available for freelance creative direction, video editing, photography, and high-impact web design.',
    defaultStyles: {
      fontSize: '15px',
      color: '#A1A1AA',
    }
  },

  // Footer Section
  {
    id: 'footer.section',
    label: 'Footer Section',
    section: 'Footer',
    type: 'section',
    defaultStyles: {
      backgroundColor: '#050505',
      padding: '64px 16px 32px 16px',
    }
  },
  {
    id: 'footer.brand',
    label: 'Footer Monogram Name',
    section: 'Footer',
    type: 'heading',
    parentId: 'footer.section',
    defaultText: 'MUSHFII',
    defaultStyles: {
      fontSize: '80px',
      fontWeight: '900',
      color: '#FFFFFF',
      letterSpacing: '0.05em',
    }
  },
  {
    id: 'footer.copyright',
    label: 'Footer Copyright Notice',
    section: 'Footer',
    type: 'paragraph',
    parentId: 'footer.section',
    defaultText: '© 2026 MUSHFII. Photography • Videography • Design',
    defaultStyles: {
      fontSize: '12px',
      color: '#A1A1AA',
    }
  }
];

export function getElementConfig(id: string): EditableElementConfig | undefined {
  return EDITABLE_ELEMENTS.find((el) => el.id === id);
}
