import React, { useState } from 'react';
import { ArrowRight, Code2, Cpu, Database, Download, Terminal } from 'lucide-react';
import { resolveAssetUrl } from '../services/api';
import { LogoWall } from './LogoWall';
import { LetterGlitch } from './LetterGlitch';

const ACCORDION_ITEMS = [
  {
    title: 'Full-Stack Web Engineering',
    icon: Code2,
    bullets: [
      'Responsive React.js Single Page Applications (SPAs)',
      'RESTful APIs with Node.js & Express.js',
      'Protected Admin CMS & CRUD workflows',
    ],
  },
  {
    title: 'MySQL & Relational Design',
    icon: Database,
    bullets: [
      'Normalized database schemas & SQL queries',
      'Parameterized queries & input validation',
      'Persistent contact, project & portfolio management',
    ],
  },
  {
    title: 'AI-Powered Developer Tools',
    icon: Cpu,
    bullets: [
      'Automated programming question curation (CodeGen)',
      'AI-generated test cases & Python/Java solutions',
      'Modern AI-assisted development with Antigravity',
    ],
  },
];

export function HeroSection({ profile }) {
  const [openItem, setOpenItem] = useState('Full-Stack Web Engineering');
  const resumeHref = resolveAssetUrl(profile?.resume_url || '/api/profile/resume');

  const toggleItem = (title) => {
    setOpenItem((prev) => (prev === title ? null : title));
  };

  return (
    <section className="text-[var(--white)] mt-12 md:mt-0" id="home">
      <div className="max-w-5xl mx-auto space-y-8 md:pt-36 md:pb-20 pb-14">
        <div className="text-left space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-md md:text-lg text-[var(--white-icon)] shiny-white">
              Hi, I&apos;m {profile?.full_name || 'Your Name'}
            </p>
            {profile?.availability_badge && (
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-[#1414149c] border border-[var(--white-icon-tr)] text-[#c3a6ff]">
                <span className="w-2 h-2 rounded-full bg-[#A9FF5B] animate-pulse" />
                {profile.availability_badge}
              </span>
            )}
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-10 md:gap-4">
            <h1 className="text-[var(--white)] text-5xl md:text-6xl font-medium text-pretty leading-none tracking-tight">
              Full Stack <br /> Developer
            </h1>
            <div className="space-y-3">
              <p className="text-sm font-medium uppercase tracking-widest text-[var(--sec)]">
                {profile?.professional_title || 'Full Stack Developer | AI Enthusiast'}
              </p>
              <p className="text-md md:text-2xl text-[var(--white-icon)] leading-snug">
                {profile?.short_intro || (
                  <>
                    Transforming ideas into interactive and seamless digital experiences with{' '}
                    <span className="text-[var(--sec)] shiny-sec">full-stack &amp; AI</span> development.
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-3 md:pt-5">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[var(--sec)] text-[#101010] font-semibold text-sm hover:opacity-90 transition"
            >
              Explore Projects
              <ArrowRight size={16} />
            </a>

            <a
              href={resumeHref}
              download
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-[var(--white-icon-tr)] bg-[#1414149c] text-[var(--white)] hover:bg-[var(--white-icon-tr)] font-medium text-sm transition"
            >
              <Download size={16} />
              Download Resume
            </a>

            {profile?.github_url && (
              <a
                target="_blank"
                rel="noreferrer"
                href={profile.github_url}
                aria-label="GitHub"
                className="text-[var(--white-icon)] hover:text-white transition duration-300 ease-in-out border border-[var(--white-icon-tr)] p-3 rounded-xl bg-[#1414149c] hover:bg-[var(--white-icon-tr)]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="M12.001 2C6.47598 2 2.00098 6.475 2.00098 12C2.00098 16.425 4.86348 20.1625 8.83848 21.4875C9.33848 21.575 9.52598 21.275 9.52598 21.0125C9.52598 20.775 9.51348 19.9875 9.51348 19.15C7.00098 19.6125 6.35098 18.5375 6.15098 17.975C6.03848 17.6875 5.55098 16.8 5.12598 16.5625C4.77598 16.375 4.27598 15.9125 5.11348 15.9C5.90098 15.8875 6.46348 16.625 6.65098 16.925C7.55098 18.4375 8.98848 18.0125 9.56348 17.75C9.65098 17.1 9.91348 16.6625 10.201 16.4125C7.97598 16.1625 5.65098 15.3 5.65098 11.475C5.65098 10.3875 6.03848 9.4875 6.67598 8.7875C6.57598 8.5375 6.22598 7.5125 6.77598 6.1375C6.77598 6.1375 7.61348 5.875 9.52598 7.1625C10.326 6.9375 11.176 6.825 12.026 6.825C12.876 6.825 13.726 6.9375 14.526 7.1625C16.4385 5.8625 17.276 6.1375 17.276 6.1375C17.826 7.5125 17.476 8.5375 17.376 8.7875C18.0135 9.4875 18.401 10.375 18.401 11.475C18.401 15.3125 16.0635 16.1625 13.8385 16.4125C14.201 16.725 14.5135 17.325 14.5135 18.2625C14.5135 19.6 14.501 20.675 14.501 21.0125C14.501 21.275 14.6885 21.5875 15.1885 21.4875C19.259 20.1133 21.9999 16.2963 22.001 12C22.001 6.475 17.526 2 12.001 2Z" />
                </svg>
              </a>
            )}

            {profile?.linkedin_url && (
              <a
                target="_blank"
                rel="noreferrer"
                href={profile.linkedin_url}
                aria-label="LinkedIn"
                className="text-[var(--white-icon)] hover:text-white transition duration-300 ease-in-out border border-[var(--white-icon-tr)] p-3 rounded-xl bg-[#1414149c] hover:bg-[var(--white-icon-tr)]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="M18.3362 18.339H15.6707V14.1622C15.6707 13.1662 15.6505 11.8845 14.2817 11.8845C12.892 11.8845 12.6797 12.9683 12.6797 14.0887V18.339H10.0142V9.75H12.5747V10.9207H12.6092C12.967 10.2457 13.837 9.53325 15.1367 9.53325C17.8375 9.53325 18.337 11.3108 18.337 13.6245V18.339H18.3362ZM7.00373 8.57475C6.14573 8.57475 5.45648 7.88025 5.45648 7.026C5.45648 6.1725 6.14648 5.47875 7.00373 5.47875C7.85873 5.47875 8.55173 6.1725 8.55173 7.026C8.55173 7.88025 7.85798 8.57475 7.00373 8.57475ZM8.34023 18.339H5.66723V9.75H8.34023V18.339ZM19.6697 3H4.32923C3.59498 3 3.00098 3.5805 3.00098 4.29675V19.7033C3.00098 20.4202 3.59498 21 4.32923 21H19.6675C20.401 21 21.001 20.4202 21.001 19.7033V4.29675C21.001 3.5805 20.401 3 19.6675 3H19.6697Z" />
                </svg>
              </a>
            )}

            {profile?.email && (
              <a
                href={`mailto:${profile.email}`}
                aria-label="Email"
                className="text-[var(--white-icon)] hover:text-white transition duration-300 ease-in-out border border-[var(--white-icon-tr)] p-3 rounded-xl bg-[#1414149c] hover:bg-[var(--white-icon-tr)]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="m18.73 5.41l-1.28 1L12 10.46L6.55 6.37l-1.28-1A2 2 0 0 0 2 7.05v11.59A1.36 1.36 0 0 0 3.36 20h3.19v-7.72L12 16.37l5.45-4.09V20h3.19A1.36 1.36 0 0 0 22 18.64V7.05a2 2 0 0 0-3.27-1.64" />
                </svg>
              </a>
            )}
          </div>
        </div>

        <LogoWall />

        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="text-left pt-3 md:pt-6 w-full lg:w-auto">
            <h2 className="text-[var(--white)] text-3xl md:text-4xl font-semibold md:mb-6 flex items-center gap-3">
              <Terminal size={28} className="text-[var(--sec)]" />
              What I do?
            </h2>
            <ul className="space-y-4 mt-4 text-lg">
              {ACCORDION_ITEMS.map((item) => {
                const Icon = item.icon;
                const isOpen = openItem === item.title;
                return (
                  <li key={item.title} className="w-full">
                    <button
                      type="button"
                      onClick={() => toggleItem(item.title)}
                      className="md:w-[420px] w-full bg-[#1414149c] rounded-2xl text-left hover:bg-[#1a1a1a] transition-all border border-[var(--white-icon-tr)] cursor-pointer overflow-hidden"
                    >
                      <div className="flex items-center gap-3 p-4">
                        <Icon size={22} className="text-[var(--sec)] flex-shrink-0" />
                        <div className="flex items-center gap-2 flex-grow justify-between min-w-0">
                          <span className="block truncate text-[var(--white)] text-base md:text-lg font-medium">
                            {item.title}
                          </span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className={`w-6 h-6 text-[var(--white)] transform transition-transform flex-shrink-0 ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                          >
                            <path d="M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z" />
                          </svg>
                        </div>
                      </div>

                      <div
                        className={`transition-all duration-300 px-4 overflow-hidden ${
                          isOpen ? 'max-h-[300px] pb-4 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                      >
                        <ul className="space-y-2 text-[var(--white-icon)] text-sm">
                          {item.bullets.map((bullet) => (
                            <li key={bullet} className="flex items-start gap-2 pl-1">
                              <span className="text-[var(--sec)]">•</span>
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="flex justify-center w-full lg:flex-1 h-[290px] md:h-[310px] pt-3 md:pt-6">
            <LetterGlitch
              glitchColors={['#5e4491', '#A476FF', '#241a38']}
              glitchSpeed={33}
              centerVignette={false}
              outerVignette={true}
              smooth={true}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
