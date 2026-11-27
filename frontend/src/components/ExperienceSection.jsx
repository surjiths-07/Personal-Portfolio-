import React, { useMemo, useState } from 'react';
import { Award, Briefcase, GraduationCap, Laptop, Trophy } from 'lucide-react';

const SECTION_TABS = [
  { key: 'all', label: 'All' },
  { key: 'education', label: 'Education' },
  { key: 'internship', label: 'Internship' },
  { key: 'work', label: 'Work Experience' },
  { key: 'certification', label: 'Certifications' },
  { key: 'achievement', label: 'Achievements' },
];

const TYPE_META = {
  education: { label: 'Education', icon: GraduationCap },
  internship: { label: 'Internship', icon: Laptop },
  work: { label: 'Work Experience', icon: Briefcase },
  certification: { label: 'Certification', icon: Award },
  achievement: { label: 'Achievement', icon: Trophy },
};

export function ExperienceSection({ items = [] }) {
  const [activeTab, setActiveTab] = useState('all');

  const filteredItems = useMemo(() => {
    if (activeTab === 'all') return items;
    return items.filter((item) => item.section_type === activeTab);
  }, [items, activeTab]);

  return (
    <section id="experience" className="py-16 border-t border-[#ffffff10] text-[var(--white)]">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-lg text-[var(--sec)] mb-2 shiny-sec reveal">Background</h2>
        <h3 className="text-4xl md:text-5xl font-medium mb-8 reveal">Experience &amp; Education</h3>

        <div className="flex flex-wrap gap-2 mb-8 reveal" role="tablist" aria-label="Experience categories">
          {SECTION_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-full text-xs md:text-sm font-medium border transition ${
                activeTab === tab.key
                  ? 'bg-[#a476ff22] border-[var(--sec)] text-white'
                  : 'bg-[#1414149c] border-[var(--white-icon-tr)] text-[var(--white-icon)] hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredItems.map((item) => {
            const meta = TYPE_META[item.section_type] || TYPE_META.work;
            const Icon = meta.icon;

            return (
              <article
                key={item.id}
                className="bg-[#1414149c] border border-[var(--white-icon-tr)] rounded-2xl p-6 hover:border-[#a476ff45] transition-colors reveal"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
                  <div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-[var(--sec)] mb-1">
                      <Icon size={14} />
                      {meta.label}
                    </span>
                    <h4 className="text-xl font-semibold text-[var(--white)]">{item.title}</h4>
                    <p className="text-sm text-[#c3a6ff] font-medium">{item.organization}</p>
                  </div>

                  <div className="text-xs md:text-sm text-[var(--white-icon)] md:text-right">
                    <div>{item.period}</div>
                    {item.location && <div className="opacity-80 mt-0.5">{item.location}</div>}
                  </div>
                </div>

                <p className="text-sm text-[var(--white-icon)] leading-relaxed">{item.description}</p>

                {item.highlights?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {item.highlights.map((highlight) => (
                      <span
                        key={highlight}
                        className="px-3 py-1 rounded-full text-xs bg-[#101010] border border-[var(--white-icon-tr)] text-[var(--white-icon)]"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
