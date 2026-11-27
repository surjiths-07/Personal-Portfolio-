-- Seed data for Personal Portfolio Website
USE portfolio_db;

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
  1,
  'Building resilient full-stack web applications and intelligent developer tools powered by clean architecture, relational databases, and modern AI workflows.',
  'I am a Full Stack Developer and AI Enthusiast passionate about designing clean, dependable web applications that solve real-world engineering and learning challenges. I focus on connecting thoughtful UI design with structured REST APIs and MySQL data models.',
  'My development journey started with core web fundamentals—HTML5, CSS3, and JavaScript—before progressing into component-driven React interfaces, Node.js and Express.js backend services, and relational database design with MySQL. Along the way, I began integrating AI capabilities into practical developer tools such as automated programming question curation and test-case generation.',
  'Pursuing undergraduate studies in Computer Science & Engineering, focusing on software engineering, database management systems, data structures, algorithms, and applied artificial intelligence.',
  'Full-Stack Web Engineering, RESTful API Architecture, Relational Database Optimization, AI-Assisted Developer Productivity, Automated Educational Platforms.',
  'To engineer scalable, production-grade full-stack products and AI-augmented software tools while contributing to high-craft engineering teams.',
  'https://github.com/yourusername',
  'https://linkedin.com/in/yourusername',
  'contact@yourdomain.com',
  'India',
  '/api/profile/resume',
  '/images/hero-developer.png'
WHERE NOT EXISTS (SELECT 1 FROM portfolio_profile WHERE id = 1);

-- Seed Categorized Skills
INSERT INTO skills (name, category, icon, sort_order)
SELECT * FROM (
  SELECT 'HTML5' AS name, 'Frontend Skills' AS category, 'html5' AS icon, 1 AS sort_order
  UNION ALL SELECT 'CSS3', 'Frontend Skills', 'css3', 2
  UNION ALL SELECT 'JavaScript', 'Frontend Skills', 'javascript', 3
  UNION ALL SELECT 'React.js', 'Frontend Skills', 'react', 4
  UNION ALL SELECT 'Node.js', 'Backend Skills', 'nodejs', 5
  UNION ALL SELECT 'Express.js', 'Backend Skills', 'express', 6
  UNION ALL SELECT 'REST API Development', 'Backend Skills', 'api', 7
  UNION ALL SELECT 'MySQL', 'Database Skills', 'mysql', 8
  UNION ALL SELECT 'SQL', 'Database Skills', 'sql', 9
  UNION ALL SELECT 'Database Design', 'Database Skills', 'database', 10
  UNION ALL SELECT 'CRUD Operations', 'Database Skills', 'crud', 11
  UNION ALL SELECT 'AI Integration', 'AI and Development Tools', 'ai', 12
  UNION ALL SELECT 'Git', 'AI and Development Tools', 'git', 13
  UNION ALL SELECT 'GitHub', 'AI and Development Tools', 'github', 14
  UNION ALL SELECT 'Visual Studio Code', 'AI and Development Tools', 'vscode', 15
  UNION ALL SELECT 'Antigravity', 'AI and Development Tools', 'antigravity', 16
) AS seed_skills
WHERE NOT EXISTS (SELECT 1 FROM skills LIMIT 1);

