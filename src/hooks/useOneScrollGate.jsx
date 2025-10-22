'use client';

import { useEffect, useRef, useState } from 'react';

export default function useOneScrollGate({
  enabled = true,
  targetId, // id da próxima seção (ex.: 'secao-2')
  headerOffset = 0, // se você tem header fixo
  topThreshold = 24, // tolerância para considerar "no topo"
  lockMs = 1600, // tempo de fallback (combine com sua animação)
}) {
  const [locked, setLocked] = useState(false);
  const startYRef = useRef(0);
  const lockRef = useRef(false);
  const unlockTO = useRef(null);
  const observerRef = useRef(null);

  const scrollToNext = () => {
    const el = targetId ? document.getElementById(targetId) : null;
    if (!el) return;

    const y = el.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });

    // Desbloqueia quando a próxima seção estiver 60% visível
    try {
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver(
        entries => {
          const entry = entries[0];
          if (entry && entry.isIntersecting) {
            unlock();
          }
        },
        { root: null, threshold: 0.6 },
      );
      observerRef.current.observe(el);
    } catch {
      // fallback somente por segurança
    }

    // Fallback de tempo
    clearTimeout(unlockTO.current);
    unlockTO.current = setTimeout(unlock, lockMs);
  };

  const unlock = () => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
    clearTimeout(unlockTO.current);
    lockRef.current = false;
    setLocked(false);
  };

  useEffect(() => {
    if (!enabled) return;

    const atTop = () => window.scrollY <= topThreshold;

    const triggerOnce = preventDefaultFn => {
      if (lockRef.current) {
        preventDefaultFn?.();
        return;
      }
      if (atTop()) {
        preventDefaultFn?.();
        lockRef.current = true;
        setLocked(true);
        scrollToNext();
      }
    };

    const onWheel = e => {
      // deltaY > 0 = scroll para baixo
      if (atTop() && e.deltaY > 0) {
        // precisamos do passive: false para conseguir dar preventDefault
        e.preventDefault();
        triggerOnce(() => e.preventDefault());
      } else if (lockRef.current) {
        e.preventDefault();
      }
    };

    const onKeyDown = e => {
      // Captura teclas comuns de scroll para baixo
      if ([' ', 'PageDown', 'ArrowDown'].includes(e.key) && atTop()) {
        e.preventDefault();
        triggerOnce(() => e.preventDefault());
      } else if (
        lockRef.current &&
        [' ', 'PageDown', 'ArrowDown'].includes(e.key)
      ) {
        e.preventDefault();
      }
    };

    const onTouchStart = e => {
      startYRef.current = e.touches?.[0]?.clientY ?? 0;
    };

    const onTouchMove = e => {
      const currentY = e.touches?.[0]?.clientY ?? 0;
      const dy = startYRef.current - currentY; // positivo = gesto para baixo
      if (atTop() && dy > 6) {
        e.preventDefault();
        triggerOnce(() => e.preventDefault());
      } else if (lockRef.current) {
        e.preventDefault();
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKeyDown, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });

    // opcional: evitar overscroll elástico no topo
    const prevOverscroll = document.documentElement.style.overscrollBehaviorY;
    document.documentElement.style.overscrollBehaviorY = 'contain';

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      document.documentElement.style.overscrollBehaviorY = prevOverscroll;
      if (observerRef.current) observerRef.current.disconnect();
      clearTimeout(unlockTO.current);
    };
  }, [enabled, targetId, headerOffset, topThreshold, lockMs]);

  // Exponho locked para você refletir no UI (desabilitar botão/alterar cursor)
  return locked;
}
