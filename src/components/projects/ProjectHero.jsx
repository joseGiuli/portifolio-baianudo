// src/components/projects/CaseHero.jsx
'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function CaseHero({
  title,
  subtitle,
  meta = [], // [{ label, value }]
  backLabel = 'Voltar para projetos',
  className = '',
}) {
  return (
    <section className={`relative -lg:pt-20 ${className}`}>
      <div className="mb-6">
        <Link
          href="/#projetos"
          scroll
          className="inline-flex items-center gap-2 text-neutral hover:text-vermelho transition-colors"
          aria-label={backLabel}
        >
          <ArrowLeft className="size-8" aria-hidden="true" />
          <span className="text-2xl lg:text-xl">{backLabel}</span>
        </Link>
      </div>

      {/* Título / Subtítulo */}
      <h1 className="text-vermelho font-bold text-5xl lg:text-3xl leading-tight tracking-tight">
        {title}
      </h1>

      {subtitle && (
        <p className="text-neutral text-4xl lg:text-2xl mt-2 max-w-4xl">
          {subtitle}
        </p>
      )}

      {/* Metadados */}
      {meta?.length > 0 && (
        <div className="mt-8 grid grid-cols-1 gap-y-6 gap-x-8 -lg:grid-cols-4">
          {meta.map(({ label, value }) => (
            <div key={label}>
              <p className="text-vermelho text-xl lg:text-base">{label}</p>
              <p className="text-neutral text-xl lg:text-base mt-1">{value}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
