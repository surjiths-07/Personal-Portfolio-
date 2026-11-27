import React, { useCallback, useEffect, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Edit3,
  FolderGit2,
  KeyRound,
  LogOut,
  Mail,
  Plus,
  Trash2,
  Upload,
  UserCog,
  Wrench,
} from 'lucide-react';
import { getAuthToken, portfolioApi, resolveAssetUrl, setAuthToken } from '../services/api';

const EMPTY_PROJECT_FORM = {
  id: null,
  title: '',
  short_description: '',
  description: '',
  category: 'Full-Stack Development',
  image: '/images/codegen-cover.png',
  screenshots: '/images/codegen-cover.png',
  technologies: 'React.js, Node.js, Express.js, MySQL',
  features: '',
  problem_statement: '',
  proposed_solution: '',
  objectives: '',
  future_enhancements: '',
  github_url: '',
  demo_url: '',
  is_featured: false,
};

const SKILL_CATEGORIES = [
  'Frontend Skills',
  'Backend Skills',
  'Database Skills',
  'AI and Development Tools',
];

const SKILL_ICONS = [
  'html5', 'css3', 'javascript', 'react', 'nodejs', 'express', 'api',
  'mysql', 'sql', 'database', 'crud', 'ai', 'git', 'github', 'vscode', 'antigravity',
];

const inputCls =
  'w-full px-4 py-2.5 bg-[#101010] text-[var(--white)] border border-[var(--white-icon-tr)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--sec)]';

