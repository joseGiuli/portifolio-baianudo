'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function HeroBackgroundVideo({
  playbackId, // mantido p/ não quebrar API, mas não é usado aqui
  className = '',
  posterUrl,
  objectPosition = 'bottom',
  fadeMs = 3000,
  delayMs = 500,
  finalOpacity = 1,
  startAt = 0,
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const prefersReduced = useReducedMotion();
  const videoRef = useRef(null);

  // Se quiser poster, continue passando via prop
  const poster = posterUrl || null;

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const setStart = () => {
      try {
        if (startAt > 0 && Math.abs(v.currentTime - startAt) > 0.25) {
          v.currentTime = startAt;
        }
      } catch {}
    };

    if (v.readyState >= 1) setStart();
    else v.addEventListener('loadedmetadata', setStart, { once: true });

    return () => v.removeEventListener?.('loadedmetadata', setStart);
  }, [startAt]);

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none select-none"
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: prefersReduced ? finalOpacity : finalOpacity }}
      transition={{
        duration: prefersReduced ? 0 : fadeMs / 1200,
        delay: prefersReduced ? 0 : delayMs / 1000,
        ease: 'easeOut',
      }}
      style={{ willChange: 'opacity' }}
    >
      <div
        className={`absolute inset-0 ${className}`}
        style={{ transform: 'translateZ(0)' }}
      >
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition,
            backgroundColor: 'transparent',
          }}
          src="/bg-hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onPlaying={() => setIsPlaying(true)}
        ></video>

        {/* Poster overlay: só renderiza se tiver posterUrl */}
        {poster && (
          <div
            className="absolute inset-0 z-10"
            style={{
              backgroundImage: `url('${poster}')`,
              backgroundSize: 'cover',
              backgroundPosition: objectPosition,
              opacity: isPlaying ? 0 : 1,
              transition: 'opacity 180ms ease',
              pointerEvents: 'none',
            }}
          />
        )}
      </div>
    </motion.div>
  );
}
