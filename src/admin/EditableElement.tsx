import React, { useRef, useState, useEffect } from 'react';
import { useAdmin } from './AdminContext';
import { getElementConfig } from './elementRegistry';
import { StyleOverride } from './types';
import { Edit3, RotateCcw, Check, Sparkles } from 'lucide-react';

interface EditableElementProps {
  id: string;
  defaultText?: string;
  children?: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  style?: React.CSSProperties;
  [key: string]: any;
}

export function EditableElement({
  id,
  defaultText,
  children,
  className = '',
  as: Component = 'div',
  style = {},
  ...rest
}: EditableElementProps) {
  const {
    isStudioOpen,
    isPreviewMode,
    selectedElementId,
    setSelectedElementId,
    hoveredElementId,
    setHoveredElementId,
    getEffectiveOverride,
    updateElementOverride,
    resetElementOverride,
  } = useAdmin();

  const elementRef = useRef<HTMLElement>(null);
  const [isEditingInline, setIsEditingInline] = useState(false);
  const [inlineValue, setInlineValue] = useState('');

  const config = getElementConfig(id);
  const override = getEffectiveOverride(id);

  const isSelected = isStudioOpen && !isPreviewMode && selectedElementId === id;
  const isHovered = isStudioOpen && !isPreviewMode && hoveredElementId === id && !isSelected;

  // Determine text content
  const currentText = override?.text !== undefined ? override.text : defaultText;

  // Sync inline edit value
  useEffect(() => {
    if (isEditingInline) {
      setInlineValue(currentText || '');
    }
  }, [isEditingInline, currentText]);

  // Compute merged styles from overrides
  const computedStyle: React.CSSProperties = {
    ...style,
    ...(override?.fontSize ? { fontSize: override.fontSize } : {}),
    ...(override?.fontWeight ? { fontWeight: override.fontWeight } : {}),
    ...(override?.color ? { color: override.color } : {}),
    ...(override?.backgroundColor ? { backgroundColor: override.backgroundColor } : {}),
    ...(override?.textAlign ? { textAlign: override.textAlign } : {}),
    ...(override?.lineHeight ? { lineHeight: override.lineHeight } : {}),
    ...(override?.letterSpacing ? { letterSpacing: override.letterSpacing } : {}),
    ...(override?.padding ? { padding: override.padding } : {}),
    ...(override?.margin ? { margin: override.margin } : {}),
    ...(override?.borderRadius ? { borderRadius: override.borderRadius } : {}),
    ...(override?.borderColor ? { borderColor: override.borderColor } : {}),
    ...(override?.borderWidth ? { borderWidth: override.borderWidth, borderStyle: 'solid' } : {}),
    ...(override?.opacity !== undefined ? { opacity: override.opacity } : {}),
    ...(override?.width ? { width: override.width } : {}),
    ...(override?.maxWidth ? { maxWidth: override.maxWidth } : {}),
    ...(override?.height ? { height: override.height } : {}),
    ...(override?.boxShadow ? { boxShadow: override.boxShadow } : {}),
    ...(override?.hidden ? { display: 'none' } : {}),
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isStudioOpen && !isPreviewMode) {
      e.stopPropagation();
      e.preventDefault();
      setSelectedElementId(id);
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (isStudioOpen && !isPreviewMode && (config?.type === 'heading' || config?.type === 'paragraph' || config?.type === 'button' || config?.type === 'badge')) {
      e.stopPropagation();
      e.preventDefault();
      setIsEditingInline(true);
    }
  };

  const handleInlineBlur = () => {
    setIsEditingInline(false);
    if (inlineValue !== currentText) {
      updateElementOverride(id, { text: inlineValue });
    }
  };

  const handleInlineKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleInlineBlur();
    } else if (e.key === 'Escape') {
      setIsEditingInline(false);
    }
  };

  if (!isStudioOpen || isPreviewMode) {
    // Visitor Mode: Pure render with overrides applied
    return (
      <Component
        ref={elementRef}
        className={className}
        style={computedStyle}
        {...rest}
      >
        {currentText !== undefined && (typeof children === 'string' || !children) ? currentText : children}
      </Component>
    );
  }

  // Visual Editor Active Mode
  return (
    <Component
      ref={elementRef}
      className={`relative transition-all duration-150 cursor-pointer ${className} ${
        isSelected
          ? 'outline outline-2 outline-purple-500 ring-2 ring-purple-500/30 z-30'
          : isHovered
          ? 'outline outline-1 outline-dashed outline-purple-400/80 z-20'
          : ''
      }`}
      style={computedStyle}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={(e: React.MouseEvent) => {
        e.stopPropagation();
        setHoveredElementId(id);
      }}
      onMouseLeave={() => {
        if (hoveredElementId === id) setHoveredElementId(null);
      }}
      data-editable-id={id}
      data-editable-label={config?.label || id}
      {...rest}
    >
      {/* Floating Selection Badge */}
      {isSelected && (
        <div
          className="absolute -top-7 left-0 z-50 flex items-center gap-1.5 px-2 py-0.5 rounded bg-purple-600 text-white font-mono text-[10px] shadow-lg pointer-events-auto select-none"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="font-semibold">{config?.label || id}</span>
          <span className="opacity-70 text-[9px] uppercase tracking-wider">{config?.type || 'element'}</span>
          
          {override && Object.keys(override).length > 0 && (
            <button
              onClick={() => resetElementOverride(id)}
              title="Reset styles to default"
              className="ml-1 p-0.5 hover:bg-purple-700 rounded transition-colors text-white/90"
            >
              <RotateCcw className="w-2.5 h-2.5" />
            </button>
          )}
        </div>
      )}

      {/* Floating Hover Badge */}
      {isHovered && !isSelected && (
        <div className="absolute -top-6 left-0 z-40 px-1.5 py-0.5 rounded bg-neutral-900/90 border border-purple-500/50 text-purple-300 font-mono text-[9px] pointer-events-none select-none">
          {config?.label || id}
        </div>
      )}

      {/* Inline Text Editing */}
      {isEditingInline ? (
        <input
          autoFocus
          type="text"
          value={inlineValue}
          onChange={(e) => setInlineValue(e.target.value)}
          onBlur={handleInlineBlur}
          onKeyDown={handleInlineKeyDown}
          onClick={(e) => e.stopPropagation()}
          className="w-full bg-black/80 text-white outline-none border border-purple-500 px-2 py-1 rounded font-inherit"
          style={{ fontSize: 'inherit', fontWeight: 'inherit', color: 'inherit' }}
        />
      ) : currentText !== undefined && (typeof children === 'string' || !children) ? (
        currentText
      ) : (
        children
      )}
    </Component>
  );
}
