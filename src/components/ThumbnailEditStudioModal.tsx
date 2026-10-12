import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { VideoThumbnailEditor } from './VideoThumbnailEditor';

interface ThumbnailEditStudioModalProps {
  isOpen: boolean;
  imageSrc: string;
  videoSrc?: string;
  onClose: () => void;
  onSave: (editedDataUrl: string) => void;
}

export function ThumbnailEditStudioModal({
  isOpen,
  imageSrc,
  videoSrc,
  onClose,
  onSave
}: ThumbnailEditStudioModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        data-lenis-prevent="true"
        className="fixed inset-0 z-[250] flex items-center justify-center p-2 sm:p-5 md:p-8 bg-black/90 backdrop-blur-2xl overflow-y-auto font-sans select-none text-white"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ type: 'spring', damping: 28, stiffness: 360 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-xl my-auto"
        >
          <VideoThumbnailEditor
            videoSrc={videoSrc}
            initialThumbnail={imageSrc}
            onDone={(finalDataUrl) => {
              onSave(finalDataUrl);
              onClose();
            }}
            onBack={onClose}
            mode="modal"
          />
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
