-- Seed data for Personal Portfolio Website (PostgreSQL / Supabase)

-- Seed Portfolio Profile (only if empty)
INSERT INTO portfolio_profile (
  id, full_name, professional_title, availability_badge, is_available,
  short_intro, about_intro, development_journey, education_summary,
  areas_of_interest, career_goals, github_url, linkedin_url, email,
  location, resume_url, profile_image
)
SELECT
  1,
  'Surjith',
  'Full Stack Developer | AI Enthusiast',
  'Open to Software Engineering & AI Roles',
  TRUE,
  'Building resilient full-stack web applications and intelligent developer tools powered by clean architecture, relational databases, and modern AI workflows.',
  'I am a Full Stack Developer and AI Enthusiast passionate about designing clean, dependable web applications that solve real-world engineering and learning challenges. I focus on connecting thoughtful UI design with structured REST APIs and PostgreSQL data models.',
  'My development journey started with core web fundamentals—HTML5, CSS3, and JavaScript—before progressing into component-driven React interfaces, Node.js and Express.js backend services, and relational database design with PostgreSQL and Supabase. Along the way, I began integrating AI capabilities into practical developer tools such as automated programming question curation and test-case generation.',
  'Pursuing undergraduate studies in Computer Science & Engineering, focusing on software engineering, database management systems, data structures, algorithms, and applied artificial intelligence.',
  'Full-Stack Web Engineering, RESTful API Architecture, Relational Database Optimization, AI-Assisted Developer Productivity, Automated Educational Platforms.',
  'To engineer scalable, production-grade full-stack products and AI-augmented software tools while contributing to high-craft engineering teams.',
  'https://github.com/surjiths-07',
  'https://linkedin.com/in/yourusername',
  'contact@yourdomain.com',
  'India',
  '/api/profile/resume',
  '/images/hero-developer.png'
WHERE NOT EXISTS (SELECT 1 FROM portfolio_profile WHERE id = 1);

SELECT setval(
  pg_get_serial_sequence('portfolio_profile', 'id'),
  COALESCE((SELECT MAX(id) FROM portfolio_profile), 1)
);

-- Seed Categorized Skills
INSERT INTO skills (name, category, icon, sort_order)
SELECT v.name, v.category, v.icon, v.sort_order
FROM (
  VALUES
    ('HTML5', 'Frontend Skills', 'html5', 1),
    ('CSS3', 'Frontend Skills', 'css3', 2),
    ('JavaScript', 'Frontend Skills', 'javascript', 3),
    ('React.js', 'Frontend Skills', 'react', 4),
    ('Node.js', 'Backend Skills', 'nodejs', 5),
    ('Express.js', 'Backend Skills', 'express', 6),
    ('REST API Development', 'Backend Skills', 'api', 7),
    ('PostgreSQL', 'Database Skills', 'postgresql', 8),
    ('Supabase', 'Database Skills', 'supabase', 9),
    ('SQL', 'Database Skills', 'sql', 10),
    ('Database Design', 'Database Skills', 'database', 11),
    ('CRUD Operations', 'Database Skills', 'crud', 12),
    ('AI Integration', 'AI and Development Tools', 'ai', 13),
    ('Git', 'AI and Development Tools', 'git', 14),
    ('GitHub', 'AI and Development Tools', 'github', 15),
    ('Visual Studio Code', 'AI and Development Tools', 'vscode', 16),
    ('Antigravity', 'AI and Development Tools', 'antigravity', 17)
) AS v(name, category, icon, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM skills LIMIT 1);

-- Seed Projects (Main Project: CodeGen + Reusable Additional Projects)
INSERT INTO projects (
  slug, title, short_description, description, category, image, screenshots,
  technologies, features, problem_statement, proposed_solution, objectives,
  future_enhancements, github_url, demo_url, is_featured, sort_order
)
SELECT v.slug, v.title, v.short_description, v.description, v.category, v.image, v.screenshots,
       v.technologies, v.features, v.problem_statement, v.proposed_solution, v.objectives,
       v.future_enhancements, v.github_url, v.demo_url, v.is_featured, v.sort_order