-- Seed Projects (Main Project: CodeGen + Reusable Additional Projects)
INSERT INTO projects (
  slug, title, short_description, description, category, image, screenshots,
  technologies, features, problem_statement, proposed_solution, objectives,
  future_enhancements, github_url, demo_url, is_featured, sort_order
)
SELECT * FROM (
  SELECT
    'codegen-automated-programming-question-generation' AS slug,
    'CodeGen – Automated Programming Question Generation Using AI' AS title,
    'CodeGen is an AI-powered platform designed to automate the collection, organization, and generation of programming questions. It helps students and developers discover coding problems based on topics, difficulty levels, and company categories.' AS short_description,
    'CodeGen is an AI-powered platform designed to automate the collection, organization, and generation of programming questions. It helps students and developers discover coding problems based on topics, difficulty levels, and company categories.' AS description,
    'Artificial Intelligence | Full-Stack Development | Academic Project' AS category,
    '/images/codegen-cover.png' AS image,
    '["/images/codegen-cover.png","/images/codegen-pipeline.png"]' AS screenshots,
    '["React.js","Node.js","Express.js","MySQL","JavaScript","HTML5","CSS3","AI Integration","REST API"]' AS technologies,
    '["Collect programming questions from multiple websites","Organize questions by topic","Filter questions by difficulty","Company-wise question classification","Automatic test-case generation","AI-generated Python and Java solutions","Selective JSON export","Centralized question management"]' AS features,
    'Students, educators, and interview candidates often struggle with fragmented coding practice resources scattered across numerous websites. Manually gathering problems, tagging them by topic or company, writing structured test cases, and maintaining reference solutions in multiple languages is repetitive and time-consuming.' AS problem_statement,
    'CodeGen centralizes coding question discovery and preparation into one structured full-stack platform. It collects programming questions from multiple sources, classifies them by topic, difficulty level, and target company, automatically generates test cases alongside Python and Java solutions using AI, and enables selective JSON export for reuse in assessments or study sets.' AS proposed_solution,
    '["Aggregate programming problems from multiple online sources into a unified repository","Enable fast filtering by topic, difficulty tier, and company tag","Automate creation of structured input/output test cases to reduce manual authoring effort","Provide AI-generated reference implementations in both Python and Java","Support selective JSON export for curated problem sets and centralized management"]' AS objectives,
    '["Support additional target programming languages for AI-generated solutions","Provide interactive batch validation and custom test-suite templates","Add collaborative problem collections and curriculum sharing for instructors","Expand automated source adapters and scheduled synchronization pipelines"]' AS future_enhancements,
    'https://github.com/yourusername/codegen' AS github_url,
    'https://codegen-demo.example.com' AS demo_url,
    1 AS is_featured,
    1 AS sort_order
  UNION ALL
  SELECT
    'fullstack-developer-portfolio-cms',
    'Full-Stack Portfolio & Content Management Platform',
    'A database-driven personal portfolio and admin CMS built with React.js, Node.js, Express.js, and MySQL featuring JWT authentication, image uploads, and rate-limited contact management.',
    'A production-ready full-stack portfolio application engineered to dynamically manage projects, categorized technical skills, experience timelines, and incoming visitor messages through a protected admin dashboard backed by MySQL.',
    'Full-Stack Development',
    '/images/codegen-pipeline.png',
    '["/images/codegen-pipeline.png"]',
    '["React.js","Node.js","Express.js","MySQL","REST API","CSS3","JavaScript"]',
    '["Dynamic project, skill, and timeline management via MySQL","Protected Admin Dashboard with bcrypt password hashing and JWT","Multipart project image upload and static serving","Rate-limited and validated contact message workflow"]',
    'Static developer portfolios require code edits and redeployment every time a project, skill, or milestone changes.',
    'Separates presentation from data through an Express.js REST API and structured MySQL schema with a secure administrative portal.',
    '["Deliver a high-craft dark UI with fast navigation","Provide full CRUD management without touching source code","Ensure secure authentication and sanitized SQL queries"]',
    '["Automated analytics dashboard for visitor insights","Markdown live preview editor for project case studies"]',
    'https://github.com/yourusername/personal-portfolio',
    'https://portfolio-demo.example.com',
    0,
    2
  UNION ALL
  SELECT
    'rest-api-task-database-manager',
    'Structured Task & Knowledge Tracker API',
    'A clean full-stack task and sprint tracking workspace featuring relational MySQL schema design, RESTful CRUD endpoints, and responsive React filtering.',
    'Designed to demonstrate clean REST API conventions, relational MySQL modeling, input validation, and responsive frontend state synchronization without external bloat.',
    'Full-Stack Development',
    '/images/codegen-cover.png',
    '["/images/codegen-cover.png"]',
    '["HTML5","CSS3","JavaScript","React.js","Node.js","Express.js","MySQL","SQL"]',
    '["Normalized MySQL tables with foreign key constraints","Full CRUD REST API endpoints with structured validation","Status and priority filtering in React.js","Consistent error handling and responsive UI"]',
    'Teams and students often lack lightweight, self-hosted tools to organize project milestones with clean relational persistence.',
    'Provides a modular Express.js REST service coupled with a fast React client and normalized MySQL storage.',
    '["Model clean one-to-many relationships in SQL","Implement predictable REST API responses and status codes","Deliver a keyboard-friendly responsive interface"]',
    '["Role-based team workspaces","Exportable sprint summaries in JSON and CSV"]',
    'https://github.com/yourusername/task-tracker-api',
    'https://task-tracker-demo.example.com',
    0,
    3
) AS seed_projects
WHERE NOT EXISTS (SELECT 1 FROM projects LIMIT 1);

