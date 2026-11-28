import React from 'react';
import { Compass, GraduationCap, Rocket, Sparkles, User } from 'lucide-react';
import { resolveAssetUrl } from '../services/api';

export function AboutSection({ profile }) {
  const interests = (profile?.areas_of_interest || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    <section id="about" className="py-16 border-t border-[#ffffff10] text-[var(--white)]">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-lg text-[var(--sec)] mb-2 shiny-sec reveal">Who I am</h2>
        <h3 className="text-4xl md:text-5xl font-medium mb-6 reveal">About Me</h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 reveal">
          <div className="lg:col-span-2 bg-[#1414149c] border border-[var(--white-icon-tr)] rounded-2xl p-6 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-3">
              <User size={20} className="text-[var(--sec)]" />
              <h4 className="text-xl font-semibold">Personal Introduction</h4>
            </div>
            <p className="text-[var(--white-icon)] leading-relaxed text-sm md:text-base">
              {profile?.about_intro ||
                'I am a Full Stack Developer and AI Enthusiast passionate about building clean, dependable web applications backed by Node.js, Express.js, and PostgreSQL.'}
            </p>
            <p className="text-[var(--white-icon)] leading-relaxed text-sm md:text-base mt-3 flex items-start gap-2">
              <Sparkles size={16} className="text-[var(--sec)] flex-shrink-0 mt-1" />
              <span>
                Passionate about turning complex problems into intuitive full-stack and AI-powered applications.
              </span>
            </p>
          </div>

          <div className="bg-[#1414149c] border border-[var(--white-icon-tr)] rounded-2xl p-3 flex items-center justify-center overflow-hidden">
            <img
              src={resolveAssetUrl(profile?.profile_image || '/images/hero-developer.png')}
              alt={`${profile?.full_name || 'Developer'} portrait`}
              className="w-full h-56 lg:h-full object-cover rounded-xl"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <article className="bg-[#1414149c] border border-[var(--white-icon-tr)] rounded-2xl p-6 reveal">
            <div className="flex items-center gap-3 mb-3">
              <Compass size={20} className="text-[var(--sec)]" />
              <h4 className="text-lg font-semibold">Development Journey</h4>
            </div>
            <p className="text-[var(--white-icon)] text-sm md:text-base leading-relaxed">
              {profile?.development_journey}
            </p>
          </article>

          <article className="bg-[#1414149c] border border-[var(--white-icon-tr)] rounded-2xl p-6 reveal">
            <div className="flex items-center gap-3 mb-3">
              <GraduationCap size={20} className="text-[var(--sec)]" />
              <h4 className="text-lg font-semibold">Educational Background</h4>
            </div>
            <p className="text-[var(--white-icon)] text-sm md:text-base leading-relaxed">
              {profile?.education_summary}
            </p>
          </article>

          <article className="bg-[#1414149c] border border-[var(--white-icon-tr)] rounded-2xl p-6 reveal">
            <div className="flex items-center gap-3 mb-3">
              <Sparkles size={20} className="text-[var(--sec)]" />
              <h4 className="text-lg font-semibold">Areas of Interest</h4>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {interests.map((interest) => (
                <span
                  key={interest}
                  className="px-3 py-1.5 rounded-full text-xs md:text-sm bg-[#101010] border border-[var(--white-icon-tr)] text-[var(--white-icon)]"
                >
                  {interest}
                </span>
              ))}
            </div>
          </article>

          <article className="bg-[#1414149c] border border-[var(--white-icon-tr)] rounded-2xl p-6 reveal">
            <div className="flex items-center gap-3 mb-3">
              <Rocket size={20} className="text-[var(--sec)]" />
              <h4 className="text-lg font-semibold">Career Goals</h4>
            </div>
            <p className="text-[var(--white-icon)] text-sm md:text-base leading-relaxed">
              {profile?.career_goals}
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