FROM (
  VALUES
    (
      'codegen-automated-programming-question-generation',
      'CodeGen – Automated Programming Question Generation Using AI',
      'CodeGen is an AI-powered platform designed to automate the collection, organization, and generation of programming questions. It helps students and developers discover coding problems based on topics, difficulty levels, and company categories.',
      'CodeGen is an AI-powered platform designed to automate the collection, organization, and generation of programming questions. It helps students and developers discover coding problems based on topics, difficulty levels, and company categories.',
      'Artificial Intelligence | Full-Stack Development | Academic Project',
      '/images/codegen-cover.png',
      '["/images/codegen-cover.png","/images/codegen-pipeline.png"]',
      '["React.js","Node.js","Express.js","PostgreSQL","JavaScript","HTML5","CSS3","AI Integration","REST API"]',
      '["Collect programming questions from multiple websites","Organize questions by topic","Filter questions by difficulty","Company-wise question classification","Automatic test-case generation","AI-generated Python and Java solutions","Selective JSON export","Centralized question management"]',
      'Students, educators, and interview candidates often struggle with fragmented coding practice resources scattered across numerous websites. Manually gathering problems, tagging them by topic or company, writing structured test cases, and maintaining reference solutions in multiple languages is repetitive and time-consuming.',
      'CodeGen centralizes coding question discovery and preparation into one structured full-stack platform. It collects programming questions from multiple sources, classifies them by topic, difficulty level, and target company, automatically generates test cases alongside Python and Java solutions using AI, and enables selective JSON export for reuse in assessments or study sets.',
      '["Aggregate programming problems from multiple online sources into a unified repository","Enable fast filtering by topic, difficulty tier, and company tag","Automate creation of structured input/output test cases to reduce manual authoring effort","Provide AI-generated reference implementations in both Python and Java","Support selective JSON export for curated problem sets and centralized management"]',
      '["Support additional target programming languages for AI-generated solutions","Provide interactive batch validation and custom test-suite templates","Add collaborative problem collections and curriculum sharing for instructors","Expand automated source adapters and scheduled synchronization pipelines"]',
      'https://github.com/surjiths-07',
      'https://codegen-demo.example.com',
      TRUE,
      1
    ),
    (
      'fullstack-developer-portfolio-cms',
      'Full-Stack Portfolio & Content Management Platform',
      'A database-driven personal portfolio and admin CMS built with React.js, Node.js, Express.js, and PostgreSQL featuring JWT authentication, image uploads, and rate-limited contact management.',
      'A production-ready full-stack portfolio application engineered to dynamically manage projects, categorized technical skills, experience timelines, and incoming visitor messages through a protected admin dashboard backed by PostgreSQL & Supabase.',
      'Full-Stack Development',
      '/images/codegen-pipeline.png',
      '["/images/codegen-pipeline.png"]',
      '["React.js","Node.js","Express.js","PostgreSQL","Supabase","REST API","Tailwind CSS"]',
      '["Dynamic project, skill, and timeline management via PostgreSQL","Protected Admin Dashboard with bcrypt password hashing and JWT","Project image management and Vercel serverless deployment","Rate-limited and validated contact message workflow"]',
      'Static developer portfolios require code edits and redeployment every time a project, skill, or milestone changes.',
      'Separates presentation from data through an Express.js REST API and structured PostgreSQL schema with a secure administrative portal.',
      '["Deliver a high-craft dark UI with fast navigation","Provide full CRUD management without touching source code","Ensure secure authentication and parameterized SQL queries"]',
      '["Automated analytics dashboard for visitor insights","Markdown live preview editor for project case studies"]',
      'https://github.com/surjiths-07/Personal-Portfolio-',
      'https://personal-portfolio-gules-psi-21.vercel.app',
      FALSE,
      2
    ),
    (
      'rest-api-task-database-manager',
      'Structured Task & Knowledge Tracker API',
      'A clean full-stack task and sprint tracking workspace featuring relational PostgreSQL schema design, RESTful CRUD endpoints, and responsive React filtering.',
      'Designed to demonstrate clean REST API conventions, relational PostgreSQL modeling, input validation, and responsive frontend state synchronization without external bloat.',
      'Full-Stack Development',
      '/images/codegen-cover.png',
      '["/images/codegen-cover.png"]',
      '["HTML5","CSS3","JavaScript","React.js","Node.js","Express.js","PostgreSQL","SQL"]',
      '["Normalized PostgreSQL tables with foreign key constraints","Full CRUD REST API endpoints with structured validation","Status and priority filtering in React.js","Consistent error handling and responsive UI"]',
      'Teams and students often lack lightweight, self-hosted tools to organize project milestones with clean relational persistence.',
      'Provides a modular Express.js REST service coupled with a fast React client and normalized PostgreSQL storage.',
      '["Model clean one-to-many relationships in SQL","Implement predictable REST API responses and status codes","Deliver a keyboard-friendly responsive interface"]',
      '["Role-based team workspaces","Exportable sprint summaries in JSON and CSV"]',
      'https://github.com/surjiths-07',
      'https://task-tracker-demo.example.com',
      FALSE,
      3
    )
) AS v(
  slug, title, short_description, description, category, image, screenshots,
  technologies, features, problem_statement, proposed_solution, objectives,
  future_enhancements, github_url, demo_url, is_featured, sort_order
)
WHERE NOT EXISTS (SELECT 1 FROM projects LIMIT 1);

