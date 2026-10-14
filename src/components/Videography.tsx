import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Video } from 'lucide-react';
import { videography } from '../config/site';
import { VideoItem } from '../types';
import { VideoLightbox } from './VideoLightbox';
import { VideoGalleryPage } from './VideoGalleryPage';
import { CoverFlowGallery, CoverFlowItem } from './CoverFlowGallery';

export function Videography() {
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [showFullGallery, setShowFullGallery] = useState(false);
  const [videoCoverFlowData, setVideoCoverFlowData] = useState<CoverFlowItem[]>(() => {
    try {
      const saved = localStorage.getItem('mushfiq_custom_videos_catalog_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.slice(0, 15).map((v: any) => {
            const item = v.id === 'vgal-2-2' && (!v.videoUrl || !v.videoUrl.includes('pinterest'))
              ? {
                  ...v,
                  title: "VI-SION '26 | ARTS FEST",
                  url: "https://i.pinimg.com/736x/7a/ff/18/7aff185089bc242823fb53b6bfb29071.jpg",
                  videoUrl: "https://assets.pinterest.com/ext/embed.html?id=897131188296515260",
                  caption: "VI-SION '26 Arts Fest cinematic reel and festival highlight visual."
                }
              : v;
            return {
              id: item.id,
              title: item.title,
              subtitle: item.caption ? item.caption : `${item.location || item.category || ''} ${item.year ? '• ' + item.year : ''}`.trim(),
              category: item.category,
              url: item.url || item.posterUrl,
              type: 'video',
              data: item,
            };
          });
        }
      }
    } catch (e) {}
    return videography.map((v) => ({
      id: v.id,
      title: v.title,
      subtitle: `${v.location} • ${v.year}`,
      category: v.category,
      url: v.posterUrl,
      type: 'video',
      data: v,
    }));
  });

  useEffect(() => {
    const handleOpenGallery = () => {
      setShowFullGallery(true);
    };
    const handleSync = () => {
      try {
        const saved = localStorage.getItem('mushfiq_custom_videos_catalog_v2');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setVideoCoverFlowData(
              parsed.slice(0, 15).map((v: any) => {
                const item = v.id === 'vgal-2-2' && (!v.videoUrl || !v.videoUrl.includes('pinterest'))
                  ? {
                      ...v,
                      title: "VI-SION '26 | ARTS FEST",
                      url: "https://i.pinimg.com/736x/7a/ff/18/7aff185089bc242823fb53b6bfb29071.jpg",
                      videoUrl: "https://assets.pinterest.com/ext/embed.html?id=897131188296515260",
                      caption: "VI-SION '26 Arts Fest cinematic reel and festival highlight visual."
                    }
                  : v;
                return {
                  id: item.id,
                  title: item.title,
                  subtitle: item.caption ? item.caption : `${item.location || item.category || ''} ${item.year ? '• ' + item.year : ''}`.trim(),
                  category: item.category,
                  url: item.url || item.posterUrl,
                  type: 'video',
                  data: item,
                };
              })
            );
          }
        }
      } catch (e) {}
    };

    window.addEventListener('open-video-gallery', handleOpenGallery);
    window.addEventListener('sync-custom-videos', handleSync);
    return () => {
      window.removeEventListener('open-video-gallery', handleOpenGallery);
      window.removeEventListener('sync-custom-videos', handleSync);
    };
  }, []);

  return (
    <section id="videography" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto relative overflow-hidden select-none border-t border-neutral-800/60">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#2563EB]/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-4">
        
        {/* Top Eyebrow Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2563EB]/10 border border-[#2563EB]/30 text-[#2563EB] text-xs font-sans font-semibold tracking-wider uppercase hover:scale-105 transition-transform duration-200 cursor-default"
        >
          <Video className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>CINEMATIC REELS</span>
        </motion.div>

        {/* Big Display Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white uppercase leading-[1.05]"
        >
          VIDEOGRAPHY works
        </motion.h2>
      </div>

      {/* Premium 3D Cover Flow Deck Container matching Photography Showcase */}
      <CoverFlowGallery
        items={videoCoverFlowData}
        badgeTitle="VIDEOGRAPHY WORKS"
        onSelectItem={(item) => {
          if (item.data) {
            setActiveVideo(item.data);
          }
        }}
        autoPlayInterval={5000}
      />

      {/* Action Buttons: SEE MORE VIDEOGRAPHY */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-8 sm:mt-10">
        <button
          onClick={() => {
            setShowFullGallery(true);
          }}
          className="group relative overflow-hidden px-6 sm:px-7 py-2.5 sm:py-3 rounded-full bg-neutral-950/90 text-white border border-white/15 hover:border-[#2563EB]/70 text-[11px] sm:text-xs font-['Syne'] font-bold tracking-[0.18em] uppercase transition-all duration-300 cursor-pointer shadow-[0_0_20px_rgba(0,0,0,0.8)] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:scale-[1.03] active:scale-95 inline-flex items-center gap-2.5 sm:gap-3 backdrop-blur-md"
        >
          {/* Animated Sheen Overlay */}
          <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-[#2563EB]/25 to-transparent transition-transform duration-1000 ease-in-out pointer-events-none" />
          
          <span className="relative z-10 text-white group-hover:text-blue-300 transition-colors duration-300">
            SEE MORE VIDEOGRAPHY
          </span>
          <div className="relative z-10 w-6 h-6 rounded-full bg-white/5 border border-white/10 group-hover:bg-[#2563EB] group-hover:border-[#2563EB] flex items-center justify-center transition-all duration-300">
            <ArrowRight className="w-3 h-3 text-blue-400 group-hover:text-white transition-transform duration-300 group-hover:translate-x-0.5" />
          </div>
        </button>
      </div>

      {/* Modal Video Lightbox */}
      {activeVideo && (
        <VideoLightbox
          video={activeVideo}
          videos={videography}
          onClose={() => setActiveVideo(null)}
          onSelectVideo={(v) => setActiveVideo(v)}
        />
      )}

      {/* Dedicated Videography Gallery Page View */}
      {showFullGallery && (
        <VideoGalleryPage
          onClose={() => setShowFullGallery(false)}
        />
      )}

    </section>
  );
}