-- Seed Experience, Education, Certifications & Achievements
INSERT INTO timeline_items (section_type, title, organization, period, location, description, highlights, sort_order)
SELECT * FROM (
  SELECT
    'education' AS section_type,
    'Bachelor of Engineering / B.Tech in Computer Science' AS title,
    'Your University / Institute Name' AS organization,
    '2022 – 2026 (Editable)' AS period,
    'India' AS location,
    'Undergraduate program covering Data Structures, Algorithms, Database Management Systems, Operating Systems, Web Technologies, and Artificial Intelligence.' AS description,
    '["Built CodeGen as a flagship academic full-stack AI project","Focused on relational database design and RESTful backend architecture"]' AS highlights,
    1 AS sort_order
  UNION ALL
  SELECT
    'internship',
    'Full Stack Web Development Intern',
    'Tech Company / Organization (Placeholder)',
    'Summer 2025 (Editable)',
    'Remote / Hybrid',
    'Collaborated on building responsive React.js user interfaces, Node.js/Express.js REST endpoints, and MySQL CRUD workflows following Git-based code review practices.',
    '["Developed modular UI components and integrated backend REST APIs","Wrote parameterized SQL queries and validated request payloads"]' ,
    2
  UNION ALL
  SELECT
    'work',
    'Freelance / Independent Full-Stack Developer',
    'Independent Projects',
    '2024 – Present (Editable)',
    'Remote',
    'Designing and shipping custom full-stack web applications, database schemas, and AI-assisted productivity tools with end-to-end ownership from UI to deployment.',
    '["Architected MySQL schemas and Express APIs for dynamic web platforms","Focused on clean dark-mode UX, accessibility, and responsive layouts"]',
    3
  UNION ALL
  SELECT
    'certification',
    'Full-Stack Web Development & SQL Certification',
    'Verified Learning Platform (Editable)',
    '2025',
    'Online',
    'Completed hands-on coursework covering modern JavaScript, React.js state architecture, Node.js, Express.js REST APIs, and relational MySQL database design.',
    '["Applied REST API design principles and CRUD workflows","Implemented secure authentication and data validation patterns"]',
    4
  UNION ALL
  SELECT
    'achievement',
    'Lead Developer – CodeGen Academic Showcase',
    'Departmental / Academic Project Evaluation',
    '2025 – 2026',
    'Campus',
    'Led the full-stack architecture and AI integration for CodeGen, automating programming question collection, classification, test-case generation, and Python/Java solution synthesis.',
    '["Automated multi-source problem organization and selective JSON export","Engineered full-stack pipeline combining React, Express, MySQL, and AI"]',
    5
) AS seed_timeline
WHERE NOT EXISTS (SELECT 1 FROM timeline_items LIMIT 1);

-- Seed Portfolio Likes Counter
INSERT INTO portfolio_likes (id, likes_count)
SELECT 1, 24
WHERE NOT EXISTS (SELECT 1 FROM portfolio_likes WHERE id = 1);