-- Seed Experience, Education, Certifications & Achievements
INSERT INTO timeline_items (section_type, title, organization, period, location, description, highlights, sort_order)
SELECT v.section_type, v.title, v.organization, v.period, v.location, v.description, v.highlights, v.sort_order
FROM (
  VALUES
    (
      'education',
      'Bachelor of Engineering / B.Tech in Computer Science',
      'Your University / Institute Name',
      '2022 – 2026 (Editable)',
      'India',
      'Undergraduate program covering Data Structures, Algorithms, Database Management Systems, Operating Systems, Web Technologies, and Artificial Intelligence.',
      '["Built CodeGen as a flagship academic full-stack AI project","Focused on relational database design and RESTful backend architecture"]',
      1
    ),
    (
      'internship',
      'Full Stack Web Development Intern',
      'Tech Company / Organization (Placeholder)',
      'Summer 2025 (Editable)',
      'Remote / Hybrid',
      'Collaborated on building responsive React.js user interfaces, Node.js/Express.js REST endpoints, and PostgreSQL CRUD workflows following Git-based code review practices.',
      '["Developed modular UI components and integrated backend REST APIs","Wrote parameterized SQL queries and validated request payloads"]',
      2
    ),
    (
      'work',
      'Freelance / Independent Full-Stack Developer',
      'Independent Projects',
      '2024 – Present (Editable)',
      'Remote',
      'Designing and shipping custom full-stack web applications, database schemas, and AI-assisted productivity tools with end-to-end ownership from UI to deployment.',
      '["Architected PostgreSQL schemas and Express APIs for dynamic web platforms","Focused on clean dark-mode UX, accessibility, and responsive layouts"]',
      3
    ),
    (
      'certification',
      'Full-Stack Web Development & SQL Certification',
      'Verified Learning Platform (Editable)',
      '2025',
      'Online',
      'Completed hands-on coursework covering modern JavaScript, React.js state architecture, Node.js, Express.js REST APIs, and relational SQL database design.',
      '["Applied REST API design principles and CRUD workflows","Implemented secure authentication and data validation patterns"]',
      4
    ),
    (
      'achievement',
      'Lead Developer – CodeGen Academic Showcase',
      'Departmental / Academic Project Evaluation',
      '2025 – 2026',
      'Campus',
      'Led the full-stack architecture and AI integration for CodeGen, automating programming question collection, classification, test-case generation, and Python/Java solution synthesis.',
      '["Automated multi-source problem organization and selective JSON export","Engineered full-stack pipeline combining React, Express, PostgreSQL, and AI"]',
      5
    )
) AS v(section_type, title, organization, period, location, description, highlights, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM timeline_items LIMIT 1);

-- Seed Portfolio Likes Counter
INSERT INTO portfolio_likes (id, likes_count)
VALUES (1, 24)
ON CONFLICT (id) DO NOTHING;

SELECT setval(
  pg_get_serial_sequence('portfolio_likes', 'id'),
  COALESCE((SELECT MAX(id) FROM portfolio_likes), 1)
);
