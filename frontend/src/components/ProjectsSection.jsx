import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, CheckCircle2, ExternalLink, Github, Sparkles } from 'lucide-react';
import { resolveAssetUrl } from '../services/api';
import { ProjectCard } from './ProjectCard';

const FILTER_OPTIONS = [
  'All',
  'Artificial Intelligence',
  'Full-Stack Development',
  'Academic Project',
];

export function ProjectsSection({ projects = [], githubUrl = 'https://github.com' }) {
  const [activeFilter, setActiveFilter] = useState('All');

  const featuredProject = useMemo(
    () => projects.find((project) => project.is_featured) || projects[0] || null,
    [projects]
  );

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'All') return projects;
    return projects.filter((project) =>
      String(project.category || '').toLowerCase().includes(activeFilter.toLowerCase())
    );
  }, [projects, activeFilter]);

  return (
    <section id="projects" className="py-16 border-t border-[#ffffff10] text-[var(--white)]">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-lg text-[var(--sec)] mb-2 shiny-sec reveal">My work</h2>
        <h3 className="text-4xl md:text-5xl font-medium mb-8 reveal">Projects</h3>

        {featuredProject && activeFilter === 'All' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-[#1414149c] border border-[#a476ff45] rounded-2xl p-6 mb-10 reveal">
            <Link
              to={`/projects/${featuredProject.slug || featuredProject.id}`}
              className="block rounded-xl overflow-hidden bg-[#101010] border border-[var(--white-icon-tr)]"
            >
              <img
                src={resolveAssetUrl(featuredProject.image)}
                alt={featuredProject.title}
                className="w-full h-64 md:h-80 object-cover hover:scale-105 transition-transform duration-300"
              />
            </Link>

            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#101010] border border-[#a476ff55] text-[#c3a6ff] mb-3">
                <Sparkles size={13} />
                Main Flagship Project
              </span>
              <div className="text-xs text-[var(--sec)] font-medium mb-1">
                {featuredProject.category}
              </div>
              <h4 className="text-2xl md:text-3xl font-semibold text-[var(--white)] mb-3">
                {featuredProject.title}
              </h4>
              <p className="text-sm text-[var(--white-icon)] leading-relaxed mb-4">
                {featuredProject.description}
              </p>

              {featuredProject.features?.length > 0 && (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-5">
                  {featuredProject.features.slice(0, 8).map((feat) => (
                    <li key={feat} className="flex items-start gap-2 text-xs text-[var(--white-icon)]">
                      <CheckCircle2 size={14} className="text-[var(--sec)] flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="flex flex-wrap gap-1.5 mb-5">
                {(featuredProject.technologies || []).map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 text-xs rounded-md bg-[#101010] border border-[var(--white-icon-tr)] text-[var(--white-icon)]"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  to={`/projects/${featuredProject.slug || featuredProject.id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[var(--sec)] text-[#101010] text-sm font-semibold hover:opacity-90 transition"
                >
                  View Details
                  <ArrowUpRight size={16} />
                </Link>
                {featuredProject.github_url && (
                  <a
                    href={featuredProject.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#101010] border border-[var(--white-icon-tr)] text-[var(--white-icon)] hover:text-white text-sm transition"
                  >
                    <Github size={15} />
                    GitHub
                  </a>
                )}
                {featuredProject.demo_url && (
                  <a
                    href={featuredProject.demo_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#101010] border border-[var(--white-icon-tr)] text-[var(--white-icon)] hover:text-white text-sm transition"
                  >
                    <ExternalLink size={15} />
                    Live Demo
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-8 reveal" role="tablist" aria-label="Filter projects">
          {FILTER_OPTIONS.map((filter) => (
            <button
              key={filter}
              type="button"
              role="tab"
              aria-selected={activeFilter === filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-xs md:text-sm font-medium border transition ${
                activeFilter === filter
                  ? 'bg-[#a476ff22] border-[var(--sec)] text-white'
                  : 'bg-[#1414149c] border-[var(--white-icon-tr)] text-[var(--white-icon)] hover:text-white'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="bg-[#1414149c] border border-[var(--white-icon-tr)] rounded-2xl p-8 text-center text-[var(--white-icon)]">
            No projects found for &ldquo;{activeFilter}&rdquo;.
          </div>
        )}

        {githubUrl && (
          <a
            target="_blank"
            rel="noreferrer"
            href={githubUrl}
            aria-label="More projects on GitHub"
            className="w-full flex items-center justify-center gap-2 mt-9 text-[var(--white-icon)] hover:text-white transition duration-300 ease-in-out border border-[var(--white-icon-tr)] p-3.5 rounded-full bg-[#1414149c] hover:bg-[var(--white-icon-tr)]"
          >
            <span className="md:text-lg text-sm font-medium">More projects on</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M12.001 2C6.47598 2 2.00098 6.475 2.00098 12C2.00098 16.425 4.86348 20.1625 8.83848 21.4875C9.33848 21.575 9.52598 21.275 9.52598 21.0125C9.52598 20.775 9.51348 19.9875 9.51348 19.15C7.00098 19.6125 6.35098 18.5375 6.15098 17.975C6.03848 17.6875 5.55098 16.8 5.12598 16.5625C4.77598 16.375 4.27598 15.9125 5.11348 15.9C5.90098 15.8875 6.46348 16.625 6.65098 16.925C7.55098 18.4375 8.98848 18.0125 9.56348 17.75C9.65098 17.1 9.91348 16.6625 10.201 16.4125C7.97598 16.1625 5.65098 15.3 5.65098 11.475C5.65098 10.3875 6.03848 9.4875 6.67598 8.7875C6.57598 8.5375 6.22598 7.5125 6.77598 6.1375C6.77598 6.1375 7.61348 5.875 9.52598 7.1625C10.326 6.9375 11.176 6.825 12.026 6.825C12.876 6.825 13.726 6.9375 14.526 7.1625C16.4385 5.8625 17.276 6.1375 17.276 6.1375C17.826 7.5125 17.476 8.5375 17.376 8.7875C18.0135 9.4875 18.401 10.375 18.401 11.475C18.401 15.3125 16.0635 16.1625 13.8385 16.4125C14.201 16.725 14.5135 17.325 14.5135 18.2625C14.5135 19.6 14.501 20.675 14.501 21.0125C14.501 21.275 14.6885 21.5875 15.1885 21.4875C19.259 20.1133 21.9999 16.2963 22.001 12C22.001 6.475 17.526 2 12.001 2Z" />
            </svg>
          </a>
        )}
      </div>
    </section>
  );
}
