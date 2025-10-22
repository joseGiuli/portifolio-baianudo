'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const MuxPlayer = dynamic(() => import('@mux/mux-player-react/lazy'), {
  ssr: false,
});

export default function HeroBackgroundVideo({
  playbackId,
  className = '',
  posterUrl,
  objectPosition = 'bottom',
  fadeMs = 3000, // duração do fade
  delayMs = 500, // atraso opcional
  finalOpacity = 1, // opacidade final do BG (ex.: 0.2)
  startAt = 0, // início do vídeo (segundos)
  posterTime, // se não passar, usa startAt
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const prefersReduced = useReducedMotion();

  const posterT = posterTime ?? startAt;
  const poster =
    posterUrl ??
    `https://image.mux.com/${playbackId}/thumbnail.jpg?time=${posterT}`;

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none select-none"
      aria-hidden="true"
      // fade começa na montagem
      initial={{ opacity: 0 }}
      animate={{ opacity: prefersReduced ? finalOpacity : finalOpacity }}
      transition={{
        duration: prefersReduced ? 0 : fadeMs / 800,
        delay: prefersReduced ? 0 : delayMs / 1000,
        ease: 'easeOut',
      }}
      style={{ willChange: 'opacity' }}
    >
      <div
        className={`absolute inset-0 ${className}`}
        style={{ transform: 'translateZ(0)' }}
      >
        <MuxPlayer
          data-pos={objectPosition}
          className="absolute inset-0 h-full w-full"
          style={{
            width: '100%',
            height: '100%',
            // força cover e posição dentro do shadow DOM do player
            '--media-object-fit': 'cover',
            '--media-object-position': objectPosition, // ex.: 'bottom' ou 'center bottom'
            backgroundColor: 'transparent',
          }}
          streamType="on-demand"
          playbackId={playbackId}
          startTime={startAt}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          controls={false}
          onPlaying={() => setIsPlaying(true)}
        />

        {/* Poster: presente desde o início e some suave quando o vídeo tocar */}
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
      </div>
    </motion.div>
  );
}
