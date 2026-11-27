import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Briefcase, FolderGit2, Home, Lock, Mail, User, Wrench } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Home', hash: 'home', icon: Home },
  { label: 'About', hash: 'about', icon: User },
  { label: 'Skills', hash: 'skills', icon: Wrench },
  { label: 'Projects', hash: 'projects', icon: FolderGit2 },
  { label: 'Experience', hash: 'experience', icon: Briefcase },
  { label: 'Contact', hash: 'contact', icon: Mail },
];

export function Navbar() {
  const navRef = useRef(null);
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolling, setIsScrolling] = useState(false);
  const [navWidth, setNavWidth] = useState('80%');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let rafId = null;
    const maxScroll = 1000;

    const updateNav = () => {
      if (window.scrollY > 0) {
        setIsScrolling(true);
        const scrollProgress = Math.min(window.scrollY / maxScroll, 1);
        const easeProgress = 1 - Math.pow(1 - scrollProgress, 4);
        const minWidth = 620;
        const maxWidth = window.innerWidth * 0.8;
        const currentWidth = Math.max(minWidth, maxWidth - (maxWidth - minWidth) * easeProgress);
        if (window.innerWidth >= 768) {
          setNavWidth(`${currentWidth}px`);
        }
      } else {
        setIsScrolling(false);
        setNavWidth('80%');
      }
      rafId = null;
    };

    const onScroll = () => {
      if (!rafId) {
        rafId = requestAnimationFrame(updateNav);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    if (location.pathname !== '/') return undefined;

    const sections = document.querySelectorAll('section[id]');
    if (!sections.length || !('IntersectionObserver' in window)) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.35 }
    );

    sections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, [location.pathname]);

  const handleNavClick = (hash) => {
    setActiveSection(hash);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
      return;
    }
    document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex justify-center w-full">
      <nav
        ref={navRef}
        id="main-nav"
        style={{ width: navWidth }}
        className={`fixed left-1/2 z-[100] border border-transparent backdrop-blur-xl md:top-6 md:bottom-auto bottom-0 ${
          isScrolling ? 'scrolling' : ''
        }`}
      >
        <div className="mx-auto flex justify-center items-center px-4 py-3">
          <ul className="flex w-full justify-between md:justify-center md:gap-8 lg:gap-10 gap-2 items-center">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === '/' && activeSection === item.hash;
              return (
                <li key={item.hash} className="flex-1 md:flex-none flex justify-center">
                  <button
                    type="button"
                    onClick={() => handleNavClick(item.hash)}
                    className={`flex flex-col items-center gap-1 text-[var(--white-icon)] hover:text-white transition-colors text-[11px] md:text-sm lg:text-base relative ${
                      isActive ? 'active' : ''
                    }`}
                  >
                    <span className="hidden md:block absolute -left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full transition-all duration-300 scale-0 opacity-0 bg-[#A9FF5B] nav-indicator" />
                    <span className="md:hidden flex items-center justify-center w-5 h-5">
                      <Icon size={18} />
                    </span>
                    <span className="hidden md:inline-block whitespace-nowrap">{item.label}</span>
                    <span className="md:hidden">{item.label}</span>
                  </button>
                </li>
              );
            })}

            <li className="flex-1 md:flex-none flex justify-center">
              <Link
                to="/admin"
                className={`flex flex-col items-center gap-1 text-[var(--white-icon)] hover:text-white transition-colors text-[11px] md:text-sm lg:text-base relative ${
                  location.pathname === '/admin' ? 'active' : ''
                }`}
              >
                <span className="hidden md:block absolute -left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full transition-all duration-300 scale-0 opacity-0 bg-[#A9FF5B] nav-indicator" />
                <span className="md:hidden flex items-center justify-center w-5 h-5">
                  <Lock size={18} />
                </span>
                <span className="hidden md:inline-block whitespace-nowrap">Admin</span>
                <span className="md:hidden">Admin</span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}
