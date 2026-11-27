import React from 'react';
import { TechIcon } from './TechIcons';

const CATEGORY_ORDER = [
  'Frontend Skills',
  'Backend Skills',
  'Database Skills',
  'AI and Development Tools',
];

export function SkillsSection({ skills = [] }) {
  const grouped = skills.reduce((acc, skill) => {
    const key = skill.category || 'Other Skills';
    if (!acc[key]) acc[key] = [];
    acc[key].push(skill);
    return acc;
  }, {});

  const orderedCategories = [
    ...CATEGORY_ORDER.filter((cat) => grouped[cat]?.length),
    ...Object.keys(grouped).filter((cat) => !CATEGORY_ORDER.includes(cat)),
  ];

  return (
    <section id="skills" className="py-16 border-t border-[#ffffff10] text-[var(--white)]">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-lg text-[var(--sec)] mb-2 shiny-sec reveal">Tech stack</h2>
        <h3 className="text-4xl md:text-5xl font-medium mb-8 reveal">Skills &amp; Tools</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {orderedCategories.map((category) => (
            <div
              key={category}
              className="bg-[#1414149c] border border-[var(--white-icon-tr)] rounded-2xl p-6 hover:border-[#a476ff50] transition-colors reveal"
            >
              <div className="flex items-center justify-between mb-5">
                <h4 className="text-lg md:text-xl font-semibold text-[var(--white)]">{category}</h4>
                <span className="text-xs text-[var(--white-icon)] px-3 py-1 rounded-full bg-[#101010] border border-[var(--white-icon-tr)]">
                  {grouped[category].length} tools
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {grouped[category].map((skill) => (
                  <div
                    key={skill.id}
                    className="flex items-center gap-3 px-3.5 py-3 rounded-xl bg-[#101010] border border-[var(--white-icon-tr)] hover:border-[#a476ff60] transition-all"
                  >
                    <span className="w-9 h-9 rounded-lg bg-[#1414149c] border border-[var(--white-icon-tr)] flex items-center justify-center flex-shrink-0">
                      <TechIcon iconKey={skill.icon} size={18} />
                    </span>
                    <span className="text-sm font-medium text-[var(--white)]">{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
