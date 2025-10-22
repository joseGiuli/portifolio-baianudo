'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function ScrollDownIndicator({
  className = '',
  label = 'Scroll Down',
}) {
  const prefersReduced = useReducedMotion();

  // timeline (em segundos)
  const GAP = 0.5; // intervalo entre 1ª e 2ª seta (e texto)
  const IN = 0.5; // duração do fade-in
  const HOLD = 1; // quanto tempo fica visível após aparecer o texto
  const OUT = 0.35; // duração do fade-out
  const TOTAL = GAP + IN + HOLD + OUT;

  // normalização (0 → 1) para o "times" do framer-motion
  const timesArrow1 = [0, IN / TOTAL, (GAP + IN + HOLD) / TOTAL, 1];
  const timesArrow2 = [
    GAP / TOTAL,
    (GAP + IN) / TOTAL,
    (GAP + IN + HOLD) / TOTAL,
    1,
  ];

  const base = {
    duration: TOTAL,
    ease: 'linear',
    repeat: Infinity,
    repeatDelay: 0.2,
  };

  if (prefersReduced) {
    // acessibilidade: sem animação
    return (
      <div
        className={`pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-6 flex flex-col items-center gap-2 text-white ${className}`}
      >
        <ChevronDown className="w-8 h-8" aria-hidden />
        <ChevronDown className="w-8 h-8" aria-hidden />
        <span className="mt-2 text-sm tracking-wide">{label}</span>
      </div>
    );
  }

  return (
    <div
      className={`pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-6 flex flex-col items-center gap-2 text-white ${className}`}
      aria-hidden
    >
      {/* 1ª seta */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ ...base, times: timesArrow1 }}
      >
        <ChevronDown className="w-8 h-8 lg:size-5" />
      </motion.div>

      {/* 2ª seta */}
      <motion.div
        className="-mt-6 lg:-mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ ...base, times: timesArrow2 }}
      >
        <ChevronDown className="w-8 h-8 lg:size-5" />
      </motion.div>

      <motion.span
        className="text-lg lg:text-[14px] w-max tracking-wide lg:-mt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ ...base, times: timesArrow2 }}
      >
        {label}
      </motion.span>
    </div>
  );
}
