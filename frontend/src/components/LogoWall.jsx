import React from 'react';

const TECHNOLOGIES = [
  { key: 'HTML5', label: 'HTML5' },
  { key: 'CSS3', label: 'CSS3' },
  { key: 'javaScript', label: 'JavaScript' },
  { key: 'react', label: 'React.js' },
  { key: 'nodejs', label: 'Node.js' },
  { key: 'supabase', label: 'Supabase' },
  { key: 'git', label: 'Git' },
  { key: 'tailwindcss', label: 'TailwindCSS' },
  { key: 'vercel', label: 'Vercel' },
];

export function LogoWall() {
  const repeated = [...TECHNOLOGIES, ...TECHNOLOGIES];

  return (
    <div className="relative overflow-x-hidden py-8">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 md:w-32 bg-gradient-to-r from-[var(--background)] to-transparent z-20" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 md:w-32 bg-gradient-to-l from-[var(--background)] to-transparent z-20" />

      <div className="flex animate-scroll w-max will-change-transform">
        {repeated.map((tech, index) => (
          <div
            key={`${tech.key}-${index}`}
            className="flex items-center gap-2.5 pr-12 md:pr-20 group transition-all duration-300"
            aria-hidden={index >= TECHNOLOGIES.length ? 'true' : 'false'}
          >
            <img
              src={`/svg/${tech.key}.svg`}
              alt={tech.label}
              className="h-7 w-auto object-contain transition-transform group-hover:scale-110 opacity-65"
              width="28"
              height="28"
              loading={index < TECHNOLOGIES.length ? 'eager' : 'lazy'}
              decoding="async"
            />
            <span className="text-lg font-medium text-[var(--white-icon)] whitespace-nowrap">
              {tech.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
