import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, Github, User, Tag, Sparkles } from 'lucide-react';
import { Project } from '../types';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  if (!project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-neutral-950/80 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10 my-auto"
        >
          {/* Header */}
          <div className="sticky top-0 z-20 flex justify-between items-center p-6 border-b border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-medium">
                  {project.category}
                </span>
                <span className="text-xs font-mono text-neutral-400">{project.year}</span>
              </div>
              <h3 className="text-xl md:text-2xl font-medium text-neutral-900 dark:text-white mt-1">
                {project.title}
              </h3>
            </div>

            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:scale-110 active:scale-90 transition-all duration-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="p-6 md:p-8 overflow-y-auto space-y-8">
            
            {/* Main Featured Image */}
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800">
              {project.image ? (
                <img
                  src={project.image}
                  alt={project.title}
                  width={1200}
                  height={675}
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              ) : null}
            </div>

            {/* Overview & Specs */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              <div className="lg:col-span-2 space-y-4">
                <h4 className="text-lg font-medium text-neutral-900 dark:text-white">
                  {project.subtitle}
                </h4>
                <p className="text-neutral-600 dark:text-neutral-300 text-base leading-relaxed">
                  {project.longDescription || project.description}
                </p>

                {/* Metrics */}
                {project.metrics && project.metrics.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    {project.metrics.map((metric, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/60 dark:border-neutral-700/60 hover:scale-105 transition-transform duration-200 cursor-default">
                        <p className="text-2xl md:text-3xl font-mono font-bold text-neutral-900 dark:text-white">
                          {metric.value}
                        </p>
                        <p className="text-xs text-neutral-500 font-medium mt-1">
                          {metric.label}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Sidebar Metadata */}
              <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/60 dark:border-neutral-700/60 space-y-5 h-fit">
                <div>
                  <p className="text-xs font-mono text-neutral-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" /> Role
                  </p>
                  <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                    {project.role}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-mono text-neutral-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" /> Tech Stack
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {project.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-md bg-white dark:bg-neutral-700 text-[11px] font-mono text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-600 hover:scale-105 transition-transform duration-200 cursor-default"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* External Action Links */}
                <div className="pt-4 space-y-2 border-t border-neutral-200 dark:border-neutral-700">
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-medium flex items-center justify-center gap-2 hover:bg-neutral-800 dark:hover:bg-neutral-200 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                    >
                      <span>Visit Live Experience</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}

                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-medium flex items-center justify-center gap-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>View Code Repository</span>
                    </a>
                  )}
                </div>
              </div>

            </div>

            {/* Extra Gallery Photos */}
            {project.gallery && project.gallery.length > 0 && (
              <div className="space-y-4 pt-6 border-t border-neutral-200 dark:border-neutral-800">
                <h4 className="text-sm font-mono text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-500" /> Visual Case Shots
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.gallery.map((imgUrl, i) => (
                    imgUrl ? (
                      <div key={i} className="aspect-[16/10] rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 hover:scale-[1.03] transition-transform duration-300">
                        <img
                          src={imgUrl}
                          alt={`Gallery ${i}`}
                          width={800}
                          height={500}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : null
                  ))}
                </div>
              </div>
            )}

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
