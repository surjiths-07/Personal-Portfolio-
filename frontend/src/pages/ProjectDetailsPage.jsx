import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  Compass,
  ExternalLink,
  Github,
  Layers,
  Lightbulb,
  Rocket,
  Target,
  X,
} from 'lucide-react';
import { portfolioApi, resolveAssetUrl } from '../services/api';

export function ProjectDetailsPage() {
  const { slugOrId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lightboxImage, setLightboxImage] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    let active = true;

    async function fetchProject() {
      setLoading(true);
      setError('');
      try {
        const res = await portfolioApi.getProject(slugOrId);
        if (active) setProject(res.data);
      } catch (err) {
        if (active) setError(err.message || 'Project not found.');
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchProject();
    return () => {
      active = false;
    };
  }, [slugOrId]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-36 text-center text-[var(--white-icon)]">
        Loading project details...
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="max-w-5xl mx-auto py-28">
        <div className="bg-[#1414149c] border border-[var(--white-icon-tr)] rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-semibold mb-3">Project Not Found</h2>
          <p className="text-[var(--white-icon)] mb-6">{error || 'The requested project could not be loaded.'}</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--sec)] text-[#101010] font-semibold text-sm"
          >
            <ArrowLeft size={16} />
            Back to Portfolio
          </Link>
        </div>
      </div>
    );
  }

  const gallery =
    project.screenshots?.length > 0 ? project.screenshots : [project.image || '/images/codegen-cover.png'];

  return (
    <div className="max-w-5xl mx-auto pt-24 pb-16">
      <Link
        to="/#projects"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1414149c] border border-[var(--white-icon-tr)] text-sm text-[var(--white-icon)] hover:text-white mb-8 transition"
      >
        <ArrowLeft size={15} />
        Back to Projects
      </Link>

      <div className="space-y-4">
        <div className="text-sm text-[var(--sec)] shiny-sec font-medium">{project.category}</div>
        <h1 className="text-3xl md:text-5xl font-semibold text-[var(--white)] leading-tight">
          {project.title}
        </h1>
        <p className="text-[var(--white-icon)] text-base md:text-lg leading-relaxed max-w-3xl">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--sec)] text-[#101010] text-sm font-semibold hover:opacity-90 transition"
            >
              <Github size={16} />
              GitHub Repository
            </a>
          )}
          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1414149c] border border-[var(--white-icon-tr)] text-sm text-[var(--white)] hover:bg-[var(--white-icon-tr)] transition"
            >
              <ExternalLink size={16} />
              Live Demo
            </a>
          )}
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden border border-[var(--white-icon-tr)] my-8 bg-[#1414149c]">
        <img
          src={resolveAssetUrl(project.image)}
          alt={project.title}
          className="w-full max-h-[500px] object-cover"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-[#1414149c] border border-[var(--white-icon-tr)] rounded-2xl p-6">
            <h2 className="flex items-center gap-2.5 text-xl font-semibold mb-3">
              <Compass size={18} className="text-[var(--sec)]" />
              Project Overview
            </h2>
            <p className="text-[var(--white-icon)] text-sm md:text-base leading-relaxed">
              {project.description}
            </p>
          </section>

          {project.problem_statement && (
            <section className="bg-[#1414149c] border border-[var(--white-icon-tr)] rounded-2xl p-6">
              <h2 className="flex items-center gap-2.5 text-xl font-semibold mb-3">
                <Target size={18} className="text-[var(--sec)]" />
                Problem Statement
              </h2>
              <p className="text-[var(--white-icon)] text-sm md:text-base leading-relaxed">
                {project.problem_statement}
              </p>
            </section>
          )}

          {project.proposed_solution && (
            <section className="bg-[#1414149c] border border-[var(--white-icon-tr)] rounded-2xl p-6">
              <h2 className="flex items-center gap-2.5 text-xl font-semibold mb-3">
                <Lightbulb size={18} className="text-[var(--sec)]" />
                Proposed Solution
              </h2>
              <p className="text-[var(--white-icon)] text-sm md:text-base leading-relaxed">
                {project.proposed_solution}
              </p>
            </section>
          )}

          {project.objectives?.length > 0 && (
            <section className="bg-[#1414149c] border border-[var(--white-icon-tr)] rounded-2xl p-6">
              <h2 className="flex items-center gap-2.5 text-xl font-semibold mb-4">
                <CheckCircle2 size={18} className="text-[var(--sec)]" />
                Project Objectives
              </h2>
              <ul className="space-y-2.5">
                {project.objectives.map((objective) => (
                  <li key={objective} className="flex items-start gap-2.5 text-sm text-[var(--white-icon)]">
                    <CheckCircle2 size={15} className="text-[var(--sec)] flex-shrink-0 mt-0.5" />
                    <span>{objective}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {project.features?.length > 0 && (
            <section className="bg-[#1414149c] border border-[var(--white-icon-tr)] rounded-2xl p-6">
              <h2 className="flex items-center gap-2.5 text-xl font-semibold mb-4">
                <Layers size={18} className="text-[var(--sec)]" />
                Key Features
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-[var(--white-icon)]">
                    <CheckCircle2 size={15} className="text-[var(--sec)] flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="bg-[#1414149c] border border-[var(--white-icon-tr)] rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4">Screenshots</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {gallery.map((shot, idx) => (
                <button
                  key={`${shot}-${idx}`}
                  type="button"
                  onClick={() => setLightboxImage(resolveAssetUrl(shot))}
                  className="rounded-xl overflow-hidden border border-[var(--white-icon-tr)] hover:border-[var(--sec)] transition"
                >
                  <img
                    src={resolveAssetUrl(shot)}
                    alt={`${project.title} screenshot ${idx + 1}`}
                    className="w-full h-44 object-cover"
                  />
                </button>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <div className="bg-[#1414149c] border border-[var(--white-icon-tr)] rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">Technology Stack</h2>
            <div className="flex flex-wrap gap-2">
              {(project.technologies || []).map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 text-xs rounded-lg bg-[#101010] border border-[var(--white-icon-tr)] text-[var(--white)]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {project.future_enhancements?.length > 0 && (
            <div className="bg-[#1414149c] border border-[var(--white-icon-tr)] rounded-2xl p-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
                <Rocket size={17} className="text-[var(--sec)]" />
                Future Enhancements
              </h2>
              <ul className="space-y-2.5">
                {project.future_enhancements.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-[var(--white-icon)]">
                    <CheckCircle2 size={14} className="text-[var(--sec)] flex-shrink-0 mt-1" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>

      {lightboxImage && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setLightboxImage('')}
          className="fixed inset-0 bg-black/85 z-[120] flex items-center justify-center p-6"
        >
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setLightboxImage('')}
              aria-label="Close preview"
              className="absolute top-3 right-3 p-2 rounded-lg bg-[#141414] border border-[var(--white-icon-tr)] text-white"
            >
              <X size={18} />
            </button>
            <img
              src={lightboxImage}
              alt="Screenshot preview"
              className="w-full rounded-xl border border-[var(--white-icon-tr)]"
            />
          </div>
        </div>
      )}
    </div>
  );
}
