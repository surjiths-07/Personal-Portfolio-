import React, { useCallback, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ProjectDetailsPage } from './pages/ProjectDetailsPage';
import { AdminPage } from './pages/AdminPage';

export default function App() {
  const [profile, setProfile] = useState(null);

  const handleProfileLoaded = useCallback((loadedProfile) => {
    setProfile(loadedProfile);
    if (loadedProfile?.full_name) {
      document.title = `${loadedProfile.full_name} — ${loadedProfile.professional_title || 'Portfolio'}`;
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--white)]">
      <Navbar />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage onProfileLoaded={handleProfileLoaded} />} />
          <Route path="/projects/:slugOrId" element={<ProjectDetailsPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<HomePage onProfileLoaded={handleProfileLoaded} />} />
        </Routes>
      </main>

      <Footer profile={profile} />
    </div>
  );
}
