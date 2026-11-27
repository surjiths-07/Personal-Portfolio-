// Minimal, zero-dependency PDF generator for dynamic resume download

function escapePdfText(text) {
  return String(text || '')
    .replace(/[^\x20-\x7E]/g, ' ')
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

function wrapText(text, maxChars = 88) {
  const words = String(text || '').trim().split(/\s+/).filter(Boolean);
  const lines = [];
  let current = '';

  for (const word of words) {
    if (!current) {
      current = word;
    } else if (current.length + 1 + word.length <= maxChars) {
      current += ` ${word}`;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function generateResumePdf({ profile, skills, projects, timeline }) {
  const commands = [];
  let y = 760;

  const addLine = (text, { font = 'F1', size = 10, indent = 50, spacing = 14 } = {}) => {
    if (y < 55) return;
    commands.push(`BT /${font} ${size} Tf 1 0 0 1 ${indent} ${y} Tm (${escapePdfText(text)}) Tj ET`);
    y -= spacing;
  };

  const addHeading = (title) => {
    if (y < 85) return;
    y -= 6;
    addLine(title.toUpperCase(), { font: 'F2', size: 11, indent: 50, spacing: 6 });
    commands.push(`0.8 w 50 ${y} m 562 ${y} l S`);
    y -= 14;
  };

  addLine(profile.full_name || 'Developer Portfolio', { font: 'F2', size: 20, spacing: 22 });
  addLine(profile.professional_title || 'Full Stack Developer | AI Enthusiast', {
    font: 'F1',
    size: 11,
    spacing: 15,
  });

  const contactParts = [profile.email, profile.location, profile.github_url, profile.linkedin_url].filter(Boolean);
  if (contactParts.length) {
    addLine(contactParts.join('  |  '), { font: 'F1', size: 9, spacing: 18 });
  }

  addHeading('Summary');
  for (const line of wrapText(profile.short_intro || profile.about_intro, 92)) {
    addLine(line, { size: 9.5, spacing: 13 });
  }

  if (skills && skills.length) {
    addHeading('Technical Skills');
    const grouped = {};
    for (const s of skills) {
      if (!grouped[s.category]) grouped[s.category] = [];
      grouped[s.category].push(s.name);
    }
    for (const [category, names] of Object.entries(grouped)) {
      const lines = wrapText(`${category}: ${names.join(', ')}`, 92);
      for (const line of lines) {
        addLine(line, { size: 9.5, spacing: 13 });
      }
    }
  }

  if (projects && projects.length) {
    addHeading('Projects');
    for (const p of projects.slice(0, 4)) {
      addLine(`${p.title} (${p.category})`, { font: 'F2', size: 10, spacing: 13 });
      for (const line of wrapText(p.short_description || p.description, 88)) {
        addLine(line, { size: 9, indent: 58, spacing: 12 });
      }
      if (Array.isArray(p.technologies) && p.technologies.length) {
        addLine(`Tech Stack: ${p.technologies.join(', ')}`, { size: 8.5, indent: 58, spacing: 14 });
      }
    }
  }

  if (timeline && timeline.length) {
    addHeading('Experience & Education');
    for (const item of timeline.slice(0, 6)) {
      addLine(`${item.title} - ${item.organization} (${item.period})`, {
        font: 'F2',
        size: 9.5,
        spacing: 12,
      });
      for (const line of wrapText(item.description, 88)) {
        addLine(line, { size: 9, indent: 58, spacing: 12 });
      }
    }
  }

  const streamContent = commands.join('\n');
  const objects = [
    '1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj',
    '2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj',
    '3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >> endobj',
    `4 0 obj << /Length ${Buffer.byteLength(streamContent, 'utf8')} >> stream\n${streamContent}\nendstream endobj`,
    '5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj',
    '6 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> endobj',
  ];

  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  for (const obj of objects) {
    offsets.push(Buffer.byteLength(pdf, 'utf8'));
    pdf += `${obj}\n`;
  }

  const xrefOffset = Buffer.byteLength(pdf, 'utf8');
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  for (let i = 1; i < offsets.length; i += 1) {
    pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  return Buffer.from(pdf, 'utf8');
}

module.exports = { generateResumePdf };
