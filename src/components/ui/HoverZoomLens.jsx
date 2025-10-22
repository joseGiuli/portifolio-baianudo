// src/components/ui/HoverZoomLens.jsx
'use client';

import { useRef, useState, useLayoutEffect, useEffect } from 'react';
import Image from 'next/image';

export default function HoverZoomLens({
  src,
  alt = '',
  width,
  height,
  largeSrc,
  zoom = 2.2,
  lensSize = 120,
  lensBorder = 1,
  className = '',
  lensClassName = 'border border-vermelho',
  disableOnTouch = true,
  offsetX = 0, // finos ajustes manuais se precisar (px)
  offsetY = 0,
}) {
  const wrapRef = useRef(null);
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [box, setBox] = useState({ w: 0, h: 0 });

  // medir o tamanho renderizado do container da imagem
  useLayoutEffect(() => {
    if (!wrapRef.current) return;
    const el = wrapRef.current;

    const update = () => {
      const r = el.getBoundingClientRect();
      setBox({ w: r.width, h: r.height });
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // pré-carrega a imagem hi-res
  useEffect(() => {
    if (!largeSrc) return;
    const img = new window.Image();
    img.src = largeSrc;
  }, [largeSrc]);

  const ratioX = width && box.w ? width / box.w : 1;
  const ratioY = height && box.h ? height / box.h : 1;
  const half = (lensSize - lensBorder) / 2; // 👈 compensa a borda

  const clampToBox = (clientX, clientY) => {
    const rect = wrapRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const cx = Math.max(half, Math.min(x, rect.width - half));
    const cy = Math.max(half, Math.min(y, rect.height - half));
    return { x: Math.round(cx), y: Math.round(cy) };
  };

  const onEnter = () => {
    if (disableOnTouch && 'ontouchstart' in window) return;
    setShow(true);
  };
  const onLeave = () => setShow(false);
  const onMove = e => {
    if (!wrapRef.current) return;
    const p = e.touches ? e.touches[0] : e;
    setPos(clampToBox(p.clientX, p.clientY));
  };

  // fundo ampliado em px (sempre consistente)
  const scaleX = zoom * ratioX;
  const scaleY = zoom * ratioY;
  const bgW = box.w * scaleX;
  const bgH = box.h * scaleY;

  // centraliza o ponto sob o cursor dentro da lente (compensando borda)
  const bgX = -(pos.x * scaleX - half) + offsetX;
  const bgY = -(pos.y * scaleY - half) + offsetY;

  return (
    <div
      ref={wrapRef}
      className={`relative overflow-hidden rounded-2xl ${className}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onMouseMove={onMove}
      onTouchStart={disableOnTouch ? undefined : onEnter}
      onTouchEnd={disableOnTouch ? undefined : onLeave}
      onTouchMove={disableOnTouch ? undefined : onMove}
    >
      {/* Imagem base */}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="w-full h-auto select-none pointer-events-none"
        quality={100}
        priority
      />

      {/* Lente */}
      {show && (
        <div
          className={`pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-md shadow-xl ${lensClassName}`}
          style={{
            left: pos.x,
            top: pos.y,
            width: lensSize,
            height: lensSize,
            backgroundImage: `url(${largeSrc || src})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: `${bgW}px ${bgH}px`,
            backgroundPosition: `${bgX}px ${bgY}px`,
            willChange: 'background-position',
            boxShadow:
              '0 0 0 2px rgba(255,255,255,0.10), 0 10px 24px rgba(0,0,0,0.35)',
          }}
        />
      )}
    </div>
  );
}
