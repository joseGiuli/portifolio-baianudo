'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MotionFillButton({
  children,
  onClick,
  className = '',
  ariaLabel,
  // preenchimento
  fillClassName = 'bg-red-600', // usa classes Tailwind (ou gradiente)
  fillColor, // cor arbitrária (#hex/rgb/hsl), se não usar classe
  textOnFillClassName = '', // ex.: "group-hover:text-black"

  // borda
  borderClassName = 'border-white', // ex.: "border-blue-600 border-2"
  borderColor, // cor arbitrária (#hex/rgb/hsl). Se definido, sobrepõe a classe

  as = 'button',
  href,
  target,
  rel,
}) {
  const [hovered, setHovered] = useState(false);

  const baseClasses = `
    relative isolate overflow-hidden rounded-xl border ${borderClassName} bg-transparent
    px-8 lg:px-4 lg:py-3 py-4 text-white shadow-md outline-none transition-transform duration-200
    focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2
    will-change-transform group ${className}
  `;

  const content = (
    <>
      <span
        className={`relative z-10 transition-colors duration-200 ${textOnFillClassName}`}
      >
        {children}
      </span>

      <AnimatePresence initial={false}>
        {hovered && (
          <motion.span
            key="fill"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }} // recolhe da direita → esquerda
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className={`pointer-events-none absolute inset-0 z-0 rounded-xl ${fillClassName || ''}`}
            style={
              fillClassName
                ? undefined
                : fillColor
                  ? { background: fillColor }
                  : undefined
            }
          />
        )}
      </AnimatePresence>
    </>
  );

  const commonProps = {
    className: baseClasses,
    style: borderColor ? { borderColor } : undefined,
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    onClick,
    'aria-label': ariaLabel,
  };

  return as === 'a' ? (
    <motion.a
      {...commonProps}
      href={href}
      target={target}
      rel={rel}
      whileTap={{ scale: 0.98 }}
    >
      {content}
    </motion.a>
  ) : (
    <motion.button {...commonProps} type="button" whileTap={{ scale: 0.98 }}>
      {content}
    </motion.button>
  );
}
