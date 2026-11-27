import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { resolveAssetUrl } from '../services/api';

export function ProjectCard({ project }) {
  const detailsPath = `/projects/${project.slug || project.id}`;

  return (
    <article className="group bg-[#1414149c] border border-[var(--white-icon-tr)] rounded-2xl p-4 hover:border-[#a476ff55] transition-all duration-300 flex flex-col reveal">
      <Link to={detailsPath} className="block rounded-xl overflow-hidden mb-4 bg-[#101010]">
        <img
          src={resolveAssetUrl(project.image)}
          alt={project.title}
          loading="lazy"
          className="w-full h-48 md:h-60 object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </Link>

      <div className="flex flex-col flex-1 px-1">
        <span className="text-xs text-[var(--sec)] font-medium mb-1">{project.category}</span>
        <Link to={detailsPath}>
          <h4 className="text-xl font-semibold text-[var(--white)] group-hover:text-white mb-2">
            {project.title}
          </h4>
        </Link>
        <p className="text-sm text-[var(--white-icon)] leading-relaxed mb-4 flex-1">
          {project.short_description || project.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {(project.technologies || []).slice(0, 6).map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-1 text-xs rounded-md bg-[#101010] border border-[var(--white-icon-tr)] text-[var(--white-icon)]"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 pt-3 border-t border-[#ffffff10]">
          {project.github_url && (
            <a
              target="_blank"
              rel="noreferrer"
              href={project.github_url}
              aria-label={`GitHub repository for ${project.title}`}
              title="GitHub"
              className="h-11 px-3.5 flex justify-center items-center gap-1.5 text-xs font-medium text-[var(--white-icon)] hover:text-white transition border border-[var(--white-icon-tr)] rounded-xl bg-[#101010] hover:bg-[var(--white-icon-tr)]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M24 12L18.3431 17.6569L16.9289 16.2426L21.1716 12L16.9289 7.75736L18.3431 6.34315L24 12ZM2.82843 12L7.07107 16.2426L5.65685 17.6569L0 12L5.65685 6.34315L7.07107 7.75736L2.82843 12ZM9.78845 21H7.66009L14.2116 3H16.3399L9.78845 21Z" />
              </svg>
              GitHub
            </a>
          )}

          {project.demo_url && (
            <a
              target="_blank"
              rel="noreferrer"
              href={project.demo_url}
              aria-label={`Live demo for ${project.title}`}
              title="Live Demo"
              className="h-11 px-3.5 flex justify-center items-center gap-1.5 text-xs font-medium text-[var(--white-icon)] hover:text-white transition border border-[var(--white-icon-tr)] rounded-xl bg-[#101010] hover:bg-[var(--white-icon-tr)]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M16.0037 9.41421L7.39712 18.0208L5.98291 16.6066L14.5895 8H7.00373V6H18.0037V17H16.0037V9.41421Z" />
              </svg>
              Demo
            </a>
          )}

          <Link
            to={detailsPath}
            className="ml-auto h-11 px-4 flex justify-center items-center gap-1.5 text-xs font-semibold text-[#101010] bg-[var(--sec)] hover:opacity-90 rounded-xl transition"
          >
            View Details
            <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
}
