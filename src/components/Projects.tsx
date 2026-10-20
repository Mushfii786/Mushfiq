import React, { useState, useMemo, useCallback, memo } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { photography, videography } from '../config/site';
import { Project, Photo, VideoItem } from '../types';
const ProjectModal = React.lazy(() => import('./ProjectModal').then((m) => ({ default: m.ProjectModal })));
const PhotoLightbox = React.lazy(() => import('./PhotoLightbox').then((m) => ({ default: m.PhotoLightbox })));
const VideoLightbox = React.lazy(() => import('./VideoLightbox').then((m) => ({ default: m.VideoLightbox })));
const GalleryPage = React.lazy(() => import('./GalleryPage').then((m) => ({ default: m.GalleryPage })));
import { CoverFlowGallery, CoverFlowItem } from './CoverFlowGallery';
import RegeneratedImage from '../assets/images/regenerated_image_1786114032574.webp'; 
import RegeneratedImage2 from '../assets/images/regenerated_image_1786192879031.jpg'; 
import RegeneratedImage4 from '../assets/images/regenerated_image_1787841813563.webp';

export const Projects = memo(function Projects() {
  const photos = photography;

  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [activePhoto, setActivePhoto] = useState<Photo | null>(null);
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [showFullGallery, setShowFullGallery] = useState(false);

  // Derive published photos for the cover flow carousel
  const coverFlowData: CoverFlowItem[] = useMemo(() => {
    const published = photos.filter((p) => p.published);
    if (published.length > 0) {
      return published.slice(0, 15).map((p) => ({
        id: p.id,
        title: p.title,
        subtitle: p.caption || p.location || 'Photography',
        category: p.category || 'Photo',
        url: p.url,
        type: 'photo' as const,
        data: {
          id: p.id,
          title: p.title,
          category: p.category,
          url: p.url,
          caption: p.caption,
          location: p.location || '',
          camera: p.camera,
          lens: p.lens,
          settings: p.settings,
          year: p.year || '2026',
        },
      }));
    }
    // Fallback if empty
    return [
      {
        id: "cf-1",
        title: "Monsoon Mood",
        subtitle: "Malappuram, Kerala",
        category: "Photo",
        url: RegeneratedImage2,
        type: "photo",
        data: photography[0]
      },
      {
        id: "cf-2",
        title: "Kochi Metro",
        subtitle: "Kochi, Kerala",
        category: "Photo",
        url: RegeneratedImage4,
        type: "photo",
        data: photography[1]
      },
      {
        id: "cf-3",
        title: "Captured Moments",
        subtitle: "Frames by Mushfii",
        category: "Photo",
        url: RegeneratedImage,
        type: "photo",
        data: photography[2]
      },
    ];
  }, [photos]);

  const handleSelectItem = useCallback((item: CoverFlowItem) => {
    if (item.type === 'project' && item.data) {
      setActiveProject(item.data);
    } else if (item.type === 'video' && item.data) {
      setActiveVideo(item.data);
    } else if (item.data) {
      setActivePhoto(item.data);
    } else {
      setShowFullGallery(true);
    }
  }, []);

  return (
    <section id="projects" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto relative overflow-hidden select-none">
      
      {/* Background Ambient Glow (Pure GPU Radial Gradient instead of 150px CSS blur filter) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.14)_0%,transparent_70%)] pointer-events-none transform-gpu" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-4">
        
        {/* Big Display Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-neutral-900 dark:text-white uppercase leading-[1.05]"
        >
          BEYOND THE FRAME
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2563EB]/10 border border-[#2563EB]/25 text-[#2563EB] text-[10px] sm:text-xs font-mono font-semibold tracking-wider uppercase hover:scale-105 transition-transform duration-200 cursor-default mx-auto mt-2"
        >
          <Sparkles className="w-3 h-3 text-[#2563EB]" />
          <span>Photography & Videography Works</span>
        </motion.div>
      </div>

      {/* Interactive 3D Cover Flow Gallery */}
      <CoverFlowGallery
        items={coverFlowData}
        onSelectItem={handleSelectItem}
        autoPlayInterval={5000}
      />

      {/* SEE MORE Action Button */}
      <div className="text-center mt-6 sm:mt-8">
        <button
          onClick={() => setShowFullGallery(true)}
          className="group relative overflow-hidden px-5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-neutral-950/90 text-white border border-white/15 hover:border-[#2563EB]/70 text-[10px] sm:text-xs font-['Syne'] font-bold tracking-[0.15em] uppercase transition-all duration-300 cursor-pointer shadow-[0_0_20px_rgba(0,0,0,0.8)] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:scale-[1.03] active:scale-95 inline-flex items-center gap-2 sm:gap-2.5 backdrop-blur-md"
        >
          {/* Animated Sheen Overlay */}
          <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-[#2563EB]/25 to-transparent transition-transform duration-1000 ease-in-out pointer-events-none" />
          
          <span className="relative z-10 text-white group-hover:text-blue-300 transition-colors duration-300">
            SEE MORE WORKS
          </span>
          <div className="relative z-10 w-5 h-5 rounded-full bg-white/5 border border-white/10 group-hover:bg-[#2563EB] group-hover:border-[#2563EB] flex items-center justify-center transition-all duration-300">
            <ArrowRight className="w-2.5 h-2.5 text-blue-400 group-hover:text-white transition-transform duration-300 group-hover:translate-x-0.5" />
          </div>
        </button>
      </div>

      {/* Modal for Project Detail */}
      <React.Suspense fallback={null}>
        {activeProject && (
          <ProjectModal
            project={activeProject}
            onClose={() => setActiveProject(null)}
          />
        )}

        {/* Modal Lightbox for Video */}
        {activeVideo && (
          <VideoLightbox
            video={activeVideo}
            videos={videography}
            onClose={() => setActiveVideo(null)}
            onSelectVideo={(v) => setActiveVideo(v)}
          />
        )}

        {/* Modal Lightbox for Photo */}
        {activePhoto && (
          <PhotoLightbox
            photo={activePhoto}
            photos={photography}
            onClose={() => setActivePhoto(null)}
            onSelectPhoto={(p) => setActivePhoto(p)}
          />
        )}

        {/* Full Gallery Page View */}
        {showFullGallery && (
          <GalleryPage onClose={() => setShowFullGallery(false)} />
        )}
      </React.Suspense>

    </section>
  );
});

