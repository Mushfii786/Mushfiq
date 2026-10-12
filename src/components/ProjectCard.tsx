import React from 'react';
import { motion } from 'framer-motion';
import { Project } from '../types';
import { ArrowUpRight } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  index?: number;
  onClick?: () => void;
}

export function ProjectCard({ project, index = 0, onClick }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 0.6,
        delay: (index % 3) * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      onClick={onClick}
      className="group relative flex flex-col p-3 pb-4 sm:p-4 sm:pb-5 rounded-3xl bg-[#111216]/95 border border-neutral-800 hover:border-[#2563EB]/70 shadow-[0_10px_30px_rgba(0,0,0,0.6)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.8),0_0_24px_rgba(37,99,235,0.25)] transition-all duration-300 active:scale-[0.98] cursor-pointer"
    >
      {/* Media Container */}
      <div className="relative aspect-[16/10] sm:aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800/80 shadow-inner">
        {/* Title Badge in Top-Left */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15 text-xs sm:text-sm font-medium text-white shadow-md">
          <div className="w-3.5 h-3.5 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
            <span className="text-[9px]">⌘</span>
          </div>
          <span>{project.title}</span>
        </div>

        {/* Action Icon in Top-Right */}
        <div className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white/80 group-hover:text-white group-hover:bg-[#2563EB] group-hover:border-[#2563EB] flex items-center justify-center transition-all duration-300">
          <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>

        {/* Project Thumbnail Image */}
        <img
          src={project.image}
          alt={project.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Category Pill at Bottom-Left of Image */}
        <div className="absolute bottom-3 left-3 z-10 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono text-neutral-300">
          {project.category}
        </div>
      </div>

      {/* Card Info & Descriptions */}
      <div className="flex flex-col gap-2.5 mt-3.5 px-1 font-sans">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
            {project.subtitle || project.title}
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        </div>

        <div className="flex items-center justify-between text-xs text-neutral-500 pt-2 border-t border-neutral-800/80">
          <span className="truncate max-w-[200px] text-neutral-400">{project.role}</span>
          <span className="font-mono text-neutral-400 shrink-0">{project.year}</span>
        </div>
      </div>
    </motion.div>
  );
}