export function AdminPage() {
  const [admin, setAdmin] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [activeTab, setActiveTab] = useState('projects');
  const [notice, setNotice] = useState(null);

  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [messages, setMessages] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [profile, setProfile] = useState(null);

  const [projectForm, setProjectForm] = useState(EMPTY_PROJECT_FORM);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [skillForm, setSkillForm] = useState({
    name: '',
    category: 'Frontend Skills',
    icon: 'react',
  });

  const [timelineForm, setTimelineForm] = useState({
    section_type: 'education',
    title: '',
    organization: '',
    period: '',
    location: '',
    description: '',
    highlights: '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
  });

  const loadAdminData = useCallback(async () => {
    const [projRes, skillRes, msgRes, profileRes, timelineRes] = await Promise.all([
      portfolioApi.getProjects(),
      portfolioApi.getSkills(),
      portfolioApi.getContactMessages(),
      portfolioApi.getProfile(),
      portfolioApi.getTimeline(),
    ]);
    setProjects(projRes.data || []);
    setSkills(skillRes.data || []);
    setMessages(msgRes.data || []);
    setProfile(profileRes.data || null);
    setTimeline(timelineRes.data || []);
  }, []);

  useEffect(() => {
    async function verifySession() {
      const token = getAuthToken();
      if (!token) {
        setCheckingAuth(false);
        return;
      }
      try {
        const res = await portfolioApi.getMe();
        setAdmin(res.admin);
        await loadAdminData();
      } catch {
        setAuthToken('');
      } finally {
        setCheckingAuth(false);
      }
    }

    verifySession();
  }, [loadAdminData]);

  const showNotice = (type, text) => setNotice({ type, text });

  const handleLogin = async (e) => {
    e.preventDefault();
    setNotice(null);
    try {
      const res = await portfolioApi.login(loginForm);
      setAuthToken(res.token);
      setAdmin(res.admin);
      setLoginForm({ username: '', password: '' });
      await loadAdminData();
      showNotice('success', `Welcome back, ${res.admin.username}.`);
    } catch (err) {
      showNotice('error', err.message || 'Login failed.');
    }
  };

  const handleLogout = () => {
    setAuthToken('');
    setAdmin(null);
    setNotice(null);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    setNotice(null);
    try {
      const res = await portfolioApi.uploadProjectImage(file);
      setProjectForm((prev) => ({
        ...prev,
        image: res.imageUrl,
        screenshots: prev.screenshots ? `${prev.screenshots}\n${res.imageUrl}` : res.imageUrl,
      }));
      showNotice('success', 'Project image uploaded.');
    } catch (err) {
      showNotice('error', err.message || 'Image upload failed.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    setNotice(null);
    try {
      const payload = {
        ...projectForm,
        screenshots: projectForm.screenshots.split(/\r?\n|,/).map((s) => s.trim()).filter(Boolean),
        technologies: projectForm.technologies.split(',').map((s) => s.trim()).filter(Boolean),
        features: projectForm.features.split(/\r?\n/).map((s) => s.trim()).filter(Boolean),
        objectives: projectForm.objectives.split(/\r?\n/).map((s) => s.trim()).filter(Boolean),
        future_enhancements: projectForm.future_enhancements.split(/\r?\n/).map((s) => s.trim()).filter(Boolean),
      };

      if (projectForm.id) {
        await portfolioApi.updateProject(projectForm.id, payload);
        showNotice('success', 'Project updated in MySQL.');
      } else {
        await portfolioApi.createProject(payload);
        showNotice('success', 'New project added to MySQL.');
      }

      setProjectForm(EMPTY_PROJECT_FORM);
      await loadAdminData();
    } catch (err) {
      showNotice('error', err.message || 'Could not save project.');
    }
  };

  const startEditProject = (project) => {
    setProjectForm({
      id: project.id,
      title: project.title || '',
      short_description: project.short_description || '',
      description: project.description || '',
      category: project.category || '',
      image: project.image || '/images/codegen-cover.png',
      screenshots: (project.screenshots || []).join('\n'),
      technologies: (project.technologies || []).join(', '),
      features: (project.features || []).join('\n'),
      problem_statement: project.problem_statement || '',
      proposed_solution: project.proposed_solution || '',
      objectives: (project.objectives || []).join('\n'),
      future_enhancements: (project.future_enhancements || []).join('\n'),
      github_url: project.github_url || '',
      demo_url: project.demo_url || '',
      is_featured: Boolean(project.is_featured),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteProject = async (id) => {
    setNotice(null);
    try {
      await portfolioApi.deleteProject(id);
      if (projectForm.id === id) setProjectForm(EMPTY_PROJECT_FORM);
      await loadAdminData();
      showNotice('success', 'Project deleted.');
    } catch (err) {
      showNotice('error', err.message);
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    setNotice(null);
    try {
      await portfolioApi.createSkill(skillForm);
      setSkillForm((prev) => ({ ...prev, name: '' }));
      await loadAdminData();
      showNotice('success', 'Skill added.');
    } catch (err) {
      showNotice('error', err.message);
    }
  };

  const handleDeleteSkill = async (id) => {
    setNotice(null);
    try {
      await portfolioApi.deleteSkill(id);
      await loadAdminData();
      showNotice('success', 'Skill removed.');
    } catch (err) {
      showNotice('error', err.message);
    }
  };

  const handleToggleMessageRead = async (msg) => {
    try {
      await portfolioApi.toggleMessageRead(msg.id, !msg.is_read);
      await loadAdminData();
    } catch (err) {
      showNotice('error', err.message);
    }
  };

  const handleDeleteMessage = async (id) => {
    try {
      await portfolioApi.deleteContactMessage(id);
      await loadAdminData();
      showNotice('success', 'Contact message deleted.');
    } catch (err) {
      showNotice('error', err.message);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setNotice(null);
    try {
      await portfolioApi.updateProfile(profile);
      await loadAdminData();
      showNotice('success', 'Portfolio profile saved to MySQL.');
    } catch (err) {
      showNotice('error', err.message);
    }
  };

  const handleAddTimeline = async (e) => {
    e.preventDefault();
    setNotice(null);
    try {
      await portfolioApi.createTimelineItem({
        ...timelineForm,
        highlights: timelineForm.highlights.split(/\r?\n/).map((s) => s.trim()).filter(Boolean),
      });
      setTimelineForm({
        section_type: 'education',
        title: '',
        organization: '',
        period: '',
        location: '',
        description: '',
        highlights: '',
      });
      await loadAdminData();
      showNotice('success', 'Timeline milestone added.');
    } catch (err) {
      showNotice('error', err.message);
    }
  };

  const handleDeleteTimeline = async (id) => {
    try {
      await portfolioApi.deleteTimelineItem(id);
      await loadAdminData();
      showNotice('success', 'Timeline item deleted.');
    } catch (err) {
      showNotice('error', err.message);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setNotice(null);
    try {
      const res = await portfolioApi.updatePassword(passwordForm);
      setPasswordForm({ currentPassword: '', newPassword: '' });
      showNotice('success', res.message || 'Password updated.');
    } catch (err) {
      showNotice('error', err.message);
    }
  };

  if (checkingAuth) {
    return (
      <div className="max-w-5xl mx-auto py-36 text-center text-[var(--white-icon)]">
        Verifying admin session...
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="max-w-md mx-auto pt-32 pb-20">
        <div className="bg-[#1414149c] border border-[var(--white-icon-tr)] rounded-2xl p-7">
          <div className="text-sm text-[var(--sec)] shiny-sec mb-1">Protected Portal</div>
          <h1 className="text-2xl font-semibold mb-2">Admin Sign In</h1>
          <p className="text-sm text-[var(--white-icon)] mb-6">
            Sign in with your administrator credentials stored securely via bcrypt in MySQL.
          </p>

          {notice && (
            <div className="flex items-start gap-2 p-3 rounded-lg mb-4 text-sm bg-rose-950/40 border border-rose-500/40 text-rose-300">
              <AlertCircle size={17} className="mt-0.5 flex-shrink-0" />
              <span>{notice.text}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs text-[var(--white-icon)] mb-1.5" htmlFor="admin-username">
                Username or Email
              </label>
              <input
                id="admin-username"
                type="text"
                className={inputCls}
                value={loginForm.username}
                onChange={(e) => setLoginForm((p) => ({ ...p, username: e.target.value }))}
                required
              />
            </div>

            <div>
              <label className="block text-xs text-[var(--white-icon)] mb-1.5" htmlFor="admin-password">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                className={inputCls}
                value={loginForm.password}
                onChange={(e) => setLoginForm((p) => ({ ...p, password: e.target.value }))}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--sec)] text-[#101010] font-semibold text-sm hover:opacity-90 transition"
            >
              <KeyRound size={16} />
              Sign In to Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pt-28 pb-20">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <div className="text-sm text-[var(--sec)] shiny-sec">Portfolio CMS</div>
          <h1 className="text-3xl md:text-4xl font-semibold">Admin Dashboard</h1>
          <p className="text-sm text-[var(--white-icon)] mt-1">
            Signed in as <strong className="text-white">{admin.username}</strong> ({admin.email})
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1414149c] border border-[var(--white-icon-tr)] text-sm text-[var(--white-icon)] hover:text-white transition"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>

      {notice && (
        <div
          className={`flex items-start gap-2.5 px-4 py-3 rounded-xl text-sm border mb-6 ${
            notice.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
          }`}
        >
          {notice.type === 'success' ? <CheckCircle2 size={17} /> : <AlertCircle size={17} />}
          <span>{notice.text}</span>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-8">
        {[
          { key: 'projects', label: `Projects (${projects.length})`, icon: FolderGit2 },
          { key: 'skills', label: `Skills (${skills.length})`, icon: Wrench },
          { key: 'messages', label: `Messages (${messages.length})`, icon: Mail },
          { key: 'profile', label: 'Profile & Timeline', icon: UserCog },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition ${
                activeTab === tab.key
                  ? 'bg-[#a476ff24] border-[var(--sec)] text-white'
                  : 'bg-[#1414149c] border-[var(--white-icon-tr)] text-[var(--white-icon)] hover:text-white'
              }`}
            >
              <Icon size={15} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'projects' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <form
            onSubmit={handleSaveProject}
            className="bg-[#1414149c] border border-[var(--white-icon-tr)] rounded-2xl p-6 space-y-4"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">
                {projectForm.id ? 'Edit Project' : 'Add New Project'}
              </h2>
              {projectForm.id && (
                <button
                  type="button"
                  onClick={() => setProjectForm(EMPTY_PROJECT_FORM)}
                  className="text-xs px-3 py-1 rounded-lg border border-[var(--white-icon-tr)] text-[var(--white-icon)]"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <input
              type="text"
              placeholder="Project Title *"
              className={inputCls}
              value={projectForm.title}
              onChange={(e) => setProjectForm((p) => ({ ...p, title: e.target.value }))}
              required
            />
            <input
              type="text"
              placeholder="Category *"
              className={inputCls}
              value={projectForm.category}
              onChange={(e) => setProjectForm((p) => ({ ...p, category: e.target.value }))}
              required
            />
            <input
              type="text"
              placeholder="Short Card Summary *"
              className={inputCls}
              value={projectForm.short_description}
              onChange={(e) => setProjectForm((p) => ({ ...p, short_description: e.target.value }))}
              required
            />
            <textarea
              rows="3"
              placeholder="Full Overview Description *"
              className={inputCls}
              value={projectForm.description}
              onChange={(e) => setProjectForm((p) => ({ ...p, description: e.target.value }))}
              required
            />

            <div className="flex flex-wrap gap-2 items-center">
              <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#101010] border border-[var(--white-icon-tr)] text-xs cursor-pointer hover:border-[var(--sec)]">
                <Upload size={14} />
                {uploadingImage ? 'Uploading...' : 'Upload Image'}
                <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
              </label>
              <input
                type="text"
                placeholder="Image URL"
                className={`${inputCls} flex-1`}
                value={projectForm.image}
                onChange={(e) => setProjectForm((p) => ({ ...p, image: e.target.value }))}
              />
            </div>

            <input
              type="text"
              placeholder="Technologies (comma-separated)"
              className={inputCls}
              value={projectForm.technologies}
              onChange={(e) => setProjectForm((p) => ({ ...p, technologies: e.target.value }))}
            />
            <textarea
              rows="3"
              placeholder="Key Features (one per line)"
              className={inputCls}
              value={projectForm.features}
              onChange={(e) => setProjectForm((p) => ({ ...p, features: e.target.value }))}
            />
            <textarea
              rows="2"
              placeholder="Problem Statement"
              className={inputCls}
              value={projectForm.problem_statement}
              onChange={(e) => setProjectForm((p) => ({ ...p, problem_statement: e.target.value }))}
            />
            <textarea
              rows="2"
              placeholder="Proposed Solution"
              className={inputCls}
              value={projectForm.proposed_solution}
              onChange={(e) => setProjectForm((p) => ({ ...p, proposed_solution: e.target.value }))}
            />
            <textarea
              rows="2"
              placeholder="Objectives (one per line)"
              className={inputCls}
              value={projectForm.objectives}
              onChange={(e) => setProjectForm((p) => ({ ...p, objectives: e.target.value }))}
            />
            <textarea
              rows="2"
              placeholder="Future Enhancements (one per line)"
              className={inputCls}
              value={projectForm.future_enhancements}
              onChange={(e) => setProjectForm((p) => ({ ...p, future_enhancements: e.target.value }))}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="GitHub URL"
                className={inputCls}
                value={projectForm.github_url}
                onChange={(e) => setProjectForm((p) => ({ ...p, github_url: e.target.value }))}
              />
              <input
                type="text"
                placeholder="Live Demo URL"
                className={inputCls}
                value={projectForm.demo_url}
                onChange={(e) => setProjectForm((p) => ({ ...p, demo_url: e.target.value }))}
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-[var(--white-icon)]">
              <input
                type="checkbox"
                checked={projectForm.is_featured}
                onChange={(e) => setProjectForm((p) => ({ ...p, is_featured: e.target.checked }))}
              />
              Mark as Main Featured Project
            </label>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--sec)] text-[#101010] font-semibold text-sm"
            >
              <Plus size={16} />
              {projectForm.id ? 'Update Project' : 'Create Project'}
            </button>
          </form>

          <div className="bg-[#1414149c] border border-[var(--white-icon-tr)] rounded-2xl p-6 space-y-3">
            <h2 className="text-lg font-semibold mb-2">Existing Projects</h2>
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-[#101010] border border-[var(--white-icon-tr)]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={resolveAssetUrl(proj.image)}
                    alt={proj.title}
                    className="w-14 h-11 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="font-medium text-sm truncate">{proj.title}</div>
                    <div className="text-xs text-[var(--white-icon)] truncate">
                      {proj.category} {proj.is_featured ? '• Featured' : ''}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => startEditProject(proj)}
                    className="p-2 rounded-lg border border-[var(--white-icon-tr)] text-[var(--white-icon)] hover:text-white"
                    aria-label="Edit project"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteProject(proj.id)}
                    className="p-2 rounded-lg border border-rose-500/40 text-rose-300 hover:bg-rose-950/40"
                    aria-label="Delete project"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'skills' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <form
            onSubmit={handleAddSkill}
            className="bg-[#1414149c] border border-[var(--white-icon-tr)] rounded-2xl p-6 space-y-4"
          >
            <h2 className="text-lg font-semibold">Add New Skill</h2>
            <input
              type="text"
              placeholder="Skill Name *"
              className={inputCls}
              value={skillForm.name}
              onChange={(e) => setSkillForm((p) => ({ ...p, name: e.target.value }))}
              required
            />
            <select
              className={inputCls}
              value={skillForm.category}
              onChange={(e) => setSkillForm((p) => ({ ...p, category: e.target.value }))}
            >
              {SKILL_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <select
              className={inputCls}
              value={skillForm.icon}
              onChange={(e) => setSkillForm((p) => ({ ...p, icon: e.target.value }))}
            >
              {SKILL_ICONS.map((icon) => (
                <option key={icon} value={icon}>{icon}</option>
              ))}
            </select>
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--sec)] text-[#101010] font-semibold text-sm"
            >
              <Plus size={16} />
              Add Skill
            </button>
          </form>

          <div className="bg-[#1414149c] border border-[var(--white-icon-tr)] rounded-2xl p-6 space-y-3">
            <h2 className="text-lg font-semibold">Configured Skills</h2>
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-[#101010] border border-[var(--white-icon-tr)]"
              >
                <div>
                  <div className="text-sm font-medium">{skill.name}</div>
                  <div className="text-xs text-[var(--white-icon)]">
                    {skill.category} • {skill.icon}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteSkill(skill.id)}
                  className="p-2 rounded-lg border border-rose-500/40 text-rose-300 hover:bg-rose-950/40"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'messages' && (
        <div className="bg-[#1414149c] border border-[var(--white-icon-tr)] rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold">Inbox Messages</h2>
          {messages.length === 0 ? (
            <p className="text-sm text-[var(--white-icon)]">No contact messages received yet.</p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className="p-4 rounded-xl bg-[#101010] border border-[var(--white-icon-tr)] space-y-2"
              >
                <div className="flex flex-wrap justify-between gap-2">
                  <div>
                    <div className="font-semibold text-sm">
                      {msg.subject}{' '}
                      {!msg.is_read && (
                        <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-[#a476ff30] text-[#c3a6ff]">
                          New
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[var(--white-icon)]">
                      {msg.name} ({msg.email}) • {new Date(msg.created_at).toLocaleString()}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleMessageRead(msg)}
                      className="px-3 py-1.5 rounded-lg text-xs border border-[var(--white-icon-tr)] text-[var(--white-icon)] hover:text-white"
                    >
                      {msg.is_read ? 'Mark Unread' : 'Mark Read'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteMessage(msg.id)}
                      className="p-2 rounded-lg border border-rose-500/40 text-rose-300 hover:bg-rose-950/40"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-[var(--white-icon)]">{msg.message}</p>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'profile' && profile && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <form
            onSubmit={handleSaveProfile}
            className="bg-[#1414149c] border border-[var(--white-icon-tr)] rounded-2xl p-6 space-y-3"
          >
            <h2 className="text-lg font-semibold mb-2">Edit Profile Settings</h2>
            <input
              type="text"
              placeholder="Full Name *"
              className={inputCls}
              value={profile.full_name || ''}
              onChange={(e) => setProfile((p) => ({ ...p, full_name: e.target.value }))}
              required
            />
            <input
              type="text"
              placeholder="Professional Title *"
              className={inputCls}
              value={profile.professional_title || ''}
              onChange={(e) => setProfile((p) => ({ ...p, professional_title: e.target.value }))}
              required
            />
            <input
              type="text"
              placeholder="Availability Badge"
              className={inputCls}
              value={profile.availability_badge || ''}
              onChange={(e) => setProfile((p) => ({ ...p, availability_badge: e.target.value }))}
            />
            <textarea
              rows="2"
              placeholder="Short Hero Intro *"
              className={inputCls}
              value={profile.short_intro || ''}
              onChange={(e) => setProfile((p) => ({ ...p, short_intro: e.target.value }))}
              required
            />
            <textarea
              rows="3"
              placeholder="About Me Intro"
              className={inputCls}
              value={profile.about_intro || ''}
              onChange={(e) => setProfile((p) => ({ ...p, about_intro: e.target.value }))}
            />
            <textarea
              rows="3"
              placeholder="Development Journey"
              className={inputCls}
              value={profile.development_journey || ''}
              onChange={(e) => setProfile((p) => ({ ...p, development_journey: e.target.value }))}
            />
            <textarea
              rows="2"
              placeholder="Education Summary"
              className={inputCls}
              value={profile.education_summary || ''}
              onChange={(e) => setProfile((p) => ({ ...p, education_summary: e.target.value }))}
            />
            <input
              type="text"
              placeholder="Areas of Interest (comma-separated)"
              className={inputCls}
              value={profile.areas_of_interest || ''}
              onChange={(e) => setProfile((p) => ({ ...p, areas_of_interest: e.target.value }))}
            />
            <textarea
              rows="2"
              placeholder="Career Goals"
              className={inputCls}
              value={profile.career_goals || ''}
              onChange={(e) => setProfile((p) => ({ ...p, career_goals: e.target.value }))}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="GitHub URL"
                className={inputCls}
                value={profile.github_url || ''}
                onChange={(e) => setProfile((p) => ({ ...p, github_url: e.target.value }))}
              />
              <input
                type="text"
                placeholder="LinkedIn URL"
                className={inputCls}
                value={profile.linkedin_url || ''}
                onChange={(e) => setProfile((p) => ({ ...p, linkedin_url: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="email"
                placeholder="Email"
                className={inputCls}
                value={profile.email || ''}
                onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
              />
              <input
                type="text"
                placeholder="Location"
                className={inputCls}
                value={profile.location || ''}
                onChange={(e) => setProfile((p) => ({ ...p, location: e.target.value }))}
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--sec)] text-[#101010] font-semibold text-sm"
            >
              Save Profile Settings
            </button>
          </form>

          <div className="space-y-6">
            <form
              onSubmit={handleAddTimeline}
              className="bg-[#1414149c] border border-[var(--white-icon-tr)] rounded-2xl p-6 space-y-3"
            >
              <h2 className="text-lg font-semibold">Add Experience / Education Milestone</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <select
                  className={inputCls}
                  value={timelineForm.section_type}
                  onChange={(e) => setTimelineForm((p) => ({ ...p, section_type: e.target.value }))}
                >
                  <option value="education">Education</option>
                  <option value="internship">Internship</option>
                  <option value="work">Work Experience</option>
                  <option value="certification">Certification</option>
                  <option value="achievement">Achievement</option>
                </select>
                <input
                  type="text"
                  placeholder="Period *"
                  className={inputCls}
                  value={timelineForm.period}
                  onChange={(e) => setTimelineForm((p) => ({ ...p, period: e.target.value }))}
                  required
                />
              </div>
              <input
                type="text"
                placeholder="Title *"
                className={inputCls}
                value={timelineForm.title}
                onChange={(e) => setTimelineForm((p) => ({ ...p, title: e.target.value }))}
                required
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Organization *"
                  className={inputCls}
                  value={timelineForm.organization}
                  onChange={(e) => setTimelineForm((p) => ({ ...p, organization: e.target.value }))}
                  required
                />
                <input
                  type="text"
                  placeholder="Location"
                  className={inputCls}
                  value={timelineForm.location}
                  onChange={(e) => setTimelineForm((p) => ({ ...p, location: e.target.value }))}
                />
              </div>
              <textarea
                rows="2"
                placeholder="Description *"
                className={inputCls}
                value={timelineForm.description}
                onChange={(e) => setTimelineForm((p) => ({ ...p, description: e.target.value }))}
                required
              />
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--sec)] text-[#101010] font-semibold text-sm"
              >
                <Plus size={16} />
                Add Milestone
              </button>
            </form>

            <div className="bg-[#1414149c] border border-[var(--white-icon-tr)] rounded-2xl p-6 space-y-3">
              <h2 className="text-lg font-semibold">Timeline Entries</h2>
              {timeline.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#101010] border border-[var(--white-icon-tr)]"
                >
                  <div>
                    <div className="text-sm font-medium">{item.title}</div>
                    <div className="text-xs text-[var(--white-icon)]">
                      {item.section_type} • {item.organization} ({item.period})
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteTimeline(item.id)}
                    className="p-2 rounded-lg border border-rose-500/40 text-rose-300"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            <form
              onSubmit={handleUpdatePassword}
              className="bg-[#1414149c] border border-[var(--white-icon-tr)] rounded-2xl p-6 space-y-3"
            >
              <h2 className="text-lg font-semibold">Change Admin Password</h2>
              <input
                type="password"
                placeholder="Current Password"
                className={inputCls}
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))}
                required
              />
              <input
                type="password"
                placeholder="New Password (min 8 chars)"
                className={inputCls}
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))}
                required
              />
              <button
                type="submit"
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--white-icon-tr)] bg-[#101010] text-sm hover:border-[var(--sec)]"
              >
                Update Password
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
