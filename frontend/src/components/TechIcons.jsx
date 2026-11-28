import React from 'react';
import {
  Atom,
  Bot,
  Braces,
  Code2,
  Cpu,
  Database,
  FileCode2,
  GitBranch,
  Github,
  Layers,
  Server,
  Sparkles,
  Table2,
  Terminal,
  Webhook,
} from 'lucide-react';

export function TechIcon({ iconKey = 'code', size = 18 }) {
  const key = String(iconKey).toLowerCase();

  switch (key) {
    case 'html5':
      return <FileCode2 size={size} color="#f97316" />;
    case 'css3':
      return <Layers size={size} color="#38bdf8" />;
    case 'javascript':
      return <Braces size={size} color="#facc15" />;
    case 'react':
      return <Atom size={size} color="#22d3ee" />;
    case 'nodejs':
      return <Server size={size} color="#4ade80" />;
    case 'express':
      return <Terminal size={size} color="#e2e8f0" />;
    case 'api':
      return <Webhook size={size} color="#818cf8" />;
    case 'mysql':
    case 'postgresql':
      return <Database size={size} color="#38bdf8" />;
    case 'supabase':
      return <Database size={size} color="#3ecf8e" />;
    case 'sql':
      return <Table2 size={size} color="#a78bfa" />;
    case 'database':
      return <Database size={size} color="#34d399" />;
    case 'crud':
      return <Cpu size={size} color="#f472b6" />;
    case 'ai':
      return <Bot size={size} color="#c084fc" />;
    case 'git':
      return <GitBranch size={size} color="#fb7185" />;
    case 'github':
      return <Github size={size} color="#f8fafc" />;
    case 'vscode':
      return <Code2 size={size} color="#60a5fa" />;
    case 'antigravity':
      return <Sparkles size={size} color="#22d3ee" />;
    default:
      return <Code2 size={size} color="#818cf8" />;
  }
}
