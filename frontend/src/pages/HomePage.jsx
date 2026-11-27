import React, { useEffect, useState } from 'react';
import { portfolioApi } from '../services/api';
import { HeroSection } from '../components/HeroSection';
import { AboutSection } from '../components/AboutSection';
import { SkillsSection } from '../components/SkillsSection';
import { ProjectsSection } from '../components/ProjectsSection';
import { ExperienceSection } from '../components/ExperienceSection';
import { ContactSection } from '../components/ContactSection';

export function HomePage({ onProfileLoaded }) {
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadPortfolioData() {
      try {
        const [profileRes, skillsRes, projectsRes, timelineRes] = await Promise.all([
          portfolioApi.getProfile(),
          portfolioApi.getSkills(),
          portfolioApi.getProjects(),
          portfolioApi.getTimeline(),
        ]);

        if (!active) return;

        setProfile(profileRes.data);
        setSkills(skillsRes.data || []);
        setProjects(projectsRes.data || []);
        setTimeline(timelineRes.data || []);

        if (onProfileLoaded && profileRes.data) {
          onProfileLoaded(profileRes.data);
        }
      } catch (err) {
        if (active) {
          setError(err.message || 'Unable to connect to the portfolio backend API.');
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadPortfolioData();
    return () => {
      active = false;
    };
  }, [onProfileLoaded]);

  useEffect(() => {
    if (loading) return undefined;

    const elements = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      elements.forEach((el) => el.classList.add('is-visible'));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [loading, projects, skills, timeline]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-36 text-center text-[var(--white-icon)]">
        Loading portfolio from MySQL...
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="max-w-5xl mx-auto py-28">
        <div className="p-5 rounded-2xl bg-rose-950/30 border border-rose-500/40 text-rose-200">
          <strong>Backend Connection Issue:</strong> {error}. Make sure MySQL and the Express server are running.
        </div>
      </div>
    );
  }

  return (
    <>
      <HeroSection profile={profile} />
      <AboutSection profile={profile} />
      <SkillsSection skills={skills} />
      <ProjectsSection projects={projects} githubUrl={profile?.github_url} />
      <ExperienceSection items={timeline} />
      <ContactSection profile={profile} />
    </>
  );
}
